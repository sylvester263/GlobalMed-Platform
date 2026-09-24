import type { Metadata } from "next";

import { site } from "@/lib/site";

type PageMetaInput = {
  /** ≤ 60 chars including the " | GlobalMed" suffix added by the root template. */
  title: string;
  /** ≤ 155 chars (docs/12 §1). */
  description: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Standard per-page metadata: canonical, Open Graph and Twitter card (docs/12 §1). */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.shortName,
      type,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
