import { selectAsset } from "@content/variants";
import { agentLLM } from "@/lib/llm";
import type { Experiment, Leak, VariantAsset } from "@/lib/types";
import type { AgentContext } from "./types";
import { kindLabel } from "./util";

// Variant Studio — assembles the actual asset to ship from the curated library,
// routed through the single agentLLM seam (offline default = curated selection).
export async function runVariantStudio(
  ctx: AgentContext,
  input: { leak: Leak; experiment: Experiment },
): Promise<{ asset: VariantAsset; source: string }> {
  ctx.emit({
    cycle: ctx.cycle,
    agent: "variant-studio",
    status: "thinking",
    headline: "Assembling the asset to ship…",
  });
  await ctx.wait(750);

  const template = selectAsset(input.leak.id, input.experiment.hypothesis.lever);
  const resp = await agentLLM.generate({
    task: `asset:${template.kind}:${input.leak.id}`,
    context: {
      leak: input.leak.id,
      lever: input.experiment.hypothesis.lever,
      expectedLift: input.experiment.hypothesis.expectedLift,
    },
    candidates: template.bodyVariants,
    seed: ctx.seed,
  });

  const asset: VariantAsset = { ...template.base, body: resp.text };

  ctx.emit({
    cycle: ctx.cycle,
    agent: "variant-studio",
    status: "done",
    headline: `Built a ${kindLabel(asset.kind)}: “${asset.title}”.`,
    detail: `Real, usable copy assembled via the agentLLM seam (source: ${resp.source}). Open the asset to read it.`,
    toolCalls: [
      {
        tool: "agentLLM.generate()",
        skill: "llm-seam",
        input: `task = asset:${template.kind}`,
        output: `source = ${resp.source}`,
      },
    ],
    chips: [
      { label: "Asset", value: kindLabel(asset.kind) },
      { label: "Source", value: resp.source, tone: "accent" },
      { label: "Status", value: "ready to ship", tone: "good" },
    ],
    handoffTo: "readout",
  });

  return { asset, source: resp.source };
}
