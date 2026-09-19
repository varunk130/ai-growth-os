import { test } from "node:test";
import assert from "node:assert/strict";
import { runCycle } from "@/agents/orchestrator";
import { emptyMemory } from "@/skills/compound-memory";
import type { MemoryState } from "@/lib/types";

const quiet = { goal: "Grow WAU", emit: () => {}, wait: async () => {} };

async function cycles(n: number) {
  let memory: MemoryState = emptyMemory();
  const results = [];
  for (let i = 0; i < n; i++) {
    const out = await runCycle({ ...quiet, memory });
    results.push(out.result);
    memory = out.memory;
  }
  return { results, memory };
}

test("each cycle targets a leak not already solved", async () => {
  const { results } = await cycles(3);
  const leaks = results.map((r) => r.leak.id);
  assert.equal(new Set(leaks).size, leaks.length);
});

test("shipped wins compound modeled WAU", async () => {
  const { results } = await cycles(3);
  for (const r of results) {
    if (r.readout.decision === "ship") assert.ok(r.wauAfter > r.wauBefore);
  }
  assert.ok(results[2].wauAfter > results[0].wauBefore);
});

test("memory records one learning per cycle", async () => {
  const { memory } = await cycles(2);
  assert.equal(memory.cycles, 2);
  assert.equal(memory.learnings.length, 2);
});

test("the loop is deterministic run to run", async () => {
  const a = await cycles(2);
  const b = await cycles(2);
  const strip = (x: unknown) => JSON.stringify(x, (k, v) => (k === "ts" ? undefined : v));
  assert.equal(strip(a.results), strip(b.results));
});
