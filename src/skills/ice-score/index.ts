import type { Hypothesis, IceRow } from "@/lib/types";

export const descriptor = {
  name: "ice-score",
  description: "Computes ICE (Impact × Confidence × Ease) scores for a set of hypotheses and ranks them to pick the next experiment.",
};

export function scoreAndRank(hypotheses: Hypothesis[]): IceRow[] {
  return hypotheses
    .map((h) => ({
      hypothesisId: h.id,
      statement: h.statement,
      lever: h.lever,
      impact: h.impact,
      confidence: h.confidence,
      ease: h.ease,
      ice: h.impact * h.confidence * h.ease,
      rank: 0,
    }))
    .sort((a, b) => b.ice - a.ice)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}
