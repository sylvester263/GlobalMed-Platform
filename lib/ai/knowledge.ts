import { approvedWording } from "@/content/aapc";
import { whyRegister } from "@/content/home";
import { serviceCards, servicesIntro } from "@/content/home-services";
import { aapcCourseFacts, formatUsdPrice, getAapcCourses } from "@/data/courses";
import { aapcCertificationPath, site } from "@/lib/site";

/**
 * The pinned knowledge document (docs/09 §3): built from the same files the site renders, so
 * the bot never drifts from the site. It goes into every system prompt and is also stored as
 * the "pinned" knowledge-base document.
 */

export const contactFacts = {
  phone: site.contact.phone,
  whatsapp: site.contact.whatsappDisplay,
  whatsappUrl: aapcCourseFacts.whatsappUrl,
  email: site.contact.email,
  hours: site.contact.hours,
  registerUrl: `${aapcCertificationPath}#register`,
  auditUrl: "/free-billing-audit",
  contactUrl: "/contact",
} as const;

/** Every USD amount the bot may state (the three prices, the separate total and the saving). */
export function allowedUsdAmounts(): number[] {
  const courses = getAapcCourses();
  const prices = courses.map((c) => c.priceUsd);
  const single = courses.filter((c) => c.slug !== "cpc-cpb").reduce((n, c) => n + c.priceUsd, 0);
  const dual = courses.find((c) => c.slug === "cpc-cpb")?.priceUsd ?? 0;
  return [...new Set([...prices, single, single - dual])];
}

export function coursesText(): string {
  return getAapcCourses()
    .map((course) =>
      [
        `### ${course.title} (${course.credential})`,
        `- Price: ${formatUsdPrice(course.priceUsd)}${course.priceSaving ? ` (${course.priceSaving})` : ""}`,
        `- Duration: ${course.duration}`,
        `- Format: ${aapcCourseFacts.format}. Taught by ${aapcCourseFacts.taughtBy}. Certification awarded by ${aapcCourseFacts.awardedBy}.`,
        `- Package Includes: ${course.packageIncludes.join("; ")}`,
        `- Course page: /education/${course.slug}`,
      ].join("\n"),
    )
    .join("\n\n");
}

export function pinnedKnowledge(): string {
  const services = serviceCards
    .filter((card) => card.id !== "aapc-certifications")
    .map((card) =>
      [
        `### ${card.title}`,
        ...card.paragraphs,
        ...(card.checklist ? [`${card.checklist.label} ${card.checklist.items.join("; ")}`] : []),
        ...(card.strong ? [card.strong] : []),
      ].join("\n"),
    )
    .join("\n\n");

  return [
    "## Company",
    `${site.name} ("GlobalMed"). ${approvedWording.partnership}`,
    servicesIntro.lead,
    "",
    "## Contact",
    `Phone ${contactFacts.phone} · WhatsApp ${contactFacts.whatsapp} (${contactFacts.whatsappUrl}) · Email ${contactFacts.email} · ${contactFacts.hours}.`,
    "",
    "## AAPC training: who does what",
    approvedWording.role,
    approvedWording.training,
    approvedWording.certification,
    `Delivery note: "${aapcCourseFacts.priceNote}"`,
    "GlobalMed does not teach and does not issue certificates. Training is online only.",
    "",
    "## The only three courses offered",
    coursesText(),
    "",
    `How to register: the Register Now form (${contactFacts.registerUrl}) or WhatsApp ${contactFacts.whatsapp}. Our team then contacts the student to complete their AAPC enrollment.`,
    "",
    `## ${whyRegister.title}`,
    whyRegister.intro,
    ...whyRegister.points.map((p) => `- ${p.lead}: ${p.rest}`),
    whyRegister.closing,
    whyRegister.tagline,
    "",
    "## Services",
    services,
    "",
    `Free billing audit: ${contactFacts.auditUrl}. Quotes and questions: ${contactFacts.contactUrl}.`,
  ].join("\n");
}
