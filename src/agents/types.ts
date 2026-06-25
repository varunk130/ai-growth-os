import type {
  Experiment,
  ExperimentDesign,
  Hypothesis,
  IceRow,
  Leak,
  Learning,
  Readout,
  VariantAsset,
} from "@/lib/types";

export type AgentId =
  | "loop"
  | "funnel-analyst"
  | "hypothesis-writer"
  | "prioritizer"
  | "experiment-designer"
  | "variant-studio"
  | "readout";

export type Accent = "lime" | "teal" | "signal" | "ship" | "kill";

export interface AgentMeta {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  accent: Accent;
  kind: "orchestrator" | "analysis" | "generative";
}

export const AGENTS: Record<AgentId, AgentMeta> = {
  loop: {
    id: "loop",
    name: "Loop",
    role: "Orchestrator",
    tagline: "Owns the WAU goal, plans the cycle, compounds learnings.",
    accent: "lime",
    kind: "orchestrator",
  },
  "funnel-analyst": {
    id: "funnel-analyst",
    name: "Funnel Analyst",
    role: "Analysis sub-agent",
    tagline: "Queries the dataset and finds the biggest drop-off.",
    accent: "teal",
    kind: "analysis",
  },
  "hypothesis-writer": {
    id: "hypothesis-writer",
    name: "Hypothesis Writer",
    role: "Generative sub-agent",
    tagline: "Proposes testable bets that target the leak.",
    accent: "signal",
    kind: "generative",
  },
  prioritizer: {
    id: "prioritizer",
    name: "Prioritizer",
    role: "Analysis sub-agent",
    tagline: "Scores bets by ICE and picks the winner.",
    accent: "teal",
    kind: "analysis",
  },
  "experiment-designer": {
    id: "experiment-designer",
    name: "Experiment Designer",
    role: "Analysis sub-agent",
    tagline: "Sizes the test: metric, sample size, runtime.",
    accent: "teal",
    kind: "analysis",
  },
  "variant-studio": {
    id: "variant-studio",
    name: "Variant Studio",
    role: "Generative sub-agent",
    tagline: "Assembles the actual asset to ship.",
    accent: "signal",
    kind: "generative",
  },
  readout: {
    id: "readout",
    name: "Readout",
    role: "Analysis sub-agent",
    tagline: "Runs the significance test and makes the call.",
    accent: "teal",
    kind: "analysis",
  },
};

export const AGENT_ORDER: AgentId[] = [
  "loop",
  "funnel-analyst",
  "hypothesis-writer",
  "prioritizer",
  "experiment-designer",
  "variant-studio",
  "readout",
];

export type TraceStatus = "thinking" | "tool" | "done" | "handoff";

export interface ToolCall {
  tool: string;
  skill: string;
  input: string;
  output: string;
}

export type ChipTone = "default" | "good" | "bad" | "accent";

export interface Chip {
  label: string;
  value: string;
  tone?: ChipTone;
}

export interface TraceEvent {
  id: string;
  cycle: number;
  agent: AgentId;
  status: TraceStatus;
  headline: string; // plain-language: what this agent figured out / is doing
  detail?: string; // plain-language: why it matters
  toolCalls?: ToolCall[]; // technical layer
  chips?: Chip[]; // technical layer, structured (never raw JSON)
  handoffTo?: AgentId;
  ts: number;
}

export interface CycleResult {
  cycle: number;
  goal: string;
  leak: Leak;
  hypotheses: Hypothesis[];
  iceTable: IceRow[];
  topExperiment: Experiment;
  design: ExperimentDesign;
  asset: VariantAsset;
  readout: Readout;
  learning: Learning;
  assetSource: string; // provenance from the LLM seam (curated vs model)
  wauBefore: number;
  wauAfter: number;
}

export interface AgentContext {
  cycle: number;
  seed: number;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}
