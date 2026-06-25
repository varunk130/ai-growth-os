import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo",
  description: "Watch six named agents find a leak, design an experiment, write the asset, and call the result — live, with no API keys.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
