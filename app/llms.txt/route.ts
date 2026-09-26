import { features } from "@/config/features";
import { approvedWording } from "@/content/aapc";
import { aapcCourseFacts, aapcCoursePath, getAapcCourses, priceText } from "@/data/courses";
import { getCourses, getServices, getSpecialties } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/metadata";
import { aapcCertificationPath, postalAddress, site } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt (docs/12 §2): a plain summary of the site for AI search engines. */
export function GET() {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "GlobalMed does not collect patient information (PHI) through its website, forms or chatbot.",
    "",
    "## Services for US medical practices",
    ...getServices().map(
      (s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.summary}`,
    ),
    `- [Free billing audit](${absoluteUrl("/free-billing-audit")}): no-cost review of a practice's claims, denials and AR.`,
    "",
    "## Specialties",
    ...getSpecialties().map((s) => `- [${s.name}](${absoluteUrl(`/specialties/${s.slug}`)})`),
    "",
    "## AAPC certification (CPC® and CPB®)",
    approvedWording.partnership,
    `${approvedWording.training} ${approvedWording.certification} ${approvedWording.role}`,
    "GlobalMed does not teach, run classes or issue certificates. All training is online.",
    `- [AAPC Certification in Pakistan](${absoluteUrl(aapcCertificationPath)}): the three AAPC courses, compared.`,
    ...getAapcCourses().map(
      (c) =>
        `- [${c.title}](${absoluteUrl(aapcCoursePath(c.slug))}): ${c.summary} ${aapcCourseFacts.format}, ${c.duration}. Price: ${priceText(c)}.`,
    ),
    // Hidden at client request — GlobalMed education plans are future scope.
    ...(features.globalmedCourses
      ? [
          `## ${site.schoolName}`,
          ...getCourses().map(
            (c) =>
              `- [${c.title}](${absoluteUrl(`/education/courses/${c.slug}`)}): ${c.summary} (${c.hours} hours, ${usd.format(c.priceUsd)})`,
          ),
        ]
      : []),
    ...(features.certificates ? [`- [Verify a certificate](${absoluteUrl("/verify")})`] : []),
    "",
    "## Contact",
    `- Email: ${site.contact.email}`,
    `- Phone: ${site.contact.phone} (${site.contact.hours})`,
    `- WhatsApp: ${site.contact.whatsappDisplay}`,
    `- Address: ${postalAddress}`,
    `- [Contact page](${absoluteUrl("/contact")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
