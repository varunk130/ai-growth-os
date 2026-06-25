import { designSampleSize } from "@/skills/stats";
import { blendedActivation, recentWeeklySignups } from "@/lib/analytics";
import { num, pct } from "@/lib/format";
import type { Experiment, ExperimentDesign, Leak } from "@/lib/types";
import type { AgentContext } from "./types";
import { clamp, leakKind, roundTo } from "./util";

// Experiment Designer — computes the metric, MDE, sample size and runtime (real stats).
export async function runExperimentDesigner(
  ctx: AgentContext,
  input: { leak: Leak; experiment: Experiment },
): Promise<{ design: ExperimentDesign }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "experiment-designer",
    status: "thinking",
    headline: "Sizing the test — metric, sample size and runtime…",
  });
  await ctx.wait(700);

  const baseline = input.leak.metric;
  const alpha = 0.05;
  const power = 0.8;
  const mde = clamp(roundTo(input.experiment.hypothesis.expectedLift * 0.8, 0.05), 0.1, 0.3);
  const perArm = designSampleSize({ baseline, mde, alpha, power });

  const weeklySignups = recentWeeklySignups();
  const dailyEligible =
    leakKind(input.leak.id) === "retention"
      ? Math.max(1, Math.round((weeklySignups * blendedActivation()) / 7))
      : Math.max(1, Math.round(weeklySignups / 7));

  const totalSample = perArm * 2;
  const estRuntimeDays = Math.ceil(totalSample / dailyEligible);

  const design: ExperimentDesign = {
    metric: input.experiment.metric,
    baseline,
    mde,
    alpha,
    power,
    sampleSizePerArm: perArm,
    totalSample,
    dailyEligible,
    estRuntimeDays,
    variants: ["Control (current experience)", `Treatment (${input.experiment.hypothesis.lever})`],
  };

  ctx.emit({
    cycle: ctx.cycle,
    agent: "experiment-designer",
    status: "done",
    headline: `Test sized: ${num(perArm)} per arm, ~${estRuntimeDays} days to read out.`,
    detail: `Two-proportion test at α ${alpha}, ${Math.round(power * 100)}% power, detecting a +${pct(mde)} relative lift on ${input.leak.stage.toLowerCase()}.`,
    toolCalls: [
      {
        tool: "designSampleSize()",
        skill: "experiment-stats",
        input: `baseline ${pct(baseline, 1)}, MDE +${pct(mde)}`,
        output: `${num(perArm)}/arm`,
      },
    ],
    chips: [
      { label: "Metric", value: design.metric },
      { label: "Baseline", value: pct(baseline, 1), tone: "bad" },
      { label: "MDE", value: `+${pct(mde)}` },
      { label: "Sample", value: `${num(perArm)}/arm` },
      { label: "Runtime", value: `~${estRuntimeDays}d`, tone: "accent" },
    ],
    handoffTo: "variant-studio",
  });

  return { design };
}
