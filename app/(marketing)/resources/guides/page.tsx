import { FileText } from "lucide-react";
import type { Metadata } from "next";

import { PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { guides } from "@/content/company";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Guides and Downloads",
  description:
    "Free checklists and guides for practices and students: clean claims, denial reason codes and starting a coding career.",
  path: "/resources/guides",
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides and downloads"
        intro="Practical checklists from our billing and coding team. New guides are announced in our monthly newsletter; sign up in the footer."
        crumbs={[{ name: "Guides", path: "/resources/guides" }]}
      />
      <Section>
        <ul className="grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.title} className="flex flex-col gap-3 rounded-lg border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-md bg-mint text-teal-deep">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <Badge variant="neutral">For {guide.audience.toLowerCase()}</Badge>
              <h2 className="text-xl">{guide.title}</h2>
              <p className="text-muted-foreground">{guide.body}</p>
              <p className="mt-auto text-sm font-semibold text-muted-foreground">Coming soon</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
