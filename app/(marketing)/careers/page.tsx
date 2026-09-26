import { Briefcase, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { openRoles } from "@/content/company";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Careers at GlobalMed",
  description:
    "Work with GlobalMed as a medical coder, transcriptionist or AR specialist. See open roles in Lahore and remote.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a healthcare career serving US practices"
        intro="We hire coders, billers, transcriptionists and editors. [CLIENT TO CONFIRM open roles]"
        crumbs={[{ name: "Careers", path: "/careers" }]}
      />
      <Section title="Open roles">
        <ul className="flex flex-col gap-4">
          {openRoles.map((role) => (
            <li
              key={role.title}
              className="flex flex-col gap-3 rounded-lg border bg-card p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl">{role.title}</h3>
                <p className="text-muted-foreground">{role.summary}</p>
                <p className="flex flex-wrap gap-2">
                  <Badge variant="neutral">
                    <MapPin aria-hidden="true" /> {role.location}
                  </Badge>
                  <Badge variant="secondary">
                    <Briefcase aria-hidden="true" /> {role.type}
                  </Badge>
                </p>
              </div>
              <a
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
                className={buttonVariants({ variant: "secondary" })}
              >
                Apply by email
              </a>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground">
          Don&apos;t see a fit? Email your CV to{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-primary underline underline-offset-4"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
