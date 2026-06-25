import { growthModel } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import { num, pct, signedPct } from "@/lib/format";
import { recordLearning, type ShippedEffect } from "@/skills/compound-memory";
import type { Learning, MemoryState } from "@/lib/types";
import type { AgentContext, CycleResult, TraceEvent } from "./types";
import { runFunnelAnalyst } from "./funnelAnalyst";
import { runHypothesisWriter } from "./hypothesisWriter";
import { runPrioritizer } from "./prioritizer";
import { runExperimentDesigner } from "./experimentDesigner";
import { runVariantStudio } from "./variantStudio";
import { runReadout } from "./readout";
import { leakKind } from "./util";

export interface RunCycleOptions {
  goal: string;
  memory: MemoryState;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}

export interface RunCycleOutput {
  result: CycleResult;
  memory: MemoryState;
}

// Orchestrator "Loop" — owns the WAU goal, plans the cycle, dispatches the six
// sub-agents in sequence, then folds the outcome back into compound-memory.
export async function runCycle(opts: RunCycleOptions): Promise<RunCycleOutput> {
  const cycle = opts.memory.cycles + 1;
  const ctx: AgentContext = { cycle, seed: cycle, emit: opts.emit, wait: opts.wait };

  const wauBefore = growthModel(funnelData, opts.memory).wau;

  // --- Loop plans the cycle ---------------------------------------------------
  ctx.emit({
    cycle,
    agent: "loop",
    status: "thinking",
    headline: cycle === 1 ? "New goal: lift WAU. Planning the first experiment cycle…" : `Cycle ${cycle}: re-planning with everything learned so far…`,
    detail: "Checking compound-memory, then dispatching the sub-agents.",
  });
  await ctx.wait(650);

  ctx.emit({
    cycle,
    agent: "loop",
    status: "handoff",
    headline:
      cycle === 1
        ? "No prior memory — starting cold from 60 days of data."
        : `Loaded ${opts.memory.learnings.length} learning(s); skipping ${opts.memory.addressedLeaks.length} solved leak(s).`,
    chips: [
      { label: "Goal", value: "Grow WAU" },
      { label: "Memory", value: `${opts.memory.learnings.length} learning(s)` },
      { label: "WAU model", value: num(wauBefore), tone: "accent" },
    ],
    handoffTo: "funnel-analyst",
  });
  await ctx.wait(300);

  // --- Dispatch sub-agents ----------------------------------------------------
  const { leak } = await runFunnelAnalyst(ctx, { addressedLeaks: opts.memory.addressedLeaks });
  await ctx.wait(280);
  const { hypotheses } = await runHypothesisWriter(ctx, { leak });
  await ctx.wait(280);
  const { iceTable, experiment } = await runPrioritizer(ctx, { hypotheses, leak });
  await ctx.wait(280);
  const { design } = await runExperimentDesigner(ctx, { leak, experiment });
  await ctx.wait(280);
  const { asset, source } = await runVariantStudio(ctx, { leak, experiment });
  await ctx.wait(280);
  const { readout } = await runReadout(ctx, { leak, experiment, design });
  await ctx.wait(320);

  // --- Loop compounds the learning -------------------------------------------
  const shipped = readout.decision === "ship";
  const kind = leakKind(leak.id);
  const effect: ShippedEffect =
    kind === "retention"
      ? { leakId: leak.id, retentionLift: shipped ? readout.relLift : 0 }
      : { leakId: leak.id, activationLift: shipped ? readout.relLift : 0 };

  const learning: Learning = {
    id: `learn-c${cycle}-${leak.id}`,
    cycle,
    leakId: leak.id,
    statement: shipped
      ? `${leak.label}: "${experiment.hypothesis.statement}" lifted ${design.metric.toLowerCase()} by ${signedPct(readout.relLift)}.`
      : `${leak.label}: "${experiment.hypothesis.statement}" did not produce a reliable lift (${readout.decision}).`,
    metric: design.metric,
    before: leak.metric,
    after: leak.metric * (1 + (shipped ? readout.relLift : 0)),
    deltaPct: shipped ? readout.relLift : 0,
    shipped,
    ts: Date.now(),
  };

  const memory = recordLearning(opts.memory, learning, effect);
  const wauAfter = growthModel(funnelData, memory).wau;

  ctx.emit({
    cycle,
    agent: "loop",
    status: "done",
    headline: shipped
      ? `Compounded. Modeled WAU ${num(wauBefore)} → ${num(wauAfter)} (${signedPct((wauAfter - wauBefore) / wauBefore)}).`
      : `Cycle logged — nothing shipped, but the learning is saved.`,
    detail: shipped
      ? "The win is written to memory; the next cycle will skip this leak and build on the lift."
      : "Memory keeps the negative result so the loop won't repeat it.",
    chips: [
      { label: "WAU before", value: num(wauBefore) },
      { label: "WAU after", value: num(wauAfter), tone: shipped ? "good" : "default" },
      { label: "Learnings", value: String(memory.learnings.length), tone: "accent" },
      { label: "Activation lift", value: signedPct(memory.activationLift) },
      { label: "Retention lift", value: signedPct(memory.retentionLift) },
    ],
  });

  const result: CycleResult = {
    cycle,
    goal: opts.goal,
    leak,
    hypotheses,
    iceTable,
    topExperiment: experiment,
    design,
    asset,
    readout,
    learning,
    assetSource: source,
    wauBefore,
    wauAfter,
  };

  return { result, memory };
}
