import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/env";

import type { Database } from "./types";

/** Paths that need a signed-in user. Role checks happen in layouts and actions (requireArea). */
export function isProtectedPath(pathname: string): boolean {
  return /^\/(dashboard|learn)(\/|$)/.test(pathname);
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(`${request.nextUrl.pathname}${request.nextUrl.search}`)}`;
  return NextResponse.redirect(url);
}

/**
 * Refreshes the Supabase session cookie and gates protected paths. Without Supabase
 * configured, protected paths fail closed to /login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectedPath = isProtectedPath(request.nextUrl.pathname);

  if (!isSupabaseConfigured()) {
    return protectedPath ? redirectToLogin(request) : response;
  }

  const { url, anonKey } = getSupabasePublicConfig();
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not put code between createServerClient and getUser(): it revalidates the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && protectedPath) return redirectToLogin(request);
  return response;
}
