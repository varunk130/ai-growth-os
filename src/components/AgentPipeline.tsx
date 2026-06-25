import { ArrowRight, RefreshCw } from "lucide-react";
import { AGENTS, AGENT_ORDER } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";

export function AgentPipeline({ compact = false }: { compact?: boolean }) {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-stretch gap-2.5">
        {AGENT_ORDER.map((id, i) => {
          const a = AGENTS[id];
          const Icon = AGENT_ICON[id];
          const accent = ACCENT[a.accent];
          return (
            <div key={id} className="flex items-center gap-2.5">
              <div className={`flex items-center gap-2.5 rounded-xl border ${accent.border} ${accent.bg} px-3 py-2.5`}>
                <Icon className={`h-4 w-4 ${accent.text}`} aria-hidden />
                <div className="leading-tight">
                  <div className="text-[13px] font-medium text-white">{a.name}</div>
                  {!compact && <div className="text-[10px] uppercase tracking-wider text-slate-500">{a.kind}</div>}
                </div>
              </div>
              {i < AGENT_ORDER.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[12px] text-slate-500">
        <RefreshCw className="h-3.5 w-3.5 text-lime" aria-hidden />
        <span>
          Readout&apos;s result flows back into <span className="text-slate-300">compound-memory</span>, so the next loop starts
          smarter — that&apos;s the compounding.
        </span>
      </div>
    </div>
  );
}
