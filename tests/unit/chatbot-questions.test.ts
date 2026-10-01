import { readFileSync } from "node:fs";

import { beforeAll, describe, expect, it } from "vitest";

/**
 * The 20-question test set (pm/CHATBOT_TEST_QUESTIONS.md, tests/audit/chatbot-questions.json)
 * run through the engine in local dry run. Questions marked needsLlm can only be answered
 * by the model; without LLM keys they must get the safe "contact our team" reply instead
 * (never an invented answer). tests/audit/chatbot-questions.mjs runs the same set against a
 * running server, including with a real model.
 */

type Question = { id: number; q: string; must: string[]; mustNot: string[]; needsLlm: boolean };

const questions = JSON.parse(
  readFileSync(new URL("../audit/chatbot-questions.json", import.meta.url), "utf8"),
) as Question[];

type Engine = typeof import("@/lib/ai/engine");
type Store = typeof import("@/lib/ai/store");
type Settings = typeof import("@/lib/ai/settings");
let engine: Engine;
let store: Store;
let settings: Settings;

beforeAll(async () => {
  process.env.FORMS_DRY_RUN = "true";
  delete process.env.LLM_PROVIDER;
  delete process.env.LLM_API_KEY;
  engine = await import("@/lib/ai/engine");
  store = await import("@/lib/ai/store");
  settings = await import("@/lib/ai/settings");
});

async function answer(question: string): Promise<string> {
  const conversation = await store.createConversation({
    visitorId: "unit-test",
    tokenHash: store.hashToken("t"),
    summary: question,
  });
  let reply = "";
  for await (const event of engine.respond(conversation, question, settings.defaultChatSettings)) {
    if (event.type === "delta") reply += event.text;
    if (event.type === "replace") reply = event.text;
  }
  return reply;
}

describe("chatbot test question set", () => {
  for (const item of questions) {
    it(`${item.id}. ${item.q}`, async () => {
      const reply = (await answer(item.q)).toLowerCase();
      for (const text of item.mustNot) expect(reply).not.toContain(text.toLowerCase());
      if (item.needsLlm && reply.includes("i can answer questions about course prices")) {
        // Blocked until the LLM key is set: the safe reply points to the team.
        expect(reply).toContain("+92 300 419 8760");
        return;
      }
      for (const text of item.must) expect(reply).toContain(text.toLowerCase());
    });
  }

  it("never stores the patient information it refused", async () => {
    const conversation = await store.createConversation({
      visitorId: "unit-test",
      tokenHash: store.hashToken("t"),
      summary: "x",
    });
    const question = questions.find((q) => q.id === 11)!.q;
    for await (const event of engine.respond(
      conversation,
      question,
      settings.defaultChatSettings,
    )) {
      void event;
    }
    const stored = await store.listMessages(conversation.id);
    expect(stored.map((m) => m.content).join(" ")).not.toContain("John Smith");
  });
});
