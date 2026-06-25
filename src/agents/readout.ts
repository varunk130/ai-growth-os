import { readoutTest } from "@/skills/stats";
import { pValueLabel, pct, signedPct } from "@/lib/format";
import type { Decision, Experiment, ExperimentDesign, Leak, Readout } from "@/lib/types";
import type { AgentContext } from "./types";
import { seededFraction } from "./util";

const verb: Record<Decision, string> = { ship: "Ship it", kill: "Kill it", iterate: "Iterate" };

// Readout — runs a real significance test on a deterministically simulated result
// and makes the ship/kill call.
export async function runReadout(
  ctx: AgentContext,
  input: { leak: Leak; experiment: Experiment; design: ExperimentDesign },
): Promise<{ readout: Readout }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "readout",
    status: "thinking",
    headline: "Simulating the result and testing for significance…",
  });
  await ctx.wait(750);

  const baseline = input.design.baseline;
  const expected = input.experiment.hypothesis.expectedLift;
  const frac = seededFraction(`${ctx.cycle}:${input.experiment.id}`);
  const actualLift = expected * (0.82 + frac * 0.42); // 0.82x–1.24x of expected, reproducible

  const n = input.design.sampleSizePerArm;
  const controlConv = Math.round(n * baseline);
  const treatmentConv = Math.round(n * baseline * (1 + actualLift));

  const t = readoutTest({ controlConv, controlN: n, treatmentConv, treatmentN: n });
  const significant = t.pValue < 0.05 && t.treatmentRate > t.controlRate;
  const decision: Decision = significant ? "ship" : t.pValue < 0.2 && t.treatmentRate > t.controlRate ? "iterate" : "kill";

  const rationale =
    decision === "ship"
      ? `Treatment beat control by ${signedPct(t.relLift)} (${pValueLabel(t.pValue)}). The 95% CI excludes zero, so this is a real win — roll it out.`
      : decision === "iterate"
        ? `Directionally positive (${signedPct(t.relLift)}) but not yet significant (${pValueLabel(t.pValue)}). Extend the test or refine the variant.`
        : `No reliable lift (${signedPct(t.relLift)}, ${pValueLabel(t.pValue)}). Kill it and free the slot for the next bet.`;

  const readout: Readout = {
    controlN: n,
    controlConv,
    treatmentN: n,
    treatmentConv,
    controlRate: t.controlRate,
    treatmentRate: t.treatmentRate,
    absLift: t.absLift,
    relLift: t.relLift,
    z: t.z,
    pValue: t.pValue,
    significant,
    ciLow: t.ciLow,
    ciHigh: t.ciHigh,
    decision,
    rationale,
  };

  ctx.emit({
    cycle: ctx.cycle,
    agent: "readout",
    status: "done",
    headline: `${verb[decision]} — ${signedPct(t.relLift)} relative lift, ${pValueLabel(t.pValue)}.`,
    detail: rationale,
    toolCalls: [
      {
        tool: "readoutTest()",
        skill: "experiment-stats",
        input: `${n}/arm · control ${pct(t.controlRate, 1)} vs treatment ${pct(t.treatmentRate, 1)}`,
        output: `z = ${t.z.toFixed(2)}, p = ${t.pValue < 0.001 ? "<0.001" : t.pValue.toFixed(3)}`,
      },
    ],
    chips: [
      { label: "Control", value: pct(t.controlRate, 1), tone: "bad" },
      { label: "Treatment", value: pct(t.treatmentRate, 1), tone: "good" },
      { label: "Rel. lift", value: signedPct(t.relLift), tone: "accent" },
      { label: "p-value", value: t.pValue < 0.001 ? "<0.001" : t.pValue.toFixed(3) },
      { label: "Decision", value: decision.toUpperCase(), tone: decision === "ship" ? "good" : decision === "kill" ? "bad" : "default" },
    ],
    handoffTo: "loop",
  });

  return { readout };
}
