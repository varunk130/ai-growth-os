import { ArrowDown, Database, FileText, RefreshCw, Target } from "lucide-react";
import { AGENTS, AGENT_ORDER } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

function Layer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-4 w-4 text-slate-600" />
    </div>
  );
}

export function ArchitectureDiagram() {
  const subAgents = AGENT_ORDER.filter((id) => id !== "loop");

  return (
    <div className="panel relative overflow-hidden p-5 sm:p-7">
      <div className="grid-bg absolute inset-0 -z-10 opacity-50" aria-hidden />

      <Layer title="Goal">
        <div className="mx-auto w-fit rounded-xl border border-lime/30 bg-lime/[0.06] px-4 py-2.5 text-center">
          <Target className="mr-2 inline h-4 w-4 text-lime" />
          <span className="text-sm text-white">“WAU is flat — find the leak and run the next experiment.”</span>
        </div>
      </Layer>

      <Arrow />

      <Layer title="Orchestrator">
        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-lime/40 bg-lime/10">
            <RefreshCw className="h-4 w-4 text-lime" />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">{AGENTS.loop.name}</div>
            <div className="text-[11px] text-slate-400">{AGENTS.loop.tagline}</div>
          </div>
        </div>
      </Layer>

      <Arrow />

      <Layer title="Sub-agents (dispatched in sequence)">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {subAgents.map((id) => {
            const a = AGENTS[id];
            const Icon = AGENT_ICON[id];
            const accent = ACCENT[a.accent];
            return (
              <div key={id} className={`flex items-center gap-2 rounded-lg border ${accent.border} ${accent.bg} px-2.5 py-2`}>
                <Icon className={`h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                <span className="truncate text-[12px] font-medium text-white">{a.name}</span>
              </div>
            );
          })}
        </div>
      </Layer>

      <Arrow />

      <Layer title="Skills (invoked by name)">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {SKILLS.map((s) => (
            <div key={s.name} className="rounded-lg border border-teal/25 bg-teal/[0.05] px-2.5 py-2">
              <div className="font-mono text-[11px] text-teal">{s.name}</div>
            </div>
          ))}
        </div>
      </Layer>

      <Arrow />

      <Layer title="Data & content (local, no network)">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
            <Database className="h-4 w-4 text-slate-400" />
            <span className="text-[12px] text-slate-300">Adaptive SDK funnel · 60 days, 4 channels, cohorts</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="text-[12px] text-slate-300">Curated /content · hypotheses + shippable assets</span>
          </div>
        </div>
      </Layer>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-lime/20 bg-lime/[0.05] px-3 py-2.5">
        <RefreshCw className="h-4 w-4 shrink-0 text-lime" />
        <span className="text-[12px] text-slate-300">
          <span className="font-semibold text-lime">compound-memory</span> feeds each Readout back into the next Loop — the
          backwards edge that makes growth compound.
        </span>
      </div>
    </div>
  );
}
