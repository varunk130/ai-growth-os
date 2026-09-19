import { test } from "node:test";
import assert from "node:assert/strict";
import { biggestLeak, detectLeaks, funnelStages } from "@/lib/analytics";

test("leaks are ranked by severity, largest first", () => {
  const leaks = detectLeaks();
  assert.ok(leaks.length > 0);
  for (let i = 1; i < leaks.length; i++) assert.ok(leaks[i - 1].severity >= leaks[i].severity);
});

test("the activation cliff is the headline leak in the seeded dataset", () => {
  assert.equal(biggestLeak().id, "activation_cliff");
});

test("addressed leaks are skipped on the next cycle", () => {
  const next = biggestLeak(undefined, ["activation_cliff"]);
  assert.notEqual(next.id, "activation_cliff");
});

test("every leak sits below its benchmark", () => {
  for (const l of detectLeaks()) {
    assert.ok(l.metric < l.benchmark, `${l.id}: ${l.metric} >= ${l.benchmark}`);
    assert.ok(Math.abs(l.gap - (l.benchmark - l.metric)) < 1e-9);
  }
});

test("funnel stages narrow from signup to integration", () => {
  const stages = funnelStages();
  for (let i = 1; i < stages.length; i++) {
    const s = stages[i];
    assert.ok(s.count <= stages[i - 1].count, `${s.key} count exceeds previous stage`);
    assert.ok(s.rateFromPrev !== undefined && s.rateFromPrev > 0 && s.rateFromPrev <= 1);
  }
});
