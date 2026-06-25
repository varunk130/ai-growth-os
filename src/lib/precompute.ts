import { runCycle } from "@/agents/orchestrator";
import { emptyMemory } from "@/skills/compound-memory";
import type { CycleResult } from "@/agents/types";
import type { MemoryState } from "@/lib/types";

// Runs the agent loop headlessly (no trace, instant) to produce real, deterministic
// artifacts for the static Results page. Same runtime the live demo uses.
export async function precomputeCycles(n: number): Promise<{ results: CycleResult[]; memory: MemoryState }> {
  let memory: MemoryState = emptyMemory();
  const results: CycleResult[] = [];
  for (let i = 0; i < n; i++) {
    const { result, memory: next } = await runCycle({
      goal: "Grow WAU",
      memory,
      emit: () => {},
      wait: async () => {},
    });
    results.push(result);
    memory = next;
  }
  return { results, memory };
}
