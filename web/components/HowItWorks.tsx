import Reveal from "./Reveal";

const steps = [
  {
    n: "1",
    title: "Install it once",
    body: "Run the install command in any terminal. There is no account to make and no key to paste.",
    code: "npm i -g saycommit",
  },
  {
    n: "2",
    title: "Change your code",
    body: "Work as you normally do in any git project. saycommit looks at what you changed.",
    code: "git status",
  },
  {
    n: "3",
    title: "Run saycommit",
    body: "It writes the message and commits. Add --dry-run first if you only want to see the message.",
    code: "saycommit",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-zinc-400">
            Three steps and you never write a commit message by hand again.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-sm text-emerald-300">
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {s.body}
                </p>
                <code className="mt-5 block rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-emerald-300">
                  $ {s.code}
                </code>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}