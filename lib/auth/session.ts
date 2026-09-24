import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { canAccess, type DashboardArea, type Role } from "@/lib/auth/roles";
import { createClient } from "@/lib/db/server";
import type { Tables } from "@/lib/db/types";
import { isSupabaseConfigured } from "@/lib/env";

export type SessionUser = {
  user: User;
  profile: Tables<"profiles">;
};

/**
 * The signed-in user and their profile, or null. `getUser()` revalidates the session with
 * Supabase Auth (never trust the cookie alone), and the role comes from `profiles`, never
 * from the browser (CLAUDE.md §4). Cached per request.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  // Always render per request. Without this, a build with Supabase unconfigured would
  // prerender every dashboard as a static redirect to /login.
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return null;
  return { user, profile };
});

/** Redirects to /login (returning here afterwards) unless someone is signed in. */
export async function requireUser(returnTo: string): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return session;
}

/** Current and possible authenticator assurance levels (MFA) for this session. */
export async function getAssurance(): Promise<{ current: string | null; next: string | null }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return { current: data?.currentLevel ?? null, next: data?.nextLevel ?? null };
}

/**
 * docs/11 §2: admin accounts require MFA. Admins without a verified factor are sent to set
 * one up; admins with one who haven't completed it this session are sent to the challenge.
 */
export async function requireAdminMfa(returnTo: string): Promise<void> {
  const { current, next } = await getAssurance();
  if (current === "aal2") return;
  if (next === "aal2") redirect(`/mfa?next=${encodeURIComponent(returnTo)}`);
  redirect("/dashboard/account?mfa=required#security");
}

/**
 * Guards a dashboard area: signed in, allowed role, and MFA-verified if the user is an
 * admin. Use in every area layout AND every server action/route handler for that area.
 */
export async function requireArea(area: DashboardArea, returnTo: string): Promise<SessionUser> {
  const session = await requireUser(returnTo);
  if (!canAccess(session.profile.role, area)) redirect("/dashboard?denied=1");
  if (session.profile.role === "admin") await requireAdminMfa(returnTo);
  return session;
}

/**
 * For Server Actions and route handlers: returns the session if the caller has one of the
 * roles (and MFA for admins), otherwise null — the caller returns a 401/403-style result.
 */
export async function authorize(allowed: Role[]): Promise<SessionUser | null> {
  const session = await getSessionUser();
  if (!session || !allowed.includes(session.profile.role)) return null;
  if (session.profile.role === "admin") {
    const { current } = await getAssurance();
    if (current !== "aal2") return null;
  }
  return session;
}
