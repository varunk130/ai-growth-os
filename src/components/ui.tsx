import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
        <path
          d="M9 16c0-3.6 2.4-6 5.2-6 2.2 0 3.6 1.4 5.4 3.6l.4.4M23 16c0 3.6-2.4 6-5.2 6-2.2 0-3.6-1.4-5.4-3.6l-.4-.4"
          stroke="#B8FF3D"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M23 16c0-3.6-2.4-6-5.2-6-1.4 0-2.5.6-3.6 1.6M9 16c0 3.6 2.4 6 5.2 6 1.4 0 2.5-.6 3.6-1.6"
          stroke="#5EEAD4"
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      {showText && <span className="font-display text-[17px] font-semibold tracking-tight text-white">Compound</span>}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`container-px py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function Stat({ value, label, tone = "default" }: { value: ReactNode; label: ReactNode; tone?: "default" | "lime" | "teal" }) {
  const toneClass = tone === "lime" ? "text-lime" : tone === "teal" ? "text-teal" : "text-white";
  return (
    <div className="panel-quiet px-4 py-3.5">
      <div className={`font-display text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{intro}</p>}
    </div>
  );
}

export function CTA({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={variant === "primary" ? "btn-primary" : "btn-ghost"}>
      {children}
    </Link>
  );
}

export function TagPill({ children, accent = "lime" }: { children: ReactNode; accent?: "lime" | "teal" | "signal" }) {
  const map = {
    lime: "border-lime/30 bg-lime/10 text-lime",
    teal: "border-teal/30 bg-teal/10 text-teal",
    signal: "border-signal/30 bg-signal/10 text-signal",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${map[accent]}`}>
      {children}
    </span>
  );
}
