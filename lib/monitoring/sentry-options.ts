import type { init } from "@sentry/nextjs";

type SentryOptions = NonNullable<Parameters<typeof init>[0]>;

/**
 * Sentry v11 collects request bodies, cookies, headers and user info by default.
 * This platform must never forward user or patient data to third parties (docs/11),
 * so every collection category is switched off. Stack traces and error messages remain.
 */
export const privacySafeDataCollection: SentryOptions["dataCollection"] = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  stackFrameVariables: false,
};
