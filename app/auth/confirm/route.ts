import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";

const allowedTypes = new Set<EmailOtpType>([
  "signup",
  "recovery",
  "email_change",
  "email",
  "invite",
]);

/**
 * Email links (sign-up confirmation, password recovery, email change). Supabase email
 * templates must link to /auth/confirm?token_hash={{ .TokenHash }}&type=…&next=…
 * (SSR pattern; see docs/14 set-up notes).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  if (tokenHash && type && allowedTypes.has(type) && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const target = type === "recovery" ? "/reset-password/update" : next;
      return NextResponse.redirect(new URL(target, origin));
    }
  }
  return NextResponse.redirect(new URL("/login?error=link", origin));
}
