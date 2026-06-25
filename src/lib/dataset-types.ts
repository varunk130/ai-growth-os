// Canonical dataset types for the Adaptive SDK synthetic funnel.
// Shared by the seed generator (data/seed.ts) and the runtime (src/lib/dataset.ts).
// This file has NO runtime imports so the seed can reference it before funnel.json exists.

export type ChannelKey = "docs_seo" | "github" | "community" | "partnerships";

export interface ChannelDaily {
  signups: number;
  spend: number; // acquisition spend attributed to this channel that day (USD)
  activated: number; // signups from this channel that reached first API call
}

export interface DayRecord {
  date: string; // ISO yyyy-mm-dd
  dayIndex: number; // 0..days-1
  signups: number; // total new signups across channels
  firstApiCall: number; // activation stage 1: first API call
  firstIntegration: number; // activation stage 2: first successful integration
  dau: number; // daily active users
  wau: number; // weekly active users (rolling)
  channels: Record<ChannelKey, ChannelDaily>;
}

export interface Cohort {
  cohortIndex: number; // 0-based weekly signup cohort
  startDate: string;
  size: number; // signups in the cohort week
  retention: number[]; // retention[0] = 1.0; retention[k] = fraction active in week k (observed weeks only)
}

export interface ChannelMeta {
  key: ChannelKey;
  label: string;
  blurb: string;
  signups: number;
  spend: number;
  cac: number; // spend / signups
  activated: number;
  activationRate: number; // activated / signups
}

export interface Benchmarks {
  activationRateHealthy: number; // signup -> first API call
  apiToIntegrationHealthy: number; // first API call -> first integration
  week1RetentionHealthy: number;
  week2RetentionHealthy: number;
  week4RetentionHealthy: number;
}

export interface FunnelMeta {
  product: string;
  tagline: string;
  generatedAt: string;
  seed: number;
  days: number;
  startDate: string;
  endDate: string;
  injectedProblems: string[];
}

export interface FunnelData {
  meta: FunnelMeta;
  daily: DayRecord[];
  cohorts: Cohort[];
  channels: ChannelMeta[];
  benchmarks: Benchmarks;
}
