"use client";

import { useEffect, useState } from "react";

const COMMAND = "saycommit";

const OUTPUT = [
  "Reading your changes...",
  "3 files changed, 42 insertions(+), 7 deletions(-)",
  "",
  "--- commit message ---",
  "feat(auth): add login rate limiting",
  "",
  "- limit login attempts to 5 per minute",
  "- return a clear error when the limit is hit",
  "----------------------",
  "Committed.",
];

export default function TerminalDemo() {
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (typed < COMMAND.length) {
      timer = setTimeout(() => setTyped(typed + 1), 110);
    } else if (lines < OUTPUT.length) {
      timer = setTimeout(() => setLines(lines + 1), lines === 0 ? 700 : 320);
    } else {
      timer = setTimeout(() => {
        setTyped(0);
        setLines(0);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [typed, lines]);

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-emerald-500/10 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-zinc-500">my-project</span>
      </div>
      <div className="min-h-[300px] p-5 text-left font-mono text-sm leading-relaxed">
        <div>
          <span className="text-emerald-400">$ </span>
          <span className="text-zinc-100">{COMMAND.slice(0, typed)}</span>
          {lines === 0 && (
            <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-zinc-300" />
          )}
        </div>
        {OUTPUT.slice(0, lines).map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith("feat")
                ? "text-emerald-300"
                : line === "Committed."
                  ? "text-emerald-400"
                  : "text-zinc-400"
            }
          >
            {line || "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
}