import { getCourses, getServices, getSpecialties } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

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
    "GlobalMed does not collect patient information (PHI) through its website, courses or chatbot.",
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
    `## ${site.schoolName}`,
    "Online courses with rewatchable video lessons, quizzes, timed mock exams and verifiable certificates. Payment by card in USD, or in PKR by bank transfer, JazzCash or Easypaisa.",
    ...getCourses().map(
      (c) =>
        `- [${c.title}](${absoluteUrl(`/school/courses/${c.slug}`)}): ${c.summary} (${c.hours} hours, ${usd.format(c.priceUsd)})`,
    ),
    `- [Verify a certificate](${absoluteUrl("/verify")})`,
    "",
    "## Contact",
    `- Email: ${site.contact.email}`,
    `- US phone: ${site.contact.phoneUs} (${site.contact.hoursUs})`,
    `- Pakistan phone: ${site.contact.phonePk} (${site.contact.hoursPk})`,
    `- [Contact page](${absoluteUrl("/contact")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
