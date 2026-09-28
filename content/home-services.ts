import { aapcCertificationPath } from "@/lib/site";

// "Our Services" on the home page (client text, 2026-09-28). Used verbatim: do not reword,
// shorten or add claims. `strong` lines render bold.

export const servicesIntro = {
  title: "Our Services",
  lead: "GlobalMed Transcriptions & Billing Solutions is the leading medical transcription and billing company in Pakistan. Supporting healthcare providers with accurate documentation and dependable revenue cycle services. GlobalMed offers medical transcription, AI-assisted clinical documentation editing, coding, and billing services tailored to each client's workflow. Our experienced team help clinicians spend less time on documentation and focus more on what matters most – PATIENT CARE.",
  note: {
    text: "Through its strategic partnership with AAPC, GlobalMed supports students pursuing Certified Professional Coder (CPC®) and Certified Professional Biller (CPB®) training by coordinating enrollment, batch schedules, payments, and access to required books and online learning resources.",
    href: aapcCertificationPath,
  },
};

export type ServiceCardCta = { label: string; href: string };

export type ServiceCard = {
  id: string;
  title: string;
  image: { src: string; alt: string };
  paragraphs: string[];
  chips?: string[];
  checklist?: { label: string; items: string[] };
  strong?: string;
  ctas: ServiceCardCta[];
};

const contactForm = "/contact#contact-form";

export const serviceCards: ServiceCard[] = [
  {
    id: "medical-transcription",
    title: "Medical Transcription",
    image: {
      src: "/images/services/medical-transcription.jpg",
      alt: "Medical transcriptionist with a headset typing a clinical report at her workstation",
    },
    paragraphs: [
      "With more than 25 years of combined industry experience, GlobalMed's transcriptionists, editors, and proofreaders deliver accurate clinical documentation across medical specialties and at scale. Our team works with a wide range of EMR and EHR systems and is experienced in editing voice recognition and AI-generated drafts.",
      "Our quality processes support up to 99% accuracy. In AI-assisted workflows, we have reduced turnaround times from 24 hours to as little as 6 hours, helping clinicians receive reliable reports sooner.",
    ],
    chips: ["Up to 99% accuracy", "24h → 6h turnaround"],
    ctas: [{ label: "Request a Free Quote", href: contactForm }],
  },
  {
    id: "ai-clinical-documentation",
    title: "AI-Powered Clinical Documentation",
    image: {
      src: "/images/services/ai-clinical-documentation.jpg",
      alt: "Laptop screen showing a voice waveform turning into a structured draft report",
    },
    paragraphs: [
      "Dictation2Report (D2R) by MediTechLabs transforms clinical dictations into structured draft reports in minutes. Combined with expert review, it offers an end-to-end solution for faster, accurate clinical documentation.",
    ],
    strong:
      "Partner with GlobalMed for medical transcription services built around quality, capacity, and timely delivery.",
    ctas: [{ label: "Talk to Our Team", href: contactForm }],
  },
  {
    id: "revenue-cycle-management",
    title: "Revenue Cycle Management (RCM)",
    image: {
      src: "/images/services/revenue-cycle-management.jpg",
      alt: "Medical biller reviewing a CMS-1500 claim form beside a revenue dashboard",
    },
    paragraphs: [
      "GlobalMed supports your revenue cycle from patient registration through final payment. Our team includes certified medical billing and coding professionals who help practices submit accurate claims, address denials, and improve collections.",
      "We use HIPAA-compliant processes to protect patient information. With careful review and timely follow-up at every stage, we help reduce avoidable revenue loss so your team can focus on patient care.",
    ],
    checklist: {
      label: "Our RCM services include:",
      items: [
        "Medical coding and billing",
        "Provider credentialing",
        "Prior authorization support",
        "Insurance verification and eligibility",
        "Claims management",
        "Denial management",
        "Payment posting",
        "Accounts receivable follow-up",
        "Billing audits and analysis",
      ],
    },
    ctas: [{ label: "Book a Free Billing Audit", href: "/free-billing-audit#audit-form" }],
  },
  {
    id: "aapc-certifications",
    title: "AAPC Certifications: CPC® and CPB®",
    image: {
      src: "/images/services/aapc-certification.jpg",
      alt: "Student taking notes during a live online medical coding class",
    },
    paragraphs: [
      "Through its strategic partnership with the American Academy of Professional Coders (AAPC), GlobalMed helps students in Pakistan access training for two internationally recognized credentials: Certified Professional Coder (CPC®) and Certified Professional Biller (CPB®).",
      "AAPC provides the training and credentials. GlobalMed supports students throughout the enrollment process by coordinating batch schedules, payment processing, and access to required books and online learning resources.",
      "Interested in building a career in medical coding or billing? Contact GlobalMed for program details and enrollment guidance.",
    ],
    ctas: [
      { label: "View CPC® & CPB® Courses", href: aapcCertificationPath },
      { label: "Register Now", href: `${aapcCertificationPath}#register` },
    ],
  },
];
