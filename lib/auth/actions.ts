"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { safeNext } from "@/lib/auth/redirect";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  loginSchema,
  mfaCodeSchema,
  profileSchema,
  resetRequestSchema,
  signupSchema,
  updatePasswordSchema,
  type AuthFormState,
} from "@/lib/validation/auth";

const UNAVAILABLE: AuthFormState = {
  status: "error",
  message: "Accounts aren't available yet. Please try again later.",
};
const RATE_LIMITED: AuthFormState = {
  status: "error",
  message: "Too many attempts. Please wait a few minutes and try again.",
};

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

async function limited(surface: "authLogin" | "authSignup" | "authReset" | "authMfa") {
  return !(await checkRateLimit(surface, await clientIp()));
}

/** P3-1: email + password sign-in. */
export async function signIn(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const raw = {
    email: text(form, "email"),
    password: text(form, "password"),
    next: text(form, "next"),
  };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrors(parsed.error),
      values: { email: raw.email },
    };
  }
  if (await limited("authLogin")) return { ...RATE_LIMITED, values: { email: raw.email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    // Don't reveal whether the email exists; do explain the unconfirmed-email case.
    const unconfirmed = error.code === "email_not_confirmed";
    return {
      status: "error",
      message: unconfirmed
        ? "Please confirm your email first. We've sent you a link; check your spam folder too."
        : "That email and password don't match. Check them and try again.",
      values: { email: parsed.data.email },
    };
  }
  redirect(safeNext(parsed.data.next));
}

/** P3-1: sign-up. Email confirmation is required before sign-in (Supabase setting). */
export async function signUp(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const raw = {
    fullName: text(form, "fullName"),
    email: text(form, "email"),
    password: text(form, "password"),
    next: text(form, "next"),
  };
  const parsed = signupSchema.safeParse(raw);
  const values = { fullName: raw.fullName, email: raw.email };
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values };
  if (await limited("authSignup")) return { ...RATE_LIMITED, values };

  const next = safeNext(parsed.data.next);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // handle_new_user() copies full_name into profiles (0001_init.sql).
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: absoluteUrl(`/auth/confirm?next=${encodeURIComponent(next)}`),
    },
  });
  if (error) {
    if (error.code === "weak_password") {
      return {
        status: "error",
        fieldErrors: {
          password: "That password is too common or has appeared in a data breach. Choose another.",
        },
        values,
      };
    }
    return {
      status: "error",
      message: "We couldn't create your account. Please try again.",
      values,
    };
  }
  // Same response whether or not the email was already registered (no account enumeration).
  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

/** P3-1: request a password reset link. Always reports success (no account enumeration). */
export async function requestPasswordReset(
  _prev: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const raw = { email: text(form, "email") };
  const parsed = resetRequestSchema.safeParse(raw);
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrors(parsed.error), values: raw };
  if (await limited("authReset")) return { ...RATE_LIMITED, values: raw };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: absoluteUrl("/auth/confirm?next=/reset-password/update"),
  });
  return {
    status: "success",
    message:
      "If an account exists for that email, a reset link is on its way. It expires in one hour.",
  };
}

/** P3-1: set a new password (after the reset link signs the user in). */
export async function updatePassword(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const parsed = updatePasswordSchema.safeParse({
    password: text(form, "password"),
    confirm: text(form, "confirm"),
  });
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const message =
      error.code === "weak_password"
        ? "That password is too common or has appeared in a data breach. Choose another."
        : error.code === "same_password"
          ? "Choose a password you haven't used for this account before."
          : "Your reset link may have expired. Request a new one and try again.";
    return { status: "error", fieldErrors: { password: message } };
  }
  redirect("/dashboard?password=updated");
}

/** P3-2: Google sign-in (provider configured in Supabase; client input). */
export async function signInWithGoogle(form: FormData): Promise<void> {
  if (!isSupabaseConfigured()) redirect("/login?error=unavailable");
  const next = safeNext(text(form, "next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: absoluteUrl(`/auth/callback?next=${encodeURIComponent(next)}`) },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login?signed_out=1");
}

/** P3-6: complete the MFA challenge for this session (aal1 → aal2). */
export async function verifyMfaChallenge(
  _prev: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const parsed = mfaCodeSchema.safeParse({
    code: text(form, "code"),
    factorId: text(form, "factorId"),
  });
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  if (await limited("authMfa")) return RATE_LIMITED;

  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: parsed.data.factorId,
    code: parsed.data.code,
  });
  if (error) {
    return {
      status: "error",
      fieldErrors: {
        code: "That code didn't work. Codes change every 30 seconds; try the current one.",
      },
    };
  }
  redirect(safeNext(text(form, "next")));
}

/** P3-6: start TOTP enrollment. Returns the QR code (SVG data URL) and secret. */
export async function startMfaEnrollment(): Promise<
  { ok: true; factorId: string; qrCode: string; secret: string } | { ok: false; message: string }
> {
  if (!isSupabaseConfigured() || !(await getSessionUser())) {
    return { ok: false, message: "Please sign in again." };
  }
  const supabase = await createClient();
  // Remove abandoned, unverified factors so a fresh QR code can be issued.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const factor of factors?.all ?? []) {
    if (factor.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
  });
  if (error || !data) return { ok: false, message: "We couldn't start set-up. Please try again." };
  return { ok: true, factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

/** P3-6: confirm TOTP enrollment with the first code. */
export async function confirmMfaEnrollment(
  _prev: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return UNAVAILABLE;
  const parsed = mfaCodeSchema.safeParse({
    code: text(form, "code"),
    factorId: text(form, "factorId"),
  });
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  if (await limited("authMfa")) return RATE_LIMITED;

  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: parsed.data.factorId,
    code: parsed.data.code,
  });
  if (error) {
    return {
      status: "error",
      fieldErrors: {
        code: "That code didn't work. Check your app shows GlobalMed and try the current code.",
      },
    };
  }
  revalidatePath("/dashboard/account");
  return { status: "success", message: "Two-step verification is on." };
}

/** A-4: update your own profile. RLS stops anyone changing their own role (0001_init.sql). */
export async function updateProfile(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const session = await getSessionUser();
  if (!session) return { status: "error", message: "Please sign in again." };
  const raw = {
    fullName: text(form, "fullName"),
    certificateName: text(form, "certificateName"),
    country: text(form, "country"),
    phone: text(form, "phone"),
  };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrors(parsed.error), values: raw };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      certificate_name: parsed.data.certificateName,
      country: parsed.data.country || null,
      phone: parsed.data.phone || null,
    })
    .eq("id", session.user.id);
  if (error)
    return {
      status: "error",
      message: "We couldn't save your changes. Please try again.",
      values: raw,
    };
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Profile saved.", values: raw };
}
