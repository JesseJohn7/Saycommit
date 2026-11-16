"use client";

import { motion, type Variants } from "framer-motion";
import CopyCommand from "./CopyCommand";
import TerminalDemo from "./TerminalDemo";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      id="install"
      className="relative overflow-hidden px-6 pb-24 pt-36 text-center"
    >
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="animate-glow pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-[90%] rounded-full bg-emerald-500/30 blur-[110px]" />
      <div className="animate-glow pointer-events-none absolute left-1/2 top-24 h-72 w-72 translate-x-[10%] rounded-full bg-cyan-500/20 blur-[110px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-3xl"
      >
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Free. No sign-up. No API key.
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          One command.
          <br />
          <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            A perfect commit message.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-lg text-zinc-400"
        >
          saycommit reads your changes, writes a clean Conventional Commits
          message and commits for you. Install it and run it. That is all the
          setup there is.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex justify-center">
          <CopyCommand command="npm i -g saycommit" />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="https://www.npmjs.com/package/saycommit"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            View on npm
          </a>
          <a
            href="https://github.com/JesseJohn7/Saycommit"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/5"
          >
            View source
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="relative mt-16"
      >
        <div className="animate-float">
          <TerminalDemo />
        </div>
      </motion.div>
    </section>
  );
}