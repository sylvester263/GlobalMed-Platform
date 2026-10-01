import { execSync } from "node:child_process";
import path from "node:path";

import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

import { features } from "./config/features";
import { hiddenRedirects } from "./config/hidden-routes";

// CSP is added in Phase 9 (P9-3) once analytics, Bunny, Stripe and Turnstile origins are final.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/** The commit being built, for /api/health (any host; ADR-032). */
function buildCommit(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  env: { BUILD_COMMIT: buildCommit() },
  poweredByHeader: false,
  // Photos are WebP masters (scripts/optimize-images.mjs); next/image serves AVIF or WebP at
  // these widths (ADR-030). 750/828/1080 are kept for 2x phones.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 960, 1080, 1280, 1920, 2560],
  },
  experimental: {
    // Was true (P2-21) while the CSS was small. At 125 kB it was inlined into every page twice
    // (a <style> tag and the RSC payload), doubling HTML size and main-thread work (ADR-031).
    inlineCss: false,
    // Update images are uploaded through a server action (lib/updates/actions.ts): up to 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
  // Social images for dynamic routes render on request: ship the font, logo and photo
  // backgrounds they read (lib/seo/og-image.tsx) with those functions.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": [
      "./assets/fonts/**",
      "./public/images/og/*-1200.jpg",
      "./public/images/brand/globalmed-logo-horizontal.png",
    ],
  },
  // A stray lockfile higher up the tree would otherwise be picked as the workspace root.
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // "School" was renamed "Education" (ADR-024). The pages still live under app/(marketing)/school,
  // so both /school/... (old links) and /education/... (nav, canonical) render the same page.
  // Hidden education features (config/features.ts) redirect to the AAPC Certification page.
  // Redirects run before the rewrites below, so /school/... and /education/... are both covered.
  async redirects() {
    return hiddenRedirects(features);
  },
  async rewrites() {
    return [
      { source: "/education", destination: "/school" },
      { source: "/education/:path*", destination: "/school/:path*" },
    ];
  },
};

// `ANALYZE=true npm run build` writes .next/analyze/client.json (bundle sizes per module).
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
  analyzerMode: "json",
});

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
