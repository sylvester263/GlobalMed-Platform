import { describe, expect, it, vi } from "vitest";

import { chunkText } from "@/lib/ai/chunk";
import {
  containsPhi,
  detectIntent,
  leadStarts,
  needsHandoff,
  replyProblems,
  scriptedAnswer,
} from "@/lib/ai/guardrails";
import { allowedUsdAmounts, pinnedKnowledge } from "@/lib/ai/knowledge";
import { continueLeadFlow, parseContact, startLeadFlow } from "@/lib/ai/lead-flow";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { buildContext } from "@/lib/ai/rag";
import { defaultChatSettings, isWithinHours, parseChatSettings } from "@/lib/ai/settings";

describe("guardrails: patient information", () => {
  it.each([
    "My patient John Smith, DOB 04/05/1970, needs a code",
    "MRN 4482193 was denied",
    "SSN 123-45-6789",
    "Mr. Khan was diagnosed with diabetes last week",
    "insurance id: ABC12345 for my patient",
  ])("refuses %s", (text) => {
    expect(containsPhi(text)).toBe(true);
  });

  it.each([
    "How much is the CPC course?",
    "Do you handle denial management for cardiology practices?",
    "What is the date of the next batch?",
  ])("allows %s", (text) => {
    expect(containsPhi(text)).toBe(false);
  });
});

describe("guardrails: prices come from the site data", () => {
  it("answers the CPC® price exactly", () => {
    const answer = scriptedAnswer("How much does the CPC course cost?");
    expect(answer?.text).toContain("USD 1,050");
    expect(answer?.text).toContain("16 weeks");
    expect(answer?.text).toMatch(/Register Now|WhatsApp/);
  });

  it("answers the dual course price and saving", () => {
    const answer = scriptedAnswer("price for both CPC and CPB together?");
    expect(answer?.text).toContain("USD 1,800");
    expect(answer?.text).toContain("USD 300");
  });

  it("lists all three courses when no course is named", () => {
    const answer = scriptedAnswer("what are your course fees");
    expect(answer?.text).toContain("USD 1,050");
    expect(answer?.text).toContain("USD 1,800");
  });

  it("lists the Package Includes items exactly", () => {
    const answer = scriptedAnswer("what is included in the CPB package?");
    expect(answer?.text).toContain("Six months of Blackboard access");
    expect(answer?.text).toContain("CPB Examination with two attempts");
  });

  it("only allows the knowledge-base amounts in model replies", () => {
    expect(allowedUsdAmounts().sort((a, b) => a - b)).toEqual([300, 1050, 1800, 2100]);
    expect(replyProblems("The CPC® course is USD 1,050 for 16 weeks.")).toEqual([]);
    expect(replyProblems("The CPC® course is now $899.")).toHaveLength(1);
    expect(replyProblems("It costs Rs 250,000")).toContain("price in rupees");
  });
});

describe("guardrails: hidden courses and delivery", () => {
  it("says other credentials are not offered", () => {
    expect(scriptedAnswer("Do you offer the CRC course?")?.text).toMatch(/three AAPC courses only/);
  });

  it("says training is online only", () => {
    expect(scriptedAnswer("Are there in-person classes in Lahore?")?.text).toMatch(/online only/);
  });

  it("says GlobalMed does not teach or certify", () => {
    expect(scriptedAnswer("Who teaches the CPC course?")?.text).toMatch(
      /doesn't teach or issue certificates/,
    );
  });

  it("flags model replies that mention retired or hidden offerings", () => {
    expect(replyProblems("You also get practice tests and Codify.")).toContain(
      "retired package item",
    );
    expect(replyProblems("We run onsite training sessions too.")).toContain("in-person training");
    expect(replyProblems("You will receive a GlobalMed certificate.")).toContain(
      "GlobalMed certificate",
    );
  });

  it("puts the guardrails and knowledge into the system prompt", () => {
    const prompt = buildSystemPrompt({ context: "" });
    expect(prompt).toContain("GlobalMed does NOT teach");
    expect(prompt).toContain("USD 1,050");
    expect(prompt).toContain("USD 1,800");
    expect(prompt).toContain("Never ask for or repeat patient information");
    expect(prompt).toContain("+92 300 419 8760");
    expect(pinnedKnowledge()).toContain("Dictation2Report (D2R) by MediTechLabs");
    expect(pinnedKnowledge()).toContain("Special pricing for Pakistan");
  });
});

describe("intent and handoff", () => {
  it.each([
    ["Can I talk to a person?", "human"],
    ["Talk to a person", "human"],
    ["This is the worst service, I want to complain", "complaint"],
    ["I paid but my payment failed", "payment"],
    ["Tell me about CPC certification", "course"],
    ["Do you do medical billing for clinics?", "service"],
    ["hello", "other"],
  ] as const)("%s → %s", (text, intent) => {
    expect(detectIntent(text)).toBe(intent);
  });

  it("hands complaints, payment issues and requests to a person", () => {
    expect(needsHandoff("human")).toBe(true);
    expect(needsHandoff("payment")).toBe(true);
    expect(needsHandoff("course")).toBe(false);
  });
});

