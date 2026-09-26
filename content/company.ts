import { features } from "@/config/features";
import { aapcFaqs, approvedWording } from "@/content/aapc";
import { faqSchema, type Faq } from "@/lib/content/schema";

/**
 * [CLIENT TO CONFIRM] Company facts. Until the client confirms real figures, every stat is
 * shown with an "Illustrative figure" label (pm/CLIENT_INPUTS_NEEDED.md).
 */
export const companyStats = {
  confirmed: false,
  items: [
    { label: "Years serving US practices", value: 12, suffix: "", decimals: 0 },
    { label: "Claims processed", value: 125000, suffix: "+", decimals: 0 },
    { label: "Clean-claim rate", value: 98.4, suffix: "%", decimals: 1 },
    // Hidden at client request — GlobalMed education plans are future scope.
    ...(features.trainingStats
      ? [{ label: "Students trained", value: 1500, suffix: "+", decimals: 0 }]
      : []),
  ],
};

export const values = [
  {
    title: "Accuracy before speed",
    body: "A claim that's right the first time is faster than one that comes back. We check before we send.",
  },
  {
    title: "Plain reporting",
    body: "Every client gets numbers they can read and a person who explains them.",
  },
  {
    title: "Privacy by design",
    body: "Patient information stays in HIPAA-compliant systems. Our website and chatbot never ask for it.",
  },
  {
    title: "Teaching what we practise",
    body: "GlobalMed Education courses are taught by people who bill and code for US practices every week.",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
  },
].filter((v) => v.visible !== false);

/** [CLIENT TO CONFIRM] Names, photos and bios. Roles are shown until then. */
export const team = [
  {
    role: "Founder & CEO",
    name: "[CLIENT TO CONFIRM]",
    bio: "Leads GlobalMed's services and its AAPC partnership in Pakistan.",
  },
  {
    role: "Director of Revenue Cycle",
    name: "[CLIENT TO CONFIRM]",
    bio: "Oversees billing, coding and denial management for US clients.",
  },
  {
    role: "Head of Coding Quality",
    name: "[CLIENT TO CONFIRM]",
    bio: "Runs coding audits and accuracy reviews.",
  },
  {
    role: "Director, GlobalMed Education",
    name: "[CLIENT TO CONFIRM]",
    bio: "Designs courses and leads the instructor team.",
  },
  {
    role: "Client Success Lead",
    name: "[CLIENT TO CONFIRM]",
    bio: "The first call for every practice we work with.",
  },
  {
    role: "Compliance Officer",
    name: "[CLIENT TO CONFIRM]",
    bio: "Owns HIPAA policies, BAAs and staff training.",
  },
];

/** [CLIENT TO CONFIRM] Open roles. */
export const openRoles = [
  {
    title: "Medical Coder (CPC)",
    location: "Lahore / Remote",
    type: "Full-time",
    summary: "Code professional-fee encounters for US multispecialty clients.",
  },
  {
    title: "AR Follow-up Specialist",
    location: "Lahore",
    type: "Full-time, US shift",
    summary: "Work unpaid claims by phone and portal with US payers.",
  },
  {
    title: "Course Instructor, Medical Billing",
    location: "Remote",
    type: "Part-time",
    summary: "Teach live batches and answer student questions.",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
  },
].filter((r) => r.visible !== false);

type FaqGroup = { id: string; title: string; faqs: Faq[]; visible?: boolean };

