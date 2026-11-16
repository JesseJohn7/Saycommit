"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

const items = [
  {
    q: "Is saycommit free?",
    a: "Yes. There are no trials and no sign-up. It runs on a shared free quota, so heavy use can hit a limit.",
  },
  {
    q: "Do I need an API key?",
    a: "No. Install it and run it. If you ever hit the free limit, run saycommit setup and add your own free Groq key.",
  },
  {
    q: "Is my code uploaded?",
    a: "Your diff, meaning only the changes and the file list, is sent through our server to an AI model so it can write the message. It is capped in size and we do not log it.",
  },
  {
    q: "What is the free limit?",
    a: "Each person gets 20 messages per hour. After that you will see a message telling you to try later or use your own key.",
  },
  {
    q: "What do I need installed?",
    a: "Node.js and git. If both run on your computer, saycommit will too.",
  },
  {
    q: "Can I see the message before it commits?",
    a: "Yes. Run saycommit --dry-run to print the message without committing anything.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition hover:bg-white/[0.03]"
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="text-xl text-emerald-400"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}