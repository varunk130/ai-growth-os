import { CheckCircle2, Target } from "lucide-react";
import { detectLeaks } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import { num, pct } from "@/lib/format";
import type { MemoryState } from "@/lib/types";

export function ExperimentBacklog({ memory }: { memory: MemoryState }) {
  const leaks = detectLeaks(funnelData, memory.addressedLeaks);
  const maxUpside = Math.max(...leaks.map((l) => l.wauUpside), 1);
  const nextUpId = leaks.find((l) => !l.addressed)?.id;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-teal" />
          <h3 className="font-display text-sm font-semibold text-white">Experiment backlog</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">ranked by WAU upside</span>
      </div>

      <ul className="divide-y divide-white/[0.05]">
        {leaks.map((l) => {
          const next = l.id === nextUpId;
          return (
            <li key={l.id} className={`px-5 py-3 ${l.addressed ? "opacity-55" : ""}`}>
              <div className="flex items-center gap-2">
                {l.addressed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-ship" />
                ) : (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${next ? "bg-lime" : "bg-slate-600"}`} />
                )}
                <span className={`text-[13px] font-medium ${l.addressed ? "text-slate-400 line-through" : "text-white"}`}>{l.label}</span>
                {next && (
                  <span className="rounded border border-lime/30 bg-lime/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-lime">
                    next up
                  </span>
                )}
                <span className="ml-auto font-mono text-[11px] text-slate-400">+{num(l.wauUpside)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 pl-5">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className={`block h-full rounded-full ${l.addressed ? "bg-ship/60" : next ? "bg-lime" : "bg-slate-600"}`}
                    style={{ width: `${(l.wauUpside / maxUpside) * 100}%` }}
                  />
                </span>
                <span className="shrink-0 font-mono text-[10px] text-slate-500">
                  {pct(l.metric)} → {pct(l.benchmark)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
