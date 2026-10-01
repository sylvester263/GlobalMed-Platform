/**
 * Lead capture in the chat (docs/09 §5): name, then email or WhatsApp, then (for service
 * enquiries) practice name and specialty. Pure: the state is stored on the conversation
 * (chat_conversations.lead_flow) and the engine saves the lead when the flow is done.
 */

export type LeadKind = "course" | "service" | "handoff";
export type LeadStep = "name" | "contact" | "practice" | "specialty" | "done";

export type LeadFlow = {
  kind: LeadKind;
  step: LeadStep;
  name?: string;
  email?: string;
  phone?: string;
  practiceName?: string;
  specialty?: string;
};

export type LeadFlowResult = {
  flow: LeadFlow | null;
  reply: string;
  /** Set once every field is collected. */
  completed?: LeadFlow;
};

const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
const phonePattern = /\+?[\d\s()-]{7,20}/;

const questions: Record<Exclude<LeadStep, "done">, string> = {
  name: "Sure — what's your name?",
  contact: "Thanks! What's the best email address or WhatsApp number to reach you?",
  practice: "What's the name of your practice or organisation?",
  specialty: "And which specialty (for example family medicine, cardiology, radiology)?",
};

export function startLeadFlow(kind: LeadKind, intro?: string): LeadFlowResult {
  const flow: LeadFlow = { kind, step: "name" };
  return { flow, reply: intro ? `${intro}\n\n${questions.name}` : questions.name };
}

export function isCancel(text: string): boolean {
  return /^\s*(cancel|stop|no thanks|never ?mind|skip)\s*[.!]?\s*$/i.test(text);
}

/** Parses an email or a phone number out of a reply. */
export function parseContact(text: string): { email?: string; phone?: string } | null {
  const email = text.match(emailPattern)?.[0];
  if (email) return { email: email.replace(/[.,;]+$/, "") };
  const phone = text.match(phonePattern)?.[0];
  if (phone && phone.replace(/\D/g, "").length >= 7) return { phone: phone.trim() };
  return null;
}

function clean(text: string, max = 120): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

/** Advances the flow with the visitor's reply. */
export function continueLeadFlow(flow: LeadFlow, text: string): LeadFlowResult {
  if (isCancel(text)) {
    return {
      flow: null,
      reply: "No problem — I won't collect your details. Ask me anything else.",
    };
  }

  const next = { ...flow };
  switch (flow.step) {
    case "name": {
      const name = clean(text.replace(/^(my name is|i am|i'm|this is)\s+/i, ""), 80);
      if (name.length < 2) return { flow, reply: "Could you tell me your name?" };
      next.name = name;
      next.step = "contact";
      return { flow: next, reply: questions.contact };
    }
    case "contact": {
      const contact = parseContact(text);
      if (!contact) {
        return {
          flow,
          reply:
            "I couldn't read that. Please send an email address (name@example.com) or a WhatsApp number with country code.",
        };
      }
      Object.assign(next, contact);
      if (flow.kind === "service") {
        next.step = "practice";
        return { flow: next, reply: questions.practice };
      }
      next.step = "done";
      return { flow: null, reply: doneReply(next), completed: next };
    }
    case "practice": {
      next.practiceName = clean(text);
      next.step = "specialty";
      return { flow: next, reply: questions.specialty };
    }
    case "specialty": {
      next.specialty = clean(text, 80);
      next.step = "done";
      return { flow: null, reply: doneReply(next), completed: next };
    }
    default:
      return { flow: null, reply: doneReply(next), completed: next };
  }
}

function doneReply(flow: LeadFlow): string {
  const first = flow.name?.split(" ")[0] ?? "";
  if (flow.kind === "course") {
    return `Thank you${first ? `, ${first}` : ""}! Our team will contact you about the AAPC course and help you complete your enrollment.`;
  }
  if (flow.kind === "service") {
    return `Thank you${first ? `, ${first}` : ""}! Our team will be in touch about your practice's needs.`;
  }
  return `Thank you${first ? `, ${first}` : ""}. A member of our team will reply here, or contact you directly.`;
}
