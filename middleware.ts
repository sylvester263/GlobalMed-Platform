import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/db/middleware";
import {
  comingSoonResponse,
  getMaintenanceKey,
  isMaintenanceExempt,
  isMaintenanceMode,
  PREVIEW_COOKIE,
  PREVIEW_MAX_AGE,
  PREVIEW_PARAM,
  previewToken,
  safeEqual,
} from "@/lib/maintenance";

/**
 * Only routes that use the session. Static marketing pages skip the Supabase round-trip.
 * Webhooks are excluded: they verify their own signatures.
 */
const SESSION_PATH =
  /^\/(dashboard|learn|reset-password|auth)(\/|$)|^\/(login|signup|mfa)$|^\/api\/(?!(stripe|whatsapp|video)\/webhook)/;

async function handle(request: NextRequest) {
  return SESSION_PATH.test(request.nextUrl.pathname) ? updateSession(request) : NextResponse.next();
}

/** Maintenance mode (ADR-038): visitors get the Coming Soon page; the team previews with a key. */
async function maintenance(request: NextRequest): Promise<Response> {
  const key = getMaintenanceKey();
  const token = key ? await previewToken(key) : null;
  const { searchParams } = request.nextUrl;

  const offered = searchParams.get(PREVIEW_PARAM);
  if (offered !== null && key && token && safeEqual(offered, key)) {
    // Drop the key from the address bar, history and Referer, then set the cookie.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete(PREVIEW_PARAM);
    const res = NextResponse.redirect(clean, 303);
    res.cookies.set(PREVIEW_COOKIE, token, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: PREVIEW_MAX_AGE,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;
  if (!token || !cookie || !safeEqual(cookie, token)) return comingSoonResponse();

  const res = await handle(request);
  // A shared cache must never hand the real site to the public while maintenance is on.
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

/**
 * One main address (launch, ADR-039): www and the temporary *.hostingersite.com name 301 to the
 * host in NEXT_PUBLIC_SITE_URL. Only those hosts move, so localhost and unknown hosts are left
 * alone. /api/ is skipped: webhooks and health checks must not be bounced.
 */
function canonicalRedirect(request: NextRequest): Response | null {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site || request.nextUrl.pathname.startsWith("/api/")) return null;
  const canonical = new URL(site).host;
  const forwarded = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = (forwarded.split(",")[0] ?? "").trim().toLowerCase();
  if (host !== `www.${canonical}` && !host.endsWith(".hostingersite.com")) return null;
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, site);
  return NextResponse.redirect(target, 301);
}

export async function middleware(request: NextRequest) {
  const moved = canonicalRedirect(request);
  if (moved) return moved;
  if (isMaintenanceMode() && !isMaintenanceExempt(request.nextUrl.pathname)) {
    return maintenance(request);
  }
  return handle(request);
}

export const config = {
  // Every route, so maintenance mode covers the whole site. Built assets never reach middleware.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
