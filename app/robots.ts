import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";

const privatePaths = [
  "/api/",
  "/dashboard/",
  "/learn/",
  "/styleguide",
  "/free-billing-audit/thank-you",
  "/newsletter/",
  "/verify/",
];

/**
 * All crawlers, including AI crawlers, are allowed on public pages by default (docs/12 §2).
 * [CLIENT TO CONFIRM] whether to allow AI crawlers — pm/CLIENT_INPUTS_NEEDED.md.
 * "/verify/" blocks individual results (they show a person's name); "/verify" stays open.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: privatePaths }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
