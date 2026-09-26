import "server-only";

import { z } from "zod";

const optional = z.string().min(1).optional();

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: optional,
  RESEND_API_KEY: optional,
  RESEND_SEGMENT_ID: optional,
  EMAIL_FROM: z.string().default("GlobalMed <no-reply@globalmedtranscriptions.com>"),
  ADMIN_NOTIFY_EMAIL: optional,
  TURNSTILE_SECRET_KEY: optional,
  UPSTASH_REDIS_REST_URL: optional,
  UPSTASH_REDIS_REST_TOKEN: optional,
  NEWSLETTER_SECRET: optional,
  STRIPE_SECRET_KEY: optional,
  STRIPE_WEBHOOK_SECRET: optional,
  FORMS_DRY_RUN: z.enum(["true", "false"]).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readEnv(): ServerEnv {
  const raw: Record<string, string | undefined> = {};
  for (const key of Object.keys(serverEnvSchema.shape)) {
    raw[key] = process.env[key] || undefined;
  }
  return serverEnvSchema.parse(raw);
}

export const serverEnv = readEnv();

/**
 * Local-only escape hatch: with FORMS_DRY_RUN=true outside production, forms validate and
 * succeed without storing, emailing or verifying Turnstile. Never active in production.
 */
export function formsDryRun(): boolean {
  return serverEnv.NODE_ENV !== "production" && serverEnv.FORMS_DRY_RUN === "true";
}
