import { test } from "node:test";
import assert from "node:assert/strict";
import { normalCdf, normalQuantile, sampleSizePerArm, twoProportionZTest } from "@/lib/stats";

const close = (a: number, b: number, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test("normal CDF and quantile are inverses at common critical values", () => {
  close(normalCdf(0), 0.5);
  close(normalQuantile(0.975), 1.96);
  close(normalCdf(normalQuantile(0.8)), 0.8);
  assert.equal(normalQuantile(0), -Infinity);
  assert.equal(normalQuantile(1), Infinity);
});

test("two-proportion sample size matches the textbook value", () => {
  // 10% baseline, +20% relative MDE, alpha 0.05, power 0.8
  assert.equal(sampleSizePerArm({ baseline: 0.1, mde: 0.2 }), 3841);
});

test("smaller effects need larger samples", () => {
  const big = sampleSizePerArm({ baseline: 0.1, mde: 0.3 });
  const small = sampleSizePerArm({ baseline: 0.1, mde: 0.1 });
  assert.ok(small > big);
});

test("z-test reports lift, p-value, and a CI that brackets the difference", () => {
  const r = twoProportionZTest({ controlConv: 100, controlN: 1000, treatmentConv: 130, treatmentN: 1000 });
  close(r.absLift, 0.03);
  close(r.relLift, 0.3);
  close(r.pValue, 0.0355);
  assert.ok(r.ciLow < r.absLift && r.absLift < r.ciHigh);
});

test("identical arms produce no lift and p = 1", () => {
  const r = twoProportionZTest({ controlConv: 50, controlN: 500, treatmentConv: 50, treatmentN: 500 });
  assert.equal(r.absLift, 0);
  close(r.pValue, 1);
});
