import type { Metadata } from "next";
import Link from "next/link";
import { Database, ListChecks, Eraser, ArrowRight, Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { blendedActivation, avgCohortRetention, detectLeaks } from "@/lib/analytics";
import { funnelData } from "@/lib/dataset";
import { pct, num } from "@/lib/format";

export const metadata: Metadata = {
  title: "Problem → Solution",
  description: "Early-stage growth dies in the gap between data and action. Compound closes it with a compounding experiment loop.",
};

const PAINS = [
  {
    icon: Database,
    title: "Data sits; nobody acts",
    body: "Funnel dashboards show the leak, but turning that into a sized, shippable test takes a week of analyst time most teams don't have.",
  },
  {
    icon: ListChecks,
    title: "Ideas beat evidence",
    body: "Experiment backlogs are unranked opinions. The highest-leverage bet rarely wins the week, because nobody does the ICE and the stats.",
  },
  {
    icon: Eraser,
    title: "Wins evaporate",
    body: "There's no memory. Last month's learning doesn't shape this month's plan, so every cycle restarts from zero instead of compounding.",
  },
];

export default function ProblemPage() {
  const activation = blendedActivation();
  const week2 = avgCohortRetention(2);
  const leak = detectLeaks()[0];

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Problem → Solution</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Early-stage growth dies in the gap between <span className="text-slate-500">data</span> and{" "}
          <span className="text-lime">action.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          A founder or first growth hire can see the numbers slipping. What they lack isn&apos;t insight — it&apos;s a system
          that turns a flat metric into the right experiment, run after run, and remembers what worked.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {PAINS.map((p) => (
            <div key={p.title} className="panel p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-kill/25 bg-kill/10 text-kill">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence from the dataset */}
      <Section className="!pt-0">
        <div className="panel p-6 sm:p-8">
          <Eyebrow className="mb-4">The proof is in the funnel · Adaptive SDK</Eyebrow>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={pct(activation)} label="Signup → first API call" tone="teal" />
            <Stat value={pct(week2)} label="Week-2 retention" tone="teal" />
            <Stat value={`+${num(leak.wauUpside)}`} label="WAU left on the table" tone="lime" />
            <Stat value="3" label="Problems hiding in the data" />
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-400">
            This is one real (synthetic) 60-day funnel. The activation cliff, the leaky second week, and the channel-mix drag
            are all sitting in plain sight — and all of them go unfixed without someone to find, test, and compound the fix.
          </p>
        </div>
      </Section>

      {/* Solution */}
      <Section className="!pt-0">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow className="mb-3">The solution</Eyebrow>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              A compounding experiment loop that shows its work.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Compound is a real multi-agent runtime. An Orchestrator owns the WAU goal and dispatches six sub-agents: they
              query the data, rank leaks by WAU impact, score hypotheses with ICE, size the test with real statistics, assemble
              the actual asset, and call the result with a significance test. Then every win is written to memory and folded into
              the next cycle — so the loop starts smarter each time. No dashboards to read, no API keys to set.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="btn-primary !px-6 !py-3.5">
                <Play className="h-4 w-4" /> Watch it run
              </Link>
              <Link href="/how-it-works" className="btn-ghost !px-6 !py-3.5">
                See the architecture <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="panel p-6">
            <div className="space-y-3">
              {[
                ["Find", "Funnel Analyst ranks every leak by modeled WAU impact."],
                ["Prioritize", "ICE math picks the one experiment worth running now."],
                ["Build", "Variant Studio assembles a real, shippable asset."],
                ["Decide", "Readout runs a significance test and ships or kills."],
                ["Compound", "The win feeds the next cycle — growth stacks."],
              ].map(([k, v], i) => (
                <div key={k} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-lime/30 bg-lime/10 font-mono text-[11px] text-lime">
                    {i + 1}
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">{k}.</span> {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
