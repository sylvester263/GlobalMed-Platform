"use server";

import { redirect } from "next/navigation";

import { addNewsletterContact, emailConfigured, sendEmail } from "@/lib/email/send";
import { NewsletterConfirm } from "@/lib/email/templates/newsletter-confirm";
import { createConfirmToken, readConfirmToken } from "@/lib/newsletter/token";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { absoluteUrl } from "@/lib/seo/metadata";
import { formsDryRun } from "@/lib/server-env";
import { newsletterSchema, type FormResult } from "@/lib/validation/leads";

/** Step 1 of double opt-in: email a signed confirmation link (docs/02 W-14). */
export async function subscribeToNewsletter(input: unknown): Promise<FormResult> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      fieldErrors: { email: parsed.error.issues[0]?.message ?? "Enter a valid email address." },
    };
  }
  if (!(await checkRateLimit("newsletter", await clientIp()))) {
    return { ok: false, message: "Too many requests. Please wait a few minutes and try again." };
  }
  if (formsDryRun()) return { ok: true };

  const token = createConfirmToken(parsed.data.email);
  if (!token || !emailConfigured()) {
    return {
      ok: false,
      message: "Newsletter sign-up is not available yet. Please try again later.",
    };
  }
  const sent = await sendEmail({
    to: parsed.data.email,
    subject: "Confirm your GlobalMed newsletter subscription",
    react: NewsletterConfirm({
      confirmUrl: absoluteUrl(`/newsletter/confirm?token=${encodeURIComponent(token)}`),
    }),
  });
  return sent
    ? { ok: true }
    : { ok: false, message: "We couldn't send the confirmation email. Please try again." };
}

/**
 * Step 2 of double opt-in. Runs on a button press (POST), never on page load, so email
 * link scanners that pre-fetch URLs can't confirm a subscription on someone's behalf.
 */
export async function confirmNewsletter(formData: FormData): Promise<void> {
  const token = formData.get("token");
  const email = typeof token === "string" ? readConfirmToken(token) : null;
  const ok = email ? await addNewsletterContact(email) : false;
  redirect(ok ? "/newsletter/confirm?status=confirmed" : "/newsletter/confirm?status=failed");
}
