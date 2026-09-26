import {
  courseSchema,
  instructorSchema,
  pathwaySchema,
  type Course,
  type Instructor,
  type Pathway,
} from "@/lib/content/schema";

// [CLIENT TO CONFIRM] Course list, outlines, durations, prices (USD + PKR), access periods and
// instructors (pm/CLIENT_INPUTS_NEEDED.md). Catalog moves to the courses table in Phase 4.

export const instructors: Instructor[] = [
  {
    id: "lead-coding-instructor",
    name: "Lead Coding Instructor",
    title: "CPC, 10+ years in multispecialty coding",
    bio: "Codes for US practices every week and teaches from real (de-identified) scenarios. [CLIENT TO CONFIRM name and bio]",
    initials: "CI",
  },
  {
    id: "lead-billing-instructor",
    name: "Lead Billing Instructor",
    title: "Revenue cycle manager",
    bio: "Runs billing teams for US clients and teaches the workflow employers expect from day one. [CLIENT TO CONFIRM name and bio]",
    initials: "BI",
  },
].map((i) => instructorSchema.parse(i));

const raw: Course[] = [
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "medical-billing-essentials",
    title: "Medical Billing Essentials",
    metaTitle: "Medical Billing Course Online",
    metaDescription:
      "Learn US medical billing from claim creation to payment posting. Video lessons you can rewatch, practice exercises and a verifiable certificate.",
    summary:
      "The US revenue cycle from registration to payment, with the claim forms and workflows employers use.",
    description:
      "A beginner course that walks through the US revenue cycle the way a billing team works it: eligibility, claim creation, submission, payment posting, denials and AR follow-up. Every module ends with a practice exercise based on de-identified scenarios.",
    level: "beginner",
    category: "billing",
    hours: 24,
    lessonCount: 42,
    mockExams: 1,
    priceUsd: 199,
    pricePkr: 30000,
    accessMonths: 12,
    outcomes: [
      "Explain each step of the US revenue cycle",
      "Complete and correct a CMS-1500 claim",
      "Verify eligibility and benefits",
      "Post payments from an ERA and read an EOB",
      "Work denials and prioritise AR by age and value",
      "Use practice management software the way billing teams do",
    ],
    requirements: [
      "Comfortable reading English",
      "A computer with internet access",
      "No prior healthcare experience needed",
    ],
    audience: [
      "Healthcare professionals and billers",
      "Career-changers starting in healthcare",
      "Front-desk staff moving into billing",
      "Graduates looking for remote work with US practices",
    ],
    curriculum: [
      {
        title: "How a claim gets paid",
        lessons: [
          { title: "The revenue cycle in 10 minutes", minutes: 10, preview: true },
          { title: "Payers, plans and eligibility", minutes: 16, preview: false },
          { title: "Anatomy of a CMS-1500", minutes: 18, preview: false },
        ],
      },
      {
        title: "Submitting clean claims",
        lessons: [
          { title: "Clearinghouses and rejections", minutes: 14, preview: false },
          { title: "Scrubbing a claim before it goes out", minutes: 20, preview: false },
          { title: "Practice: fix five rejected claims", minutes: 30, preview: false },
        ],
      },
      {
        title: "Payments, denials and AR",
        lessons: [
          { title: "Reading an EOB", minutes: 15, preview: true },
          { title: "Posting an ERA", minutes: 18, preview: false },
          { title: "Working denials by reason code", minutes: 22, preview: false },
          { title: "Final assessment", minutes: 45, preview: false },
        ],
      },
    ],
    instructor: "lead-billing-instructor",
    faqs: [
      {
        question: "Do I need a medical background?",
        answer:
          "No. The course starts from zero and explains every term the first time it appears.",
      },
      {
        question: "Is this course enough to get a job?",
        answer:
          "It teaches the workflow employers test for in interviews. Most students pair it with Medical Coding Foundations for broader job options.",
      },
    ],
    featured: true,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "medical-coding-foundations",
    title: "Medical Coding Foundations",
    metaTitle: "Medical Coding Course: ICD-10-CM and CPT",
    metaDescription:
      "Learn ICD-10-CM, CPT and HCPCS coding from certified coders, with practice sets, timed mock exams and a verifiable certificate.",
    summary: "ICD-10-CM, CPT and HCPCS from the ground up, with practice sets after every module.",
    description:
      "The core coding course: how the code sets are organised, how to read the guidelines, and how to code real-world encounters accurately. Includes anatomy and terminology refreshers and three timed mock exams.",
    level: "beginner",
    category: "coding",
    hours: 32,
    lessonCount: 64,
    mockExams: 3,
    priceUsd: 299,
    pricePkr: 45000,
    accessMonths: 12,
    outcomes: [
      "Navigate ICD-10-CM and apply the Official Guidelines",
      "Code E/M, surgery, radiology and medicine services with CPT",
      "Use HCPCS Level II codes for supplies and drugs",
      "Apply modifiers such as 25, 59 and laterality correctly",
      "Read documentation and code only what it supports",
      "Sit timed mock exams in a certification-style format",
    ],
    requirements: [
      "Comfortable reading English",
      "Current-year code books or encoder access recommended",
      "No prior coding experience needed",
    ],
    audience: [
      "Healthcare professionals and billers",
      "Beginners aiming for a coding career",
      "Billers who want to understand coding",
      "Nursing and pharmacy graduates changing careers",
    ],
    curriculum: [
      {
        title: "Terminology and anatomy for coders",
        lessons: [
          { title: "Word parts that unlock medical terms", minutes: 14, preview: true },
          { title: "Body systems at a glance", minutes: 22, preview: false },
          { title: "Practice: 30 terms in context", minutes: 20, preview: false },
        ],
      },
      {
        title: "ICD-10-CM",
        lessons: [
          { title: "Code structure and conventions", minutes: 18, preview: true },
          { title: "Chapter-specific guidelines", minutes: 26, preview: false },
          { title: "Practice set: 25 diagnoses", minutes: 30, preview: false },
        ],
      },
      {
        title: "CPT and HCPCS",
        lessons: [
          { title: "E/M levels by decision making and time", minutes: 24, preview: false },
          { title: "Surgery and the global package", minutes: 20, preview: false },
          { title: "Modifiers 25, 59 and friends", minutes: 16, preview: false },
          { title: "Mock exam 1 (timed)", minutes: 60, preview: false },
        ],
      },
    ],
    instructor: "lead-coding-instructor",
    faqs: [
      {
        question: "Which code books do I need?",
        answer:
          "Current-year ICD-10-CM, CPT and HCPCS books are recommended. Lessons show exactly where to look, and we list low-cost options in the first module.",
      },
      {
        question: "Does this prepare me for the CPC exam?",
        answer:
          "It builds the foundation. For exam readiness, continue with CPC Exam Preparation, which adds timed full-length mock exams and exam strategy.",
      },
    ],
    featured: true,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "cpc-exam-preparation",
    title: "CPC Exam Preparation",
    metaTitle: "CPC Exam Preparation Course",
    metaDescription:
      "Prepare for the CPC exam with timed full-length mock exams, section-by-section review and exam strategy from certified coders.",
    summary: "Timed full-length mock exams, section-by-section review and exam strategy.",
    description:
      "An exam-focused course for students who already know the basics. You'll practise under real timing, review every answer with an explanation, and learn how to use your code books quickly under pressure. GlobalMed prepares you for the exam; the certification exam itself is run by the certifying body.",
    level: "advanced",
    category: "exam-prep",
    hours: 28,
    lessonCount: 38,
    mockExams: 4,
    priceUsd: 349,
    pricePkr: 52000,
    accessMonths: 6,
    outcomes: [
      "Complete full-length mock exams within the time limit",
      "Find codes quickly with book tabbing and notes strategy",
      "Identify and fix your weakest exam sections",
      "Review every question with an explanation",
    ],
    requirements: [
      "Medical Coding Foundations or equivalent experience",
      "Current-year code books",
    ],
    audience: [
      "Healthcare professionals and billers",
      "Students close to sitting the CPC exam",
      "Working coders preparing for certification",
    ],
    curriculum: [
      {
        title: "Exam strategy",
        lessons: [
          { title: "How the exam is structured", minutes: 12, preview: true },
          { title: "Tabbing and annotating your books", minutes: 20, preview: false },
          { title: "Time management per question", minutes: 14, preview: false },
        ],
      },
      {
        title: "Section reviews",
        lessons: [
          { title: "Surgery sections: common traps", minutes: 28, preview: false },
          { title: "E/M, radiology, pathology and medicine", minutes: 26, preview: false },
          { title: "ICD-10-CM and HCPCS questions", minutes: 22, preview: false },
        ],
      },
      {
        title: "Full-length mock exams",
        lessons: [
          { title: "Mock exam 1 (timed)", minutes: 240, preview: false },
          { title: "Mock exam 2 (timed)", minutes: 240, preview: false },
          { title: "Review mode and next steps", minutes: 20, preview: false },
        ],
      },
    ],
    instructor: "lead-coding-instructor",
    faqs: [
      {
        question: "Does this course include the exam fee?",
        answer:
          "No. The certification exam is booked and paid for through the certifying body. This course prepares you for it.",
      },
      {
        question: "Are the mock exams timed like the real exam?",
        answer:
          "Yes. Mock exams are timed, randomised from a question bank and auto-submit when time runs out. You can review every answer afterwards.",
      },
    ],
    featured: true,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "icd-10-cm-mastery",
    title: "ICD-10-CM Mastery",
    metaTitle: "ICD-10-CM Training Course",
    metaDescription:
      "Go deeper on ICD-10-CM: guidelines, sequencing, combination codes and specificity, with scenario-based practice for working coders.",
    summary:
      "Guidelines, sequencing and specificity for coders who want to code diagnoses with confidence.",
    description:
      "An intermediate course on diagnosis coding. Covers the Official Guidelines in depth, sequencing, combination codes, 7th characters and the specificity payers expect.",
    level: "intermediate",
    category: "coding",
    hours: 14,
    lessonCount: 26,
    mockExams: 1,
    priceUsd: 149,
    pricePkr: 22000,
    accessMonths: 12,
    outcomes: [
      "Apply the ICD-10-CM Official Guidelines confidently",
      "Sequence primary and secondary diagnoses correctly",
      "Use combination codes and 7th characters",
      "Code to the specificity payers require",
    ],
    requirements: ["Basic ICD-10-CM knowledge", "Current-year ICD-10-CM book"],
    audience: [
      "Healthcare professionals and billers",
      "Working coders",
      "Billers who review diagnosis coding",
    ],
    curriculum: [
      {
        title: "Guidelines in depth",
        lessons: [
          { title: "Section I conventions revisited", minutes: 16, preview: true },
          { title: "Sequencing rules", minutes: 20, preview: false },
        ],
      },
      {
        title: "Tricky chapters",
        lessons: [
          { title: "Diabetes and its complications", minutes: 18, preview: false },
          { title: "Injuries and 7th characters", minutes: 20, preview: false },
        ],
      },
      {
        title: "Practice",
        lessons: [
          { title: "Scenario set: 40 diagnoses", minutes: 45, preview: false },
          { title: "Assessment", minutes: 40, preview: false },
        ],
      },
    ],
    instructor: "lead-coding-instructor",
    faqs: [
      {
        question: "Is this suitable for beginners?",
        answer:
          "It's designed for learners who already know the basics. Beginners should start with Medical Coding Foundations.",
      },
      {
        question: "Will it cover this year's code updates?",
        answer: "Yes. Lessons are updated for each October ICD-10-CM release.",
      },
    ],
    featured: false,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "evaluation-and-management-coding",
    title: "E/M Coding in Practice",
    metaTitle: "E/M Coding Course for Coders",
    metaDescription:
      "Code office and hospital E/M visits by medical decision making or time, with modifier 25 and split/shared rules, through real-world scenarios.",
    summary: "Office and hospital E/M visits by decision making or time, including modifier 25.",
    description:
      "E/M codes are the most-billed services in outpatient care. This course teaches level selection by medical decision making and by time, with scenario practice across specialties.",
    level: "intermediate",
    category: "coding",
    hours: 10,
    lessonCount: 20,
    mockExams: 1,
    priceUsd: 129,
    pricePkr: 19000,
    accessMonths: 12,
    outcomes: [
      "Choose office E/M levels by medical decision making",
      "Choose levels by total time when it's the better option",
      "Apply modifier 25 correctly",
      "Code hospital and observation visits",
    ],
    requirements: ["Basic CPT knowledge"],
    audience: [
      "Healthcare professionals and billers",
      "Working coders",
      "Providers and office managers who review coding",
    ],
    curriculum: [
      {
        title: "Office visits",
        lessons: [
          { title: "The three elements of medical decision making", minutes: 18, preview: true },
          { title: "Coding by time", minutes: 12, preview: false },
        ],
      },
      {
        title: "Beyond the office",
        lessons: [
          { title: "Hospital and observation visits", minutes: 16, preview: false },
          { title: "Modifier 25 in practice", minutes: 14, preview: false },
        ],
      },
      {
        title: "Practice",
        lessons: [
          { title: "Scenario set: 30 visits", minutes: 40, preview: false },
          { title: "Assessment", minutes: 30, preview: false },
        ],
      },
    ],
    instructor: "lead-coding-instructor",
    faqs: [
      {
        question: "Does the course follow the current E/M guidelines?",
        answer:
          "Yes. It follows the current AMA E/M guidelines for office and hospital services, and it's updated when they change.",
      },
      {
        question: "Is this useful for providers?",
        answer:
          "Yes. Providers and office managers take it to understand how documentation drives the level billed.",
      },
    ],
    featured: false,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "denials-and-appeals",
    title: "Denials and Appeals",
    metaTitle: "Denial Management and Appeals Course",
    metaDescription:
      "Learn to work claim denials: read reason codes, correct and resubmit, write appeals that succeed, and prevent repeat denials.",
    summary: "Read reason codes, write appeals that succeed and stop denials repeating.",
    description:
      "A practical course for billers on the denial workflow: triaging by value and deadline, reading CARC and RARC codes, correcting claims, writing appeal letters and fixing root causes.",
    level: "intermediate",
    category: "billing",
    hours: 8,
    lessonCount: 16,
    mockExams: 0,
    priceUsd: 99,
    pricePkr: 15000,
    accessMonths: null,
    outcomes: [
      "Read claim adjustment and remark reason codes",
      "Decide between correction, reconsideration and appeal",
      "Write a clear appeal letter with the right evidence",
      "Track denial trends and fix root causes",
    ],
    requirements: ["Medical Billing Essentials or billing experience"],
    audience: [
      "Healthcare professionals and billers",
      "Billers and AR specialists",
      "Billing team leads",
    ],
    curriculum: [
      {
        title: "Understanding denials",
        lessons: [
          { title: "CARC and RARC codes explained", minutes: 16, preview: true },
          { title: "Triaging by value and deadline", minutes: 12, preview: false },
        ],
      },
      {
        title: "Recovering revenue",
        lessons: [
          { title: "Corrected claims vs appeals", minutes: 14, preview: false },
          { title: "Writing an appeal letter", minutes: 20, preview: false },
        ],
      },
      {
        title: "Prevention",
        lessons: [
          { title: "Root-cause analysis", minutes: 16, preview: false },
          { title: "Building a denial dashboard", minutes: 18, preview: false },
        ],
      },
    ],
    instructor: "lead-billing-instructor",
    faqs: [
      {
        question: "Does it include appeal letter templates?",
        answer: "Yes. You get templates for the most common denial types to adapt for each case.",
      },
      {
        question: "How long do I have access?",
        answer: "Lifetime access, including future updates to the course.",
      },
    ],
    featured: false,
  },
  // [CLIENT TO CONFIRM] CPC® and CPB® programs: hours, lesson counts, mock exams, prices (USD +
  // PKR), access period and outline are placeholders until the client confirms them.
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "cpc-certified-professional-coder",
    title: "CPC® Training: Certified Professional Coder",
    metaTitle: "CPC® Training in Pakistan",
    metaDescription:
      "CPC® medical coding training in Lahore and online: ICD-10-CM, CPT®, HCPCS Level II, modifiers and timed mock exams to prepare for the AAPC exam.",
    summary:
      "Full CPC® preparation: ICD-10-CM, CPT®, HCPCS Level II, modifiers, terminology and timed mock exams.",
    description:
      "A complete medical coding program that prepares you for the CPC® exam. You learn the code sets and guidelines from working coders, practise on de-identified scenarios after every module, and sit timed mock exams in exam format. Classes run onsite in Lahore and online, and every lesson is recorded. The CPC® credential is awarded by AAPC when you pass their exam. Duration and fees: [CLIENT TO CONFIRM].",
    level: "beginner",
    category: "coding",
    hours: 80, // [CLIENT TO CONFIRM]
    lessonCount: 90, // [CLIENT TO CONFIRM]
    mockExams: 3, // [CLIENT TO CONFIRM]
    priceUsd: 499, // [CLIENT TO CONFIRM]
    pricePkr: 75000, // [CLIENT TO CONFIRM]
    accessMonths: 12, // [CLIENT TO CONFIRM]
    outcomes: [
      "Apply ICD-10-CM conventions and the Official Guidelines",
      "Code procedures and services with CPT®",
      "Use HCPCS Level II codes for supplies, drugs and services",
      "Apply modifiers correctly",
      "Use medical terminology and anatomy to read documentation",
      "Code in line with guidelines and compliance rules",
      "Complete timed mock exams in exam format",
    ],
    requirements: [
      "Comfortable reading English",
      "Current-year code books recommended",
      "No prior coding experience needed",
    ],
    audience: [
      "Healthcare professionals and billers",
      "Graduates starting a medical coding career",
      "Nursing, pharmacy and life-science graduates changing careers",
      "Billers who want to move into coding",
    ],
    curriculum: [
      {
        title: "Medical terminology and anatomy",
        lessons: [
          { title: "Word parts that unlock medical terms", minutes: 14, preview: true },
          { title: "Body systems for coders", minutes: 22, preview: false },
        ],
      },
      {
        title: "ICD-10-CM, CPT® and HCPCS Level II",
        lessons: [
          { title: "ICD-10-CM conventions and guidelines", minutes: 20, preview: false },
          { title: "CPT® sections and E/M", minutes: 24, preview: false },
          { title: "HCPCS Level II and modifiers", minutes: 18, preview: false },
        ],
      },
      {
        title: "Compliance and exam preparation",
        lessons: [
          { title: "Coding compliance essentials", minutes: 16, preview: false },
          { title: "Exam strategy and book tabbing", minutes: 20, preview: false },
          { title: "Mock exam (timed)", minutes: 240, preview: false },
        ],
      },
    ],
    instructor: "lead-coding-instructor",
    faqs: [
      {
        question: "Does this course include the AAPC exam fee?",
        answer:
          "The exam is registered for and taken with AAPC. Whether the fee is included is [CLIENT TO CONFIRM].",
      },
      {
        question: "Is the course onsite or online?",
        answer:
          "Both. Batches run onsite in Lahore and live online, and every class is recorded so you can rewatch it.",
      },
    ],
    featured: false,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "cpb-certified-professional-biller",
    title: "CPB® Training: Certified Professional Biller",
    metaTitle: "CPB® Training in Pakistan",
    metaDescription:
      "CPB® medical billing training in Lahore and online: claims, payer rules, denials and appeals, AR follow-up and mock exams to prepare for the AAPC exam.",
    summary:
      "Full CPB® preparation: claims submission, payer rules, denials and appeals, AR follow-up and patient billing.",
    description:
      "A complete medical billing program that prepares you for the CPB® exam. You learn the US revenue cycle the way billing teams work it, practise on de-identified scenarios after every module, and sit timed mock exams in exam format. Classes run onsite in Lahore and online, and every lesson is recorded. The CPB® credential is awarded by AAPC when you pass their exam. Duration and fees: [CLIENT TO CONFIRM].",
    level: "beginner",
    category: "billing",
    hours: 70, // [CLIENT TO CONFIRM]
    lessonCount: 80, // [CLIENT TO CONFIRM]
    mockExams: 3, // [CLIENT TO CONFIRM]
    priceUsd: 449, // [CLIENT TO CONFIRM]
    pricePkr: 68000, // [CLIENT TO CONFIRM]
    accessMonths: 12, // [CLIENT TO CONFIRM]
    outcomes: [
      "Prepare and submit clean claims",
      "Apply payer rules for commercial and government payers",
      "Work denials and write appeals",
      "Prioritise and follow up accounts receivable",
      "Handle patient billing and statements",
      "Follow billing compliance requirements",
      "Complete timed mock exams in exam format",
    ],
    requirements: [
      "Comfortable reading English",
      "A computer with internet access",
      "No prior healthcare experience needed",
    ],
    audience: [
      "Healthcare professionals and billers",
      "Career-starters looking for work in US healthcare",
      "Front-desk and AR staff moving into billing",
      "Graduates looking for remote work with US practices",
    ],
    curriculum: [
      {
        title: "Claims and payer rules",
        lessons: [
          { title: "The revenue cycle in 10 minutes", minutes: 10, preview: true },
          { title: "Claims submission and clearinghouses", minutes: 18, preview: false },
          { title: "Payer rules and coverage", minutes: 20, preview: false },
        ],
      },
      {
        title: "Denials, appeals and AR",
        lessons: [
          { title: "Working denials by reason code", minutes: 22, preview: false },
          { title: "Writing an appeal", minutes: 20, preview: false },
          { title: "AR follow-up by age and value", minutes: 18, preview: false },
        ],
      },
      {
        title: "Patient billing, compliance and exam preparation",
        lessons: [
          { title: "Patient billing and statements", minutes: 16, preview: false },
          { title: "Billing compliance essentials", minutes: 16, preview: false },
          { title: "Mock exam (timed)", minutes: 240, preview: false },
        ],
      },
    ],
    instructor: "lead-billing-instructor",
    faqs: [
      {
        question: "Does this course include the AAPC exam fee?",
        answer:
          "The exam is registered for and taken with AAPC. Whether the fee is included is [CLIENT TO CONFIRM].",
      },
      {
        question: "Is the course onsite or online?",
        answer:
          "Both. Batches run onsite in Lahore and live online, and every class is recorded so you can rewatch it.",
      },
    ],
    featured: false,
  },
];

