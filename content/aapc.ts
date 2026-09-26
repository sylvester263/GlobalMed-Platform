import { aapcCourses, getAapcCourses, priceText } from "@/data/courses";
import type { Faq } from "@/lib/content/schema";

// "AAPC Certification in Pakistan" page (/education/aapc-certification-pakistan), the
// "Get Trained by AAPC Instructors" band and the footer pricing card. Business model
// (client, 2026-09-26): GlobalMed is AAPC's Strategic Partner in Pakistan; AAPC faculty teach
// AAPC's online courses and AAPC awards the certification. Original copy, nothing from AAPC's site.

/** Approved wording (client, 2026-09-26). Use these lines verbatim across the site. */
export const approvedWording = {
  partnership:
    "GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding.",
  training:
    "Get trained by AAPC instructors: live, instructor-led online courses led by AAPC faculty.",
  certification: "Your certification is awarded by AAPC.",
  role: "GlobalMed Transcriptions helps students in Pakistan register for AAPC's official online courses and supports them through enrollment.",
} as const;

/** Shown on the AAPC page and in the footer. */
export const certificationPrice = {
  label: "CPC® and CPB® Certification",
  amount: "USD 1,050",
  note: "[CLIENT TO CONFIRM whether per certification or combined]",
};

export const aapcHero = {
  title: "AAPC Certification in Pakistan",
  intro: `${approvedWording.partnership} ${approvedWording.training} ${approvedWording.certification}`,
};

export const instructorsBand = {
  title: "Get Trained by AAPC Instructors",
  body: approvedWording.training,
  points: [
    "Live online classes with AAPC faculty",
    "Official AAPC exams and practice tests",
    "AAPC membership included",
  ],
  cta: "View CPC® & CPB® Training",
  /** [CLIENT TO CONFIRM] Optional instructor photos, in public/images/instructors/. */
  photos: [
    { src: "/images/instructors/instructor-1.jpg", placeholder: "Instructor photo 1" },
    { src: "/images/instructors/instructor-2.jpg", placeholder: "Instructor photo 2" },
    { src: "/images/instructors/instructor-3.jpg", placeholder: "Instructor photo 3" },
  ],
};

const examPending = "[CLIENT TO CONFIRM from AAPC]";

/**
 * The earlier CPC®/CPB® panels, superseded by the three AAPC course cards (data/courses.ts)
 * on 2026-09-26. Not shown; kept so nothing is deleted.
 */
export const certifications = [
  {
    id: "cpc",
    credential: "CPC®",
    name: "Certified Professional Coder",
    courseSlug: "cpc-certified-professional-coder",
    overview:
      "For people who turn medical records into diagnosis and procedure codes. CPC® is the credential most US employers ask for in outpatient and physician-office coding.",
    audience: [
      "Healthcare professionals and billers",
      "Medical graduates",
      "Coding beginners",
      "Working coders seeking certification",
    ],
    topics: [
      "Medical terminology & anatomy",
      "ICD-10-CM diagnosis coding",
      "CPT® procedure coding: E/M, surgery, anesthesia, radiology, pathology and medicine",
      "HCPCS Level II",
      "Modifiers",
      "Coding guidelines and compliance",
    ],
  },
  {
    id: "cpb",
    credential: "CPB®",
    name: "Certified Professional Biller",
    courseSlug: "cpb-certified-professional-biller",
    overview:
      "For people who get claims paid: from building and submitting the claim to working denials and collecting the balance.",
    audience: [
      "Healthcare professionals and billers",
      "Billing staff",
      "AR and front-office teams",
      "Career-changers",
    ],
    topics: [
      "Claim creation and submission",
      "Payer rules: Medicare, Medicaid and commercial",
      "Denials and appeals",
      "AR follow-up",
      "Patient billing and collections",
      "Billing compliance",
    ],
  },
] as const;

/**
 * Exam facts are AAPC's to state; never fill these in without the client's confirmation.
 * Not shown since the 2026-09-26 page restructure; show them again once AAPC confirms.
 */
export const examDetails = [
  { label: "Number of questions", value: examPending },
  { label: "Duration", value: examPending },
  { label: "Format", value: examPending },
  { label: "Passing score", value: examPending },
];

/** "How it works", drawn along the claim line (AAPC page and home). */
export const aapcSteps = [
  {
    stage: "Register with GlobalMed",
    caption:
      "Send the registration form or message us on WhatsApp. We help you choose CPC®, CPB® or both.",
    stat: "Registration support",
  },
  {
    stage: "Get enrolled in AAPC's online course",
    caption: "We support you through enrollment in AAPC's official, instructor-led online course.",
    stat: "AAPC official course",
  },
  {
    stage: "Learn live online with AAPC faculty",
    caption: "Live online sessions led by AAPC faculty (AAPC-certified instructors).",
    stat: "Instructor-led online",
  },
  {
    stage: "Take the AAPC certification exam",
    caption: "Your course includes AAPC's certification exam and practice tests.",
    stat: "Official AAPC exam",
  },
  {
    stage: "Earn your AAPC credential",
    caption: "Pass the exam and AAPC awards your CPC® or CPB® credential.",
    stat: "Awarded by AAPC",
  },
];

function costAnswer(): string {
  const lines = getAapcCourses().map((course) => `${course.credential}: ${priceText(course)}`);
  return `Course fees: ${lines.join("; ")}. Fees are paid for AAPC's official course; our team confirms the current fee when you register.`;
}

const dual = aapcCourses.find((c) => c.slug === "cpc-cpb");

/**
 * Training FAQs (client, 2026-09-26): used on the home page and the AAPC Certification page.
 * Costs come from data/courses.ts.
 */
export const aapcFaqs: Faq[] = [
  {
    question: "What are CPC® and CPB®?",
    answer:
      "CPC® (Certified Professional Coder) and CPB® (Certified Professional Biller) are professional credentials awarded by AAPC. CPC® covers physician and outpatient medical coding; CPB® covers medical billing.",
  },
  {
    question: "Who teaches the courses?",
    answer:
      "AAPC faculty (AAPC-certified instructors) teach every course, live and online. GlobalMed Transcriptions does not run the classes.",
  },
  {
    question: "Is the training online or in person?",
    answer:
      "Online only. The courses are AAPC's live, instructor-led online courses, so you can join from anywhere in Pakistan.",
  },
  {
    question: "Who awards the certification?",
    answer: `AAPC. ${approvedWording.certification} You earn the CPC® or CPB® credential by passing AAPC's certification exam.`,
  },
  {
    question: "What does GlobalMed do?",
    answer: `${approvedWording.partnership} ${approvedWording.role}`,
  },
  {
    question: "Which course should I choose: CPC®, CPB® or both?",
    answer: `Choose CPC® if you want to assign diagnosis and procedure codes from medical records. Choose CPB® if you prefer claims, payers, denials and payments. Choose CPC® + CPB®${dual ? ` (${dual.duration})` : ""} for the widest foundation and two certifications.`,
  },
  {
    question: "How much does it cost?",
    answer: costAnswer(),
  },
  {
    question: "How do I register?",
    answer:
      "Send the Register Now form, or message us on WhatsApp at +92 300 419 8760. Our team will contact you to complete your AAPC enrollment.",
  },
];

/** The FAQs shown on each AAPC course page: who teaches, format, who certifies, how to register. */
export const courseFaqs: Faq[] = [1, 2, 3, 7].flatMap((i) => aapcFaqs[i] ?? []);
