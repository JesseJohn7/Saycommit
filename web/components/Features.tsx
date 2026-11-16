import Reveal from "./Reveal";

const features = [
  {
    icon: ">_",
    title: "One command",
    body: "Run saycommit and your changes become a commit message and a commit.",
  },
  {
    icon: "{}",
    title: "Conventional Commits",
    body: "feat, fix, refactor, docs and more, with a short subject line and helpful bullets.",
  },
  {
    icon: "↑",
    title: "Commit and push",
    body: "Add -y -p to skip the confirmation and push to GitHub in the same command.",
  },
  {
    icon: "◎",
    title: "Dry run",
    body: "Use --dry-run to see the message without committing anything.",
  },
  {
    icon: "⚿",
    title: "Bring your own key",
    body: "Hit the free limit? Run saycommit setup and use your own free Groq key.",
  },
  {
    icon: "★",
    title: "Free and open source",
    body: "No trials, no sign-up. Read the code or improve it on GitHub.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need, nothing you do not
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 font-mono text-sm text-emerald-300 transition group-hover:bg-emerald-500/25">
                  {f.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}