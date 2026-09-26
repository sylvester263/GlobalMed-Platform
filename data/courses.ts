/**
 * The AAPC courses offered through GlobalMed (client, 2026-09-26). GlobalMed is AAPC's
 * Strategic Partner in Pakistan: AAPC faculty teach these courses online and AAPC awards the
 * certification. GlobalMed helps students register and supports them through enrollment.
 * Prices and packages confirmed by the client on 2026-09-26.
 *
 * Each course has its own page (/education/<slug>) whose long-form copy lives in
 * content/courses/<slug>.ts. `visible: false` hides a course everywhere without deleting it.
 * GlobalMed's own courses live in content/school.ts and are hidden (config/features.ts).
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
  included: string[];
  /** Price in US dollars. */
  priceUsd: number;
  /** Extra line under the price (the dual course's saving). */
  priceSaving?: string;
  /** Marked "Best value: two certifications". */
  bestValue?: boolean;
  /** Rows of the comparison table on the AAPC Certification page. */
  compare: {
    duration: string;
    membership: string;
    exams: string;
    practiceTests: string;
    internship: boolean;
    codify: boolean;
    denialsGuide: boolean;
    prerequisiteHalfOff: boolean;
  };
};

/** Facts that apply to every AAPC course (shown on each card and course page). */
export const aapcCourseFacts = {
  badge: "AAPC Official Course",
  format: "Instructor-led online course",
  taughtBy: "AAPC faculty",
  awardedBy: "AAPC",
  priceNote:
    "Training is delivered online by AAPC. GlobalMed Transcriptions is AAPC's Strategic Partner in Pakistan.",
  whatsappUrl: "https://wa.me/923004198760",
} as const;

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
      "CPC Certification Exam, along with 3 practice tests",
      "1/2 off Prerequisite course",
    ],
    priceUsd: 1050,
    compare: {
      duration: "16 weeks",
      membership: "1 year",
      exams: "CPC",
      practiceTests: "3",
      internship: true,
      codify: true,
      denialsGuide: false,
      prerequisiteHalfOff: true,
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
      "Enroll in both AAPC preparation courses, CPC® and CPB®, taught live online by AAPC faculty, for USD 1,600. Register in Pakistan with GlobalMed.",
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
    priceUsd: 1600,
    priceSaving: "Save USD 500 compared to taking CPC® and CPB® separately (USD 2,100).",
    bestValue: true,
    compare: {
      duration: "32 weeks",
      membership: "2 years",
      exams: "CPC + CPB",
      practiceTests: "6",
      internship: true,
      codify: true,
      denialsGuide: true,
      prerequisiteHalfOff: true,
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
    duration: "16 weeks",
    included: [
      "16-week online course led by AAPC faculty",
      "One-year AAPC membership and benefits",
      "Denials Management & Appeals Reference Guide",
      "Three practice tests",
      "Certification Exam",
      "1/2 off Prerequisite course",
    ],
    priceUsd: 1050,
    compare: {
      duration: "16 weeks",
      membership: "1 year",
      exams: "CPB",
      practiceTests: "3",
      internship: false,
      codify: false,
      denialsGuide: true,
      prerequisiteHalfOff: true,
    },
  },
];

/** Visible courses in menu order: CPC®, CPB®, then the dual course. */
export function getAapcCourses(): AapcCourse[] {
  const order: AapcCourseSlug[] = ["cpc", "cpb", "cpc-cpb"];
  return order.flatMap((slug) => aapcCourses.filter((c) => c.slug === slug && c.visible));
}

/** Card order on the AAPC Certification page and home: the dual course in the middle. */
export function getAapcCoursesDualCentred(): AapcCourse[] {
  return aapcCourses.filter((c) => c.visible);
}

export function getAapcCourse(slug: string): AapcCourse | undefined {
  return aapcCourses.find((c) => c.slug === slug && c.visible);
}

export function aapcCoursePath(slug: AapcCourseSlug): string {
  return `/education/${slug}`;
}

const usd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "USD 1,050". */
export function formatUsdPrice(amount: number): string {
  return `USD ${usd.format(amount)}`;
}

/** Price for text (FAQs, chatbot, comparison table). */
export function priceText(course: AapcCourse): string {
  return formatUsdPrice(course.priceUsd);
}

/** Registration form course options (lead `interest`). */
export const registrationCourses = ["CPC®", "CPB®", "CPC® + CPB®"] as const;
export type RegistrationCourse = (typeof registrationCourses)[number];

/** The course behind a registration option (for its price in the form). */
export function courseForRegistration(label: string): AapcCourse | undefined {
  return aapcCourses.find((c) => c.registrationLabel === label && c.visible);
}
