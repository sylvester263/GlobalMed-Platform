import type { Faq } from "@/lib/content/schema";

// [CLIENT TO CONFIRM] Home page copy. The home page leads with CPC® and CPB® training as
// AAPC's strategic partner in Pakistan; US billing services follow further down.
// AAPC partnership wording needs AAPC's written permission (pm/CLIENT_INPUTS_NEEDED.md).

export const cpcCourseSlug = "cpc-certified-professional-coder";
export const cpbCourseSlug = "cpb-certified-professional-biller";

/**
 * Home hero slider (client review 2026-09-25). Images go in public/images/slider/ at
 * 1920 × 640 or larger; a labelled placeholder shows until each one is added.
 */
export const heroSlides = [
  {
    id: "company",
    headline: "The Leading Transcription and Billing Company in Pakistan",
    body: "Serving hospitals and clinics in the USA, Canada, UK, Australia and Saudi Arabia since 2007.",
    image: "/images/slider/slide-1.jpg",
    imageAlt: "",
    placeholder: "Slide 1 image",
    actions: [
      { label: "Our Services", href: "/services" },
      { label: "Request a Free Quote", href: "/contact" },
    ],
  },
  {
    id: "billing-coding",
    headline: "Medical Billing and Coding",
    body: "Accurate coding and clean claims that get providers paid faster.",
    image: "/images/slider/slide-2.jpg",
    imageAlt: "",
    placeholder: "Slide 2 image",
    actions: [
      { label: "Explore Billing & Coding", href: "/services" },
      { label: "Get Trained in Billing & Coding", href: "/education/aapc-certification-pakistan" },
    ],
  },
  {
    id: "aapc",
    headline: "AAPC Certification with GlobalMed Transcriptions",
    body: "GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding.",
    image: "/images/slider/slide-3.jpg",
    imageAlt: "",
    placeholder: "Slide 3 image",
    actions: [
      { label: "AAPC Certification in Pakistan", href: "/education/aapc-certification-pakistan" },
      { label: "Talk to an Advisor on WhatsApp", href: "https://wa.me/923004198760" },
    ],
  },
];

export const hero = {
  badge: "Strategic Partner of AAPC in Pakistan",
  headline: "AAPC-Certified Medical Coding & Billing Training in Pakistan",
  intro:
    "Prepare for the CPC® and CPB® credentials with GlobalMed Transcriptions, AAPC's strategic training partner, and start a global career in healthcare revenue cycle.",
};

/**
 * MG-4 count-up proof points. Every figure is a placeholder until the client confirms it.
 * The statement and stats are not shown: the home strip now uses the approved partnership
 * wording (content/aapc.ts). Hidden at client request — GlobalMed education plans are future scope.
 */
export const partnership = {
  statement:
    "GlobalMed Transcriptions × AAPC: bringing internationally recognised medical coding and billing certification training to Pakistan.",
  confirmed: false,
  stats: [
    { label: "Students trained", value: 1500, suffix: "+" },
    { label: "Training batches completed", value: 40, suffix: "+" },
    { label: "Certified instructors", value: 8, suffix: "" },
    { label: "Years in US healthcare revenue cycle", value: 12, suffix: "" },
  ],
};

/**
 * GlobalMed's earlier CPC®/CPB® program cards (onsite + online). Replaced on the home page by
 * the three AAPC course cards (data/courses.ts); kept for the hidden EducationalOrganization
 * JSON-LD. Hidden at client request — GlobalMed education plans are future scope.
 */
export const programs = [
  {
    slug: cpcCourseSlug,
    credential: "CPC®",
    name: "Certified Professional Coder",
    audience: [
      "Healthcare professionals and billers",
      "Graduates, nursing and pharmacy professionals, and billers who want to become medical coders for US healthcare.",
    ],
    topics: [
      "ICD-10-CM diagnosis coding",
      "CPT® procedure coding",
      "HCPCS Level II",
      "Modifiers",
      "Medical terminology & anatomy",
      "Coding guidelines & compliance",
    ],
    format: "Live classes (onsite in Lahore or online), recorded lessons and timed mock exams",
    duration: "[CLIENT TO CONFIRM]",
    cta: "View CPC Course",
  },
  {
    slug: cpbCourseSlug,
    credential: "CPB®",
    name: "Certified Professional Biller",
    audience: [
      "Healthcare professionals and billers",
      "Career-starters, front-desk and AR staff, and anyone who wants to work in US medical billing.",
    ],
    topics: [
      "Claims submission",
      "Payer rules",
      "Denials & appeals",
      "AR follow-up",
      "Patient billing",
      "Compliance",
    ],
    format: "Live classes (onsite in Lahore or online), recorded lessons and timed mock exams",
    duration: "[CLIENT TO CONFIRM]",
    cta: "View CPB Course",
  },
] as const;

