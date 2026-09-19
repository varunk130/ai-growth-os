import { test } from "node:test";
import assert from "node:assert/strict";
import { leverageScore, scoreAndRank, WEIGHTS } from "@/skills/ice-score";
import { HYPOTHESES } from "@content/hypotheses";
import type { Hypothesis } from "@/lib/types";

const bet = (o: Partial<Hypothesis>): Hypothesis => ({
  id: "h",
  statement: "s",
  lever: "lifecycle",
  targetLeak: "activation_cliff",
  rationale: "r",
  revenueImpact: 5,
  icpFit: 5,
  evidence: 5,
  timeToSignal: 5,
  expectedLift: 0.1,
  ...o,
});

test("weights sum to 1", () => {
  const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});

test("score spans 10 to 100 across the 1-10 factor range", () => {
  assert.equal(leverageScore(bet({ revenueImpact: 1, icpFit: 1, evidence: 1, timeToSignal: 1 })), 10);
  assert.equal(leverageScore(bet({ revenueImpact: 10, icpFit: 10, evidence: 10, timeToSignal: 10 })), 100);
});

test("a fast bet that misses the ICP loses to a slower on-ICP bet", () => {
  const offIcp = bet({ id: "off", revenueImpact: 7, icpFit: 2, evidence: 7, timeToSignal: 10 });
  const onIcp = bet({ id: "on", revenueImpact: 7, icpFit: 8, evidence: 7, timeToSignal: 6 });
  assert.equal(scoreAndRank([offIcp, onIcp])[0].hypothesisId, "on");
});

test("rankings are sorted by score with contiguous ranks", () => {
  for (const list of Object.values(HYPOTHESES)) {
    const rows = scoreAndRank(list);
    rows.forEach((r, i) => {
      assert.equal(r.rank, i + 1);
      if (i > 0) assert.ok(rows[i - 1].score >= r.score);
    });
  }
});

test("every authored factor is on the 1-10 scale", () => {
  for (const h of Object.values(HYPOTHESES).flat()) {
    for (const k of ["revenueImpact", "icpFit", "evidence", "timeToSignal"] as const) {
      assert.ok(Number.isInteger(h[k]) && h[k] >= 1 && h[k] <= 10, `${h.id}.${k} = ${h[k]}`);
    }
  }
});

test("demo scenarios keep their intended winning experiments", () => {
  const winners = Object.fromEntries(
    Object.entries(HYPOTHESES).map(([leak, list]) => [leak, scoreAndRank(list)[0].hypothesisId]),
  );
  assert.deepEqual(winners, {
    activation_cliff: "act-email-firstcall",
    week2_retention: "ret-week1-recipes",
    integration_gap: "int-recipes",
    channel_mix: "ch-reallocate",
  });
});
