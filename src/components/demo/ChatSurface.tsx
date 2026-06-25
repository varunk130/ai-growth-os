"use client";

import { useState } from "react";
import { Play, Send, RotateCw, Trash2 } from "lucide-react";
import { GUIDED_PROMPT } from "@content/narration";

const SUGGESTIONS = [
  GUIDED_PROMPT,
  "Where are we losing the most users, and what should we test?",
  "Find the biggest activation leak and design an experiment.",
];

export function ChatSurface({
  onRun,
  onGuided,
  onAnother,
  onReset,
  running,
  cycles,
}: {
  onRun: (goal: string) => void;
  onGuided: () => void;
  onAnother: () => void;
  onReset: () => void;
  running: boolean;
  cycles: number;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v || running) return;
    onRun(v);
    setValue("");
  };

  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-ink-950/50 px-3.5 py-1 focus-within:border-lime/40">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            disabled={running}
            placeholder="Ask Compound to grow WAU…"
            aria-label="Goal for Compound"
            className="flex-1 bg-transparent py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
          />
          <button
            onClick={submit}
            disabled={running || !value.trim()}
            aria-label="Send goal"
            className="btn-ghost !rounded-lg !px-2.5 !py-2 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <button onClick={onGuided} disabled={running} className="btn-primary whitespace-nowrap">
          <Play className="h-4 w-4" /> Run guided demo
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Try</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => !running && onRun(s)}
            disabled={running}
            className="focusable rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[12px] text-slate-400 transition-colors hover:border-lime/30 hover:text-lime disabled:opacity-40"
          >
            {s.length > 52 ? `${s.slice(0, 52)}…` : s}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onAnother}
            disabled={running || cycles === 0}
            className="btn-ghost !px-3 !py-1.5 text-[12px] disabled:opacity-40"
          >
            <RotateCw className="h-3.5 w-3.5" /> Run another cycle
          </button>
          <button
            onClick={onReset}
            disabled={running || cycles === 0}
            aria-label="Reset memory"
            className="focusable rounded-lg border border-white/10 p-2 text-slate-500 transition-colors hover:border-kill/30 hover:text-kill disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
