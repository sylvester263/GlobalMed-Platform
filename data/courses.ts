/**
 * The AAPC courses offered through GlobalMed (client, 2026-09-26). GlobalMed is AAPC's
 * Strategic Partner in Pakistan: AAPC faculty teach these courses online and AAPC awards the
 * certification. GlobalMed helps students register and supports them through enrollment.
 *
 * Each course has its own page (/education/<slug>) and card. `visible: false` hides a course
 * everywhere without deleting it. GlobalMed's own courses live in content/school.ts and are
 * hidden (config/features.ts).
 */

export type AapcCourseSlug = "cpc" | "cpb" | "cpc-cpb";

export type AapcCourse = {
  slug: AapcCourseSlug;
  visible: boolean;
  /** Full course name. */
  title: string;
  /** Credential mark shown large on cards. */
  credential: string;
  /** Education menu label. */
  navLabel: string;
  /** Value stored with a registration (lead `interest`). */
  registrationLabel: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  duration: string;
  /** Null until the client confirms the list from AAPC; a labelled placeholder shows instead. */
  included: string[] | null;
  learn: string[];
  /** Price as shown, or null until confirmed. */
  price: string | null;
  /** False while the client still has to confirm the price. */
  priceConfirmed: boolean;
  /** Marked "Best value: two certifications". */
  bestValue?: boolean;
  /** Rows of the comparison table on the AAPC Certification page. */
  compare: {
    duration: string;
    membership: string;
    exams: string;
    practiceTests: string;
    internship: string;
    codify: string;
  };
};

const pendingAapc = "[CLIENT TO CONFIRM from AAPC]";

/** Facts that apply to every AAPC course (shown on each card and course page). */
export const aapcCourseFacts = {
  badge: "AAPC Official Course",
  format: "Instructor-led online course",
  taughtBy: "AAPC faculty (AAPC-certified instructors)",
  awardedBy: "AAPC",
  audience: [
    "Healthcare professionals and billers",
    "Medical and allied-health graduates",
    "Career-changers starting in medical coding or billing",
    "Working coders and billers who want a recognised credential",
  ],
  priceNote:
    "Training is delivered online by AAPC. GlobalMed Transcriptions is AAPC's Strategic Partner in Pakistan.",
  whatsappUrl: "https://wa.me/923004198760",
} as const;

const cpcLearn = [
  "Medical terminology and anatomy for coders",
  "ICD-10-CM diagnosis coding",
  "CPT® procedure coding",
  "HCPCS Level II",
  "Modifiers",
  "Official coding guidelines and compliance",
];

const cpbLearn = [
  "Turning assigned codes into accurate claims",
  "Working with third-party payers so claims are processed correctly",
  "Payer rules",
  "Denials and appeals",
  "Accounts receivable follow-up",
  "Patient billing and collections",
  "Billing compliance",
];

