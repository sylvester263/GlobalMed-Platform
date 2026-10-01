import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Prose } from "@/components/marketing/prose";
import { PageHero, Section } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd, newsArticleJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLiveUpdate, updateImageUrl } from "@/lib/updates/data";
import { categoryLabel, formatUpdateDate } from "@/lib/updates/logic";

type Props = { params: Promise<{ slug: string }> };

/** Only live updates with a full text have their own page. */
async function load(slug: string) {
  const update = await getLiveUpdate(slug);
  return update?.bodyMd ? update : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const update = await load((await params).slug);
  if (!update) return { robots: { index: false } };
  return pageMetadata({
    // The share image comes from ./opengraph-image (the update's photo, or the default card).
    defaultImage: false,
    title: update.title.length > 48 ? `${update.title.slice(0, 45).trimEnd()}…` : update.title,
    description: update.summary,
    path: `/updates/${update.slug}`,
    type: "article",
    publishedTime: update.publishAt,
  });
}

export default async function UpdatePage({ params }: Props) {
  const update = await load((await params).slug);
  if (!update) notFound();
  const path = `/updates/${update.slug}`;
  const imageUrl = updateImageUrl(update.imagePath);
  const external = update.linkUrl?.startsWith("http");

  return (
    <>
      <JsonLd
        data={newsArticleJsonLd({
          title: update.title,
          description: update.summary,
          path,
          publishedAt: update.publishAt,
          image: imageUrl,
        })}
      />
      <PageHero
        eyebrow={categoryLabel(update.category)}
        title={update.title}
        intro={update.summary}
        crumbs={[
          { name: "Updates", path: "/updates" },
          { name: update.title, path },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          <time dateTime={update.publishAt}>{formatUpdateDate(update.publishAt)}</time>
        </p>
      </PageHero>
      <Section tone="white" className="gap-8">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            width={1600}
            height={900}
            unoptimized
            className="aspect-video w-full max-w-4xl rounded-2xl object-cover"
          />
        )}
        <Prose markdown={update.bodyMd ?? ""} />
        {update.linkUrl && update.linkLabel && (
          <Link
            href={update.linkUrl}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={buttonVariants({ size: "lg", className: "self-start" })}
          >
            {update.linkLabel} <ArrowRight aria-hidden="true" />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </Link>
        )}
        <Link href="/updates" className="font-semibold text-primary underline underline-offset-4">
          All updates
        </Link>
      </Section>
    </>
  );
}
