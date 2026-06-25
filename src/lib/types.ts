// Domain types shared across skills, agents, and UI.

export interface Leak {
  id: string; // 'activation_cliff' | 'week2_retention' | 'integration_gap' | 'channel_mix'
  label: string;
  stage: string; // human-readable funnel step
  metric: number; // current rate (0..1)
  benchmark: number; // healthy reference rate (0..1)
  gap: number; // benchmark - metric
  usersAffected: number; // weekly opportunity if closed to benchmark
  wauUpside: number; // modeled steady-state WAU gain if closed to benchmark
  severity: number; // ranking score (= modeled WAU upside)
  evidence: string; // plain-language explanation
  addressed?: boolean; // already improved by a prior shipped experiment
}

export type Lever =
  | "onboarding"
  | "activation"
  | "docs"
  | "in-product"
  | "lifecycle"
  | "retention"
  | "channel";

export interface Hypothesis {
  id: string;
  statement: string;
  lever: Lever;
  targetLeak: string;
  rationale: string;
  impact: number; // 1..10
  confidence: number; // 1..10
  ease: number; // 1..10
  expectedLift: number; // relative lift on the target metric (e.g., 0.22 = +22%)
}

export interface IceRow {
  hypothesisId: string;
  statement: string;
  lever: Lever;
  impact: number;
  confidence: number;
  ease: number;
  ice: number; // impact * confidence * ease
  rank: number;
}

export interface Experiment {
  id: string;
  hypothesis: Hypothesis;
  metric: string; // primary metric name
  variantName: string;
}

export interface ExperimentDesign {
  metric: string;
  baseline: number;
  mde: number; // relative minimum detectable effect
  alpha: number;
  power: number;
  sampleSizePerArm: number;
  totalSample: number;
  dailyEligible: number;
  estRuntimeDays: number;
  variants: string[];
}

export type AssetKind = "email" | "docs" | "nudge";

export interface VariantAsset {
  kind: AssetKind;
  title: string;
  subject?: string; // email subject
  preheader?: string; // email preheader
  body: string; // markdown-ish body, real usable copy
  meta: string[]; // bullet notes (placement, trigger, etc.)
}

export type Decision = "ship" | "kill" | "iterate";

export interface Readout {
  controlN: number;
  controlConv: number;
  treatmentN: number;
  treatmentConv: number;
  controlRate: number;
  treatmentRate: number;
  absLift: number;
  relLift: number;
  z: number;
  pValue: number;
  significant: boolean;
  ciLow: number;
  ciHigh: number;
  decision: Decision;
  rationale: string;
}

export interface Learning {
  id: string;
  cycle: number;
  leakId: string;
  statement: string;
  metric: string;
  before: number;
  after: number;
  deltaPct: number;
  shipped: boolean;
  ts: number;
}

export interface MemoryState {
  cycles: number;
  learnings: Learning[];
  addressedLeaks: string[];
  activationLift: number; // cumulative relative lift on activation from shipped wins
  retentionLift: number; // cumulative relative lift on retention from shipped wins
}

export interface GrowthModel {
  weeklySignups: number;
  activation: number;
  weeklyRetention: number;
  retentionMultiplier: number;
  calibration: number;
  wau: number;
}

export interface WauPoint {
  label: string;
  dayIndex: number;
  actual?: number;
  baseline?: number;
  projected?: number;
}
