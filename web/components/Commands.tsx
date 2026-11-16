export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-zinc-500 md:flex-row">
        <div>
          <p className="font-semibold text-zinc-200">saycommit</p>
          <p className="mt-1">Free, open-source AI commit messages for your terminal.</p>
        </div>
        <div className="flex gap-6">
          <a
            href="https://github.com/JesseJohn7/Saycommit"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/saycommit"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            npm
          </a>
          <a
            href="https://github.com/JesseJohn7/Saycommit/issues"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Report an issue
          </a>
        </div>
        <p>
          © 2026 saycommit. Built by{" "}
          <a
            href="https://github.com/JesseJohn7"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-300 transition hover:text-white"
          >
            Jesse John
          </a>
        </p>
      </div>
    </footer>
  );
}