import type { Faq } from "@/lib/content/schema";

// [CLIENT TO CONFIRM] "AAPC Certification in Pakistan" page (/education/aapc-certification-pakistan),
// the "Get Trained by AAPC Instructors" band and the footer pricing card. Original copy:
// structure follows how certifications are usually presented (overview → who it's for →
// what you'll learn → exam → how to start); nothing is taken from AAPC's site.

/** Shown on the AAPC page and in the footer. */
export const certificationPrice = {
  label: "CPC® and CPB® Certification",
  amount: "USD 1,050",
  note: "[CLIENT TO CONFIRM whether per certification or combined]",
};

export const aapcHero = {
  title: "AAPC Certification in Pakistan",
  intro:
    "GlobalMed Transcriptions is AAPC's strategic partner in Pakistan for medical billing and coding. Your certification is awarded by AAPC; we train and prepare you.",
};

export const instructorsBand = {
  title: "Get Trained by AAPC Instructors",
  body: "Learn medical coding and billing from AAPC instructors through GlobalMed Transcriptions, AAPC's strategic partner in Pakistan.",
  points: ["Live & recorded classes", "Exam-focused preparation", "Career guidance"],
  cta: "View CPC® & CPB® Training",
  /** [CLIENT TO CONFIRM] Optional instructor photos, in public/images/instructors/. */
  photos: [
    { src: "/images/instructors/instructor-1.jpg", placeholder: "Instructor photo 1" },
    { src: "/images/instructors/instructor-2.jpg", placeholder: "Instructor photo 2" },
    { src: "/images/instructors/instructor-3.jpg", placeholder: "Instructor photo 3" },
  ],
};

const examPending = "[CLIENT TO CONFIRM from AAPC]";

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

/** Exam facts are AAPC's to state; never fill these in without the client's confirmation. */
export const examDetails = [
  { label: "Number of questions", value: examPending },
  { label: "Duration", value: examPending },
  { label: "Format", value: examPending },
  { label: "Passing score", value: examPending },
];

/** Drawn along the claim line. */
export const aapcSteps = [
  {
    stage: "Enroll",
    caption: "Choose CPC® or CPB® training and reserve your seat in the next batch.",
    stat: "Onsite in Lahore or online",
  },
  {
    stage: "Train with AAPC Instructors",
    caption: "Live classes with AAPC instructors, plus recordings you can rewatch.",
    stat: "Live + recorded",
  },
  {
    stage: "Practice & Mock Exams",
    caption: "Practice sets after every module and timed mock exams in exam format.",
    stat: "Exam-focused",
  },
  {
    stage: "Take the AAPC Exam",
    caption: "You sit the certification exam with AAPC when you're ready.",
    stat: "Exam logistics [CLIENT TO CONFIRM]",
  },
  {
    stage: "Earn Your AAPC Certification",
    caption: "Pass the exam and AAPC awards your CPC® or CPB® credential.",
    stat: "Awarded by AAPC",
  },
];

export const aapcFaqs: Faq[] = [
  {
    question: "Who awards the CPC® and CPB® certifications?",
    answer:
      "AAPC awards both credentials when you pass its exam. GlobalMed Transcriptions, as AAPC's strategic partner in Pakistan, trains and prepares you for that exam.",
  },
  {
    question: "Do I need a medical background?",
    answer:
      "No. Healthcare professionals and billers progress fastest, but both programs start from the fundamentals, and beginners are welcome.",
  },
  {
    question: "Is training onsite or online?",
    answer:
      "Both. Classes run onsite in Lahore and live online, and recordings let you rewatch any class. Batch dates are [CLIENT TO CONFIRM].",
  },
  {
    question: "What does the USD 1,050 cover?",
    answer:
      "The CPC® and CPB® certification fee is USD 1,050. Whether that is per certification or combined, and what it includes, is [CLIENT TO CONFIRM].",
  },
  {
    question: "How long is the exam and what score do I need?",
    answer:
      "Exam length, format and passing score are set by AAPC and are [CLIENT TO CONFIRM from AAPC]. Your instructors cover them in the exam-preparation module.",
  },
  {
    question: "How do I reserve a seat?",
    answer:
      "Send the form on this page or message us on WhatsApp at +92 300 419 8760, and an advisor will confirm the next batch and fees.",
  },
];
