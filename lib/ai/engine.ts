import "server-only";

import {
  containsPhi,
  detectIntent,
  handoffReply,
  leadStarts,
  needsHandoff,
  notConfiguredReply,
  phiPlaceholder,
  phiRefusal,
  replyProblems,
  safeFallback,
  scriptedAnswer,
  UNSURE_TOKEN,
  type Intent,
} from "@/lib/ai/guardrails";
import { contactFacts } from "@/lib/ai/knowledge";
import { continueLeadFlow, startLeadFlow, type LeadFlow } from "@/lib/ai/lead-flow";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { generate, isChatConfigured, type ChatTurn } from "@/lib/ai/provider";
import { retrieve } from "@/lib/ai/rag";
import { isWithinHours, outsideHoursText, type ChatSettings } from "@/lib/ai/settings";
import {
  addMessage,
  listMessages,
  updateConversation,
  type Conversation,
  type ConversationStatus,
} from "@/lib/ai/store";
import { sendEmail } from "@/lib/email/send";
import { LeadNotification } from "@/lib/email/templates/lead-notification";
import { storeLead } from "@/lib/leads/store";
import { absoluteUrl } from "@/lib/seo/metadata";
import { formsDryRun, serverEnv } from "@/lib/server-env";
import { site } from "@/lib/site";

/** Events streamed to the widget (as server-sent events by /api/chat). */
export type ChatEvent =
  | { type: "delta"; text: string }
  /** Replaces everything streamed so far (a model reply that failed the checks). */
  | { type: "replace"; text: string }
  | { type: "done"; status: ConversationStatus; quickReplies?: string[]; leadStep?: string };

/** docs/09 §9: history trimmed to the last 10 turns; replies capped. */
export const MAX_TURNS = 10;
export const MAX_OUTPUT_TOKENS = 400;
/** Two low-confidence answers in a row hand the chat to a person (docs/09 §6). */
export const LOW_CONFIDENCE_HANDOFF = 2;

const courseFollowUps = [leadStarts.course, handoffReply];
const serviceFollowUps = [leadStarts.service, handoffReply];

function followUps(intent: Intent): string[] | undefined {
  if (intent === "course") return courseFollowUps;
  if (intent === "service") return serviceFollowUps;
  return undefined;
}

function servicesOverview(): string {
  return [
    "GlobalMed supports healthcare providers with:",
    "• Medical transcription by experienced transcriptionists, editors and proofreaders",
    "• AI-powered clinical documentation: Dictation2Report (D2R) by MediTechLabs, with expert review",
    "• Revenue cycle management: insurance verification, prior authorizations, credentialing, coding, charge entry, claims, denial management, payment posting and A/R follow-up",
    `• A free billing audit (${contactFacts.auditUrl})`,
    "What would you like to know more about?",
  ].join("\n");
}

async function* say(
  conversation: Conversation,
  text: string,
  meta: Record<string, unknown>,
  done: Omit<Extract<ChatEvent, { type: "done" }>, "type">,
): AsyncGenerator<ChatEvent> {
  await addMessage(conversation.id, { role: "assistant", content: text, meta });
  yield { type: "delta", text };
  yield { type: "done", ...done };
}

async function saveLead(conversation: Conversation, flow: LeadFlow): Promise<void> {
  const interest =
    flow.kind === "course"
      ? "AAPC course (chatbot)"
      : flow.kind === "service"
        ? "Services (chatbot)"
        : "Talk to a person (chatbot)";
  const ok = await storeLead(
    {
      source: "chatbot",
      name: flow.name ?? null,
      email: flow.email ?? null,
      phone: flow.phone ?? null,
      practice_name: flow.practiceName ?? null,
      specialty: flow.specialty ?? null,
      interest,
      message: conversation.summary,
      details: { conversationId: conversation.id, kind: flow.kind },
    },
    [
      { label: "Name", value: flow.name ?? "" },
      { label: "Email", value: flow.email ?? "—" },
      { label: "WhatsApp / phone", value: flow.phone ?? "—" },
      ...(flow.kind === "service"
        ? [
            { label: "Practice", value: flow.practiceName ?? "—" },
            { label: "Specialty", value: flow.specialty ?? "—" },
          ]
        : []),
      { label: "Interest", value: interest },
      { label: "First question", value: conversation.summary ?? "—" },
    ],
  );
  if (!ok) return;
  await updateConversation(conversation.id, { leadFlow: null });
}

