"use client";

import { Eyebrow } from "@/components/ui";
import { useCompound } from "@/components/demo/useCompound";
import { ChatSurface } from "@/components/demo/ChatSurface";
import { GuidedCaption } from "@/components/demo/GuidedCaption";
import { AgentTrace } from "@/components/demo/AgentTrace";
import { Conversation } from "@/components/demo/Conversation";
import { GrowthModelWidget } from "@/components/demo/GrowthModelWidget";
import { ExperimentBacklog } from "@/components/demo/ExperimentBacklog";
import { IceTable } from "@/components/demo/IceTable";
import { VariantPreview } from "@/components/demo/VariantPreview";
import { ReadoutCard } from "@/components/demo/ReadoutCard";
import { WauProjectionChart } from "@/components/demo/WauProjectionChart";
import { LearningsLibrary } from "@/components/demo/LearningsLibrary";

export default function DemoPage() {
  const c = useCompound();

  return (
    <div className="container-px py-10 sm:py-12">
      <header className="mb-6">
        <Eyebrow className="mb-2">Live demo · the centerpiece</Eyebrow>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Watch the loop run.</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-400">
          Type a goal or hit <span className="text-lime">Run guided demo</span>. Six agents collaborate end-to-end — every
          tool call, score, and stat is real and computed locally. Nothing to configure.
        </p>
      </header>

      <div className="space-y-4">
        <ChatSurface
          onRun={c.runGoal}
          onGuided={c.runGuided}
          onAnother={c.runAnother}
          onReset={c.reset}
          running={c.running}
          cycles={c.memory.cycles}
        />

        <GuidedCaption caption={c.caption} />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <GrowthModelWidget memory={c.memory} />
            <Conversation messages={c.messages} running={c.running} />
            <ExperimentBacklog memory={c.memory} />
          </div>

          <div className="lg:col-span-7">
            <div className="h-[64vh] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
              <AgentTrace events={c.events} activeAgent={c.activeAgent} running={c.running} />
            </div>
          </div>
        </div>

        {c.latest && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold text-white">Artifacts this loop produced</h2>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="font-mono text-[11px] text-slate-500">cycle {c.latest.cycle}</span>
            </div>
            <IceTable rows={c.latest.iceTable} />
            <div className="grid gap-4 lg:grid-cols-2">
              <VariantPreview asset={c.latest.asset} source={c.latest.assetSource} />
              <ReadoutCard readout={c.latest.readout} />
            </div>
          </div>
        )}

        <div className="grid gap-4 pt-4 lg:grid-cols-2">
          <WauProjectionChart memory={c.memory} />
          <LearningsLibrary memory={c.memory} />
        </div>
      </div>
    </div>
  );
}
