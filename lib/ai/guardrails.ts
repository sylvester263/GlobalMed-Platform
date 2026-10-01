import { allowedUsdAmounts, contactFacts } from "@/lib/ai/knowledge";
import { formatUsdPrice, getAapcCourses, type AapcCourseSlug } from "@/data/courses";

/**
 * Deterministic guardrails (docs/09 §4), applied before and after the LLM:
 * - patient information is refused and never repeated or stored;
 * - prices, contact details and the "who teaches" answers come from the site data, not the
 *   model, so they are always exact (and work before an LLM key is set);
 * - every model reply is checked for prices and topics the bot must never state.
 */

export type Intent = "course" | "service" | "human" | "complaint" | "payment" | "other";

/** The model appends this when the knowledge doesn't answer the question (low confidence). */
export const UNSURE_TOKEN = "[[unsure]]";

/** Quick replies that start lead capture (lib/ai/lead-flow.ts). */
export const leadStarts = {
  course: "Have the team contact me about a course",
  service: "Have the team contact me about services",
} as const;

export { handoffReply } from "@/lib/ai/defaults";
import { handoffReply } from "@/lib/ai/defaults";

const has = (text: string, pattern: RegExp) => pattern.test(text);

// ---------- Patient information ----------

const phiPatterns: RegExp[] = [
  /\b(d\.?o\.?b\.?|date of birth|birth ?date)\b/i,
  /\b(mrn|medical record( number| no\.?)?|patient (id|number|account)|chart (number|no\.?))\b/i,
  /\b\d{3}-\d{2}-\d{4}\b/, // US SSN
  /\b(ssn|social security( number)?)\b/i,
  /\b(member|policy|subscriber|insurance) ?(id|number|no\.?)\s*[:#]?\s*[a-z0-9-]{4,}/i,
  // "patient John Smith", "my patient named Sara Khan", "pt. Ali Raza"
  /\b(patient|pt\.?)\s+(named\s+|name\s+is\s+|is\s+)?[A-Z][a-z]+\s+[A-Z][a-z]+/,
  // "Mr. Khan was diagnosed with", "Mrs Smith has diabetes"
  /\b(mr|mrs|ms|miss)\.?\s+[A-Z][a-z]+\b.{0,40}\b(diagnos|has |had |suffer|prescrib|admitted|discharged)/i,
  /\b(diagnosed with|diagnosis of)\b.{0,60}\b(born|aged?|years? old|dob)\b/i,
];

/** True when a message looks like it contains patient information (PHI). */
export function containsPhi(text: string): boolean {
  return phiPatterns.some((p) => p.test(text));
}

export const phiRefusal =
  "Please don't share patient information here. I've removed your message and haven't stored it. I can help with general questions about our services and the AAPC courses — for anything about a specific patient, please contact our team directly at " +
  `${contactFacts.email}.`;

/** Stored in place of a message that looked like PHI (never the original text). */
export const phiPlaceholder = "[Message removed: it looked like patient information.]";

// ---------- Intent ----------

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (
    t.includes(handoffReply.toLowerCase()) ||
    has(
      t,
      /\b(talk|speak|chat|connect)\b.{0,20}\b(person|human|agent|someone|representative|real|team|staff|sales)\b/,
    ) ||
    has(t, /\b(human|live agent|representative|call me( back)?|contact me)\b/)
  ) {
    return "human";
  }
  if (
    has(
      t,
      /\b(complain|complaint|unhappy|disappointed|terrible|worst|scam|fraud|angry|not happy|bad service|unacceptable)\b/,
    )
  ) {
    return "complaint";
  }
  if (
    has(
      t,
      /\b(refund|money back|overcharged|double charged|charged twice|payment (issue|problem|failed|declined|not (received|showing))|paid but|transaction failed)\b/,
    )
  ) {
    return "payment";
  }
  if (
    has(
      t,
      /\b(cpc|cpb|course|courses|training|train|certif\w*|aapc|exam|register|registration|enrol\w*|batch|class|classes|coder|biller|instal+ments?)\b/,
    )
  ) {
    return "course";
  }
  if (
    has(
      t,
      /\b(billing|transcription|transcriptionist|rcm|revenue cycle|coding service|denial|claims?|audit|d2r|dictation|documentation|outsourc\w*|practice|clinic|hospital|ehr|emr|quote|provider)\b/,
    )
  ) {
    return "service";
  }
  return "other";
}

