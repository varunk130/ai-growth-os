import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { precomputeCycles } from "@/lib/precompute";
import { IceTable } from "@/components/demo/IceTable";
import { VariantPreview } from "@/components/demo/VariantPreview";
import { ReadoutCard } from "@/components/demo/ReadoutCard";
import { WauProjectionChart } from "@/components/demo/WauProjectionChart";
import { LearningsLibrary } from "@/components/demo/LearningsLibrary";
import { ExperimentBacklog } from "@/components/demo/ExperimentBacklog";
import { num, pct, signedPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Results",
  description: "The real artifacts Compound produced across three cycles: ranked experiments, shippable assets, significance-tested readouts, and a compounding WAU projection.",
};

export default async function ResultsPage() {
  const { results, memory } = await precomputeCycles(3);
  const wauStart = results[0].wauBefore;
  const wauFinal = results[results.length - 1].wauAfter;
  const shipped = results.filter((r) => r.readout.decision === "ship").length;
  const headline = results[0];

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Output / Results</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Three cycles. Real artifacts. <span className="text-lime">Compounding WAU.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          Everything below was produced by the exact same runtime the live demo uses — computed deterministically, with no API
          keys. Scores are real math; assets are real copy.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={num(wauStart)} label="Modeled WAU · start" />
          <Stat value={num(wauFinal)} label="Modeled WAU · after 3 cycles" tone="lime" />
          <Stat value={`+${pct((wauFinal - wauStart) / wauStart)}`} label="Compounded lift" tone="teal" />
          <Stat value={`${shipped}/${results.length}`} label="Experiments shipped" />
        </div>
      </Section>

      {/* Cycle-by-cycle */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">The experiments it produced</Eyebrow>
        <div className="grid gap-3 lg:grid-cols-3">
          {results.map((r) => {
            const ship = r.readout.decision === "ship";
            return (
              <div key={r.cycle} className="panel p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Cycle {r.cycle}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] ${ship ? "text-ship" : "text-slate-500"}`}>
                    {ship && <CheckCircle2 className="h-3 w-3" />} {r.readout.decision.toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">{r.leak.label}</h3>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-400">
                  {r.topExperiment.hypothesis.statement}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                  <span className="font-mono text-lg font-semibold text-lime">{signedPct(r.readout.relLift)}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {r.readout.pValue < 0.001 ? "p<0.001" : `p=${r.readout.pValue.toFixed(3)}`}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <TrendingUp className="h-3 w-3 text-ship" /> {num(r.wauBefore)}→{num(r.wauAfter)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Headline analytical artifacts */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">Cycle 1 · scored and tested</Eyebrow>
        <div className="space-y-4">
          <IceTable rows={headline.iceTable} />
          <div className="grid gap-4 lg:grid-cols-2">
            <VariantPreview asset={headline.asset} source={headline.assetSource} />
            <ReadoutCard readout={headline.readout} />
          </div>
        </div>
      </Section>

      {/* All assets */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">Real creative · every cycle&apos;s shippable asset</Eyebrow>
        <div className="grid gap-4 lg:grid-cols-3">
          {results.map((r) => (
            <VariantPreview key={r.cycle} asset={r.asset} source={r.assetSource} />
          ))}
        </div>
      </Section>

      {/* Dashboards */}
      <Section className="!pt-0">
        <Eyebrow className="mb-5">The dashboards it updates</Eyebrow>
        <div className="space-y-4">
          <WauProjectionChart memory={memory} />
          <div className="grid gap-4 lg:grid-cols-2">
            <LearningsLibrary memory={memory} />
            <ExperimentBacklog memory={memory} />
          </div>
        </div>

        <div className="mt-8">
          <Link href="/demo" className="btn-primary !px-6 !py-3.5">
            <Play className="h-4 w-4" /> Watch it happen live
          </Link>
        </div>
      </Section>
    </>
  );
}
