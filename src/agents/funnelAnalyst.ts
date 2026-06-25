import { queryLeaks } from "@/skills/funnel-query";
import { num, pct } from "@/lib/format";
import type { Leak } from "@/lib/types";
import type { AgentContext } from "./types";

// Funnel Analyst — queries the dataset (real tool), ranks leaks against benchmarks,
// and surfaces the biggest unaddressed drop-off.
export async function runFunnelAnalyst(
  ctx: AgentContext,
  input: { addressedLeaks: string[] },
): Promise<{ leak: Leak; leaks: Leak[] }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "funnel-analyst",
    status: "thinking",
    headline: "Pulling 60 days of funnel data and scoring every stage…",
  });
  await ctx.wait(750);

  const leaks = queryLeaks(input.addressedLeaks);
  const leak = leaks[0];

  ctx.emit({
    cycle: ctx.cycle,
    agent: "funnel-analyst",
    status: "done",
    headline: `Biggest leak: ${leak.label.toLowerCase()} at ${leak.stage}.`,
    detail: leak.evidence,
    toolCalls: [
      {
        tool: "queryLeaks()",
        skill: "funnel-query",
        input: `addressed = [${input.addressedLeaks.join(", ") || "none"}]`,
        output: `${leaks.length} leaks ranked · top = ${leak.id}`,
      },
    ],
    chips: [
      { label: "Stage", value: leak.stage },
      { label: "Current", value: pct(leak.metric), tone: "bad" },
      { label: "Benchmark", value: pct(leak.benchmark), tone: "good" },
      { label: "Gap", value: pct(leak.gap) },
      { label: "WAU upside", value: `+${num(leak.wauUpside)}`, tone: "accent" },
      { label: "Reach", value: `${num(leak.usersAffected)}/wk` },
    ],
    handoffTo: "hypothesis-writer",
  });

  return { leak, leaks };
}
