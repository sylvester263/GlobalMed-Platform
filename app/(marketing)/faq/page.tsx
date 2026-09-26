import type { Metadata } from "next";

import { CtaBand, FaqList, PageHero, Section } from "@/components/marketing/sections";
import { faqGroups } from "@/content/company";
import { faqJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about GlobalMed's billing services, free audits, HIPAA, and AAPC's CPC® and CPB® online courses offered through GlobalMed.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      >
        <nav aria-label="FAQ topics">
          <ul className="flex flex-wrap gap-2">
            {faqGroups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex h-10 items-center rounded-full border bg-card px-4 text-sm font-semibold hover:bg-mint"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      {faqGroups.map((group, i) => (
        <Section key={group.id} id={group.id} title={group.title} tone={i % 2 ? "white" : "ledger"}>
          <FaqList faqs={group.faqs} withJsonLd={false} />
        </Section>
      ))}
      {/* One FAQPage object for the whole page rather than one per group. */}
      <JsonLd data={faqJsonLd(faqGroups.flatMap((g) => g.faqs))} />
      <CtaBand title="Didn't find your answer?" href="/contact" label="Ask us directly" />
    </>
  );
}
