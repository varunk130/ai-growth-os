import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import type { Readout } from "@/lib/types";
import { pct, signedPct } from "@/lib/format";

export function ReadoutCard({ readout }: { readout: Readout }) {
  const d = readout.decision;
  const tone =
    d === "ship"
      ? { color: "text-ship", border: "border-ship/40", bg: "bg-ship/10", icon: CheckCircle2, label: "Ship it" }
      : d === "kill"
        ? { color: "text-kill", border: "border-kill/40", bg: "bg-kill/10", icon: XCircle, label: "Kill it" }
        : { color: "text-signal", border: "border-signal/40", bg: "bg-signal/10", icon: RefreshCcw, label: "Iterate" };
  const Icon = tone.icon;
  const maxRate = Math.max(readout.controlRate, readout.treatmentRate, 0.0001);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-white">Readout · significance test</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${tone.border} ${tone.bg} ${tone.color}`}>
          <Icon className="h-3.5 w-3.5" /> {tone.label}
        </span>
      </div>

      <div className="p-5">
        {/* control vs treatment bars */}
        <div className="space-y-2.5">
          {[
            { label: "Control", rate: readout.controlRate, n: readout.controlN, conv: readout.controlConv, accent: "bg-slate-500" },
            { label: "Treatment", rate: readout.treatmentRate, n: readout.treatmentN, conv: readout.treatmentConv, accent: "bg-ship" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-400">{row.label}</span>
                <span className="font-mono text-slate-300">
                  {pct(row.rate, 1)} <span className="text-slate-600">· {row.conv.toLocaleString()}/{row.n.toLocaleString()}</span>
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className={`h-full rounded-full ${row.accent}`} style={{ width: `${(row.rate / maxRate) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Rel. lift", value: signedPct(readout.relLift), accent: "text-lime" },
            { label: "p-value", value: readout.pValue < 0.001 ? "<0.001" : readout.pValue.toFixed(3), accent: "text-white" },
            { label: "z-score", value: readout.z.toFixed(2), accent: "text-white" },
            { label: "95% CI", value: `${signedPct(readout.ciLow)}…${signedPct(readout.ciHigh)}`, accent: "text-slate-300" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
              <div className={`mt-0.5 font-mono text-sm font-semibold ${s.accent}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-slate-400">{readout.rationale}</p>
      </div>
    </div>
  );
}
