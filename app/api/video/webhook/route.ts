import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/db/admin";
import { getVideo, isOurLibrary, lessonStatusFor, webhookTokenValid } from "@/lib/video/bunny";

const payloadSchema = z.object({
  VideoLibraryId: z.union([z.number(), z.string()]),
  VideoGuid: z.string(),
  Status: z.number(),
});

/**
 * Bunny Stream status webhook (P4-2). Authenticated by a secret in the URL; the payload is
 * then treated only as a hint — the video's real status, length and captions are fetched
 * from the Bunny API before anything is written.
 */
export async function POST(request: NextRequest) {
  if (!webhookTokenValid(request.nextUrl.searchParams.get("token"))) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isOurLibrary(parsed.data.VideoLibraryId)) {
    return NextResponse.json({ ok: true }); // Acknowledge and ignore anything that isn't ours.
  }

  const video = await getVideo(parsed.data.VideoGuid);
  if (!video) return NextResponse.json({ error: "Video lookup failed" }, { status: 502 });

  await createAdminClient()
    .from("lessons")
    .update({
      video_status: lessonStatusFor(video),
      duration_sec: video.length > 0 ? Math.round(video.length) : null,
      video_meta: {
        captions: video.captions,
        width: video.width ?? null,
        height: video.height ?? null,
      },
    })
    .eq("bunny_video_id", video.guid);

  return NextResponse.json({ ok: true });
}
