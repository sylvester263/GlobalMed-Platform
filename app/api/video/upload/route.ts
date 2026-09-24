import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/db/admin";
import { audit, authorizeCourseStaff, courseIdForLesson } from "@/lib/lms/course-staff";
import { bunnyConfigured, createUpload, deleteVideo } from "@/lib/video/bunny";

const bodySchema = z.object({ lessonId: z.uuid() });

/**
 * P4-2: issues TUS credentials so the browser uploads straight to Bunny (large files never
 * pass through our server). Course instructor or admin only.
 */
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!bunnyConfigured()) {
    return NextResponse.json({ error: "Video uploads aren't set up yet." }, { status: 503 });
  }

  const courseId = await courseIdForLesson(parsed.data.lessonId);
  const staff = courseId ? await authorizeCourseStaff(courseId) : null;
  if (!staff) return NextResponse.json({ error: "You can't edit this course." }, { status: 403 });

  const db = createAdminClient();
  const { data: lesson } = await db
    .from("lessons")
    .select("id, title, type, bunny_video_id")
    .eq("id", parsed.data.lessonId)
    .single();
  if (!lesson || lesson.type !== "video") {
    return NextResponse.json({ error: "Only video lessons take uploads." }, { status: 400 });
  }

  const upload = await createUpload(lesson.title);
  if (!upload)
    return NextResponse.json({ error: "Couldn't start the upload. Try again." }, { status: 502 });

  // Replace any previous video for this lesson.
  if (lesson.bunny_video_id) await deleteVideo(lesson.bunny_video_id);
  await db
    .from("lessons")
    .update({ bunny_video_id: upload.videoId, video_status: "uploading", duration_sec: null })
    .eq("id", lesson.id);
  await audit(staff.session.user.id, "video.upload_started", "lesson", lesson.id, {
    videoId: upload.videoId,
  });

  return NextResponse.json(upload, { headers: { "Cache-Control": "no-store" } });
}
