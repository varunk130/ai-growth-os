import { detectLeaks, funnelStages, channelEfficiency } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import type { Leak } from "@/lib/types";

export const descriptor = {
  name: "funnel-query",
  description:
    "Queries the synthetic funnel dataset to compute stage conversions, rank leaks against benchmarks, and surface channel efficiency.",
};

export function queryLeaks(addressed: string[] = []): Leak[] {
  return detectLeaks(funnelData, addressed);
}

export function queryFunnelStages() {
  return funnelStages(funnelData);
}

export function queryChannels() {
  return channelEfficiency(funnelData);
}
