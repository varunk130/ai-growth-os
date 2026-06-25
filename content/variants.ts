import type { AssetKind, Lever, VariantAsset } from "@/lib/types";

// Curated, scenario-specific assets. The Variant Studio selects a template by the
// winning hypothesis's leak + lever, then routes its body through the agentLLM seam
// (offline default = deterministic pick from `bodyVariants`). All copy is real and usable.

export interface AssetTemplate {
  leak: string;
  levers: Lever[];
  kind: AssetKind;
  base: Omit<VariantAsset, "body">;
  bodyVariants: string[];
}

export const ASSETS: AssetTemplate[] = [
  // ---- Activation cliff: onboarding email (the demo's headline asset) ----------
  {
    leak: "activation_cliff",
    levers: ["lifecycle", "activation", "onboarding"],
    kind: "email",
    base: {
      kind: "email",
      title: "First-call onboarding email",
      subject: "Your first Adaptive call is 3 lines away",
      preheader: "A live key + a copy-paste snippet — you'll see a response in under a minute.",
      meta: [
        "Trigger: 15 minutes after signup with no first API call",
        "Audience: all new signups (channel-agnostic)",
        "Primary metric: signup → first API call",
        "Owner: Lifecycle · Reply-to is a real human inbox",
      ],
    },
    bodyVariants: [
      `Hi {{first_name}},

You created an Adaptive SDK account — nice. Teams that make their **first API call in the first session** ship to production ~3x more often. Let's get you there in under a minute.

**1 · Your sandbox key is already live.** No dashboard hunting:
    ADAPTIVE_KEY=sk_sandbox_7Q4…   (copy it from your dashboard)

**2 · Make your first call.** Paste this:
    import { Adaptive } from "@adaptive/sdk";
    const a = new Adaptive(process.env.ADAPTIVE_KEY);
    const res = await a.infer({ model: "edge-small", input: "ping" });
    console.log(res.output);   // → "pong"

**3 · See it return** in ~200ms, on-device.

That single call is the line between "signed up" and "activated." When you're ready, swap \`edge-small\` for your model and you're in production.

→ Run it now: https://adaptive.dev/quickstart?src=activation_email

Stuck? Just reply — a human (not a bot) answers.

— The Adaptive team`,
      `Hi {{first_name}},

Your Adaptive account is ready — and so is your API key. No setup, no config screen.

Paste this and watch it come back in ~200ms:
    const a = new Adaptive(process.env.ADAPTIVE_KEY);
    console.log((await a.infer({ model: "edge-small", input: "ping" })).output);

One call is all it takes to go from "signed up" to "activated" — and activated teams retain about 2x better in week one.

→ Your 60-second quickstart: https://adaptive.dev/quickstart?src=activation_email

Questions? Reply to this email; we read every one.

— The Adaptive team`,
    ],
  },
  // ---- Activation cliff: docs quickstart rewrite -------------------------------
  {
    leak: "activation_cliff",
    levers: ["docs"],
    kind: "docs",
    base: {
      kind: "docs",
      title: "Quickstart rewrite — “Your first call in 3 lines”",
      meta: [
        "Placement: top of docs.adaptive.dev/quickstart, above the fold",
        "Goal: convert Docs/SEO traffic (largest, lowest-activating channel)",
        "Primary metric: signup → first API call",
      ],
    },
    bodyVariants: [
      `# Your first call in 3 lines

You don't need to configure anything. Your sandbox key is on your dashboard.

\`\`\`ts
import { Adaptive } from "@adaptive/sdk";
const a = new Adaptive(process.env.ADAPTIVE_KEY);
console.log((await a.infer({ model: "edge-small", input: "ping" })).output); // → "pong"
\`\`\`

**That's it.** You just ran on-device inference in ~200ms.

Next: [Swap in your own model →](/models) · [Stream responses →](/streaming) · [Go to production →](/production)`,
    ],
  },
  // ---- Activation cliff: in-product nudge --------------------------------------
  {
    leak: "activation_cliff",
    levers: ["in-product"],
    kind: "nudge",
    base: {
      kind: "nudge",
      title: "In-product “make your first call” nudge",
      meta: [
        "Placement: dashboard home, dismissible card",
        "Trigger: account with zero API calls",
        "CTA runs a real sample request against the sandbox key",
      ],
    },
    bodyVariants: [
      `**▶ Make your first API call**
You're one click from activated. We'll run a real request with your sandbox key — no code to write yet.

[ Run sample request ]   ·   ~200ms response, on-device

_See the result, then copy the snippet into your app._`,
    ],
  },
  // ---- Week-2 retention: lifecycle email ---------------------------------------
  {
    leak: "week2_retention",
    levers: ["lifecycle", "retention"],
    kind: "email",
    base: {
      kind: "email",
      title: "Week-1 “what to build next” email",
      subject: "3 things to build with Adaptive this week",
      preheader: "You're past your first call — here's what high-retaining teams do next.",
      meta: [
        "Trigger: day 5 after first API call",
        "Audience: activated users who haven't returned in 48h",
        "Primary metric: week-1 → week-2 retention",
        "Owner: Lifecycle",
      ],
    },
    bodyVariants: [
      `Hi {{first_name}},

You've made your first calls with Adaptive — the hard part's done. Teams that build a **second** use case in week one retain about 2x better. Here are three you can ship today, each ~10 minutes:

**1 · Cache hot responses** — cut latency and spend:
    const a = new Adaptive(key, { cache: "edge" });

**2 · Stream long outputs** — better UX, same 3 lines:
    for await (const chunk of a.stream({ model: "edge-small", input })) process(chunk);

**3 · Add a fallback model** — resilience in one option:
    new Adaptive(key, { fallback: "cloud-large" });

Pick one. Reply and tell us what you're building — we'll send the exact recipe.

→ Browse all recipes: https://adaptive.dev/recipes?src=week1_email

— The Adaptive team`,
      `Hi {{first_name}},

Quick nudge while it's fresh: you've activated, but the teams that stick build a second thing within their first week. Three fast wins:

• **Caching** — \`new Adaptive(key, { cache: "edge" })\` — lower latency + cost
• **Streaming** — \`a.stream(...)\` — drop-in, better UX
• **Fallbacks** — \`{ fallback: "cloud-large" }\` — resilience in one line

Each is ~10 minutes. Want the full recipe for your stack? Just reply.

→ Recipes: https://adaptive.dev/recipes?src=week1_email

— The Adaptive team`,
    ],
  },
  // ---- Week-2 retention: in-product nudge --------------------------------------
  {
    leak: "week2_retention",
    levers: ["in-product"],
    kind: "nudge",
    base: {
      kind: "nudge",
      title: "Usage-milestone nudge",
      meta: [
        "Placement: in-product toast at 100 cumulative calls",
        "Trigger: usage milestone reached",
        "Primary metric: week-1 → week-2 retention",
      ],
    },
    bodyVariants: [
      `**🎉 100 calls — nice.**
At this volume, response caching usually cuts your latency by ~40% and trims spend.

[ Enable edge caching ]   ·   one option, no redeploy

\`new Adaptive(key, { cache: "edge" })\``,
    ],
  },
  // ---- Integration gap: docs recipes -------------------------------------------
  {
    leak: "integration_gap",
    levers: ["docs", "onboarding", "in-product"],
    kind: "docs",
    base: {
      kind: "docs",
      title: "Copy-paste integration recipes",
      meta: [
        "Placement: docs.adaptive.dev/recipes",
        "Goal: move first API call → first successful integration",
        "Primary metric: API call → integration",
      ],
    },
    bodyVariants: [
      `# Integration recipes

End-to-end, copy-paste examples that take you from a first call to a wired-in integration.

**Next.js route handler**
\`\`\`ts
// app/api/infer/route.ts
import { Adaptive } from "@adaptive/sdk";
const a = new Adaptive(process.env.ADAPTIVE_KEY);
export async function POST(req: Request) {
  const { input } = await req.json();
  const res = await a.infer({ model: "edge-small", input });
  return Response.json({ output: res.output });
}
\`\`\`

Then verify it end-to-end:
\`\`\`bash
npx adaptive verify   # checks key, model access, and a live round-trip
\`\`\`

More: [Python (FastAPI) →](/recipes/fastapi) · [Go →](/recipes/go) · [Edge runtimes →](/recipes/edge)`,
    ],
  },
  // ---- Channel-mix: reallocation brief -----------------------------------------
  {
    leak: "channel_mix",
    levers: ["channel", "onboarding", "docs"],
    kind: "docs",
    base: {
      kind: "docs",
      title: "Budget reallocation brief — Partnerships → GitHub",
      meta: [
        "Audience: growth + finance",
        "Goal: lift blended activation, lower cost per activated user",
        "Primary metric: blended signup → first API call",
      ],
    },
    bodyVariants: [
      `# Reallocate 30% of Partnerships spend into GitHub

**Why now.** GitHub is our cheapest channel and activates best; Partnerships is our most expensive and activates in the middle. We're over-investing in the worse unit economics.

**The move.** Shift 30% of monthly Partnerships budget into GitHub sponsorships, README placement, and example repos.

**Expected effect.** Higher-activating signups replace lower-activating ones, lifting blended activation and lowering cost per activated user — without changing total spend.

**Guardrail.** Hold a 4-week read on blended activation and cost-per-activated; revert if blended activation doesn't move.`,
    ],
  },
];

export function selectAsset(leakId: string, lever: Lever): AssetTemplate {
  const byLeak = ASSETS.filter((a) => a.leak === leakId);
  const pool = byLeak.length > 0 ? byLeak : ASSETS;
  return pool.find((a) => a.levers.includes(lever)) ?? pool[0];
}