export const courses: Course[] = raw.map((c) => courseSchema.parse(c));

const rawPathways: Pathway[] = [
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "billing-and-coding-career",
    title: "Billing and Coding Career Path",
    metaTitle: "Medical Billing and Coding Career Path",
    metaDescription:
      "From beginner to certification-ready: billing, coding and exam preparation in one guided path, at a bundle price.",
    summary: "Start from zero and finish ready to sit a coding certification exam.",
    outcome: "Job-ready for billing and coding roles, and prepared for the CPC exam.",
    careers: ["Medical biller", "Medical coder", "AR specialist", "Remote coder for US practices"],
    steps: [
      {
        label: "Foundations",
        description: "Terminology, anatomy and the revenue cycle",
        courses: ["medical-billing-essentials"],
      },
      {
        label: "Billing",
        description: "Claims, payments and denials",
        courses: ["denials-and-appeals"],
      },
      {
        label: "Coding",
        description: "ICD-10-CM, CPT and HCPCS",
        courses: ["medical-coding-foundations", "evaluation-and-management-coding"],
      },
      {
        label: "Exam prep",
        description: "Timed mock exams and review",
        courses: ["cpc-exam-preparation"],
      },
      { label: "Certified", description: "Verifiable GlobalMed certificates", courses: [] },
    ],
    bundlePriceUsd: 799,
    bundlePricePkr: 120000,
  },
  {
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    slug: "coding-specialist",
    title: "Coding Specialist Path",
    metaTitle: "Medical Coding Specialist Path",
    metaDescription:
      "For learners focused on coding: foundations, diagnosis coding mastery, E/M and CPC exam preparation in one path.",
    summary: "A coding-only path for learners who want to specialise.",
    outcome: "Confident diagnosis and procedure coding, prepared for the CPC exam.",
    careers: ["Medical coder", "Coding quality reviewer", "Remote coder"],
    steps: [
      {
        label: "Foundations",
        description: "Code sets and guidelines",
        courses: ["medical-coding-foundations"],
      },
      {
        label: "Diagnosis coding",
        description: "ICD-10-CM in depth",
        courses: ["icd-10-cm-mastery"],
      },
      {
        label: "E/M",
        description: "The most-billed services",
        courses: ["evaluation-and-management-coding"],
      },
      { label: "Exam prep", description: "Timed mock exams", courses: ["cpc-exam-preparation"] },
      { label: "Certified", description: "Verifiable GlobalMed certificates", courses: [] },
    ],
    bundlePriceUsd: 749,
    bundlePricePkr: 112000,
  },
];

export const pathways: Pathway[] = rawPathways.map((p) => pathwaySchema.parse(p));

/** [CLIENT TO CONFIRM] Batch schedule. Live sessions run on Zoom/Meet (docs/01 scope). */
export const batches = [
  {
    course: "medical-coding-foundations",
    starts: "2026-10-06",
    schedule: "Mon & Thu, 7:00–9:00 pm PKT",
    seats: 30,
    mode: "Live online",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
  },
  {
    course: "medical-billing-essentials",
    starts: "2026-10-13",
    schedule: "Tue & Fri, 7:00–9:00 pm PKT",
    seats: 30,
    mode: "Live online",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
  },
  {
    course: "cpc-exam-preparation",
    starts: "2026-11-03",
    schedule: "Sat, 10:00 am–1:00 pm PKT",
    seats: 20,
    mode: "Live online",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
  },
] as const;
