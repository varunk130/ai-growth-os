"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui";
import type { ChatMessage } from "./useCompound";

export function Conversation({ messages, running }: { messages: ChatMessage[]; running: boolean }) {
  const showTyping = running && (messages.length === 0 || messages[messages.length - 1].role === "user");

  return (
    <div className="panel flex flex-col overflow-hidden">
      <div className="border-b border-white/[0.06] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-white">Conversation</h3>
      </div>
      <div className="max-h-[20rem] flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !running && (
          <p className="py-6 text-center text-sm text-slate-500">
            Ask Compound to grow WAU. Try the suggested prompt, or hit <span className="text-lime">Run guided demo</span>.
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm border border-lime/20 bg-lime/[0.07] px-3.5 py-2.5 text-[13.5px] text-slate-100"
              >
                {m.text}
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-[92%] gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-ink-700">
                  <Logo showText={false} className="scale-75" />
                </span>
                <div className="rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-slate-300">
                  {m.cycle && <span className="mr-1.5 font-mono text-[10px] uppercase tracking-wider text-lime">Cycle {m.cycle}</span>}
                  {m.text}
                </div>
              </motion.div>
            ),
          )}
        </AnimatePresence>
        {showTyping && (
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-ink-700">
              <Logo showText={false} className="scale-75" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.03] px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
