const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 font-mono text-sm text-zinc-950">
            &gt;_
          </span>
          saycommit
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/JesseJohn7/Saycommit"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Star
          </a>
          <a
            href="#install"
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}