/** "Why register through GlobalMed" (client, 2026-09-26: AAPC teaches; GlobalMed registers). */
export const whyUs = [
  {
    title: "Taught by AAPC faculty",
    body: "Live, instructor-led online courses led by AAPC faculty (AAPC-certified instructors).",
  },
  {
    title: "Official AAPC exams and practice tests",
    body: "Your course includes AAPC's certification exam and practice tests. Your certification is awarded by AAPC.",
  },
  {
    title: "AAPC membership included",
    body: "One year of AAPC membership with CPC®, or two years with CPC® + CPB®, with AAPC's networking benefits.",
  },
  {
    title: "Registration support in Pakistan",
    body: "GlobalMed Transcriptions helps students in Pakistan register for AAPC's official online courses and supports them through enrollment.",
  },
];

/**
 * GlobalMed's own route to certification (onsite/online classes, mock exams, career support).
 * Not shown: the home page uses AAPC's "How it works" steps (content/aapc.ts). Hidden at client request — GlobalMed education plans are future scope.
 */
export const certificationPath = [
  {
    stage: "Enroll",
    caption: "Choose CPC® or CPB® training, onsite in Lahore or online.",
    stat: "Free career counselling first",
  },
  {
    stage: "Learn",
    caption: "Live classes with an instructor, plus recorded lessons you can rewatch.",
    stat: "Live + recorded",
  },
  {
    stage: "Practice & mock exams",
    caption: "Practice sets after every module and timed mock exams in exam format.",
    stat: "Timed, exam-style",
  },
  {
    stage: "Sit the AAPC exam",
    caption: "You register for and sit the exam with AAPC when you're ready.",
    stat: "Exam logistics [CLIENT TO CONFIRM]",
  },
  {
    stage: "Get certified",
    caption: "Pass the exam to earn your AAPC credential.",
    stat: "CPC® or CPB®",
  },
  {
    stage: "Career support",
    caption: "Interview preparation and introductions to employers.",
    stat: "[CLIENT TO CONFIRM]",
  },
];

/**
 * [CLIENT TO CONFIRM] Next CPC® and CPB® batches: dates, modes and seats.
 * Shown only while `features.batches` is on. Hidden at client request — GlobalMed education plans are future scope.
 */
export const upcomingBatches = [
  {
    credential: "CPC®",
    title: "CPC® training batch",
    starts: "[CLIENT TO CONFIRM]",
    mode: "Onsite Lahore / Online",
    seatsLeft: "[CLIENT TO CONFIRM]",
  },
  {
    credential: "CPB®",
    title: "CPB® training batch",
    starts: "[CLIENT TO CONFIRM]",
    mode: "Onsite Lahore / Online",
    seatsLeft: "[CLIENT TO CONFIRM]",
  },
];

/** Services for US practices, shown lower on the page. */
export const serviceSlugs = [
  "medical-billing",
  "medical-coding",
  "medical-transcription",
  "ai-clinical-documentation",
] as const;

/**
 * GlobalMed's earlier training FAQs (onsite classes, GlobalMed certificates). Not shown: the
 * home page uses the AAPC FAQs (content/aapc.ts). Hidden at client request — GlobalMed education plans are future scope.
 */
export const faqs: Faq[] = [
  {
    question: "What are CPC® and CPB®?",
    answer:
      "CPC® (Certified Professional Coder) and CPB® (Certified Professional Biller) are professional credentials awarded by AAPC. CPC® covers medical coding; CPB® covers medical billing and the revenue cycle.",
  },
  {
    question: "Who should take CPC® vs CPB®?",
    answer:
      "Choose CPC® if you want to assign diagnosis and procedure codes from medical documentation. Choose CPB® if you prefer claims, payer follow-up, denials and payments. Our advisors can help you decide in a free counselling session.",
  },
  {
    question: "Do I need a medical background?",
    answer:
      "No. Both programs start with the fundamentals, including medical terminology and anatomy for coders. A background in life sciences, nursing or pharmacy helps but isn't required.",
  },
  {
    question: "Is the course online or in Lahore?",
    answer:
      "Both. Batches run onsite in Lahore and live online, and every class is recorded so you can rewatch it. Batch dates and modes are [CLIENT TO CONFIRM].",
  },
  {
    question: "How does exam preparation work?",
    answer:
      "Each module ends with practice questions, and you sit timed mock exams in exam format with a review of every answer. Instructors help you focus on your weakest sections before exam day.",
  },
  {
    question: "Will I get a certificate from GlobalMed?",
    answer:
      "Yes. You receive a GlobalMed certificate of completion that employers can verify online. The CPC® or CPB® credential itself is awarded by AAPC when you pass their exam.",
  },
  {
    question: "How do I register for the AAPC exam?",
    answer:
      "The exam is registered for and taken with AAPC. How GlobalMed supports registration, exam fees and scheduling is [CLIENT TO CONFIRM].",
  },
  {
    question: "What are the fees, and can I pay in installments?",
    answer:
      "Course fees and installment options are [CLIENT TO CONFIRM]. Book a free counselling session and an advisor will share the current fees for your batch.",
  },
];

/** [CLIENT TO CONFIRM] Consent-approved testimonials. Each group stays hidden while empty. */
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  audience: "practice" | "student";
}[] = [];
