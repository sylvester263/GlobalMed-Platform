import { privacySafeDataCollection } from "@/lib/monitoring/sentry-options";

// The Sentry browser SDK is ~65 kB gzipped, so it loads lazily and only when a DSN is set.
// NEXT_PUBLIC_* is inlined at build time, so without a DSN the import is never requested.
type SentryModule = typeof import("@sentry/nextjs");

let sentry: SentryModule | undefined;

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  void import("@sentry/nextjs").then((mod) => {
    mod.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      dataCollection: privacySafeDataCollection,
    });
    sentry = mod;
  });
}

export function onRouterTransitionStart(
  ...args: Parameters<SentryModule["captureRouterTransitionStart"]>
) {
  sentry?.captureRouterTransitionStart(...args);
}
