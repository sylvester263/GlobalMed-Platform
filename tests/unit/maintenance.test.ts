import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PREVIEW_COOKIE, isMaintenanceExempt, previewToken } from "@/lib/maintenance";
import { middleware } from "@/middleware";

vi.mock("@/lib/db/middleware", () => ({
  updateSession: vi.fn(async () => new Response("session", { status: 200 })),
}));

const KEY = "test-preview-key-0123456789";
const req = (path: string, cookie?: string) =>
  new NextRequest(`https://example.com${path}`, cookie ? { headers: { cookie } } : undefined);

describe("maintenance mode", () => {
  beforeEach(() => {
    vi.stubEnv("MAINTENANCE_MODE", "true");
    vi.stubEnv("MAINTENANCE_KEY", KEY);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("shows visitors the Coming Soon page with 503, Retry-After and noindex", async () => {
    const res = await middleware(req("/courses"));
    expect(res.status).toBe(503);
    expect(res.headers.get("Retry-After")).toBe("3600");
    expect(res.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    const html = await res.text();
    expect(html).toContain("Something new is coming");
    expect(html).toContain("GlobalMed Transcriptions — launching soon");
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(html).toContain("/app/doctor-login");
  });

  it("keeps health, webhooks and static assets reachable", async () => {
    for (const path of [
      "/api/health",
      "/api/stripe/webhook",
      "/images/brand/globalmed-logo-horizontal.png",
      "/robots.txt",
      "/_next/static/chunks/main.js",
    ]) {
      expect(isMaintenanceExempt(path), path).toBe(true);
    }
    expect(isMaintenanceExempt("/llms.txt")).toBe(false);
    expect(isMaintenanceExempt("/sitemap.xml")).toBe(false);
    expect((await middleware(req("/api/health"))).status).toBe(200);
  });

  it("a correct ?preview= key sets a 24-hour cookie and strips the key from the URL", async () => {
    const res = await middleware(req(`/about?x=1&preview=${KEY}`));
    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe("https://example.com/about?x=1");
    const setCookie = res.headers.get("Set-Cookie") ?? "";
    expect(setCookie).toContain(`${PREVIEW_COOKIE}=${await previewToken(KEY)}`);
    expect(setCookie).toContain("Max-Age=86400");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).not.toContain(KEY);
  });

  it("a wrong key or forged cookie still gets the Coming Soon page", async () => {
    expect((await middleware(req("/?preview=wrong-key-wrong-key-00"))).status).toBe(503);
    expect((await middleware(req("/", `${PREVIEW_COOKIE}=${KEY}`))).status).toBe(503);
  });

  it("the preview cookie shows the real site, uncached and noindex", async () => {
    const res = await middleware(req("/", `${PREVIEW_COOKIE}=${await previewToken(KEY)}`));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(res.headers.get("X-Robots-Tag")).toContain("noindex");
  });

  it("without a key (or a short one) nobody can preview", async () => {
    vi.stubEnv("MAINTENANCE_KEY", "short");
    expect((await middleware(req("/?preview=short"))).status).toBe(503);
  });

  it("is off unless MAINTENANCE_MODE is exactly true", async () => {
    vi.stubEnv("MAINTENANCE_MODE", "false");
    expect((await middleware(req("/courses"))).status).toBe(200);
    vi.stubEnv("MAINTENANCE_MODE", "");
    expect((await middleware(req("/courses"))).status).toBe(200);
  });

  it("still sends session routes through Supabase", async () => {
    vi.stubEnv("MAINTENANCE_MODE", "false");
    expect(await (await middleware(req("/dashboard/student"))).text()).toBe("session");
    expect(await (await middleware(req("/api/stripe/webhook"))).text()).not.toBe("session");
  });
});