/** Complaint and payment issues go to a person (docs/09 §6), as does an explicit request. */
export function needsHandoff(intent: Intent): boolean {
  return intent === "human" || intent === "complaint" || intent === "payment";
}

// ---------- Scripted answers ----------

export type ScriptedAnswer = { text: string; intent: Intent; quickReplies?: string[] };

const registerLine = `To register, use the Register Now form (${contactFacts.registerUrl}) or message us on WhatsApp ${contactFacts.whatsapp}. Our team then helps you complete your AAPC enrollment.`;

function courseMentioned(t: string): AapcCourseSlug | "all" | null {
  const cpc = /\bcpc\b|professional coder|\bcoder\b|\bcoding (course|training|certification)/.test(
    t,
  );
  const cpb =
    /\bcpb\b|professional biller|\bbiller\b|\bbilling (course|training|certification)/.test(t);
  const both = /\b(both|dual|combined|combo|together|bundle)\b/.test(t) || (cpc && cpb);
  if (both) return "cpc-cpb";
  if (cpc) return "cpc";
  if (cpb) return "cpb";
  if (/\b(courses?|training|certifications?|aapc)\b/.test(t)) return "all";
  return null;
}

function priceLine(slug: AapcCourseSlug): string {
  const course = getAapcCourses().find((c) => c.slug === slug);
  if (!course) return "";
  const saving = course.priceSaving ? ` ${course.priceSaving}` : "";
  return `${course.title}: ${formatUsdPrice(course.priceUsd)}, ${course.duration}.${saving}`;
}

function packageLine(slug: AapcCourseSlug): string {
  const course = getAapcCourses().find((c) => c.slug === slug);
  return course ? `Package Includes: ${course.packageIncludes.join("; ")}.` : "";
}

/**
 * Answers that must be exact: prices, packages, contact details, delivery, who teaches and
 * certifies, and the courses that are not offered. Returns null for everything else.
 */
