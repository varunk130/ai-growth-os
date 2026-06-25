"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Play } from "lucide-react";
import { Logo } from "@/components/ui";
import { NAV_LINKS } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/80 backdrop-blur-md">
      <nav className="container-px flex h-16 items-center justify-between" aria-label="Primary">
        <Link href="/" className="focusable rounded-md" aria-label="Compound home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`focusable rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(l.href) ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/demo" className="btn-primary !px-3.5 !py-2 text-[13px]">
            <Play className="h-3.5 w-3.5" /> Run the demo
          </Link>
        </div>

        <button
          className="focusable rounded-md p-2 text-slate-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink md:hidden">
          <div className="container-px flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`focusable rounded-md px-3 py-2.5 text-sm ${isActive(l.href) ? "text-lime" : "text-slate-300"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/demo" onClick={() => setOpen(false)} className="btn-primary mt-2">
              <Play className="h-4 w-4" /> Run the demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
