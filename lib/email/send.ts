import "server-only";

import type { ReactElement } from "react";
import { Resend } from "resend";

import { serverEnv } from "@/lib/server-env";

const resend = serverEnv.RESEND_API_KEY ? new Resend(serverEnv.RESEND_API_KEY) : null;

export function emailConfigured(): boolean {
  return resend !== null;
}

type SendInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
};

/** Sends through Resend. Returns false (never throws) so callers decide how to degrade. */
export async function sendEmail({ to, subject, react, replyTo }: SendInput): Promise<boolean> {
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to,
      subject,
      react,
      replyTo,
    });
    return !error;
  } catch {
    return false;
  }
}

/** Adds a confirmed subscriber to the Resend newsletter segment (newsletter double opt-in). */
export async function addNewsletterContact(email: string): Promise<boolean> {
  if (!resend || !serverEnv.RESEND_SEGMENT_ID) return false;
  try {
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: serverEnv.RESEND_SEGMENT_ID }],
    });
    return !error;
  } catch {
    return false;
  }
}
