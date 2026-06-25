import { hypothesesForLeak } from "@content/hypotheses";
import type { Hypothesis, Leak } from "@/lib/types";
import type { AgentContext } from "./types";

// Hypothesis Writer — produces testable hypotheses targeting the leak, selected from
// the curated, scenario-specific content library.
export async function runHypothesisWriter(
  ctx: AgentContext,
  input: { leak: Leak },
): Promise<{ hypotheses: Hypothesis[] }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "hypothesis-writer",
    status: "thinking",
    headline: `Drafting bets to close the ${input.leak.label.toLowerCase()}…`,
  });
  await ctx.wait(700);

  const hypotheses = hypothesesForLeak(input.leak.id);
  const levers = Array.from(new Set(hypotheses.map((h) => h.lever)));

  ctx.emit({
    cycle: ctx.cycle,
    agent: "hypothesis-writer",
    status: "done",
    headline: `Proposed ${hypotheses.length} testable hypotheses across ${levers.length} levers.`,
    detail: `Top of mind: “${hypotheses[0].statement}”`,
    toolCalls: [
      {
        tool: "library.select()",
        skill: "content:hypotheses",
        input: `leak = ${input.leak.id}`,
        output: `${hypotheses.length} hypotheses`,
      },
    ],
    chips: [
      { label: "Hypotheses", value: String(hypotheses.length), tone: "accent" },
      { label: "Levers", value: levers.join(", ") },
    ],
    handoffTo: "prioritizer",
  });

  return { hypotheses };
}
