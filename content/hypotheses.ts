import type { Hypothesis } from "@/lib/types";

// Curated, scenario-specific hypotheses. The Hypothesis Writer selects from these
// for the leak the Funnel Analyst surfaced; the Prioritizer then scores them with
// real ICE math. impact/confidence/ease are authored on a 1-10 scale; expectedLift
// is the relative lift on the target metric used by the (real) experiment simulation.

export const HYPOTHESES: Record<string, Hypothesis[]> = {
  activation_cliff: [
    {
      id: "act-email-firstcall",
      statement: "Trigger a first-call onboarding email 15 min after signup with a pre-provisioned key and a copy-paste snippet.",
      lever: "lifecycle",
      targetLeak: "activation_cliff",
      rationale:
        "The drop is between signup and first API call, and most signups never return to the dashboard. A timely email that removes key-creation friction and hands over a working snippet meets users where they are.",
      impact: 7,
      confidence: 8,
      ease: 8,
      expectedLift: 0.18,
    },
    {
      id: "act-sandbox-key",
      statement: "Pre-provision a live sandbox API key on signup so users never have to create one before their first call.",
      lever: "activation",
      targetLeak: "activation_cliff",
      rationale:
        "Key creation is a classic activation tax. Issuing a scoped sandbox key at signup collapses the steps between 'account' and 'first call'.",
      impact: 8,
      confidence: 7,
      ease: 7,
      expectedLift: 0.2,
    },
    {
      id: "act-browser-quickstart",
      statement: "Add an in-browser interactive quickstart that issues a key and runs a real first call in under 60 seconds.",
      lever: "onboarding",
      targetLeak: "activation_cliff",
      rationale:
        "A runnable surface inside the product removes the local-setup barrier entirely and lets users feel the 200ms response before they commit to installing anything.",
      impact: 9,
      confidence: 7,
      ease: 5,
      expectedLift: 0.24,
    },
    {
      id: "act-docs-rewrite",
      statement: "Rewrite the docs quickstart to put a 3-line 'your first call' snippet above the fold.",
      lever: "docs",
      targetLeak: "activation_cliff",
      rationale:
        "Docs/SEO drives the most signups but activates worst. A shorter, copy-paste-first quickstart converts that traffic instead of burying the call in setup prose.",
      impact: 6,
      confidence: 7,
      ease: 9,
      expectedLift: 0.14,
    },
    {
      id: "act-cli-init",
      statement: "Ship `npx adaptive init` that scaffolds a working first call in the user's own repo.",
      lever: "onboarding",
      targetLeak: "activation_cliff",
      rationale:
        "Developers live in the terminal. A one-command scaffold produces a guaranteed-working call without copy-paste errors.",
      impact: 8,
      confidence: 6,
      ease: 6,
      expectedLift: 0.2,
    },
    {
      id: "act-checklist-nudge",
      statement: "Add an in-product checklist with a one-click 'make your first API call' sample request.",
      lever: "in-product",
      targetLeak: "activation_cliff",
      rationale:
        "For users who do reach the dashboard, a single obvious next action with a runnable sample reduces decision friction.",
      impact: 5,
      confidence: 7,
      ease: 9,
      expectedLift: 0.12,
    },
    {
      id: "act-framework-quickstarts",
      statement: "Auto-detect the user's stack and show framework-specific quickstarts (Next.js, Python, Go).",
      lever: "docs",
      targetLeak: "activation_cliff",
      rationale:
        "A generic snippet adds translation work. Framework-native examples cut the distance between docs and a running call.",
      impact: 7,
      confidence: 6,
      ease: 6,
      expectedLift: 0.15,
    },
    {
      id: "act-concierge-nudge",
      statement: "DM a 'stuck on setup?' concierge nudge in Discord after 10 minutes of signup with no first call.",
      lever: "in-product",
      targetLeak: "activation_cliff",
      rationale:
        "Community-sourced signups already live in Discord. A light human touch at the moment of friction rescues otherwise-lost activations.",
      impact: 5,
      confidence: 6,
      ease: 7,
      expectedLift: 0.1,
    },
  ],
  week2_retention: [
    {
      id: "ret-week1-recipes",
      statement: "Send a week-1 'what to build next' email with 3 copy-paste recipes matched to the user's first call.",
      lever: "lifecycle",
      targetLeak: "week2_retention",
      rationale:
        "Users activate but stall before week 2 because they don't see a second use case. Concrete recipes give a reason to come back inside the retention-critical window.",
      impact: 7,
      confidence: 8,
      ease: 8,
      expectedLift: 0.2,
    },
    {
      id: "ret-milestone-nudge",
      statement: "Fire usage-milestone nudges in-product (e.g., at 100 calls, suggest response caching).",
      lever: "in-product",
      targetLeak: "week2_retention",
      rationale:
        "Milestones turn raw usage into a sense of progress and surface the next capability exactly when it's relevant.",
      impact: 6,
      confidence: 7,
      ease: 7,
      expectedLift: 0.16,
    },
    {
      id: "ret-cohort-tips",
      statement: "On day 5, email cohort-based tips drawn from what similar teams shipped next.",
      lever: "lifecycle",
      targetLeak: "week2_retention",
      rationale:
        "Social proof from comparable teams is a strong second-week pull and reduces the blank-page problem.",
      impact: 6,
      confidence: 6,
      ease: 7,
      expectedLift: 0.14,
    },
    {
      id: "ret-value-recap",
      statement: "Show an in-product value recap: latency saved and cost avoided since signup.",
      lever: "in-product",
      targetLeak: "week2_retention",
      rationale:
        "Making accumulated value visible reinforces the habit and gives champions an internal story to retell.",
      impact: 6,
      confidence: 7,
      ease: 6,
      expectedLift: 0.12,
    },
    {
      id: "ret-error-budget",
      statement: "Proactively alert teams when an integration starts erroring, before they churn silently.",
      lever: "retention",
      targetLeak: "week2_retention",
      rationale:
        "Silent breakage is a leading churn cause for SDKs. Catching it first turns a churn moment into a save.",
      impact: 7,
      confidence: 6,
      ease: 5,
      expectedLift: 0.15,
    },
    {
      id: "ret-office-hours",
      statement: "Invite active second-week teams to weekly office hours.",
      lever: "retention",
      targetLeak: "week2_retention",
      rationale:
        "High-intent teams convert faster with a low-friction human channel; it also surfaces roadmap signal.",
      impact: 4,
      confidence: 6,
      ease: 8,
      expectedLift: 0.1,
    },
  ],
  integration_gap: [
    {
      id: "int-recipes",
      statement: "Publish copy-paste integration recipes for the top 5 frameworks with a working end-to-end example.",
      lever: "docs",
      targetLeak: "integration_gap",
      rationale:
        "Users make a first call but stall before a real integration. End-to-end recipes bridge 'it responded' to 'it's wired into my app'.",
      impact: 6,
      confidence: 7,
      ease: 7,
      expectedLift: 0.16,
    },
    {
      id: "int-health-check",
      statement: "Ship an `adaptive verify` command that health-checks a user's integration and flags misconfig.",
      lever: "onboarding",
      targetLeak: "integration_gap",
      rationale: "A deterministic verification step catches the silent misconfigurations that block successful integration.",
      impact: 5,
      confidence: 7,
      ease: 7,
      expectedLift: 0.13,
    },
    {
      id: "int-inline-errors",
      statement: "Return inline, human-readable error explanations in SDK responses with a fix link.",
      lever: "in-product",
      targetLeak: "integration_gap",
      rationale: "Better error ergonomics reduce the debugging tax that stalls first integrations.",
      impact: 6,
      confidence: 6,
      ease: 6,
      expectedLift: 0.12,
    },
  ],
  channel_mix: [
    {
      id: "ch-reallocate",
      statement: "Reallocate 30% of Partnerships spend into GitHub, which activates ~1.7x better at a fraction of the CAC.",
      lever: "channel",
      targetLeak: "channel_mix",
      rationale:
        "Partnerships carries the highest CAC and middling activation; GitHub is the cheapest, best-activating channel. Shifting spend lifts blended activation and lowers cost per activated user.",
      impact: 7,
      confidence: 6,
      ease: 8,
      expectedLift: 0.18,
    },
    {
      id: "ch-docs-widget",
      statement: "Embed a live first-call widget on the top Docs/SEO landing pages to activate organic traffic in place.",
      lever: "docs",
      targetLeak: "channel_mix",
      rationale: "Docs/SEO drives the most signups but the worst activation; activating in-page closes the gap on the largest channel.",
      impact: 6,
      confidence: 6,
      ease: 6,
      expectedLift: 0.14,
    },
    {
      id: "ch-referrer-onboarding",
      statement: "Tailor onboarding by referrer so each channel lands on its highest-intent first step.",
      lever: "onboarding",
      targetLeak: "channel_mix",
      rationale: "Channel intent differs; a GitHub visitor and a partnership lead want different first steps.",
      impact: 6,
      confidence: 6,
      ease: 5,
      expectedLift: 0.12,
    },
  ],
};

export function hypothesesForLeak(leakId: string): Hypothesis[] {
  return HYPOTHESES[leakId] ?? HYPOTHESES.activation_cliff;
}
