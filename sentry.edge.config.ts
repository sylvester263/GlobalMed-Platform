import * as Sentry from "@sentry/nextjs";

import { privacySafeDataCollection } from "@/lib/monitoring/sentry-options";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: 0.1,
  dataCollection: privacySafeDataCollection,
});
