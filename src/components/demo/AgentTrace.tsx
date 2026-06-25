"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Terminal } from "lucide-react";
import { AGENTS, type AgentId, type TraceEvent } from "@/agents/types";
import { ACCENT, AGENT_ICON, CHIP_TONE } from "@/components/agentVisuals";

function ThinkingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label="working">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

function TraceNode({ event, isLast, active }: { event: TraceEvent; isLast: boolean; active: boolean }) {
  const reduced = useReducedMotion();
  const meta = AGENTS[event.agent];
  const Icon = AGENT_ICON[event.agent];
  const accent = ACCENT[meta.accent];
  const thinking = event.status === "thinking";

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="relative flex gap-3.5 pb-4"
    >
      {/* rail */}
      <div className="relative flex flex-col items-center">
        <span
          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${accent.border} ${accent.bg} ${
            active && thinking ? "animate-pulse-node" : ""
          }`}
        >
          <Icon className={`h-4 w-4 ${accent.text}`} aria-hidden />
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-gradient-to-b from-white/15 to-white/[0.04]" aria-hidden />}
      </div>

      {/* body */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-white">{meta.name}</span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${accent.border} ${accent.text}`}>
            {meta.kind}
          </span>
          {event.handoffTo && event.status !== "thinking" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <ArrowDownRight className="h-3 w-3" /> hands to {AGENTS[event.handoffTo].name}
            </span>
          )}
        </div>

        <p className={`mt-1 text-[15px] leading-snug ${thinking ? "text-slate-400" : "text-slate-100"}`}>
          {event.headline}
          {thinking && <ThinkingDots className={`ml-2 align-middle ${accent.text}`} />}
        </p>

        {event.detail && !thinking && <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{event.detail}</p>}

        {event.chips && event.chips.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {event.chips.map((c, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] ${CHIP_TONE[c.tone ?? "default"]}`}>
                <span className="opacity-60">{c.label}</span>
                <span className="font-semibold">{c.value}</span>
              </span>
            ))}
          </div>
        )}

        {event.toolCalls && event.toolCalls.length > 0 && (
          <div className="mt-2.5 space-y-1">
            {event.toolCalls.map((t, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-white/[0.06] bg-ink-950/50 px-2.5 py-1.5 font-mono text-[11px] text-slate-400">
                <Terminal className="mt-0.5 h-3 w-3 shrink-0 text-slate-600" aria-hidden />
                <span className="min-w-0">
                  <span className="text-teal">{t.tool}</span>
                  <span className="text-slate-600"> · {t.skill}</span>
                  <span className="block text-slate-500">
                    {t.input} <span className="text-slate-600">→</span> {t.output}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}

export function AgentTrace({
  events,
  activeAgent,
  running,
}: {
  events: TraceEvent[];
  activeAgent: AgentId | null;
  running: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Collapse: hide a "thinking" event once a later non-thinking event for the same
  // cycle+agent exists. Keeps a clean, growing list of conclusions + the live frontier.
  const visible = useMemo(() => {
    return events.filter((e) => {
      if (e.status !== "thinking") return true;
      return !events.some((o) => o.cycle === e.cycle && o.agent === e.agent && o.ts >= e.ts && o.status !== "thinking");
    });
  }, [events]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [visible.length, reduced]);

  // group by cycle for dividers
  const groups = useMemo(() => {
    const map = new Map<number, TraceEvent[]>();
    for (const e of visible) {
      if (!map.has(e.cycle)) map.set(e.cycle, []);
      map.get(e.cycle)!.push(e);
    }
    return Array.from(map.entries());
  }, [visible]);

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-white">Agent Trace</span>
          <span className="text-[11px] text-slate-500">live multi-agent execution</span>
        </div>
        <span className={`flex items-center gap-1.5 text-[11px] ${running ? "text-lime" : "text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-lime animate-pulse" : "bg-slate-600"}`} />
          {running ? "running" : "idle"}
        </span>
      </div>

      <div ref={scrollRef} className="min-h-[24rem] flex-1 overflow-y-auto px-5 py-4">
        {visible.length === 0 ? (
          <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Terminal className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              The trace will animate here. Hit <span className="text-lime">Run guided demo</span> or type a goal to start the loop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map(([cycle, evs]) => (
              <div key={cycle}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Cycle {cycle}
                  </span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <ul className="ml-0.5">
                  <AnimatePresence initial={!reduced}>
                    {evs.map((e, i) => (
                      <TraceNode key={e.id} event={e} isLast={i === evs.length - 1} active={activeAgent === e.agent && running} />
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
