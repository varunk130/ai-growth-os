/**
 * Compound — synthetic data seed generator for the "Adaptive SDK" PLG funnel.
 *
 * Deterministic: a fixed seed drives both @faker-js/faker and a local PRNG, so
 * `npm run seed` always reproduces the committed data/funnel.json sample.
 *
 * It generates 60 days of daily funnel data across 4 acquisition channels, weekly
 * retention cohorts, and channel CAC aggregates. Three realistic problems are
 * deliberately injected so the agents have something genuine to find:
 *   1. Activation cliff: ~38% of signups reach their first API call (healthy ~55%).
 *   2. Leaky week-2 retention: cohorts fall to ~33% by week 2 (healthy ~46%).
 *   3. Channel-mix drag: Docs/SEO drives the most signups but the worst activation.
 */
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Benchmarks,
  Cohort,
  ChannelKey,
  ChannelMeta,
  DayRecord,
  FunnelData,
} from "../src/lib/dataset-types";

const SEED = 424242;
const DAYS = 60;
const END_DATE = new Date("2026-06-15T00:00:00Z"); // fixed anchor for reproducibility

faker.seed(SEED);

// --- Deterministic PRNG (mulberry32) for numeric noise -----------------------
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const jitter = (spread: number) => 1 + (rand() - 0.5) * spread; // multiplicative noise
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const round = (x: number) => Math.round(x);

// --- Channel definitions ------------------------------------------------------
interface ChannelDef {
  key: ChannelKey;
  label: string;
  blurb: string;
  share: number; // fraction of daily signups
  actMult: number; // activation multiplier vs. base rate
  cac: number; // target cost per acquisition (USD)
}
const CHANNELS: ChannelDef[] = [
  { key: "docs_seo", label: "Docs / SEO", blurb: "Organic search + documentation", share: 0.42, actMult: 0.82, cac: 16 },
  { key: "github", label: "GitHub", blurb: "Open-source repo, README & stars", share: 0.27, actMult: 1.38, cac: 7 },
  { key: "community", label: "Community / Discord", blurb: "Developer community & Discord", share: 0.19, actMult: 1.04, cac: 12 },
  { key: "partnerships", label: "Partnerships", blurb: "Co-marketing & integration deals", share: 0.12, actMult: 1.12, cac: 135 },
];

const BASE_ACTIVATION = 0.3; // blended ~0.375 after channel mix (the injected cliff)
const API_TO_INTEGRATION = 0.72;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

const START_DATE = addDays(END_DATE, -(DAYS - 1));

// --- Daily series -------------------------------------------------------------
const daily: DayRecord[] = [];

for (let d = 0; d < DAYS; d++) {
  const date = addDays(START_DATE, d);
  const dow = date.getUTCDay(); // 0 Sun .. 6 Sat

  // Signup volume: ramp then plateau, with weekday seasonality.
  let trend = 120 + 70 * (d / (DAYS - 1));
  if (d > 42) trend = 120 + 70 * (42 / (DAYS - 1)) + 6 * ((d - 42) / 17);
  const weekendDrag = dow === 0 || dow === 6 ? 0.78 : 1.06;
  const baseSignups = trend * weekendDrag * jitter(0.12);

  // Late activation softening flattens WAU in the final week (motivates the demo).
  const actSoft = d >= 50 ? 0.94 : 1.0;

  const channels = {} as DayRecord["channels"];
  let firstApiCall = 0;
  let signupsTotal = 0;

  for (const ch of CHANNELS) {
    const chSignups = round(baseSignups * ch.share * jitter(0.1));
    const effRate = clamp(BASE_ACTIVATION * ch.actMult * actSoft * jitter(0.08), 0.05, 0.95);
    const chActivated = round(chSignups * effRate);
    const chSpend = round(chSignups * ch.cac * jitter(0.15));
    channels[ch.key] = { signups: chSignups, spend: chSpend, activated: chActivated };
    firstApiCall += chActivated;
    signupsTotal += chSignups;
  }

  const firstIntegration = round(firstApiCall * API_TO_INTEGRATION * jitter(0.08));

  // WAU as a saturating (logistic) curve that plateaus by ~day 50, then softens
  // slightly in the final week — this is what makes "WAU is flat this week" true.
  const FLOOR = 550;
  const CEIL = 2000;
  const STEEP = 0.13;
  const MID = 22;
  let wauVal = FLOOR + (CEIL - FLOOR) / (1 + Math.exp(-STEEP * (d - MID)));
  if (d >= 53) wauVal *= 1 - 0.012 * (d - 52); // gentle plateau/dip in the final week
  wauVal *= jitter(0.015);
  const wau = round(wauVal);
  const dauSeason = dow === 0 || dow === 6 ? 0.82 : 1.04;
  const dau = round(wau * 0.42 * dauSeason * jitter(0.05));

  daily.push({
    date: isoDate(date),
    dayIndex: d,
    signups: signupsTotal,
    firstApiCall,
    firstIntegration,
    dau,
    wau,
    channels,
  });
}

