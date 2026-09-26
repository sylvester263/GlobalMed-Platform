import { cpbContent } from "./cpb";
import { cpcContent } from "./cpc";
import type { CoursePageContent } from "./types";

/**
 * /education/cpc-cpb — built from the CPC® and CPB® copy with no new claims (client
 * instructions, 2026-09-26).
 */
function firstSentence(text: string): string {
  const match = /^(.+?\.)(\s|$)/.exec(text);
  return match?.[1] ?? text;
}

const cpcClosing = cpcContent.closing.paragraphs[0] ?? "";
const cpbClosing = cpbContent.closing.paragraphs[0] ?? "";

export const cpcCpbContent: CoursePageContent = {
  intro: {
    heading: "What is the CPC® + CPB® dual certifications course?",
    paragraphs: [
      "Earn two AAPC credentials in one instructor-led online program. The CPC® + CPB® dual certifications course enrolls you in both AAPC preparation courses, 16 weeks for CPC® and 16 weeks for CPB®, giving you the widest foundation for a career in medical billing and coding.",
    ],
    columns: [
      { heading: cpcContent.intro.heading, body: cpcContent.intro.paragraphs[0] ?? "" },
      { heading: cpbContent.intro.heading, body: cpbContent.intro.paragraphs[0] ?? "" },
    ],
  },
  why: {
    heading: "Why earn both certifications?",
    groups: [
      { title: "Coding (CPC®)", items: cpcContent.why.groups.flatMap((g) => g.items) },
      { title: "Billing (CPB®)", items: cpbContent.why.groups.flatMap((g) => g.items) },
    ],
  },
  covers: {
    heading: "What do the CPC® and CPB® cover?",
    tabs: [
      { label: "CPC® — Medical coding", groups: cpcContent.covers.groups ?? [] },
      { label: "CPB® — Medical billing", groups: cpbContent.covers.groups ?? [] },
    ],
  },
  who: {
    heading: "Who should earn the CPC® and CPB®?",
    items: [
      "Healthcare professionals and billers",
      "Anyone who wants both coding and billing credentials for roles across the full revenue cycle",
      "Career-changers starting in healthcare administration",
      "Working coders or billers who want to add the second credential",
    ],
  },
  // The CPB® requirements cover both credentials.
  experience: cpbContent.experience,
  maintaining: {
    heading: "Maintaining your certifications",
    paragraphs: [
      "To maintain your credentials, you must maintain your AAPC annual membership and earn continuing education units (CEUs) as required by AAPC for each credential.",
    ],
  },
  closing: {
    heading: "Expand your opportunities with the CPC® and CPB® certifications.",
    paragraphs: [firstSentence(cpcClosing), firstSentence(cpbClosing)],
  },
};
