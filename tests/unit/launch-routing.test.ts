import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { doctorPortalRedirects, legacyRedirects } from "@/config/legacy-redirects";
import { middleware } from "@/middleware";

vi.mock("@/lib/db/middleware", () => ({
  updateSession: vi.fn(async () => new Response("session", { status: 200 })),
}));

const SITE = "https://globalmedtranscriptions.com";
const onHost = (host: string, path: string) =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });

describe("canonical host (ADR-039)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
    vi.stubEnv("MAINTENANCE_MODE", "false");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("301s www to the main domain, keeping path and query", async () => {
    const res = await middleware(onHost("www.globalmedtranscriptions.com", "/about?x=1"));
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe(`${SITE}/about?x=1`);
  });

  it("301s the temporary hostingersite.com address", async () => {
    const res = await middleware(onHost("papayawhip-narwhal-751592.hostingersite.com", "/"));
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe(`${SITE}/`);
  });

  it("leaves the main domain, localhost and /api/ alone", async () => {
    expect((await middleware(onHost("globalmedtranscriptions.com", "/about"))).status).toBe(200);
    expect((await middleware(onHost("localhost:3000", "/about"))).status).toBe(200);
    const api = await middleware(onHost("www.globalmedtranscriptions.com", "/api/health"));
    expect(api.status).toBe(200);
  });
});

describe("old WordPress URLs", () => {
  const to = (source: string) => legacyRedirects.find((r) => r.source === source)?.destination;

  it("maps the main old pages to their new pages with 301", () => {
    expect(to("/about-us")).toBe("/about");
    expect(to("/contact-us")).toBe("/contact");
    expect(to("/medical-transcription-services")).toBe("/services/medical-transcription");
    expect(to("/legal-medical-transcription")).toBe("/services/medical-transcription");
    expect(to("/gmt-blog")).toBe("/blog");
    expect(legacyRedirects.every((r) => r.statusCode === 301)).toBe(true);
  });

  it("never redirects a page that still exists on the new site", () => {
    const live = ["/", "/services", "/faq", "/careers", "/blog", "/about", "/contact"];
    expect(legacyRedirects.filter((r) => live.includes(r.source))).toEqual([]);
  });

  it("forwards the doctor portal temporarily", () => {
    expect(doctorPortalRedirects.every((r) => !r.permanent)).toBe(true);
    expect(doctorPortalRedirects.map((r) => r.source)).toEqual(["/app", "/app/:path*"]);
  });
});
