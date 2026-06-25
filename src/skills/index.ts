import { descriptor as funnelQuery } from "./funnel-query";
import { descriptor as iceScore } from "./ice-score";
import { descriptor as experimentStats } from "./stats";
import { descriptor as compoundMemory } from "./compound-memory";

export interface SkillDescriptor {
  name: string;
  description: string;
}

// The skill registry surfaced on the How-it-works page.
export const SKILLS: SkillDescriptor[] = [funnelQuery, iceScore, experimentStats, compoundMemory];
