import "server-only";

import { headers } from "next/headers";

/** Best-effort client IP for rate limiting. Never stored with leads. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
