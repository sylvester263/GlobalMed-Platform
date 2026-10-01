/**
 * Chatbot test question set (pm/CHATBOT_TEST_QUESTIONS.md). Sends each question as a new
 * conversation to /api/chat and checks the answer for required and forbidden text.
 * Questions marked needsLlm can only pass once LLM_PROVIDER / LLM_API_KEY are set; without
 * them they are reported as BLOCKED (the bot gives the "contact our team" reply instead).
 *
 *   node tests/audit/chatbot-questions.mjs [baseUrl]     # local: FORMS_DRY_RUN=true next dev
 */
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? process.env.AUDIT_BASE ?? "http://localhost:3200";
const questions = JSON.parse(
  readFileSync(new URL("./chatbot-questions.json", import.meta.url), "utf8"),
);

async function ask(q) {
  const res = await fetch(new URL("/api/chat", base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: q,
      visitorId: `qset${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
    }),
  });
  if (!res.ok) return { error: `HTTP ${res.status} ${await res.text()}` };
  const text = await res.text();
  let reply = "";
  let model = true;
  for (const block of text.split("\n\n")) {
    const event = block.match(/^event: (\w+)/m)?.[1];
    const data = block.match(/^data: (.*)$/m)?.[1];
    if (!event || !data) continue;
    const payload = JSON.parse(data);
    if (event === "delta") reply += payload.text;
    if (event === "replace") reply = payload.text;
  }
  if (/I can answer questions about course prices, packages and how to reach us/.test(reply))
    model = false;
  return { reply, model };
}

let pass = 0;
let fail = 0;
let blocked = 0;
const rows = [];
for (const item of questions) {
  const { reply = "", error, model } = await ask(item.q);
  const lower = reply.toLowerCase();
  const missing = item.must.filter((m) => !lower.includes(m.toLowerCase()));
  const forbidden = item.mustNot.filter((m) => lower.includes(m.toLowerCase()));
  let result;
  if (error) result = "FAIL";
  else if (item.needsLlm && !model) result = "BLOCKED";
  else result = missing.length || forbidden.length ? "FAIL" : "PASS";
  if (result === "PASS") pass++;
  else if (result === "FAIL") fail++;
  else blocked++;
  rows.push({
    id: item.id,
    result,
    missing,
    forbidden,
    error,
    reply: reply.replace(/\s+/g, " ").slice(0, 160),
  });
}
for (const r of rows) {
  process.stdout.write(
    `${String(r.id).padStart(2)} ${r.result.padEnd(7)} ${r.error ?? ""}${r.missing.length ? ` missing: ${r.missing.join(", ")}` : ""}${r.forbidden.length ? ` forbidden: ${r.forbidden.join(", ")}` : ""}\n   ${r.reply}\n`,
  );
}
process.stdout.write(`\n${pass} pass · ${fail} fail · ${blocked} blocked (need LLM key)\n`);
process.exit(fail ? 1 : 0);