async function handOff(
  conversation: Conversation,
  reason: string,
  settings: ChatSettings,
): Promise<string> {
  await updateConversation(conversation.id, {
    status: "handoff",
    handoffReason: reason,
    handoffAt: new Date().toISOString(),
    lowConfidenceStreak: 0,
  });
  if (!formsDryRun()) {
    await sendEmail({
      to: serverEnv.ADMIN_NOTIFY_EMAIL ?? site.contact.email,
      subject: `Chat handed to a person (${reason})`,
      react: LeadNotification({
        source: "chatbot handoff",
        fields: [
          { label: "Reason", value: reason },
          { label: "First question", value: conversation.summary ?? "—" },
        ],
        dashboardUrl: absoluteUrl(`/dashboard/sales/inbox/${conversation.id}`),
      }),
    });
  }
  return isWithinHours(settings)
    ? "I've asked a member of our team to join this chat — they'll reply here shortly."
    : `I've passed this chat to our team. ${outsideHoursText(settings)}`;
}

/** Streams the model reply, holding back the low-confidence marker so it never shows. */
async function* streamModel(
  history: ChatTurn[],
  question: string,
): AsyncGenerator<ChatEvent, { text: string; unsure: boolean; sources: unknown[] }> {
  const retrieved = await retrieve(question);
  const system = buildSystemPrompt({ context: retrieved.context });
  let full = "";
  let shown = 0;
  try {
    for await (const part of generate([...history, { role: "user", content: question }], {
      system,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    })) {
      full += part;
      const safeEnd = Math.max(shown, full.length - UNSURE_TOKEN.length);
      if (safeEnd > shown) {
        yield { type: "delta", text: full.slice(shown, safeEnd) };
        shown = safeEnd;
      }
    }
  } catch {
    return { text: "", unsure: true, sources: retrieved.sources };
  }
  const unsure = full.includes(UNSURE_TOKEN);
  const text = full.replace(UNSURE_TOKEN, "").trimEnd();
  if (text.length > shown) yield { type: "delta", text: text.slice(shown) };
  return { text, unsure, sources: retrieved.sources };
}

/**
 * One visitor message → the reply events. Order: patient-information check, handoff state,
 * lead capture, quick replies, handoff triggers, exact (scripted) answers, then RAG + LLM
 * with the reply checks.
 */
