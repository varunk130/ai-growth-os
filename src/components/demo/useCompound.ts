"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { runCycle } from "@/agents/orchestrator";
import { emptyMemory, loadMemory, saveMemory, clearMemory } from "@/skills/compound-memory";
import type { AgentId, CycleResult, TraceEvent } from "@/agents/types";
import type { MemoryState } from "@/lib/types";
import { num, pct, signedPct } from "@/lib/format";
import { CLOSING, CYCLE_INTROS, GUIDED_PROMPT, NARRATION } from "@content/narration";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  cycle?: number;
}

function assistantSummary(r: CycleResult): string {
  const ship = r.readout.decision === "ship";
  return [
    `Found the ${r.leak.label.toLowerCase()} — ${pct(r.leak.metric)} vs a ${pct(r.leak.benchmark)} benchmark.`,
    `Top experiment by ICE: “${r.topExperiment.hypothesis.statement}”.`,
    `Sized at ${num(r.design.sampleSizePerArm)}/arm (~${r.design.estRuntimeDays} days).`,
    `Readout: ${signedPct(r.readout.relLift)}${ship ? " and significant" : ""} → ${r.readout.decision.toUpperCase()}.`,
    `Modeled WAU ${num(r.wauBefore)} → ${num(r.wauAfter)}.`,
  ].join(" ");
}

export function useCompound() {
  const reduced = useReducedMotion();
  const [memory, setMemory] = useState<MemoryState>(emptyMemory());
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [results, setResults] = useState<CycleResult[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "running">("idle");
  const [mode, setMode] = useState<"idle" | "guided" | "manual">("idle");
  const [caption, setCaption] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const memoryRef = useRef<MemoryState>(memory);
  const guidedRef = useRef(false);
  const idRef = useRef(0);
  const reducedRef = useRef<boolean>(false);

  useEffect(() => {
    reducedRef.current = !!reduced;
  }, [reduced]);

  // Restore persisted compound-memory (the learnings carry across reloads).
  useEffect(() => {
    const m = loadMemory();
    memoryRef.current = m;
    setMemory(m);
    setHydrated(true);
  }, []);

  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, reducedRef.current ? 0 : ms));
  const wait = useCallback((ms: number) => sleep(ms), []);

  const handleEmit = useCallback((e: Omit<TraceEvent, "id" | "ts">) => {
    const ev: TraceEvent = { ...e, id: `ev-${idRef.current++}`, ts: Date.now() };
    setEvents((prev) => [...prev, ev]);
    if (e.status !== "done") setActiveAgent(e.agent);
    if (guidedRef.current && e.status === "thinking" && NARRATION[e.agent]) {
      setCaption(NARRATION[e.agent]);
    }
  }, []);

  const run = useCallback(
    async (goal: string, guided: boolean) => {
      guidedRef.current = guided;
      setStatus("running");
      setMode(guided ? "guided" : "manual");
      setMessages((m) => [...m, { role: "user", text: goal }]);

      try {
        if (guided) {
          setCaption(CYCLE_INTROS[memoryRef.current.cycles % CYCLE_INTROS.length]);
          await sleep(1100);
        }

        const { result, memory: next } = await runCycle({
          goal,
          memory: memoryRef.current,
          emit: handleEmit,
          wait,
        });

        memoryRef.current = next;
        setMemory(next);
        saveMemory(next);
        setResults((r) => [...r, result]);
        setMessages((m) => [...m, { role: "assistant", text: assistantSummary(result), cycle: result.cycle }]);
        if (guided) setCaption(CLOSING);
        return result;
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: "Something interrupted that cycle and nothing was saved — give it another run." },
        ]);
        setCaption(null);
        return null;
      } finally {
        setActiveAgent(null);
        setStatus("idle");
      }
    },
    [handleEmit, wait],
  );

  const doReset = useCallback(() => {
    clearMemory();
    const m = emptyMemory();
    memoryRef.current = m;
    setMemory(m);
    setEvents([]);
    setResults([]);
    setMessages([]);
    setCaption(null);
    setActiveAgent(null);
    setMode("idle");
  }, []);

  const runGoal = useCallback(
    async (goal: string) => {
      if (status === "running") return;
      await run(goal, false);
    },
    [run, status],
  );

  const runAnother = useCallback(async () => {
    if (status === "running") return;
    await run("Run another cycle — compound the last win.", guidedRef.current);
  }, [run, status]);

  const runGuided = useCallback(async () => {
    if (status === "running") return;
    doReset();
    await sleep(60);
    await run(GUIDED_PROMPT, true);
    await sleep(1400);
    await run("Now compound it — run the next cycle.", true);
    setCaption("Two cycles in, and the WAU projection has compounded twice. That's the loop.");
  }, [doReset, run, status]);

  const reset = useCallback(() => {
    if (status === "running") return;
    doReset();
  }, [doReset, status]);

  return {
    memory,
    events,
    results,
    messages,
    status,
    mode,
    caption,
    activeAgent,
    hydrated,
    latest: results[results.length - 1] ?? null,
    running: status === "running",
    runGoal,
    runGuided,
    runAnother,
    reset,
  };
}
