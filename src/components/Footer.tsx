import { Github, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/[0.06] bg-ink-900/60">
      <div className="container-px flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden text-sm text-slate-500 sm:inline">· {SITE.tagline}</span>
        </div>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
          <span>
            Built by <span className="text-slate-300">{SITE.author}</span>
          </span>
          <span aria-hidden>·</span>
          <span>synthetic/public data</span>
          <span aria-hidden>·</span>
          <a href={SITE.github} target="_blank" rel="noreferrer" className="link-quiet inline-flex items-center gap-1">
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <span aria-hidden>·</span>
          <a href={SITE.liveUrl} target="_blank" rel="noreferrer" className="link-quiet inline-flex items-center gap-1">
            <ExternalLink className="h-3.5 w-3.5" /> Live demo
          </a>
        </p>
      </div>
    </footer>
  );
}
