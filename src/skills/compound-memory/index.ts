import type { Learning, MemoryState } from "@/lib/types";

export const descriptor = {
  name: "compound-memory",
  description:
    "Persists every experiment and learning to local state and feeds prior learnings into the next cycle — this is the compounding loop.",
};

const KEY = "compound:memory:v1";

export function emptyMemory(): MemoryState {
  return { cycles: 0, learnings: [], addressedLeaks: [], activationLift: 0, retentionLift: 0 };
}

export function loadMemory(): MemoryState {
  if (typeof window === "undefined") return emptyMemory();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyMemory();
    const parsed = JSON.parse(raw) as MemoryState;
    return { ...emptyMemory(), ...parsed };
  } catch {
    return emptyMemory();
  }
}

export function saveMemory(memory: MemoryState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* storage unavailable — memory simply won't persist across reloads */
  }
}

export function clearMemory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}

export interface ShippedEffect {
  leakId: string;
  activationLift?: number;
  retentionLift?: number;
}

// Fold a completed cycle's learning into memory. Shipped wins mark the leak as
// addressed (so the next cycle moves on) and compound the activation/retention lifts.
export function recordLearning(prev: MemoryState, learning: Learning, effect: ShippedEffect): MemoryState {
  const shipped = learning.shipped;
  return {
    cycles: prev.cycles + 1,
    learnings: [...prev.learnings, learning],
    addressedLeaks:
      shipped && !prev.addressedLeaks.includes(effect.leakId)
        ? [...prev.addressedLeaks, effect.leakId]
        : prev.addressedLeaks,
    activationLift: prev.activationLift + (shipped ? effect.activationLift ?? 0 : 0),
    retentionLift: prev.retentionLift + (shipped ? effect.retentionLift ?? 0 : 0),
  };
}
