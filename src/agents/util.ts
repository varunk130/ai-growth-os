import type { AssetKind } from "@/lib/types";

export function metricForLeak(leakId: string): string {
  switch (leakId) {
    case "activation_cliff":
      return "Signup → first API call rate";
    case "week2_retention":
      return "Week-1 → week-2 retention";
    case "integration_gap":
      return "API call → integration rate";
    case "channel_mix":
      return "Blended activation rate";
    default:
      return "Activation rate";
  }
}

export type LeakKind = "activation" | "retention";

export function leakKind(leakId: string): LeakKind {
  return leakId === "week2_retention" ? "retention" : "activation";
}

export function kindLabel(kind: AssetKind): string {
  switch (kind) {
    case "email":
      return "onboarding email";
    case "docs":
      return "docs page";
    case "nudge":
      return "in-product nudge";
    default:
      return kind;
  }
}

export function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

// Deterministic fraction in [0, 1) for reproducible result simulation.
export function seededFraction(str: string): number {
  return (djb2(str) % 100000) / 100000;
}

export function roundTo(x: number, step: number): number {
  return Math.round(x / step) * step;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}
