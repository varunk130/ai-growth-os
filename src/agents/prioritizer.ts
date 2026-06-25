import { scoreAndRank } from "@/skills/ice-score";
import type { Experiment, Hypothesis, IceRow, Leak } from "@/lib/types";
import type { AgentContext } from "./types";
import { metricForLeak } from "./util";

// Prioritizer — computes ICE scores (real math) and picks the top experiment.
export async function runPrioritizer(
  ctx: AgentContext,
  input: { hypotheses: Hypothesis[]; leak: Leak },
): Promise<{ iceTable: IceRow[]; top: Hypothesis; experiment: Experiment }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "prioritizer",
    status: "thinking",
    headline: "Scoring each bet by Impact × Confidence × Ease…",
  });
  await ctx.wait(700);

  const iceTable = scoreAndRank(input.hypotheses);
  const topRow = iceTable[0];
  const top = input.hypotheses.find((h) => h.id === topRow.hypothesisId) as Hypothesis;

  const experiment: Experiment = {
    id: `exp-c${ctx.cycle}-${top.id}`,
    hypothesis: top,
    metric: metricForLeak(input.leak.id),
    variantName: top.lever,
  };

  ctx.emit({
    cycle: ctx.cycle,
    agent: "prioritizer",
    status: "done",
    headline: `Picked the winner: “${top.statement}”`,
    detail: `Highest ICE of ${iceTable.length} bets — Impact ${topRow.impact} × Confidence ${topRow.confidence} × Ease ${topRow.ease}.`,
    toolCalls: [
      {
        tool: "scoreAndRank()",
        skill: "ice-score",
        input: `${input.hypotheses.length} hypotheses`,
        output: `top ICE = ${topRow.ice} (${top.id})`,
      },
    ],
    chips: [
      { label: "Impact", value: String(topRow.impact) },
      { label: "Confidence", value: String(topRow.confidence) },
      { label: "Ease", value: String(topRow.ease) },
      { label: "ICE", value: String(topRow.ice), tone: "accent" },
    ],
    handoffTo: "experiment-designer",
  });

  return { iceTable, top, experiment };
}
