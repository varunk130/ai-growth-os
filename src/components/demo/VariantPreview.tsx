import { Mail, FileText, Bell, CheckCircle2 } from "lucide-react";
import type { VariantAsset } from "@/lib/types";
import { MarkdownLite } from "./MarkdownLite";

function MetaList({ meta }: { meta: string[] }) {
  return (
    <ul className="mt-3 space-y-1 border-t border-white/[0.06] pt-3">
      {meta.map((m, i) => (
        <li key={i} className="flex items-start gap-2 text-[12px] text-slate-400">
          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

export function VariantPreview({ asset, source }: { asset: VariantAsset; source?: string }) {
  const kindMeta =
    asset.kind === "email"
      ? { icon: Mail, label: "Onboarding email" }
      : asset.kind === "docs"
        ? { icon: FileText, label: "Docs page" }
        : { icon: Bell, label: "In-product nudge" };
  const Icon = kindMeta.icon;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-signal" />
          <h3 className="font-display text-sm font-semibold text-white">Variant Studio · the actual asset</h3>
        </div>
        {source && <span className="font-mono text-[10px] text-slate-500">source: {source}</span>}
      </div>

      <div className="p-5">
        {/* asset frame */}
        <div className="rounded-xl border border-white/[0.08] bg-ink-950/40">
          {asset.kind === "email" && (
            <div className="border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>From: Adaptive &lt;hello@adaptive.dev&gt;</span>
                <span>{kindMeta.label}</span>
              </div>
              <div className="mt-1.5 text-[15px] font-semibold text-white">{asset.subject}</div>
              {asset.preheader && <div className="text-[12px] text-slate-400">{asset.preheader}</div>}
            </div>
          )}
          {asset.kind === "docs" && (
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              <span className="ml-2 truncate rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-400">
                docs.adaptive.dev
              </span>
            </div>
          )}
          {asset.kind === "nudge" && (
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 text-[11px] text-slate-500">
              <Bell className="h-3 w-3 text-signal" /> in-product · {asset.title}
            </div>
          )}

          <div className="px-4 py-4">
            <MarkdownLite text={asset.body} />
          </div>
        </div>

        <MetaList meta={asset.meta} />
      </div>
    </div>
  );
}
