#!/usr/bin/env node
const { execFileSync, spawnSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CONFIG = path.join(os.homedir(), ".saycommit.json");
const MAX_DIFF = 30000;

// Later, when your backend is deployed, put its URL here (example: "https://your-app.vercel.app/api/commit").
// Leave empty until then.
const HOSTED_URL = process.env.SAYCOMMIT_API_URL || "";

const SYSTEM =
  "You write git commit messages in Conventional Commits format (feat, fix, refactor, docs, test, chore, style, perf). " +
  "Subject line max 72 chars, imperative mood, no trailing period. For non-trivial changes add a blank line and short bullet points explaining what and why. " +
  "Output ONLY the commit message, no code fences, no preamble.";

const GROQ_PREFERRED = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "qwen/qwen3-32b",
];

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const hintIdx = args.indexOf("--hint");
const hint = hintIdx > -1 ? args[hintIdx + 1] || "" : "";

// die() prints the message and stops without process.exit (avoids the Windows "Assertion failed" crash)
class Fatal extends Error {}
const die = (m) => { console.error(m); process.exitCode = 1; throw new Fatal(m); };

const ask = (q) => new Promise((r) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(q, (a) => { rl.close(); r(a.trim()); });
});
const git = (...a) => {
  try { return execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { die(`git ${a.join(" ")} failed:\n${(e.stderr || e.message).toString().trim()}`); }
};
const loadConfig = () => { try { return JSON.parse(fs.readFileSync(CONFIG, "utf8")); } catch { return {}; } };

if (has("--help") || has("-h")) {
  console.log(`saycommit - AI-written git commits

  saycommit            stage if needed, generate message, confirm, commit
  saycommit -y         skip confirmation
  saycommit -p         push after commit
  saycommit --dry-run  only print the message
  saycommit --hint "x" give the AI extra context
  saycommit setup      save your API key once (free Groq key works)

Keys: run "saycommit setup", or set GROQ_API_KEY, GEMINI_API_KEY or ANTHROPIC_API_KEY.`);
  process.exit(0);
}

async function setup() {
  console.log("Pick a provider:\n  1) Groq (free, easiest: https://console.groq.com/keys)\n  2) Gemini (free: https://aistudio.google.com/apikey)\n  3) Anthropic Claude (paid)");
  const c = await ask("Choice [1]: ");
  const key = await ask("Paste your API key: ");
  if (!key) die("No key entered.");
  const p = c === "3" ? "anthropic" : c === "2" ? "gemini" : "groq";
  fs.writeFileSync(CONFIG, JSON.stringify({ provider: p, key }), { mode: 0o600 });
  console.log(`Saved to ${CONFIG}. Now run: saycommit`);
}

function pickProvider() {
  const cfg = loadConfig();
  const env = process.env;
  if (cfg.key) return cfg;
  if (env.GROQ_API_KEY) return { provider: "groq", key: env.GROQ_API_KEY };
  if (env.GEMINI_API_KEY || env.GOOGLE_API_KEY) return { provider: "gemini", key: env.GEMINI_API_KEY || env.GOOGLE_API_KEY };
  if (env.ANTHROPIC_API_KEY) return { provider: "anthropic", key: env.ANTHROPIC_API_KEY };
  if (HOSTED_URL) return { provider: "hosted" };
  die("No API key found. Run: saycommit setup\nFree key (no card): https://console.groq.com/keys");
}

function groqCall(model, key, prompt) {
  const body = {
    model,
    temperature: 0.2,
    max_completion_tokens: 1500,
    messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
  };
  if (model.startsWith("openai/gpt-oss")) body.reasoning_effort = "low";
  return fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
}

async function groqFallbackModel(key, tried) {
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { authorization: `Bearer ${key}` } });
  if (!r.ok) return null;
  const ids = ((await r.json()).data || []).map((m) => m.id);
  return GROQ_PREFERRED.find((m) => ids.includes(m) && m !== tried) || null;
}

async function generate(diff, stat) {
  if (process.env.SAYCOMMIT_MOCK) return "chore: mock commit message\n\n- generated without API call";
  const { provider, key } = pickProvider();
  if (diff.length > MAX_DIFF) diff = diff.slice(0, MAX_DIFF) + "\n...[diff truncated]";
  let prompt = `Files changed:\n${stat}\n\nDiff:\n${diff}`;
  if (hint) prompt += `\n\nUser hint: ${hint}`;

  if (provider === "hosted") {
    const res = await fetch(HOSTED_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ diff, stat, hint }),
      signal: AbortSignal.timeout(30000),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) die(d.error || `Server error ${res.status}`);
    return d.message;
  }

  if (provider === "groq") {
    let model = process.env.SAYCOMMIT_MODEL || GROQ_PREFERRED[0];
    let res = await groqCall(model, key, prompt);
    if (res.status === 404) {
      const alt = await groqFallbackModel(key, model);
      if (alt) { model = alt; res = await groqCall(model, key, prompt); }
    }
    if (!res.ok) die(`Groq API error ${res.status}: ${await res.text()}`);
    const d = await res.json();
    const t = (d.choices?.[0]?.message?.content || "").trim();
    if (!t) die("Groq returned no text.");
    return t;
  }

  if (provider === "gemini") {
    const model = process.env.SAYCOMMIT_MODEL || "gemini-3.8-flash";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 },
      }),
    });
    if (!res.ok) die(`Gemini API error ${res.status}: ${await res.text()}`);
    const d = await res.json();
    const t = (d.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
    if (!t) die("Gemini returned no text.");
    return t;
  }

  const model = process.env.SAYCOMMIT_MODEL || "claude-haiku-4-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) die(`Anthropic API error ${res.status}: ${await res.text()}`);
  const d = await res.json();
  return d.content.map((b) => b.text || "").join("").trim();
}

(async () => {
  if (args[0] === "setup") return setup();
  git("rev-parse", "--is-inside-work-tree");
  if (!git("diff", "--cached", "--name-only").trim()) {
    if (!git("status", "--porcelain").trim()) die("Nothing to commit.");
    console.log("Nothing staged, staging all changes...");
    git("add", "-A");
  }
  const diff = git("diff", "--cached");
  const stat = git("diff", "--cached", "--stat");
  let msg = await generate(diff, stat);
  console.log(`\n${stat}\n--- commit message ---\n${msg}\n----------------------\n`);
  if (has("--dry-run")) return;

  if (!has("-y")) {
    const ans = (await ask("Commit? [Y]es / [n]o / [e]dit: ")).toLowerCase();
    if (ans === "n" || ans === "no") return console.log("Aborted (changes remain staged).");
    if (ans === "e" || ans === "edit") {
      const f = path.join(os.tmpdir(), `saycommit-${Date.now()}.txt`);
      fs.writeFileSync(f, msg);
      spawnSync(process.env.EDITOR || (process.platform === "win32" ? "notepad" : "nano"), [f], { stdio: "inherit" });
      msg = fs.readFileSync(f, "utf8").trim();
    }
  }
  git("commit", "-m", msg);
  console.log("Committed.");
    if (has("-p")) { git("push"); console.log("Pushed."); }
})().catch((e) => {
  if (e instanceof Fatal) return;
  console.error("Error: " + (e.cause && e.cause.message ? e.cause.message : e.message) + "\nCheck your internet connection and API key.");
  process.exitCode = 1;
});