import { Infinity as InfinityIcon, Search, Lightbulb, ListOrdered, FlaskConical, Wand2, LineChart, type LucideIcon } from "lucide-react";
import type { AgentId, Accent } from "@/agents/types";

export const AGENT_ICON: Record<AgentId, LucideIcon> = {
  loop: InfinityIcon,
  "funnel-analyst": Search,
  "hypothesis-writer": Lightbulb,
  prioritizer: ListOrdered,
  "experiment-designer": FlaskConical,
  "variant-studio": Wand2,
  readout: LineChart,
};

export interface AccentClasses {
  text: string;
  bg: string;
  border: string;
  dot: string;
  ring: string;
  glow: string;
}

export const ACCENT: Record<Accent, AccentClasses> = {
  lime: { text: "text-lime", bg: "bg-lime/10", border: "border-lime/40", dot: "bg-lime", ring: "ring-lime/50", glow: "shadow-glow" },
  teal: { text: "text-teal", bg: "bg-teal/10", border: "border-teal/40", dot: "bg-teal", ring: "ring-teal/50", glow: "shadow-glow-teal" },
  signal: { text: "text-signal", bg: "bg-signal/10", border: "border-signal/40", dot: "bg-signal", ring: "ring-signal/50", glow: "shadow-glow" },
  ship: { text: "text-ship", bg: "bg-ship/10", border: "border-ship/40", dot: "bg-ship", ring: "ring-ship/50", glow: "shadow-glow" },
  kill: { text: "text-kill", bg: "bg-kill/10", border: "border-kill/40", dot: "bg-kill", ring: "ring-kill/50", glow: "shadow-glow" },
};

export const CHIP_TONE: Record<string, string> = {
  default: "border-white/10 bg-white/[0.03] text-slate-300",
  good: "border-ship/30 bg-ship/10 text-ship",
  bad: "border-kill/30 bg-kill/10 text-kill",
  accent: "border-lime/30 bg-lime/10 text-lime",
};