export async function* respond(
  conversation: Conversation,
  rawText: string,
  settings: ChatSettings,
): AsyncGenerator<ChatEvent> {
  const text = rawText.trim();

  // 1. Patient information: refuse, store a placeholder, never the text.
  if (containsPhi(text)) {
    await addMessage(conversation.id, {
      role: "user",
      content: phiPlaceholder,
      meta: { phi: true },
    });
    yield* say(conversation, phiRefusal, { guard: "phi" }, { status: conversation.status });
    return;
  }

  const intent = detectIntent(text);
  await addMessage(conversation.id, { role: "user", content: text, meta: { intent } });

  // 2. Handed to a person: the bot stays quiet (agents reply), except to finish lead capture.
  if (conversation.status === "handoff" && !conversation.leadFlow) {
    yield { type: "done", status: "handoff" };
    return;
  }

  // 3. Lead capture in progress.
  if (conversation.leadFlow) {
    const result = continueLeadFlow(conversation.leadFlow, text);
    await updateConversation(conversation.id, { leadFlow: result.flow });
    if (result.completed) await saveLead(conversation, result.completed);
    yield* say(
      conversation,
      result.reply,
      { leadStep: result.flow?.step ?? "done" },
      { status: conversation.status, leadStep: result.flow?.step },
    );
    return;
  }

  // 4. Quick replies.
  if (text === leadStarts.course || text === leadStarts.service) {
    const kind = text === leadStarts.course ? "course" : "service";
    const result = startLeadFlow(kind);
    await updateConversation(conversation.id, { leadFlow: result.flow });
    yield* say(
      conversation,
      result.reply,
      { leadStep: "name" },
      {
        status: conversation.status,
        leadStep: "name",
      },
    );
    return;
  }
  if (text === settings.quickReplies[1] || /^billing (&|and) transcription services$/i.test(text)) {
    yield* say(
      conversation,
      servicesOverview(),
      { intent: "service", scripted: true },
      {
        status: conversation.status,
        quickReplies: serviceFollowUps,
      },
    );
    return;
  }

  // 5. Handoff triggers: asked for a person, complaint, payment issue.
  if (needsHandoff(intent)) {
    if (!settings.handoffEnabled) {
      yield* say(
        conversation,
        safeFallback,
        { intent, handoff: "disabled" },
        {
          status: conversation.status,
        },
      );
      return;
    }
    const intro = await handOff(conversation, intent === "human" ? "requested" : intent, settings);
    const result = startLeadFlow("handoff", intro);
    await updateConversation(conversation.id, { leadFlow: result.flow });
    yield* say(
      conversation,
      result.reply,
      { intent, handoff: true },
      {
        status: "handoff",
        leadStep: "name",
      },
    );
    return;
  }

  // 6. Exact answers from the site data.
  const quickCourse =
    text === settings.quickReplies[0] ? "What courses do you offer and their prices?" : text;
  const scripted = scriptedAnswer(quickCourse);
  if (scripted) {
    await updateConversation(conversation.id, { lowConfidenceStreak: 0 });
    yield* say(
      conversation,
      scripted.text,
      { intent: scripted.intent, scripted: true },
      {
        status: conversation.status,
        quickReplies: scripted.quickReplies,
      },
    );
    return;
  }

  // 7. No model yet: point to the team.
  if (!isChatConfigured()) {
    yield* say(
      conversation,
      notConfiguredReply,
      { intent, model: "not-configured" },
      {
        status: conversation.status,
        quickReplies: followUps(intent) ?? [handoffReply],
      },
    );
    return;
  }

  // 8. RAG + LLM.
  const previous = await listMessages(conversation.id, { limit: MAX_TURNS * 2 + 1 });
  const history: ChatTurn[] = previous
    .slice(0, -1) // the message just stored
    .filter((m) => m.role === "user" || m.role === "assistant" || m.role === "agent")
    .slice(-MAX_TURNS * 2)
    .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

  const stream = streamModel(history, text);
  let next = await stream.next();
  while (!next.done) {
    yield next.value;
    next = await stream.next();
  }
  const { text: reply, unsure, sources } = next.value;

  const problems = reply ? replyProblems(reply) : ["empty reply"];
  const finalText = problems.length ? safeFallback : reply;
  if (problems.length) yield { type: "replace", text: finalText };

  const lowConfidence = unsure || problems.length > 0;
  const streak = lowConfidence ? conversation.lowConfidenceStreak + 1 : 0;
  await addMessage(conversation.id, {
    role: "assistant",
    content: finalText,
    meta: { intent, unsure, problems, sources },
  });

  if (streak >= LOW_CONFIDENCE_HANDOFF && settings.handoffEnabled) {
    const intro = await handOff(conversation, "low_confidence", settings);
    const result = startLeadFlow("handoff", intro);
    await updateConversation(conversation.id, { leadFlow: result.flow });
    await addMessage(conversation.id, {
      role: "assistant",
      content: result.reply,
      meta: { handoff: true },
    });
    yield { type: "delta", text: `\n\n${result.reply}` };
    yield { type: "done", status: "handoff", leadStep: "name" };
    return;
  }

  await updateConversation(conversation.id, { lowConfidenceStreak: streak });
  yield {
    type: "done",
    status: conversation.status,
    quickReplies: lowConfidence ? [handoffReply] : followUps(intent),
  };
}
