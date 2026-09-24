import { publicEnv } from "@/lib/env";

/**
 * Site-wide facts: brand, contact details, navigation. Values marked CLIENT TO CONFIRM
 * are placeholders tracked in pm/CLIENT_INPUTS_NEEDED.md; keep NAP identical everywhere
 * (docs/12 §2), so read them from here only.
 */
export const site = {
  name: "GlobalMed Transcriptions and Billing Solutions",
  shortName: "GlobalMed",
  schoolName: "GlobalMed School of Billing and Coding",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  description:
    "Medical billing, coding, transcription and AI clinical documentation for US practices, plus the GlobalMed School of Billing and Coding.",
  credit: "Designed & developed by SylJo Tech",
  // CLIENT TO CONFIRM: every contact value below.
  contact: {
    email: "info@globalmedtranscriptions.com",
    phoneUs: "+1 (000) 000-0000",
    phoneUsHref: "tel:+10000000000",
    phonePk: "+92 000 0000000",
    phonePkHref: "tel:+920000000000",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    hoursUs: "Monday–Friday, 9am–6pm Eastern",
    hoursPk: "Monday–Saturday, 10am–7pm PKT",
    address: {
      street: "[CLIENT TO CONFIRM]",
      city: "Lahore",
      region: "Punjab",
      country: "PK",
    },
  },
  social: [] as { label: string; href: string }[],
  features: {
    /** AAPC partnership page and marks: only with AAPC's written permission (CLAUDE.md §5). */
    aapcPartnership: process.env.NEXT_PUBLIC_FEATURE_AAPC === "true",
  },
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; links: NavLink[]; feature?: NavLink };

export const mainNav: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    links: [
      {
        label: "Medical billing",
        href: "/services/medical-billing",
        description: "Claims, payments and AR follow-up",
      },
      {
        label: "Medical coding",
        href: "/services/medical-coding",
        description: "ICD-10-CM, CPT and HCPCS by certified coders",
      },
      {
        label: "Medical transcription",
        href: "/services/medical-transcription",
        description: "Accurate notes, fast turnaround",
      },
      {
        label: "AI clinical documentation",
        href: "/services/ai-clinical-documentation",
        description: "AI drafts, human-reviewed",
      },
      {
        label: "Revenue cycle management",
        href: "/services/revenue-cycle-management",
        description: "The whole cycle, one accountable team",
      },
      {
        label: "Denial management",
        href: "/services/denial-management",
        description: "Recover denied claims and prevent the next",
      },
    ],
    feature: {
      label: "Free billing audit",
      href: "/free-billing-audit",
      description: "See where your practice is losing revenue. No cost, no commitment.",
    },
  },
  {
    label: "School",
    href: "/school",
    links: [
      {
        label: "CPC & CPB Training",
        href: "/#certification-programs",
        description: "AAPC certification training in Lahore and online",
      },
      {
        label: "All courses",
        href: "/school/courses",
        description: "Billing, coding and exam prep",
      },
      {
        label: "Certification pathways",
        href: "/school/pathways",
        description: "From beginner to certified",
      },
      {
        label: "Exam preparation",
        href: "/school/exam-prep",
        description: "Timed mock exams and review",
      },
      {
        label: "Upcoming batches",
        href: "/school/batches",
        description: "Live classes with an instructor",
      },
      {
        label: "Corporate training",
        href: "/school/corporate-training",
        description: "Train your billing team",
      },
    ],
    feature: {
      label: site.schoolName,
      href: "/school",
      description:
        "Video lessons you can rewatch, mock exams and a certificate employers can verify.",
    },
  },
  {
    label: "Resources",
    href: "/blog",
    links: [
      { label: "Blog", href: "/blog", description: "Billing and coding insights" },
      {
        label: "Guides & downloads",
        href: "/resources/guides",
        description: "Checklists for practices and students",
      },
      { label: "FAQ", href: "/faq", description: "Answers to common questions" },
      {
        label: "Verify a certificate",
        href: "/verify",
        description: "Check a GlobalMed certificate",
      },
    ],
  },
];

export const simpleNav: NavLink[] = [
  { label: "Specialties", href: "/specialties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  { title: "Services", links: mainNav[0]!.links },
  {
    title: "School",
    links: [...mainNav[1]!.links, { label: "Verify a certificate", href: "/verify" }],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our team", href: "/about/team" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms of service", href: "/legal/terms" },
  { label: "Refund policy", href: "/legal/refund-policy" },
  { label: "HIPAA notice", href: "/legal/hipaa-notice" },
  { label: "Cookie policy", href: "/legal/cookie-policy" },
];

export function whatsappHref(message: string): string | null {
  const digits = site.contact.whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Whether `href` is the current page or one of its children (for aria-current). */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
