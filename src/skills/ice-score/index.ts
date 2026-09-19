import type { Hypothesis, LeverageRow } from "@/lib/types";

export const descriptor = {
  name: "gtm-leverage",
  description:
    "Ranks hypotheses by GTM Leverage Score — revenue impact, ICP fit, evidence, and time-to-signal — to pick the next experiment.",
};

// Factor weights (sum to 1). Revenue impact leads; ICP fit keeps bets pointed at
// the segment that actually buys; evidence and time-to-signal share the rest.
export const WEIGHTS = {
  revenueImpact: 0.35,
  icpFit: 0.25,
  evidence: 0.2,
  timeToSignal: 0.2,
} as const;

// Weighted geometric mean of the four 1-10 factors, scaled to 0-100. Unlike an
// additive score, a weak factor drags the whole bet down — an easy test that
// misses the ICP can't win on ease alone.
export function leverageScore(h: Hypothesis): number {
  const product =
    Math.pow(h.revenueImpact, WEIGHTS.revenueImpact) *
    Math.pow(h.icpFit, WEIGHTS.icpFit) *
    Math.pow(h.evidence, WEIGHTS.evidence) *
    Math.pow(h.timeToSignal, WEIGHTS.timeToSignal);
  return Math.round(product * 10);
}

export function scoreAndRank(hypotheses: Hypothesis[]): LeverageRow[] {
  return hypotheses
    .map((h) => ({
      hypothesisId: h.id,
      statement: h.statement,
      lever: h.lever,
      revenueImpact: h.revenueImpact,
      icpFit: h.icpFit,
      evidence: h.evidence,
      timeToSignal: h.timeToSignal,
      score: leverageScore(h),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}