// --- Weekly retention cohorts -------------------------------------------------
const cohorts: Cohort[] = [];
const numCohorts = Math.floor((DAYS - 1) / 7) + 1;
for (let c = 0; c < numCohorts; c++) {
  const startDay = c * 7;
  const slice = daily.slice(startDay, startDay + 7);
  if (slice.length === 0) continue;
  const size = slice.reduce((s, day) => s + day.signups, 0);
  const maxWeek = Math.floor((DAYS - 1 - startDay) / 7);
  const improve = 1 + c * 0.006; // later cohorts improve slightly
  const retention: number[] = [1.0];
  if (maxWeek >= 1) retention[1] = clamp(0.6 * improve * jitter(0.05), 0.4, 0.75);
  if (maxWeek >= 2) retention[2] = clamp(retention[1] * (0.54 + (rand() - 0.5) * 0.05), 0.2, 0.55); // the leak
  if (maxWeek >= 3) retention[3] = clamp(retention[2] * (0.82 + (rand() - 0.5) * 0.06), 0.1, 0.5);
  if (maxWeek >= 4) retention[4] = clamp(retention[3] * (0.86 + (rand() - 0.5) * 0.06), 0.08, 0.45);
  cohorts.push({
    cohortIndex: c,
    startDate: slice[0].date,
    size,
    retention: retention.map((r) => Number(r.toFixed(4))),
  });
}

// --- Channel aggregates (CAC) -------------------------------------------------
const channelMeta: ChannelMeta[] = CHANNELS.map((ch) => {
  let signups = 0;
  let spend = 0;
  let activated = 0;
  for (const day of daily) {
    signups += day.channels[ch.key].signups;
    spend += day.channels[ch.key].spend;
    activated += day.channels[ch.key].activated;
  }
  return {
    key: ch.key,
    label: ch.label,
    blurb: ch.blurb,
    signups,
    spend,
    activated,
    cac: Number((spend / signups).toFixed(2)),
    activationRate: Number((activated / signups).toFixed(4)),
  };
});

const benchmarks: Benchmarks = {
  activationRateHealthy: 0.55,
  apiToIntegrationHealthy: 0.78,
  week1RetentionHealthy: 0.62,
  week2RetentionHealthy: 0.46,
  week4RetentionHealthy: 0.3,
};

const totalSignups = daily.reduce((s, d) => s + d.signups, 0);
const totalApi = daily.reduce((s, d) => s + d.firstApiCall, 0);
const blendedActivation = totalApi / totalSignups;
const worst = [...channelMeta].sort((a, b) => a.activationRate - b.activationRate)[0];
const best = [...channelMeta].sort((a, b) => b.activationRate - a.activationRate)[0];

const data: FunnelData = {
  meta: {
    product: "Adaptive SDK",
    tagline: "The drop-in SDK for adaptive, on-device AI.",
    generatedAt: new Date("2026-06-16T09:00:00Z").toISOString(),
    seed: SEED,
    days: DAYS,
    startDate: daily[0].date,
    endDate: daily[daily.length - 1].date,
    injectedProblems: [
      `Activation cliff: only ~${Math.round(blendedActivation * 100)}% of signups reach their first API call (healthy dev-tool benchmark ~${Math.round(
        benchmarks.activationRateHealthy * 100,
      )}%).`,
      `Leaky week-2 retention: cohorts fall to ~${Math.round(
        (cohorts.find((c) => c.retention[2] !== undefined)?.retention[2] ?? 0.33) * 100,
      )}% by week 2 vs a ~${Math.round(benchmarks.week2RetentionHealthy * 100)}% healthy benchmark.`,
      `Channel-mix drag: ${worst.label} drives the most signups but the lowest activation (~${Math.round(
        worst.activationRate * 100,
      )}%), while ${best.label} activates best (~${Math.round(best.activationRate * 100)}%).`,
    ],
  },
  daily,
  cohorts,
  channels: channelMeta,
  benchmarks,
};

const outPath = join(process.cwd(), "data", "funnel.json");
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`✓ Generated ${outPath}`);
console.log(`  ${DAYS} days · ${totalSignups.toLocaleString()} signups · blended activation ${(blendedActivation * 100).toFixed(1)}%`);
console.log(`  ${cohorts.length} cohorts · ${channelMeta.length} channels`);
console.log(`  Injected problems:`);
data.meta.injectedProblems.forEach((p) => console.log(`    • ${p}`));
