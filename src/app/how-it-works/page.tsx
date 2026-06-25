import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, Calculator, PenLine, Plug, ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { AGENTS, AGENT_ORDER } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

export const metadata: Metadata = {
  title: "How it works",
  description: "The architecture: an Orchestrator, six typed sub-agents, named skills, and a compound-memory loop — all local, no API keys.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">How it works</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          A real multi-agent runtime — not a scripted animation.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          A message bus carries a goal through an Orchestrator to six typed sub-agents. They call named skills that read and
          compute over a local dataset. Every tool call and result is observable in the Agent Trace.
        </p>
      </Section>

      <Section className="!pt-0">
        <ArchitectureDiagram />
      </Section>

      {/* Agents */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">The agents</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_ORDER.map((id) => {
            const a = AGENTS[id];
            const Icon = AGENT_ICON[id];
            const accent = ACCENT[a.accent];
            return (
              <div key={id} className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accent.border} ${accent.bg}`}>
                    <Icon className={`h-4 w-4 ${accent.text}`} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">{a.name}</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">{a.role}</div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-400">{a.tagline}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Skills */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">The skills · reusable, invoked by name</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div key={s.name} className="panel flex items-start gap-3 p-5">
              <span className="mt-0.5 rounded-md border border-teal/25 bg-teal/[0.06] px-2 py-1 font-mono text-[11px] text-teal">
                {s.name}
              </span>
              <p className="text-[13px] leading-relaxed text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Output types + LLM seam */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">Two kinds of output — both key-free</Eyebrow>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">Analytical = real computation</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Funnel conversions, leak ranking, ICE scores, two-proportion sample sizes, and the z-test / p-value in the readout
              are all genuine math on the dataset. Nothing is mocked.
            </p>
          </div>
          <div className="panel p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-signal/30 bg-signal/10 text-signal">
              <PenLine className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">Generative = curated library</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Hypotheses and the shippable assets are assembled from a scenario-specific content library, selected to match the
              exact leak the agents just found — real, usable copy, not lorem ipsum.
            </p>
          </div>
        </div>

        <div className="panel mt-4 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-lime/30 bg-lime/10 text-lime">
            <Plug className="h-5 w-5" />
          </div>
          <p className="flex-1 text-sm leading-relaxed text-slate-400">
            <span className="font-semibold text-white">One optional LLM seam.</span> Generative agents call{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-teal">agentLLM.generate()</code>,
            which defaults to the curated library. Configuring a model adapter could later route it to a real model — but the app
            never requires one.
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-lime/30 bg-lime/10 px-2.5 py-1.5 text-xs text-lime sm:self-auto">
            <KeyRound className="h-3.5 w-3.5" /> Zero API keys
          </span>
        </div>

        <div className="mt-8">
          <Link href="/demo" className="btn-primary !px-6 !py-3.5">
            Run it yourself <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
