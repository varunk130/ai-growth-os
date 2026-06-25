"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { projectWauSeries } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import { num } from "@/lib/format";
import type { MemoryState } from "@/lib/types";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const rows = payload.filter((p: any) => p.value != null);
  if (rows.length === 0) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-ink-900/95 px-3 py-2 shadow-panel backdrop-blur">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      {rows.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12px]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-slate-400">{p.dataKey}</span>
          <span className="ml-auto font-mono font-semibold text-white">{num(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function WauProjectionChart({ memory }: { memory: MemoryState }) {
  const data = projectWauSeries(funnelData, memory, 28);
  const todayLabel = funnelData.daily[funnelData.daily.length - 1].date.slice(5);
  const lifted = memory.cycles > 0;

  return (
    <div className="panel p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-white">WAU projection</h3>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-teal" /> Actual
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-3 rounded-full border border-dashed border-slate-500" /> Baseline
          </span>
          <span className="flex items-center gap-1.5 text-lime">
            <span className="h-2 w-2 rounded-full bg-lime" /> After experiments
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5EEAD4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              interval={Math.floor(data.length / 8)}
              minTickGap={16}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => num(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={todayLabel} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 3" label={{ value: "today", fill: "#64748b", fontSize: 10, position: "insideTopRight" }} />
            <Area type="monotone" dataKey="actual" stroke="#5EEAD4" strokeWidth={2} fill="url(#actualFill)" connectNulls={false} dot={false} />
            <Line type="monotone" dataKey="baseline" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} connectNulls={false} />
            <Line type="monotone" dataKey="projected" stroke="#B8FF3D" strokeWidth={2.5} dot={false} connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[12px] text-slate-500">
        {lifted
          ? "The lime line compounds every shipped win across the next 4 weeks; the dashed line is the do-nothing baseline."
          : "Run a cycle to project how shipped experiments compound WAU over the next 4 weeks."}
      </p>
    </div>
  );
}