export const faqGroups: FaqGroup[] = [
  {
    id: "services",
    title: "For practices",
    faqs: [
      {
        question: "What does GlobalMed do for medical practices?",
        answer:
          "GlobalMed runs medical billing, coding, transcription, AI clinical documentation and denial management for US practices, either as individual services or as full revenue cycle management.",
      },
      {
        question: "What is the free billing audit?",
        answer:
          "We review a sample of your recent claims, denials and accounts receivable, then show you where revenue is being lost and what we would change. There's no cost and no obligation.",
      },
      {
        question: "Do you sign a Business Associate Agreement?",
        answer:
          "Yes. We sign a BAA before we access any patient information, as HIPAA requires for billing and documentation partners.",
      },
      {
        question: "Can I send patient files through this website?",
        answer:
          "No. This website never collects patient information. Clients exchange files only through GlobalMed's HIPAA-compliant systems, set up during onboarding.",
      },
      {
        question: "Which practice management systems do you work with?",
        answer:
          "We work inside the systems our clients already use, including most major practice management and EHR platforms. We confirm access during onboarding. [CLIENT TO CONFIRM list]",
      },
    ],
  },
  {
    id: "aapc",
    title: "AAPC courses (CPC® and CPB®)",
    faqs: aapcFaqs,
  },
  {
    id: "school",
    title: "For students",
    // Hidden at client request — GlobalMed education plans are future scope.
    visible: false,
    faqs: [
      {
        question: "Do I need a medical background to start?",
        answer:
          "No. Medical Billing Essentials and Medical Coding Foundations start from zero and explain every term. Many of our students come from non-medical careers.",
      },
      {
        question: "Can I rewatch lessons?",
        answer:
          "Yes. You can rewatch any lesson as many times as you like during your access period, and the player resumes where you left off.",
      },
      {
        question: "How do I pay from Pakistan?",
        answer:
          "You can pay by card in US dollars or in Pakistani rupees by bank transfer, JazzCash or Easypaisa. Manual payments are verified within one business day, then your course unlocks.",
      },
      {
        question: "Is the GlobalMed certificate the same as a CPC certification?",
        answer:
          "No. GlobalMed certificates show you completed our course and passed its assessment, and employers can verify them online. The CPC credential is awarded by its certifying body after you pass their exam, which our exam-prep course prepares you for.",
      },
      {
        question: "How do employers check my certificate?",
        answer:
          "Every certificate has a unique ID and QR code. Employers enter the ID on our Verify a certificate page to see your name, the course and the issue date.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and data",
    faqs: [
      {
        question: "Does the chatbot store what I type?",
        answer:
          "Conversations are logged so our team can follow up and improve answers. Don't share patient information in the chat; the chatbot is for general questions only.",
      },
      {
        question: "How do I ask for my data to be deleted?",
        answer:
          "Email us from the address you used and we'll delete your account data, except records we must keep by law, such as invoices.",
      },
    ],
  },
].flatMap((g) =>
  g.visible === false ? [] : [{ ...g, faqs: g.faqs.map((f) => faqSchema.parse(f)) }],
);

/** [CLIENT TO CONFIRM] Downloadable guides (lead magnets). Files arrive with the content review (P2-14). */
export const guides = [
  {
    title: "The clean-claim checklist",
    audience: "Practices",
    body: "Twenty checks to run before a claim leaves your office.",
  },
  {
    title: "Denial reason codes, decoded",
    audience: "Practices",
    body: "The most common CARC codes, what they mean and what to do next.",
  },
  {
    title: "Start a coding career: a 90-day plan",
    audience: "Students",
    body: "What to learn, in what order, and how to show employers you're ready.",
  },
];

/** About Us page copy, supplied by the client on 2026-09-25. */
export const about = {
  title: "About GlobalMed Transcriptions",
  intro: "The leading medical transcription company in Pakistan, since 2007.",
  story: [
    "GlobalMed Transcriptions Pvt. Ltd. was founded in 2007 by Mr. Riaz Naveed and is the leading medical transcription company in Pakistan. It began as a small company and, through hard work and dependable service, has grown into Pakistan's leading and fastest-growing transcription company.",
    "We provide medical transcription and editing services to hospitals and clinics in the USA, Canada, UK, Australia and Saudi Arabia, and are actively expanding to new countries.",
  ],
  whatWeDo: [
    "Our areas of expertise include Family Medicine, Cardiology, Psychiatry, Orthopedics, Pathology, Radiology and multispecialty work.",
    "Our transcriptionists, editors and proofreaders are highly skilled and deliver accurate work regardless of dialect or dictation style, with close to 99% accuracy and a quick turnaround.",
    "We can work directly on a facility's own system or give clients access to our subscribed EMR/EHR for dictation and document management. A free trial is available so clients can judge our quality before outsourcing.",
  ],
  specialties: [
    "Family Medicine",
    "Cardiology",
    "Psychiatry",
    "Orthopedics",
    "Pathology",
    "Radiology",
    "Multispecialty",
  ],
  quality:
    "We believe in quality rather than quantity: the quality of the work we produce and the quality of service we provide. Our team can manage any type and volume of work within the agreed timeframe without compromising on quality.",
  mission:
    "To provide top-quality services to our clients' satisfaction, and to serve the community by creating more jobs.",
  leader: {
    name: "Riaz Naveed",
    role: "Founder & CEO",
    bio: "A university graduate with a diploma in Medical Laboratory Technology, he founded GlobalMed in 2007.",
    photo: "/images/team/riaz-naveed.jpg",
  },
  partnership: approvedWording.partnership,
  /** Second line of the Strategic Partnership block. */
  partnershipDetail: `${approvedWording.role} ${approvedWording.training} ${approvedWording.certification}`,
  /** Client-confirmed figures, so no "illustrative" label. */
  facts: [
    { label: "Happy Clients", value: 55, suffix: "+", decimals: 0 },
    { label: "Projects Completed", value: 470, suffix: "+", decimals: 0 },
    { label: "Expert People", value: 100, suffix: "+", decimals: 0 },
    { label: "Portfolios", value: 70, suffix: "+", decimals: 0 },
    { label: "Years in Healthcare", value: 19, suffix: "+", decimals: 0 },
  ],
};
