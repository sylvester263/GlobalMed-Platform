import { contactLinks, doctorPortalLabel, doctorPortalUrl } from "@/data/site";

/**
 * Temporary maintenance mode (ADR-038). With MAINTENANCE_MODE=true, middleware answers every
 * page with a branded "Coming Soon" page (503). The team previews the real site by opening any
 * page with ?preview=<MAINTENANCE_KEY>, which sets a 24-hour cookie. Runs in middleware, so it
 * only uses Web APIs.
 */

export const PREVIEW_PARAM = "preview";
export const PREVIEW_COOKIE = "gm_preview";
export const PREVIEW_MAX_AGE = 60 * 60 * 24;
/** Seconds a crawler should wait before trying again. */
export const RETRY_AFTER = 3600;

export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.trim().toLowerCase() === "true";
}

/** The preview key, or null when unset or too short to be safe (preview is then off). */
export function getMaintenanceKey(): string | null {
  const key = process.env.MAINTENANCE_KEY?.trim();
  return key && key.length >= 16 ? key : null;
}

/** Paths that stay reachable for everyone: health check, webhooks and static files. */
export function isMaintenanceExempt(pathname: string): boolean {
  if (pathname === "/api/health") return true;
  // Webhooks verify their own signatures; a 503 would only make the senders retry.
  if (/^\/api\/(stripe|whatsapp|video)\/webhook(\/|$)/.test(pathname)) return true;
  if (pathname.startsWith("/_next/") || pathname === "/robots.txt") return true;
  // Static assets in public/. Not .txt/.xml: llms.txt and the sitemap describe the site.
  return /\.(png|jpe?g|jfif|gif|webp|avif|svg|ico|woff2?|ttf|otf|css|js|map|mp4|webm|lottie|riv)$/i.test(
    pathname,
  );
}

/** The cookie value: a SHA-256 of the key, so the key itself is never stored in the browser. */
export async function previewToken(key: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`gm-preview:${key}`),
  );
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The Coming Soon page: self-contained HTML, so it needs nothing from the app to render. */
export function comingSoonHtml(): string {
  const email = escapeHtml(contactLinks.email);
  const phone = escapeHtml(contactLinks.mobile.display);
  const tel = escapeHtml(contactLinks.mobile.href);
  const portal = escapeHtml(doctorPortalUrl);
  const portalLabel = escapeHtml(doctorPortalLabel);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Coming soon — GlobalMed Transcriptions</title>
<link rel="icon" href="/favicon.ico">
<style>
  :root { --navy: #283F93; --navy-deep: #1F3278; --sky: #51ACE3; --white: #fff; }
  * { box-sizing: border-box; margin: 0; }
  html, body { min-height: 100%; }
  body {
    min-height: 100vh; min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 16px;
    background: radial-gradient(120% 90% at 50% 0%, var(--navy) 0%, var(--navy-deep) 70%);
    color: var(--white);
    font-family: "Public Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    text-align: center;
  }
  main { width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; gap: 28px; }
  .logo { display: inline-flex; background: var(--white); border-radius: 12px; padding: 10px 16px; }
  .logo img { display: block; height: 48px; width: auto; }
  h1 {
    font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
    font-weight: 600; letter-spacing: -0.01em; line-height: 1.1;
    font-size: clamp(2rem, 6vw, 3.25rem); text-wrap: balance;
  }
  .lead { font-size: 1.125rem; line-height: 1.6; color: rgba(255,255,255,.88); }
  .rule { width: 64px; height: 3px; border-radius: 2px; background: var(--sky); }
  .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px; font-size: 1rem; }
  a { color: var(--white); text-decoration: underline; text-underline-offset: 4px; }
  a:hover { color: #DCEFFB; }
  a:focus-visible { outline: 2px solid var(--white); outline-offset: 3px; border-radius: 4px; }
  .contact a { display: inline-flex; align-items: center; min-height: 44px; }
  .portal {
    display: inline-flex; align-items: center; min-height: 44px; padding: 0 20px;
    border: 1px solid rgba(255,255,255,.6); border-radius: 999px; text-decoration: none; font-weight: 600;
  }
  .portal:hover { background: rgba(255,255,255,.1); color: var(--white); }
  footer { font-size: .8125rem; color: rgba(255,255,255,.7); }
</style>
</head>
<body>
<main>
  <span class="logo"><img src="/images/brand/globalmed-logo-horizontal.png" alt="GlobalMed Transcriptions logo" width="800" height="174"></span>
  <h1>Something new is coming</h1>
  <div class="rule" aria-hidden="true"></div>
  <p class="lead">GlobalMed Transcriptions — launching soon</p>
  <p class="contact">
    <a href="mailto:${email}">${email}</a>
    <a href="${tel}">${phone}</a>
  </p>
  <a class="portal" href="${portal}" target="_blank" rel="noopener noreferrer">${portalLabel}<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"> (opens in a new tab)</span></a>
  <footer>Designed &amp; developed by SylJo Tech</footer>
</main>
</body>
</html>`;
}

export function comingSoonResponse(): Response {
  return new Response(comingSoonHtml(), {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": String(RETRY_AFTER),
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
