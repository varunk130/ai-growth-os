import { Trophy } from "lucide-react";
import type { IceRow } from "@/lib/types";

export function IceTable({ rows }: { rows: IceRow[] }) {
  const max = Math.max(...rows.map((r) => r.ice), 1);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-white">ICE ranking</h3>
        <span className="font-mono text-[11px] text-slate-500">Impact × Confidence × Ease</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-2.5 font-medium">#</th>
              <th className="px-2 py-2.5 font-medium">Hypothesis</th>
              <th className="px-2 py-2.5 text-center font-medium">I</th>
              <th className="px-2 py-2.5 text-center font-medium">C</th>
              <th className="px-2 py-2.5 text-center font-medium">E</th>
              <th className="px-5 py-2.5 text-right font-medium">ICE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const top = r.rank === 1;
              return (
                <tr key={r.hypothesisId} className={`border-t border-white/[0.05] ${top ? "bg-lime/[0.05]" : ""}`}>
                  <td className="px-5 py-3 align-top">
                    {top ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-lime/30 bg-lime/10 px-1.5 py-0.5 text-[10px] font-semibold text-lime">
                        <Trophy className="h-3 w-3" /> 1
                      </span>
                    ) : (
                      <span className="font-mono text-slate-500">{r.rank}</span>
                    )}
                  </td>
                  <td className="px-2 py-3 align-top">
                    <p className={`line-clamp-2 max-w-md text-[13px] ${top ? "text-white" : "text-slate-300"}`}>{r.statement}</p>
                    <span className="mt-0.5 inline-block font-mono text-[10px] uppercase tracking-wider text-slate-500">{r.lever}</span>
                  </td>
                  <td className="px-2 py-3 text-center align-top font-mono text-slate-400">{r.impact}</td>
                  <td className="px-2 py-3 text-center align-top font-mono text-slate-400">{r.confidence}</td>
                  <td className="px-2 py-3 text-center align-top font-mono text-slate-400">{r.ease}</td>
                  <td className="px-5 py-3 text-right align-top">
                    <div className="flex items-center justify-end gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                        <span
                          className={`block h-full rounded-full ${top ? "bg-lime" : "bg-slate-500"}`}
                          style={{ width: `${(r.ice / max) * 100}%` }}
                        />
                      </span>
                      <span className={`font-mono font-semibold ${top ? "text-lime" : "text-slate-300"}`}>{r.ice}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
