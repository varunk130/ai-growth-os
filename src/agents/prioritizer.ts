import { scoreAndRank } from "@/skills/ice-score";
import type { Experiment, Hypothesis, LeverageRow, Leak } from "@/lib/types";
import type { AgentContext } from "./types";
import { metricForLeak } from "./util";

// Prioritizer — computes GTM Leverage Scores (real math) and picks the top experiment.
export async function runPrioritizer(
  ctx: AgentContext,
  input: { hypotheses: Hypothesis[]; leak: Leak },
): Promise<{ leverageTable: LeverageRow[]; top: Hypothesis; experiment: Experiment }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "prioritizer",
    status: "thinking",
    headline: "Scoring each bet on revenue impact, ICP fit, evidence, and time-to-signal…",
  });
  await ctx.wait(700);

  const leverageTable = scoreAndRank(input.hypotheses);
  const topRow = leverageTable[0];
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
    detail: `Highest GTM Leverage of ${leverageTable.length} bets — Revenue ${topRow.revenueImpact} · ICP fit ${topRow.icpFit} · Evidence ${topRow.evidence} · Time-to-signal ${topRow.timeToSignal}.`,
    toolCalls: [
      {
        tool: "scoreAndRank()",
        skill: "gtm-leverage",
        input: `${input.hypotheses.length} hypotheses`,
        output: `top score = ${topRow.score}/100 (${top.id})`,
      },
    ],
    chips: [
      { label: "Revenue", value: String(topRow.revenueImpact) },
      { label: "ICP fit", value: String(topRow.icpFit) },
      { label: "Evidence", value: String(topRow.evidence) },
      { label: "Time-to-signal", value: String(topRow.timeToSignal) },
      { label: "Leverage", value: `${topRow.score}/100`, tone: "accent" },
    ],
    handoffTo: "experiment-designer",
  });

  return { leverageTable, top, experiment };
}
