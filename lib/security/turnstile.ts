import "server-only";

import { serverEnv } from "@/lib/server-env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token (docs/11 §4). Opt-in (ADR-036): without a secret key
 * the check is off and the rate limits (plus the chatbot's daily model cap) are the bot
 * protection; once TURNSTILE_SECRET_KEY is set, a missing or bad token fails.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!serverEnv.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret: serverEnv.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: ip,
  });
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
