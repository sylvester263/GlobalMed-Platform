import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Prose } from "@/components/marketing/prose";
import { PageHero, Section } from "@/components/marketing/sections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLegalPage, getLegalPages } from "@/lib/content/markdown";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLegalPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getLegalPage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/legal/${page.slug}`,
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export default async function LegalPage({ params }: Props) {
  const page = getLegalPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={page.title}
        crumbs={[{ name: page.title, path: `/legal/${page.slug}` }]}
      >
        <p className="text-sm text-muted-foreground">
          Last updated{" "}
          <time dateTime={page.updatedAt}>
            {dateFormat.format(new Date(`${page.updatedAt}T00:00:00Z`))}
          </time>
        </p>
      </PageHero>
      <Section tone="white">
        {/* docs/11 §6: legal pages need the client's counsel/compliance sign-off before launch. */}
        <Alert variant="warning" className="max-w-prose">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Draft pending legal review</AlertTitle>
          <AlertDescription>
            This page is a working draft and will be finalised by GlobalMed&apos;s legal and
            compliance advisers before launch.
          </AlertDescription>
        </Alert>
        <Prose markdown={page.body} />
      </Section>
    </>
  );
}