describe("lead capture", () => {
  it("collects name and contact for a course enquiry", () => {
    const start = startLeadFlow("course");
    const afterName = continueLeadFlow(start.flow!, "My name is Ayesha Khan");
    expect(afterName.flow?.name).toBe("Ayesha Khan");
    const done = continueLeadFlow(afterName.flow!, "ayesha@example.com");
    expect(done.completed).toMatchObject({ name: "Ayesha Khan", email: "ayesha@example.com" });
  });

  it("asks practice and specialty for services", () => {
    let result = startLeadFlow("service");
    result = continueLeadFlow(result.flow!, "Dr Ali");
    result = continueLeadFlow(result.flow!, "+92 300 1234567");
    expect(result.flow?.step).toBe("practice");
    result = continueLeadFlow(result.flow!, "Model Town Clinic");
    result = continueLeadFlow(result.flow!, "Cardiology");
    expect(result.completed).toMatchObject({
      practiceName: "Model Town Clinic",
      specialty: "Cardiology",
    });
  });

  it("re-asks for an unreadable contact and can be cancelled", () => {
    const start = continueLeadFlow(startLeadFlow("course").flow!, "Sara");
    expect(continueLeadFlow(start.flow!, "tomorrow").flow?.step).toBe("contact");
    expect(continueLeadFlow(start.flow!, "cancel").flow).toBeNull();
    expect(parseContact("whatsapp me on 0300-1234567")).toEqual({ phone: "0300-1234567" });
  });

  it("starts from the quick replies", () => {
    expect(leadStarts.course).toMatch(/course/);
  });
});

describe("RAG retrieval", () => {
  it("keeps chunks above the similarity floor, best first", () => {
    const result = buildContext([
      { title: "CPC course", content: "USD 1,050", similarity: 0.82 },
      { title: "Privacy", content: "We do not store PHI", similarity: 0.4 },
      { title: "Noise", content: "unrelated", similarity: 0.1 },
    ]);
    expect(result.topSimilarity).toBe(0.82);
    expect(result.sources.map((s) => s.title)).toEqual(["CPC course", "Privacy"]);
    expect(result.context).toContain("[CPC course]");
    expect(result.context).not.toContain("unrelated");
  });

  it("returns no context when nothing is similar enough", () => {
    expect(buildContext([{ title: "x", content: "y", similarity: 0.1 }]).context).toBe("");
  });

  it("chunks long documents with overlap", () => {
    const text = Array.from({ length: 400 }, (_, i) => `Sentence number ${i} about billing.`).join(
      " ",
    );
    const chunks = chunkText(text, { tokens: 200, overlapTokens: 25 });
    expect(chunks.length).toBeGreaterThan(5);
    expect(chunks.every((c) => c.length <= 800)).toBe(true);
    // Overlap: the end of one chunk reappears at the start of the next.
    const tail = chunks[0]!.slice(-100).trim().slice(0, 20);
    expect(chunks[1]!.startsWith(tail)).toBe(true);
    expect(chunkText("short")).toEqual(["short"]);
  });
});

describe("settings and business hours", () => {
  it("defaults to 24/7 and three quick replies", () => {
    expect(isWithinHours(defaultChatSettings)).toBe(true);
    expect(defaultChatSettings.quickReplies).toHaveLength(3);
  });

  it("checks a schedule in the business time zone", () => {
    const settings = parseChatSettings({
      hours: {
        mode: "schedule",
        timezone: "Asia/Karachi",
        days: [1, 2, 3, 4, 5],
        open: "09:00",
        close: "18:00",
      },
    });
    // Monday 2026-10-05 10:00 in Karachi (UTC+5) = 05:00 UTC.
    expect(isWithinHours(settings, new Date("2026-10-05T05:00:00Z"))).toBe(true);
    // Sunday.
    expect(isWithinHours(settings, new Date("2026-10-04T05:00:00Z"))).toBe(false);
    // Monday 20:00 Karachi.
    expect(isWithinHours(settings, new Date("2026-10-05T15:00:00Z"))).toBe(false);
  });

  it("ignores invalid stored settings", () => {
    expect(parseChatSettings({ quickReplies: [] }).quickReplies).toHaveLength(3);
  });
});

describe("rate limit (20 messages / 10 min per visitor)", () => {
  it("allows 20 then blocks", async () => {
    vi.resetModules();
    const { checkRateLimit } = await import("@/lib/security/rate-limit");
    const visitor = `test-${Date.now()}`;
    const results = [];
    for (let i = 0; i < 21; i++) results.push(await checkRateLimit("chat", visitor));
    expect(results.slice(0, 20).every(Boolean)).toBe(true);
    expect(results[20]).toBe(false);
  });
});

