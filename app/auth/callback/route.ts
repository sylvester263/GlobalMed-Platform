import { NextResponse, type NextRequest } from "next/server";

import { safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";

/** OAuth (Google, P3-2) and PKCE code exchange → session cookie → safe redirect. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}
