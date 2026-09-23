import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/db/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip static assets, images and webhooks (webhooks verify their own signatures).
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/whatsapp/webhook|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|lottie|riv)$).*)",
  ],
};