describe("bot protection without Turnstile (ADR-036)", () => {
  it("skips the Turnstile check when no secret key is set", async () => {
    vi.resetModules();
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const { verifyTurnstile } = await import("@/lib/security/turnstile");
    expect(await verifyTurnstile(undefined, "203.0.113.7")).toBe(true);
    vi.unstubAllEnvs();
  });

  it("caps model replies at 500 a day across the site", async () => {
    vi.resetModules();
    const { checkRateLimit, limits } = await import("@/lib/security/rate-limit");
    expect(limits.chatModelDaily).toEqual({ requests: 500, windowSeconds: 86_400 });
    const site = `cap-${Date.now()}`;
    for (let i = 0; i < 500; i++) await checkRateLimit("chatModelDaily", site);
    expect(await checkRateLimit("chatModelDaily", site)).toBe(false);
  });
});

describe("knowledge base: page text from the live site", () => {
  it("keeps the main content and drops scripts, nav, forms and hidden sizers", async () => {
    const { extractMainText } = await import("@/lib/ai/extract");
    const html = `<html><body><header>Menu</header><main>
      <nav>Breadcrumb</nav><h1>CPC&reg; course</h1>
      <p>Price: USD 1,050 &amp; 16 weeks</p>
      <span aria-hidden="true" class="invisible">Duplicate headline</span>
      <ul><li>Six months of Blackboard access</li></ul>
      <script>alert(1)</script><form><input name="x"></form>
    </main><footer>© 2026</footer></body></html>`;
    const text = extractMainText(html);
    expect(text).toContain("CPC® course");
    expect(text).toContain("Price: USD 1,050 & 16 weeks");
    expect(text).toContain("• Six months of Blackboard access");
    expect(text).not.toMatch(/Menu|Breadcrumb|Duplicate|alert|© 2026/);
  });
});

describe("streaming through the hosting CDN", () => {
  it("pads each flush to 2 KB with a comment the parser ignores", async () => {
    const { encodeSse, parseSse, SSE_FLUSH_BYTES } = await import("@/lib/ai/sse");
    const chunk = encodeSse("delta", { text: "USD 1,050" }, SSE_FLUSH_BYTES);
    expect(new TextEncoder().encode(chunk).length).toBeGreaterThanOrEqual(SSE_FLUSH_BYTES);
    const { events, rest } = parseSse(chunk + encodeSse("done", { status: "bot" }));
    expect(events).toEqual([
      { event: "delta", data: { text: "USD 1,050" } },
      { event: "done", data: { status: "bot" } },
    ]);
    expect(rest).toBe("");
  });
});

describe("office address (single source)", () => {
  it("answers where the office is from data/site.ts", async () => {
    const { address } = await import("@/data/site");
    expect(scriptedAnswer("What is your office address?")?.text).toContain(address.oneLine);
    expect(pinnedKnowledge()).toContain(address.oneLine);
  });
});

describe("company facts (one source for home, About and the chatbot)", () => {
  it("says 25+ years in healthcare", async () => {
    const { companyFacts, about } = await import("@/content/company");
    expect(about.facts).toBe(companyFacts);
    expect(companyFacts.find((f) => f.label === "Years in Healthcare")?.value).toBe(25);
    expect(pinnedKnowledge()).toContain("Years in Healthcare 25+");
  });
});

describe("updates in the chatbot (2026-10-02)", () => {
  const batchUpdate = {
    id: "u1",
    slug: "next-batch",
    title: "Next CPC® batch starts 15 November",
    summary: "Registrations are open until 10 November.",
    bodyMd: null,
    category: "batch" as const,
    imagePath: null,
    linkUrl: null,
    linkLabel: null,
    publishAt: "2026-10-02T05:00:00Z",
    expiresAt: null,
    pinned: false,
    status: "published" as const,
  };

  it("answers 'when is the next batch?' from the latest batch update", () => {
    const answer = scriptedAnswer("When is the next batch?", { batchUpdate });
    expect(answer?.text).toContain("Next CPC® batch starts 15 November");
    expect(answer?.text).toContain("2 Oct 2026");
  });

  it("without a batch update it still points to the team", () => {
    expect(scriptedAnswer("When does the next batch start?")?.text).toMatch(/contact GlobalMed/);
  });

  it("puts live updates into the system prompt", () => {
    const prompt = buildSystemPrompt({
      context: "",
      updates: "- 2 Oct 2026 · Batch & Enrollment: Next batch",
    });
    expect(prompt).toContain("LATEST UPDATES");
    expect(prompt).toContain("Next batch");
  });
});
