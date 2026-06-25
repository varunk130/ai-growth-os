import { GitBranch, CheckCircle2 } from "lucide-react";
import type { MemoryState } from "@/lib/types";
import { pct, signedPct } from "@/lib/format";

export function LearningsLibrary({ memory }: { memory: MemoryState }) {
  const learnings = [...memory.learnings].reverse();

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-lime" />
          <h3 className="font-display text-sm font-semibold text-white">Learnings library</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{memory.learnings.length} compounded</span>
      </div>

      {learnings.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-500">
          No learnings yet — every shipped experiment lands here and feeds the next cycle.
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {learnings.map((l) => (
            <li key={l.id} className="px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Cycle {l.cycle}
                </span>
                {l.shipped ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-ship">
                    <CheckCircle2 className="h-3 w-3" /> shipped
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">logged</span>
                )}
                {l.shipped && <span className="ml-auto font-mono text-xs font-semibold text-lime">{signedPct(l.deltaPct)}</span>}
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-slate-300">{l.statement}</p>
              {l.shipped && (
                <p className="mt-1 font-mono text-[11px] text-slate-500">
                  {l.metric}: {pct(l.before)} → <span className="text-slate-300">{pct(l.after)}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