export const aapcCourses: AapcCourse[] = [
  {
    slug: "cpc",
    visible: true,
    title: "Certified Professional Coder (CPC)®",
    credential: "CPC®",
    navLabel: "CPC® — Certified Professional Coder",
    registrationLabel: "CPC®",
    metaTitle: "CPC® Course Online in Pakistan | AAPC",
    metaDescription:
      "Prepare for AAPC's CPC® exam through AAPC's live, instructor-led online course. Register in Pakistan with GlobalMed Transcriptions, AAPC's Strategic Partner.",
    summary:
      "Prepare for the CPC® exam, AAPC's credential for physician and outpatient medical coding, through AAPC's live, instructor-led online course.",
    duration:
      "16 weeks, live online sessions of 1.5 hours per week, plus optional one-on-one virtual time with your instructor",
    included: [
      "16-week online training led by world-class AAPC faculty",
      "One-year AAPC membership and networking benefits",
      "Virtual internship through Practicode",
      "Codify by AAPC code look-up assistance app subscription",
      "CPC certification exam, along with 3 practice tests",
      "1/2 off Prerequisite course",
    ],
    learn: cpcLearn,
    price: "USD 1,050",
    priceConfirmed: false,
    compare: {
      duration: "16 weeks",
      membership: "1 year",
      exams: "CPC exam",
      practiceTests: "3",
      internship: "Practicode",
      codify: "Included",
    },
  },
  {
    slug: "cpc-cpb",
    visible: true,
    title:
      "Certified Professional Coder (CPC)® + Certified Professional Biller (CPB)® dual certifications",
    credential: "CPC® + CPB®",
    navLabel: "CPC® + CPB® Dual Certifications",
    registrationLabel: "CPC® + CPB®",
    metaTitle: "CPC® + CPB® Dual Certification | AAPC",
    metaDescription:
      "Enroll in both AAPC preparation courses, CPC® and CPB®, taught live online by AAPC faculty. Register in Pakistan with GlobalMed, AAPC's Strategic Partner.",
    summary:
      "Enroll in both AAPC preparation courses (CPC® and CPB®) for the widest foundation for a career in medical billing and coding.",
    duration: "32 weeks (16 weeks CPC + 16 weeks CPB)",
    included: [
      "Instructor-led 32-week online courses led by world-class AAPC faculty",
      "Two-year AAPC membership and networking benefits",
      "Virtual internship through Practicode",
      "CPB Denials Management and Appeals Reference Guide",
      "Codify by AAPC code look-up assistance app subscription",
      "CPC & CPB certification exams, along with 6 practice tests",
      "1/2 off Prerequisite course",
    ],
    learn: [...cpcLearn, ...cpbLearn],
    price: null,
    priceConfirmed: false,
    bestValue: true,
    compare: {
      duration: "32 weeks",
      membership: "2 years",
      exams: "CPC and CPB exams",
      practiceTests: "6",
      internship: "Practicode",
      codify: "Included",
    },
  },
  {
    slug: "cpb",
    visible: true,
    title: "Certified Professional Biller (CPB)®",
    credential: "CPB®",
    navLabel: "CPB® — Certified Professional Biller",
    registrationLabel: "CPB®",
    metaTitle: "CPB® Course Online in Pakistan | AAPC",
    metaDescription:
      "Prepare for AAPC's CPB® exam through AAPC's live, instructor-led online course. Register in Pakistan with GlobalMed Transcriptions, AAPC's Strategic Partner.",
    summary:
      "Prepare for the CPB® exam, AAPC's credential for medical billing, through AAPC's live, instructor-led online course.",
    duration: `16 weeks, live online sessions ${pendingAapc}`,
    // [CLIENT TO CONFIRM from AAPC CPB page] Never invent these items.
    included: null,
    learn: cpbLearn,
    price: "USD 1,050",
    priceConfirmed: false,
    compare: {
      duration: "16 weeks",
      membership: pendingAapc,
      exams: "CPB exam",
      practiceTests: pendingAapc,
      internship: pendingAapc,
      codify: pendingAapc,
    },
  },
];

/** Visible courses in menu order: CPC®, CPB®, then the dual course. */
export function getAapcCourses(): AapcCourse[] {
  const order: AapcCourseSlug[] = ["cpc", "cpb", "cpc-cpb"];
  return order.flatMap((slug) => aapcCourses.filter((c) => c.slug === slug && c.visible));
}

/** Card order on the AAPC Certification page: the dual course in the middle. */
export function getAapcCoursesDualCentred(): AapcCourse[] {
  return aapcCourses.filter((c) => c.visible);
}

export function getAapcCourse(slug: string): AapcCourse | undefined {
  return aapcCourses.find((c) => c.slug === slug && c.visible);
}

export function aapcCoursePath(slug: AapcCourseSlug): string {
  return `/education/${slug}`;
}

/** "USD 1,050" or the pending marker, for text (FAQs, chatbot, comparison table). */
export function priceText(course: AapcCourse): string {
  if (!course.price) return "[CLIENT TO CONFIRM]";
  return course.priceConfirmed ? course.price : `${course.price} [CLIENT TO CONFIRM]`;
}

/** Registration form course options (lead `interest`). */
export const registrationCourses = ["CPC®", "CPB®", "CPC® + CPB®"] as const;
export type RegistrationCourse = (typeof registrationCourses)[number];
