import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, formatPkr, formatUsd, PageHero, Section } from "@/components/marketing/sections";
import { PathwayLine } from "@/components/motion/pathway-line";
import { buttonVariants } from "@/components/ui/button";
import { getPathways } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Certification Pathways",
  description:
    "Guided pathways from beginner to certification-ready in medical billing and coding, with bundle pricing in USD or PKR.",
  path: "/education/pathways",
});

export default function PathwaysPage() {
  const pathways = getPathways();
  return (
    <>
      <PageHero
        eyebrow="Certification pathways"
        title="A clear route from beginner to certified"
        intro="Pathways put the right courses in the right order, so you always know what to learn next. Buy the bundle and save."
        crumbs={[
          { name: "Education", path: "/education" },
          { name: "Pathways", path: "/education/pathways" },
        ]}
      />
      {pathways.map((p, i) => (
        <Section
          key={p.slug}
          tone={i % 2 === 0 ? "ledger" : "white"}
          title={p.title}
          intro={p.summary}
        >
          <PathwayLine
            stages={p.steps.map((s) => ({ label: s.label, description: s.description }))}
            current={0}
          />
          <div className="flex flex-wrap items-center gap-6">
            <p>
              <span className="font-serif text-3xl font-semibold">
                {formatUsd(p.bundlePriceUsd)}
              </span>{" "}
              <span className="text-sm text-muted-foreground">
                or {formatPkr(p.bundlePricePkr)} for the bundle
              </span>
            </p>
            <Link href={`/education/pathways/${p.slug}`} className={buttonVariants({ size: "lg" })}>
              View this pathway
            </Link>
          </div>
        </Section>
      ))}
      <CtaBand
        title="Not sure where to start?"
        body="Tell us about your background and goals, and we'll recommend a starting course."
        href="/contact"
        label="Ask an advisor"
      />
    </>
  );
}
