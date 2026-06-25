import type { AgentId } from "@/agents/types";

// Guided-demo narration. Plain-language captions surfaced as the scripted scenario
// auto-plays, so a visitor who types nothing still understands every hand-off.

export const GUIDED_PROMPT = "WAU is flat this week — find the leak and run the next experiment.";

export const CYCLE_INTROS: string[] = [
  "Cycle 1 — Compound starts cold: no memory, just 60 days of data and a goal.",
  "Cycle 2 — now Compound remembers. Watch it skip the leak it already fixed and compound the last win.",
  "Cycle 3 — the learnings library keeps stacking. Each loop starts smarter than the one before it.",
  "Another cycle — Compound keeps mining the next-biggest opportunity and compounding the gains.",
];

export const NARRATION: Record<AgentId, string> = {
  loop: "Loop takes the goal, checks its memory for what it already knows, and plans a single experiment cycle.",
  "funnel-analyst": "The Funnel Analyst queries 60 days of real data and pinpoints the single biggest place users drop out.",
  "hypothesis-writer": "The Hypothesis Writer proposes a set of testable bets aimed squarely at that leak.",
  prioritizer: "The Prioritizer scores every bet with real ICE math and picks the one experiment to run now.",
  "experiment-designer": "The Experiment Designer sizes the test — metric, sample size and runtime — using real statistics.",
  "variant-studio": "Variant Studio assembles the actual asset to ship, drawn from the curated content library.",
  readout: "Readout simulates the result, runs a real significance test, and makes the ship-or-kill call.",
};

export const CLOSING =
  "Loop done. The win is written to memory, the experiment joins the backlog, and the WAU projection just compounded.";

export const GUIDED_HINTS: string[] = [
  "Try “WAU is flat this week — find the leak and run the next experiment.”",
  "Then hit Run another cycle to watch Compound get smarter.",
];
