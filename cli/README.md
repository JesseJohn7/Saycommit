# saycommit

Say commit. AI writes the commit message from your changes.

```
npx saycommit setup     # one time: paste a free Groq key
npx saycommit           # commit
```

Free key (no card): https://console.groq.com/keys

Flags: `-y` skip confirm, `-p` push, `--dry-run`, `--hint "context"`.
Env: `GROQ_API_KEY`, `GEMINI_API_KEY` or `ANTHROPIC_API_KEY`, optional `SAYCOMMIT_MODEL`.