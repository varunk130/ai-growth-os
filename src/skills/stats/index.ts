import { sampleSizePerArm, twoProportionZTest } from "@/lib/stats";
import type { SampleSizeInput, ZTestInput, ZTestResult } from "@/lib/stats";

export const descriptor = {
  name: "experiment-stats",
  description: "Powers experiment design (two-proportion sample size) and readout (z-test, two-sided p-value, 95% confidence interval).",
};

export function designSampleSize(input: SampleSizeInput): number {
  return sampleSizePerArm(input);
}

export function readoutTest(input: ZTestInput): ZTestResult {
  return twoProportionZTest(input);
}
