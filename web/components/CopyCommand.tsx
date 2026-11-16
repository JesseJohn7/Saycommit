"use client";

import { useState } from "react";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2 pl-4 pr-2 font-mono text-sm backdrop-blur">
      <span className="text-emerald-400">$</span>
      <span className="text-zinc-100">{command}</span>
      <button
        onClick={copy}
        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/20"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}