import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { serverEnv } from "@/lib/server-env";

const TTL_MS = 1000 * 60 * 60 * 48; // confirmation links expire after 48 hours

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Signed, expiring token for the double opt-in link. Null when no secret is configured. */
export function createConfirmToken(email: string, now = Date.now()): string | null {
  const secret = serverEnv.NEWSLETTER_SECRET;
  if (!secret) return null;
  const payload = `${Buffer.from(email.toLowerCase()).toString("base64url")}.${now + TTL_MS}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the email for a valid, unexpired token, otherwise null. */
export function readConfirmToken(token: string, now = Date.now()): string | null {
  const secret = serverEnv.NEWSLETTER_SECRET;
  if (!secret) return null;
  const [emailPart, expiry, signature] = token.split(".");
  if (!emailPart || !expiry || !signature) return null;

  const expected = Buffer.from(sign(`${emailPart}.${expiry}`, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(expiry) < now) return null;
  return Buffer.from(emailPart, "base64url").toString("utf8");
}
