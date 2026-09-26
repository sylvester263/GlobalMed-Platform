import { features, type FeatureFlag } from "@/config/features";
import { aapcCoursePath, getAapcCourses } from "@/data/courses";
import { publicEnv } from "@/lib/env";

/**
 * Site-wide facts: brand, contact details, navigation. Values marked CLIENT TO CONFIRM
 * are placeholders tracked in pm/CLIENT_INPUTS_NEEDED.md; keep NAP identical everywhere
 * (docs/12 §2), so read them from here only.
 */
export const site = {
  name: "GlobalMed Transcriptions and Billing Solutions",
  shortName: "GlobalMed",
  /** The education brand (renamed from "GlobalMed School of Billing and Coding", ADR-024). */
  schoolName: "GlobalMed Education",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  description:
    "Medical transcription, billing and coding services for healthcare providers since 2007, and AAPC's Strategic Partner in Pakistan for medical billing and coding.",
  /** Footer brand line (client review, 2026-09-25). */
  tagline:
    "Pakistan's leading medical transcription, billing and coding company since 2007, and AAPC's strategic partner in Pakistan.",
  credit: "Designed & developed by SylJo Tech",
  // Supplied by the client on 2026-09-25. The footer, contact page, llms.txt and the
  // Organization/LocalBusiness JSON-LD all read these, so they always match.
  contact: {
    email: "info@globalmedtranscriptions.com",
    phone: "+92 42 3594 6342",
    phoneHref: "tel:+924235946342",
    whatsappDisplay: "+92 300 419 8760",
    // NEXT_PUBLIC_WHATSAPP_NUMBER can override the client's number per environment.
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923004198760",
    hours: "Open 24/7",
    address: {
      street: "44 Dilkusha Garden, Near S Block Ext., Model Town",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54700",
      poBox: "PO Box 54700",
      country: "PK",
    },
    // [CLIENT TO CONFIRM] A US line and US/PK hours were placeholders before the client
    // supplied the details above. Kept here, hidden while `usLineConfirmed` is false.
    usLineConfirmed: false,
    phoneUs: "+1 (000) 000-0000",
    phoneUsHref: "tel:+10000000000",
    hoursUs: "Monday–Friday, 9am–6pm Eastern",
  },
  /** [CLIENT TO CONFIRM] Social profile links. An icon only shows once its href is filled in. */
  social: [
    { network: "facebook", label: "Facebook", href: "" },
    { network: "instagram", label: "Instagram", href: "" },
    { network: "linkedin", label: "LinkedIn", href: "" },
    { network: "youtube", label: "YouTube", href: "" },
    { network: "x", label: "X", href: "" },
  ] as { network: SocialNetwork; label: string; href: string }[],
  features: {
    /** AAPC partnership page and marks: only with AAPC's written permission (CLAUDE.md §5). */
    aapcPartnership: process.env.NEXT_PUBLIC_FEATURE_AAPC === "true",
  },
} as const;

export type SocialNetwork = "facebook" | "instagram" | "linkedin" | "youtube" | "x";

/** One-line postal address, as printed in the footer and on the contact page. */
export const postalAddress = `${site.contact.address.street}, ${site.contact.address.city}, ${site.contact.address.poBox}, Pakistan`;

/** Education routes live at /education (the old /school URLs still render the same pages). */
export const educationBase = "/education";
export const aapcCertificationPath = `${educationBase}/aapc-certification-pakistan`;

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; links: NavLink[]; feature?: NavLink };

/** A link that only shows while its feature flag is on (config/features.ts). */
type FlaggedLink = NavLink & { flag?: FeatureFlag };

function shown(links: FlaggedLink[]): NavLink[] {
  return links.filter((link) => !link.flag || features[link.flag]);
}

const servicesNav: NavGroup = {
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
};

// Education menu (client, 2026-09-26): the AAPC page and the three AAPC courses. GlobalMed's
// own education links stay below behind their flags (config/features.ts).
const educationNav: NavGroup = {
  label: "Education",
  href: features.educationLanding ? educationBase : aapcCertificationPath,
  links: shown([
    {
      label: "AAPC Certification in Pakistan",
      href: aapcCertificationPath,
      description: "GlobalMed is AAPC's Strategic Partner in Pakistan",
    },
    ...getAapcCourses().map((course) => ({
      label: course.navLabel,
      href: aapcCoursePath(course.slug),
      description: "AAPC's instructor-led online course",
    })),
    {
      label: "CPC & CPB Training",
      href: "/#certification-programs",
      description: "AAPC certification training in Lahore and online",
      flag: "onsiteTraining",
    },
    {
      label: "All courses",
      href: `${educationBase}/courses`,
      description: "Billing, coding and exam prep",
      flag: "globalmedCourses",
    },
    {
      label: "Certification pathways",
      href: `${educationBase}/pathways`,
      description: "From beginner to certified",
      flag: "pathways",
    },
    {
      label: "Exam preparation",
      href: `${educationBase}/exam-prep`,
      description: "Timed mock exams and review",
      flag: "examPrep",
    },
    {
      label: "Upcoming batches",
      href: `${educationBase}/batches`,
      description: "Live classes with an instructor",
      flag: "batches",
    },
    {
      label: "Corporate training",
      href: `${educationBase}/corporate-training`,
      description: "Train your billing team",
      flag: "corporateTraining",
    },
  ]),
  // Hidden at client request — GlobalMed education plans are future scope.
  feature: features.educationLanding
    ? {
        label: site.schoolName,
        href: educationBase,
        description:
          "Video lessons you can rewatch, mock exams and a certificate employers can verify.",
      }
    : undefined,
};

const resourcesNav: NavGroup = {
  label: "Resources",
  href: "/blog",
  links: shown([
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
      flag: "certificates",
    },
  ]),
};

const aboutLink: NavLink = { label: "About Us", href: "/about" };
const specialtiesLink: NavLink = { label: "Specialties", href: "/specialties" };
const contactLink: NavLink = { label: "Contact", href: "/contact" };

export type NavItem = NavGroup | NavLink;

/** Top navigation order (client review 2026-09-25): About Us · Education · then the rest. */
export const primaryNav: NavItem[] = [
  aboutLink,
  educationNav,
  servicesNav,
  resourcesNav,
  specialtiesLink,
  contactLink,
];

export function isNavGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Company",
    links: shown([
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "Careers / Transcriptionists", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
      { label: "Member Login", href: "/login", flag: "publicLogin" },
    ]),
  },
  {
    title: "Education",
    links: shown([
      { label: "AAPC Certification in Pakistan", href: aapcCertificationPath },
      { label: "CPC® Training", href: aapcCoursePath("cpc") },
      { label: "CPB® Training", href: aapcCoursePath("cpb") },
      { label: "CPC® + CPB® Dual Certifications", href: aapcCoursePath("cpc-cpb") },
      { label: "All Courses", href: `${educationBase}/courses`, flag: "globalmedCourses" },
      { label: "Upcoming Batches", href: `${educationBase}/batches`, flag: "batches" },
    ]),
  },
];

export const legalNav: NavLink[] = shown([
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms of service", href: "/legal/terms" },
  { label: "Refund policy", href: "/legal/refund-policy", flag: "onlineCheckout" },
  { label: "HIPAA notice", href: "/legal/hipaa-notice" },
  { label: "Cookie policy", href: "/legal/cookie-policy" },
]);

export function whatsappHref(message: string): string | null {
  const digits = site.contact.whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Whether `href` is the current page or one of its children (for aria-current). */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
