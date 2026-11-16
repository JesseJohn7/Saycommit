import Reveal from "./Reveal";
import CopyCommand from "./CopyCommand";

const commands = [
  {
    cmd: "saycommit",
    desc: "Write a message for your changes and ask before committing. Press Y to commit, n to cancel or e to edit.",
  },
  {
    cmd: "saycommit -y",
    desc: "Commit straight away without asking.",
  },
  {
    cmd: "saycommit -y -p",
    desc: "Commit without asking and push to GitHub.",
  },
  {
    cmd: "saycommit -p",
    desc: "Commit after you confirm, then push.",
  },
  {
    cmd: "saycommit --dry-run",
    desc: "Show the message only. Nothing is committed.",
  },
  {
    cmd: "saycommit setup",
    desc: "Use your own free Groq key if you hit the free limit.",
  },
  {
    cmd: "saycommit --help",
    desc: "List every option.",
  },
];

export default function Commands() {
  return (
    <section id="commands" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            All the commands
          </h2>
          <p className="mt-3 text-zinc-400">
            Run these inside any git project. Click Copy and paste it into your
            terminal.
          </p>
        </Reveal>

        <div className="mt-12 space-y-3">
          {commands.map((c, i) => (
            <Reveal key={c.cmd} delay={i * 0.05}>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/30 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-zinc-400 sm:order-1 sm:max-w-sm">
                  {c.desc}
                </p>
                <div className="sm:order-2">
                  <CopyCommand command={c.cmd} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}