export function scriptedAnswer(text: string): ScriptedAnswer | null {
  const t = text.toLowerCase();
  const course = courseMentioned(t);
  const coursePrompt = [leadStarts.course, handoffReply];

  // Other AAPC credentials and GlobalMed's own (hidden) courses are not offered.
  if (/\b(crc|cpma|coc|cic|cpco|cdeo|ccs|cca|rhit|rhia|cma)\b/.test(t)) {
    return {
      intent: "course",
      text: `GlobalMed registers students for three AAPC courses only: CPC®, CPB® and CPC® + CPB®. Other credentials aren't offered through GlobalMed. ${registerLine}`,
      quickReplies: coursePrompt,
    };
  }

  if (
    /\b(in[- ]person|onsite|on-site|on site|classroom|physical class|campus|lahore class|offline class)/.test(
      t,
    )
  ) {
    return {
      intent: "course",
      text: `Training is online only: live, instructor-led online sessions conducted by AAPC certified trainers. There are no in-person or classroom classes. ${registerLine}`,
      quickReplies: coursePrompt,
    };
  }

  if (
    /\b(who (teaches|trains|conducts)|instructor|trainer|faculty|certificate|certification (is )?(issued|awarded|given)|who (issues|awards|gives))/.test(
      t,
    ) &&
    course !== null
  ) {
    return {
      intent: "course",
      text: `GlobalMed doesn't teach or issue certificates. AAPC certified trainers teach AAPC's live online courses, and your certification is awarded by AAPC. As AAPC's Strategic Partner in Pakistan, GlobalMed supports you through enrollment: batch schedules, payment processing, and access to the required books and online learning resources. ${registerLine}`,
      quickReplies: coursePrompt,
    };
  }

  // Installments: GlobalMed facilitates plans; never quote amounts or schedules (docs/09 §3.2a).
  if (/\b(instal+ments?|pay in parts|payment plans?|pay monthly|easy payments?)\b/.test(t)) {
    return {
      intent: "course",
      text: `Yes — GlobalMed can facilitate installment plans when needed. Our team will explain the options for your course. ${registerLine}`,
      quickReplies: coursePrompt,
    };
  }

  const asksPrice =
    /\b(price|prices|cost|costs|fee|fees|how much|charges?|usd|dollars?|pkr|rupees|rs\.?|discount|cheaper)\b/.test(
      t,
    );
  const asksPackage = /\b(package|includes?|included|what do i get|what's in|comes with)\b/.test(t);
  const asksDuration = /\b(how long|duration|weeks?|months?)\b/.test(t);
  if (course && (asksPrice || asksPackage || asksDuration)) {
    const slugs: AapcCourseSlug[] = course === "all" ? ["cpc", "cpb", "cpc-cpb"] : [course];
    const lines = slugs.map((s) => `• ${priceLine(s)}${asksPackage ? ` ${packageLine(s)}` : ""}`);
    return {
      intent: "course",
      text: [
        course === "all" ? "GlobalMed registers students for three AAPC courses:" : null,
        ...lines,
        "All courses are online sessions conducted by AAPC certified trainers; certification is awarded by AAPC.",
        /\b(instal+ments?|pay in parts|monthly)\b/.test(t)
          ? "GlobalMed can facilitate installment plans when needed — our team will explain the options."
          : null,
        registerLine,
      ]
        .filter(Boolean)
        .join("\n"),
      quickReplies: coursePrompt,
    };
  }

  if (
    /\b(upcoming|next|start(ing)?|when does).{0,20}\b(batch|class|course|session)\b|\bbatch (date|start)/.test(
      t,
    )
  ) {
    return {
      intent: "course",
      text: `For the date of the upcoming batch, fees and package inclusions, please contact GlobalMed — our team will confirm the details. ${registerLine}`,
      quickReplies: coursePrompt,
    };
  }

  if (
    /\b(phone|number|call|whatsapp|email|e-mail|contact (details|info)|address|hours|open|timing|reach you)\b/.test(
      t,
    ) &&
    !/\bcall me\b/.test(t)
  ) {
    return {
      intent: "other",
      text: `You can reach GlobalMed by phone ${contactFacts.phone}, WhatsApp ${contactFacts.whatsapp} or email ${contactFacts.email}. We're ${contactFacts.hours.toLowerCase()}.`,
    };
  }

  return null;
}

// ---------- Checking model replies ----------

const forbiddenInReplies: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\bpractice tests?\b|\bpracticode\b|\bcodify\b|denials management guide/i,
    reason: "retired package item",
  },
  {
    pattern: /\b(globalmed|our) (certificate|certification)s?\b(?! (is|are) (not|never))/i,
    reason: "GlobalMed certificate",
  },
  {
    pattern:
      /\b(in[- ]person|onsite|on-site|classroom) (classes|training|sessions|batch)\b(?! (are|is) not)/i,
    reason: "in-person training",
  },
  {
    pattern:
      /\b(corporate training|exam prep(aration)? course|learning platform|certificate verification)\b/i,
    reason: "hidden offering",
  },
];

/** Returns the reasons a model reply must not be shown (empty when it's fine). */
export function replyProblems(reply: string): string[] {
  const problems: string[] = [];
  const allowed = new Set(allowedUsdAmounts());
  for (const match of reply.matchAll(
    /(?:usd|us\$|\$)\s?([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s?(?:usd|dollars)/gi,
  )) {
    const amount = Number((match[1] ?? match[2] ?? "").replace(/,/g, ""));
    if (Number.isFinite(amount) && !allowed.has(amount))
      problems.push(`price ${amount} not in the knowledge base`);
  }
  if (/\b(pkr|rs\.?|rupees)\s?[\d,]+/i.test(reply)) problems.push("price in rupees");
  for (const { pattern, reason } of forbiddenInReplies) {
    if (pattern.test(reply)) problems.push(reason);
  }
  return problems;
}

/** Shown instead of a model reply that failed the checks, or when the model can't answer. */
export const safeFallback = `I'm not able to answer that reliably here. Our team can help: WhatsApp ${contactFacts.whatsapp}, phone ${contactFacts.phone} or email ${contactFacts.email} (${contactFacts.hours.toLowerCase()}).`;

/** Used when no LLM key is configured yet: scripted answers still work. */
export const notConfiguredReply = `I can answer questions about course prices, packages and how to reach us. For anything else, our team will help: WhatsApp ${contactFacts.whatsapp}, phone ${contactFacts.phone} or email ${contactFacts.email}.`;
