const SYSTEM =
  "You write git commit messages in Conventional Commits format (feat, fix, refactor, docs, test, chore, style, perf). " +
  "Subject line max 72 chars, imperative mood, no trailing period. For non-trivial changes add a blank line and short bullet points explaining what and why. " +
  "Output ONLY the commit message, no code fences, no preamble.";

const MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.1-8b-instant", "llama-3.3-70b-versatile", "qwen/qwen3-32b"];
const MAX_DIFF = 30000;
const LIMIT_PER_HOUR = 20;
const hits = new Map();

function allowed(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { count: 1, reset: now + 3600000 });
    return true;
  }
  if (rec.count >= LIMIT_PER_HOUR) return false;
  rec.count++;
  return true;
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

async function fallbackModel(key, tried) {
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { authorization: `Bearer ${key}` } });
  if (!r.ok) return null;
  const ids = ((await r.json()).data || []).map((m) => m.id);
  return MODELS.find((m) => ids.includes(m) && m !== tried) || null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: "Server is not configured." });

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (!allowed(ip)) {
    return res.status(429).json({
      error: "Free limit reached. Try again later, or run: saycommit setup (use your own free key).",
    });
  }

  const body = req.body || {};
  const diff = String(body.diff || "").slice(0, MAX_DIFF);
  const stat = String(body.stat || "").slice(0, 2000);
  const hint = String(body.hint || "").slice(0, 200);
  if (!diff.trim()) return res.status(400).json({ error: "Empty diff." });

  let prompt = `Files changed:\n${stat}\n\nDiff:\n${diff}`;
  if (hint) prompt += `\n\nUser hint: ${hint}`;

  try {
    let model = process.env.GROQ_MODEL || MODELS[0];
    let r = await groqCall(model, key, prompt);
    if (r.status === 404) {
      const alt = await fallbackModel(key, model);
      if (alt) r = await groqCall(alt, key, prompt);
    }
    if (r.status === 429) return res.status(429).json({ error: "Server is busy. Try again in a minute." });
    if (!r.ok) return res.status(502).json({ error: "AI service error." });
    const data = await r.json();
    const message = ((data.choices && data.choices[0] && data.choices[0].message.content) || "").trim();
    if (!message) return res.status(502).json({ error: "No message generated." });
    return res.status(200).json({ message });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach AI service." });
  }
};