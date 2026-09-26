import path from "node:path";

import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Inline the (small, Tailwind-purged) CSS so it no longer blocks first render (P2-21).
    inlineCss: true,
  },
  // A stray lockfile higher up the tree would otherwise be picked as the workspace root.
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // "School" was renamed "Education" (ADR-024). The pages still live under app/(marketing)/school,
  // so both /school/... (old links) and /education/... (nav, canonical) render the same page.
  async rewrites() {
    return [
      { source: "/education", destination: "/school" },
      { source: "/education/:path*", destination: "/school/:path*" },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
