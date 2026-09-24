import "server-only";

import { formsDryRun, serverEnv } from "@/lib/server-env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token (docs/11 §4). Fails closed: without a secret
 * key, only the local dry-run mode passes.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!serverEnv.TURNSTILE_SECRET_KEY) return formsDryRun();
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
