import { funnelData, dailySum, currentWau, type FunnelData } from "./dataset";
import type { GrowthModel, Leak, MemoryState, WauPoint } from "./types";

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

// --- Funnel rates -------------------------------------------------------------

export function blendedActivation(data: FunnelData = funnelData): number {
  return dailySum("firstApiCall", data) / dailySum("signups", data);
}

export function apiToIntegration(data: FunnelData = funnelData): number {
  return dailySum("firstIntegration", data) / dailySum("firstApiCall", data);
}

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  rateFromPrev?: number;
  benchmark?: number;
}

export function funnelStages(data: FunnelData = funnelData): FunnelStage[] {
  const signups = dailySum("signups", data);
  const api = dailySum("firstApiCall", data);
  const integ = dailySum("firstIntegration", data);
  return [
    { key: "signup", label: "Signup", count: signups },
    { key: "first_api", label: "First API call", count: api, rateFromPrev: api / signups, benchmark: data.benchmarks.activationRateHealthy },
    { key: "first_integration", label: "First integration", count: integ, rateFromPrev: integ / api, benchmark: data.benchmarks.apiToIntegrationHealthy },
  ];
}

// Average observed retention at a given week offset across cohorts that reached it.
export function avgCohortRetention(week: number, data: FunnelData = funnelData): number {
  const vals = data.cohorts.map((c) => c.retention[week]).filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return 0;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

// Steady-state week-over-week retention, derived from late-week cohort ratios.
export function weeklySteadyRetention(data: FunnelData = funnelData): number {
  const ratios: number[] = [];
  for (const c of data.cohorts) {
    for (let k = 2; k < c.retention.length; k++) {
      if (c.retention[k - 1] > 0) ratios.push(c.retention[k] / c.retention[k - 1]);
    }
  }
  if (ratios.length === 0) return 0.7;
  const mean = ratios.reduce((s, v) => s + v, 0) / ratios.length;
  return clamp(mean, 0.5, 0.9);
}

// Recent weekly signup rate (average of the last `weeks` weeks).
export function recentWeeklySignups(weeks = 2, data: FunnelData = funnelData): number {
  const days = weeks * 7;
  const slice = data.daily.slice(-days);
  const total = slice.reduce((s, d) => s + d.signups, 0);
  return Math.round((total / slice.length) * 7);
}

// --- Leak detection -----------------------------------------------------------

export function detectLeaks(data: FunnelData = funnelData, addressed: string[] = []): Leak[] {
  const b = data.benchmarks;
  const weeklySignups = recentWeeklySignups(2, data);
  const activation = blendedActivation(data);
  const a2i = apiToIntegration(data);
  const w2 = avgCohortRetention(2, data);
  const weeklyActivated = weeklySignups * activation;
  const weeklyApi = weeklySignups * activation;

  const worstChannel = [...data.channels].sort((x, y) => x.activationRate - y.activationRate)[0];
  const bestChannel = [...data.channels].sort((x, y) => y.activationRate - x.activationRate)[0];
  const worstWeeklySignups = (worstChannel.signups / dailySum("signups", data)) * weeklySignups;

  const leaks: Leak[] = [
    {
      id: "activation_cliff",
      label: "Activation cliff",
      stage: "Signup → first API call",
      metric: activation,
      benchmark: b.activationRateHealthy,
      gap: b.activationRateHealthy - activation,
      usersAffected: Math.round(weeklySignups * (b.activationRateHealthy - activation)),
      wauUpside: 0,
      severity: 0,
      evidence: `Only ${(activation * 100).toFixed(0)}% of signups make a first API call vs a ~${(b.activationRateHealthy * 100).toFixed(
        0,
      )}% healthy benchmark — the single largest drop in the funnel.`,
    },
    {
      id: "week2_retention",
      label: "Leaky week-2 retention",
      stage: "Week 1 → Week 2",
      metric: w2,
      benchmark: b.week2RetentionHealthy,
      gap: b.week2RetentionHealthy - w2,
      usersAffected: Math.round(weeklyActivated * (b.week2RetentionHealthy - w2)),
      wauUpside: 0,
      severity: 0,
      evidence: `Cohorts hold ${(w2 * 100).toFixed(0)}% by week 2 vs a ~${(b.week2RetentionHealthy * 100).toFixed(
        0,
      )}% benchmark — activated users are slipping after the first week.`,
    },
    {
      id: "integration_gap",
      label: "Integration gap",
      stage: "First API call → first integration",
      metric: a2i,
      benchmark: b.apiToIntegrationHealthy,
      gap: b.apiToIntegrationHealthy - a2i,
      usersAffected: Math.round(weeklyApi * (b.apiToIntegrationHealthy - a2i)),
      wauUpside: 0,
      severity: 0,
      evidence: `${(a2i * 100).toFixed(0)}% of first API calls reach a successful integration vs ~${(b.apiToIntegrationHealthy * 100).toFixed(
        0,
      )}% — a smaller but real leak deeper in activation.`,
    },
    {
      id: "channel_mix",
      label: "Channel-mix drag",
      stage: `${worstChannel.label} activation`,
      metric: worstChannel.activationRate,
      benchmark: bestChannel.activationRate,
      gap: bestChannel.activationRate - worstChannel.activationRate,
      usersAffected: Math.round(worstWeeklySignups * (bestChannel.activationRate - worstChannel.activationRate)),
      wauUpside: 0,
      severity: 0,
      evidence: `${worstChannel.label} drives the most signups but activates at ${(worstChannel.activationRate * 100).toFixed(
        0,
      )}%, while ${bestChannel.label} hits ${(bestChannel.activationRate * 100).toFixed(0)}%.`,
    },
  ];

  const baseWau = growthModel(data).wau;
  for (const l of leaks) {
    const inputs = leakLiftInputs(l, data);
    const simMemory: MemoryState = {
      cycles: 0,
      learnings: [],
      addressedLeaks: [],
      activationLift: inputs.activationLift ?? 0,
      retentionLift: inputs.retentionLift ?? 0,
    };
    l.wauUpside = Math.max(0, growthModel(data, simMemory).wau - baseWau);
    l.severity = l.wauUpside;
    l.addressed = addressed.includes(l.id);
  }

  return leaks.sort((x, y) => Number(x.addressed) - Number(y.addressed) || y.severity - x.severity);
}

// Maps a leak to the growth-model levers its fix would move, so leaks can be ranked
// by modeled WAU upside — the metric the Loop orchestrator actually owns.
function leakLiftInputs(l: Leak, data: FunnelData): { activationLift?: number; retentionLift?: number } {
  const rel = l.metric > 0 ? l.gap / l.metric : 0;
  switch (l.id) {
    case "week2_retention":
      return { retentionLift: clamp(l.gap / (1 - l.metric), 0, 0.6) };
    case "integration_gap":
      return { activationLift: 0.3 * rel };
    case "channel_mix": {
      const totalSignups = dailySum("signups", data);
      const worst = [...data.channels].sort((a, b) => a.activationRate - b.activationRate)[0];
      const blended = blendedActivation(data);
      const share = worst.signups / totalSignups;
      const deltaBlended = share * l.gap;
      return { activationLift: blended > 0 ? deltaBlended / blended : 0 };
    }
    default:
      return { activationLift: rel };
  }
}

export function biggestLeak(data: FunnelData = funnelData, addressed: string[] = []): Leak {
  return detectLeaks(data, addressed)[0];
}

// --- Growth model: WAU = signups × activation × retention ---------------------

export function growthModel(data: FunnelData = funnelData, memory?: MemoryState): GrowthModel {
  const weeklySignups = recentWeeklySignups(2, data);
  const baseActivation = blendedActivation(data);
  const baseRetention = weeklySteadyRetention(data);
  const baseMultiplier = 1 / (1 - baseRetention);
  const calibration = currentWau(data) / (weeklySignups * baseActivation * baseMultiplier);

  let activation = baseActivation;
  let retention = baseRetention;
  if (memory) {
    activation = clamp(baseActivation * (1 + memory.activationLift), 0, 0.95);
    retention = clamp(baseRetention + memory.retentionLift * (1 - baseRetention), 0, 0.92);
  }
  const retentionMultiplier = 1 / (1 - retention);
  const wau = Math.round(calibration * weeklySignups * activation * retentionMultiplier);

  return { weeklySignups, activation, weeklyRetention: retention, retentionMultiplier, calibration, wau };
}

// Project WAU forward: baseline (no change) vs. compounded (memory lifts ramping in).
export function projectWauSeries(data: FunnelData = funnelData, memory?: MemoryState, forwardDays = 28): WauPoint[] {
  const points: WauPoint[] = data.daily.map((d) => ({
    label: d.date.slice(5),
    dayIndex: d.dayIndex,
    actual: d.wau,
  }));

  const base = currentWau(data);
  const target = memory ? growthModel(data, memory).wau : base;
  const lastIndex = data.daily.length - 1;

  // bridge point so lines connect to the actual series
  points[points.length - 1].baseline = base;
  points[points.length - 1].projected = base;

  for (let i = 1; i <= forwardDays; i++) {
    const t = i / forwardDays;
    const ease = 1 - Math.pow(1 - t, 2); // ease-out: experiments compound over weeks
    points.push({
      label: `+${i}d`,
      dayIndex: lastIndex + i,
      baseline: Math.round(base * (1 - 0.0005 * i)), // organic drift, essentially flat
      projected: Math.round(base + (target - base) * ease),
    });
  }
  return points;
}

export interface ChannelEfficiency {
  key: string;
  label: string;
  signups: number;
  cac: number;
  activationRate: number;
  costPerActivated: number;
}

export function channelEfficiency(data: FunnelData = funnelData): ChannelEfficiency[] {
  return data.channels
    .map((c) => ({
      key: c.key,
      label: c.label,
      signups: c.signups,
      cac: c.cac,
      activationRate: c.activationRate,
      costPerActivated: c.activated > 0 ? c.spend / c.activated : 0,
    }))
    .sort((a, b) => a.costPerActivated - b.costPerActivated);
}
