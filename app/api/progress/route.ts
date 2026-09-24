import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { recordProgress } from "@/lib/lms/progress-service";
import { site } from "@/lib/site";

const bodySchema = z.object({
  lessonId: z.uuid(),
  position: z
    .number()
    .min(0)
    .max(24 * 60 * 60),
});

/**
 * Player progress beacons (every 15s, on pause and when the page is hidden — docs/08 §2).
 * Accepts text/plain from navigator.sendBeacon. Same-origin only.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin && origin !== new URL(site.url).origin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const raw = await request.text();
  let json: unknown = null;
  try {
    json = JSON.parse(raw);
  } catch {
    // fall through to validation error
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const result = await recordProgress({
    userId: session.user.id,
    lessonId: parsed.data.lessonId,
    positionSec: parsed.data.position,
  });
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
