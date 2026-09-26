"use server";

import type { z } from "zod";

import { storeLead } from "@/lib/leads/store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { verifyTurnstile } from "@/lib/security/turnstile";
import {
  aapcRegistrationSchema,
  auditLeadSchema,
  contactLeadSchema,
  type FormResult,
} from "@/lib/validation/leads";

const GENERIC_FAILURE =
  "We couldn't send your request just now. Please try again in a minute, or email us directly.";

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

async function guard(turnstileToken: string | undefined): Promise<FormResult | null> {
  const ip = await clientIp();
  if (!(await checkRateLimit("leadForm", ip))) {
    return { ok: false, message: "Too many requests. Please wait a few minutes and try again." };
  }
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { ok: false, message: "We couldn't confirm you're not a robot. Please try again." };
  }
  return null;
}

/** Free billing audit (docs/02 W-4, P2-5). */
export async function submitAuditRequest(input: unknown): Promise<FormResult> {
  const parsed = auditLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;
  const blocked = await guard(data.turnstileToken);
  if (blocked) return blocked;

  const stored = await storeLead(
    {
      source: "audit_form",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      practice_name: data.practiceName,
      specialty: data.specialty,
      interest: "Free billing audit",
      utm: data.utm ?? {},
      details: {
        claimVolume: data.claimVolume,
        billingSetup: data.billingSetup,
        role: data.role,
        bestTime: data.bestTime,
      },
    },
    [
      { label: "Practice", value: data.practiceName },
      { label: "Specialty", value: data.specialty },
      { label: "Monthly claims", value: data.claimVolume },
      { label: "Billing today", value: data.billingSetup },
      { label: "Contact", value: `${data.name} (${data.role})` },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone ?? "" },
      { label: "Best time", value: data.bestTime },
    ],
  );
  return stored ? { ok: true } : { ok: false, message: GENERIC_FAILURE };
}

/** Contact page enquiry. */
export async function submitContactEnquiry(input: unknown): Promise<FormResult> {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;
  const blocked = await guard(data.turnstileToken);
  if (blocked) return blocked;

  const stored = await storeLead(
    {
      source: "contact",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      practice_name: data.organisation || null,
      interest: data.interest,
      message: data.message,
      utm: data.utm ?? {},
    },
    [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone ?? "" },
      { label: "Organisation", value: data.organisation ?? "" },
      { label: "Interest", value: data.interest },
      { label: "Message", value: data.message },
    ],
  );
  return stored ? { ok: true } : { ok: false, message: GENERIC_FAILURE };
}

/**
 * "Register for AAPC Training" (client, 2026-09-26). Replaces online checkout: the team
 * contacts the student to complete their AAPC enrollment. Stored as a lead with source
 * "aapc_registration" and the course in `interest`, so it shows in the sales pipeline.
 */
export async function submitAapcRegistration(input: unknown): Promise<FormResult> {
  const parsed = aapcRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;
  const blocked = await guard(data.turnstileToken);
  if (blocked) return blocked;

  const stored = await storeLead(
    {
      source: "aapc_registration",
      name: data.name,
      email: data.email,
      phone: data.whatsapp,
      interest: data.course,
      message: data.message || null,
      utm: data.utm ?? {},
      details: {
        course: data.course,
        city: data.city,
        background: data.background,
        contactTime: data.contactTime,
        whatsapp: data.whatsapp,
      },
    },
    [
      { label: "Course", value: data.course },
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "WhatsApp", value: data.whatsapp },
      { label: "City", value: data.city },
      { label: "Background", value: data.background },
      { label: "Preferred contact time", value: data.contactTime },
      { label: "Message", value: data.message ?? "" },
    ],
  );
  return stored ? { ok: true } : { ok: false, message: GENERIC_FAILURE };
}
