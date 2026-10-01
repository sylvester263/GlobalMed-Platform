import { timingSafeEqual } from "node:crypto";

import { syncFromSite } from "@/lib/ai/kb";
import { serverEnv } from "@/lib/server-env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function secretMatches(given: string | null): boolean {
  const expected = serverEnv.KB_SYNC_SECRET;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * POST /api/admin/kb-sync — rebuilds the knowledge base from the live site (`npm run kb:sync`).
 * Needs the KB_SYNC_SECRET header; admins use "Re-sync from website" in the dashboard instead.
 */
export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-kb-sync-secret"))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const report = await syncFromSite();
    return Response.json({ report });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
