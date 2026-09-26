import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "AAPC Partnership",
  description: "GlobalMed Education's partnership with AAPC.",
  path: "/education/aapc-partnership",
});

/**
 * W-8: published only after the client confirms AAPC's written permission
 * (NEXT_PUBLIC_FEATURE_AAPC=true). Until then the route returns 404 and isn't in the sitemap.
 * No AAPC logo, colours or copy are used without their partner guidelines (CLAUDE.md §5).
 */
export default function AapcPartnershipPage() {
  if (!site.features.aapcPartnership) notFound();
  return (
    <>
      <PageHero
        eyebrow="Partnership"
        title="GlobalMed and AAPC"
        intro="[CLIENT TO CONFIRM] Partnership description approved by AAPC under its partner guidelines."
        crumbs={[
          { name: "Education", path: "/education" },
          { name: "AAPC partnership", path: "/education/aapc-partnership" },
        ]}
      />
      <Section>
        <p className="max-w-prose text-muted-foreground">
          [CLIENT TO CONFIRM] Approved partnership content and partner mark (MG-13 animation added
          once the approved mark is supplied).
        </p>
      </Section>
      <CtaBand
        title="Start preparing for certification"
        href="/education/exam-prep"
        label="See exam preparation"
      />
    </>
  );
}
