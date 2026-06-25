"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GuidedCaption({ caption }: { caption: string | null }) {
  return (
    <AnimatePresence mode="wait">
      {caption && (
        <motion.div
          key={caption}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3 rounded-xl border border-lime/20 bg-gradient-to-r from-lime/[0.08] to-transparent px-4 py-3"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-lime/30 bg-lime/10">
            <Sparkles className="h-3.5 w-3.5 text-lime" />
          </span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-lime/80">Guided demo</div>
            <p className="mt-0.5 text-[14px] leading-snug text-slate-100">{caption}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
