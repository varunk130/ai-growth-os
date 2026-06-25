import Link from "next/link";
import { ArrowRight, KeyRound, Activity, Sparkles, GitBranch, Play } from "lucide-react";
import { Section, Eyebrow, Stat, TagPill } from "@/components/ui";
import { AgentPipeline } from "@/components/AgentPipeline";
import { SITE } from "@/lib/site";
import { detectLeaks, growthModel } from "@/lib/analytics";
import { funnelData, dailySum } from "@/lib/dataset";
import { num, pct } from "@/lib/format";

export default function HomePage() {
  const leak = detectLeaks()[0];
  const wau = growthModel(funnelData).wau;
  const signups = dailySum("signups");

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <Section className="!py-20 sm:!py-28">
          <div className="flex flex-wrap items-center gap-2">
            <TagPill accent="lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Agentic Growth Experiment Engine
            </TagPill>
            <TagPill accent="teal">
              <KeyRound className="h-3 w-3" /> Local-first · no API keys
            </TagPill>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.07] tracking-tight text-white sm:text-6xl">
            Founding growth isn&apos;t campaigns. It&apos;s a{" "}
            <span className="text-lime">compounding experiment loop.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            {SITE.name} runs that loop end-to-end — six named agents find the leak, design the test, write the asset, and call
            the result — then compound every learning into the next cycle. And it shows its work.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/demo" className="btn-primary text-[15px] !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the live demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-[15px] !px-6 !py-3.5">
              See how it works
            </Link>
            <span className="text-sm text-slate-500 sm:ml-2">No sign-up. Nothing to configure.</span>
          </div>

          {/* Live snapshot from the synthetic dataset */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={`${num(signups)}`} label="Signups · 60 days" />
            <Stat value={pct(leak.metric)} label="Activation today" tone="teal" />
            <Stat value={`+${num(leak.wauUpside)}`} label="Top WAU opportunity" tone="lime" />
            <Stat value={num(wau)} label="Modeled WAU" />
          </div>
        </Section>
      </div>

      {/* The loop */}
      <Section className="!pt-4">
        <Eyebrow className="mb-4">The loop, made watchable</Eyebrow>
        <AgentPipeline />
      </Section>

      {/* Three moves */}
      <Section className="!pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Activity,
              title: "Find the leak",
              body: "The Funnel Analyst queries 60 days of real data, benchmarks every stage, and ranks leaks by modeled WAU impact — not vibes.",
              accent: "teal" as const,
            },
            {
              icon: Sparkles,
              title: "Run the experiment",
              body: "Hypotheses, ICE scoring, sample-size math, a real shippable asset, and a significance-tested ship/kill call — all computed, all visible.",
              accent: "signal" as const,
            },
            {
              icon: GitBranch,
              title: "Compound the learning",
              body: "Every win is written to memory and folded into the growth model, so the next cycle skips solved leaks and starts smarter.",
              accent: "lime" as const,
            },
          ].map((c) => (
            <div key={c.title} className="panel p-6">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${
                  c.accent === "teal" ? "border-teal/30 bg-teal/10 text-teal" : c.accent === "signal" ? "border-signal/30 bg-signal/10 text-signal" : "border-lime/30 bg-lime/10 text-lime"
                }`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="!pt-4">
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
          <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Watch six agents take a flat WAU number and turn it into a ranked, shippable experiment — in under a minute.
          </h2>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="btn-primary !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the guided demo
            </Link>
            <Link href="/problem" className="btn-ghost !px-6 !py-3.5">
              Why it matters
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
