"use client";

import { motion } from "framer-motion";
import { TrendingUp, X } from "lucide-react";
import { growthModel } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import { num, pct, signedPct } from "@/lib/format";
import type { MemoryState } from "@/lib/types";
import { AnimatedNumber } from "./AnimatedNumber";

function Factor({ label, value, delta, lifted }: { label: string; value: string; delta?: string; lifted?: boolean }) {
  return (
    <div className={`flex-1 rounded-lg border px-3 py-2.5 ${lifted ? "border-lime/30 bg-lime/[0.06]" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-semibold ${lifted ? "text-lime" : "text-white"}`}>{value}</div>
      {delta && <div className="text-[10px] text-lime">{delta}</div>}
    </div>
  );
}

export function GrowthModelWidget({ memory }: { memory: MemoryState }) {
  const base = growthModel(funnelData);
  const cur = growthModel(funnelData, memory);
  const lifted = memory.cycles > 0;
  const wauDelta = cur.wau - base.wau;

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-lime" />
          <h3 className="font-display text-sm font-semibold text-white">Growth model</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">WAU = signups × activation × retention</span>
      </div>

      <div className="mt-4 flex items-stretch gap-2">
        <Factor label="Weekly signups" value={num(cur.weeklySignups)} />
        <div className="flex items-center text-slate-600">
          <X className="h-3.5 w-3.5" />
        </div>
        <Factor
          label="Activation"
          value={pct(cur.activation)}
          lifted={lifted && memory.activationLift > 0}
          delta={memory.activationLift > 0 ? signedPct(memory.activationLift) : undefined}
        />
        <div className="flex items-center text-slate-600">
          <X className="h-3.5 w-3.5" />
        </div>
        <Factor
          label="Retention ×"
          value={`${cur.retentionMultiplier.toFixed(2)}`}
          lifted={lifted && memory.retentionLift > 0}
          delta={memory.retentionLift > 0 ? signedPct(memory.retentionLift) : undefined}
        />
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Modeled WAU</div>
          <motion.div key={cur.wau} className="font-display text-4xl font-semibold tracking-tight text-white">
            <AnimatedNumber value={cur.wau} />
          </motion.div>
        </div>
        <div className="text-right">
          {wauDelta > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-ship/30 bg-ship/10 px-2 py-1 font-mono text-xs text-ship">
              <TrendingUp className="h-3 w-3" /> +{num(wauDelta)} vs baseline
            </span>
          ) : (
            <span className="font-mono text-xs text-slate-500">baseline · run a cycle to compound</span>
          )}
        </div>
      </div>
    </div>
  );
}
