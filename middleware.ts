import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/db/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only routes that use the session. Static marketing pages skip the Supabase round-trip.
  // Webhooks are excluded: they verify their own signatures.
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/login",
    "/signup",
    "/reset-password/:path*",
    "/mfa",
    "/auth/:path*",
    "/api/((?!stripe/webhook|whatsapp/webhook).*)",
  ],
};
