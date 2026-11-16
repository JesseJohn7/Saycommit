import Reveal from "./Reveal";

const flow = [
  { title: "Your computer", body: "saycommit reads your git changes." },
  { title: "saycommit server", body: "Adds the key and passes the diff on." },
  { title: "Groq AI", body: "Writes the message and sends it back." },
];

const points = [
  {
    title: "Only the diff is sent",
    body: "Just your changes and the list of changed files. Never your whole project.",
  },
  {
    title: "Capped in size",
    body: "Very large diffs are cut off before they are sent.",
  },
  {
    title: "Not logged by us",
    body: "The server does not log or save your diff.",
  },
  {
    title: "Want to skip our server?",
    body: "Run saycommit setup and use your own free Groq key. Your diff then goes straight to Groq.",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Here is exactly where your code goes
          </h2>
          <p className="mt-3 text-zinc-400">
            To write a message, your diff has to reach an AI model. We would
            rather tell you how than hide it.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {flow.map((f, i) => (
              <div key={f.title} className="flex flex-1 items-center gap-3">
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                  <p className="font-semibold">{f.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{f.body}</p>
                </div>
                {i < flow.length - 1 && (
                  <span className="hidden text-emerald-400 md:block">→</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-semibold text-emerald-300">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}