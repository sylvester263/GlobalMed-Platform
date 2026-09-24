import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { getLearnerCourse, getLessonContent } from "@/lib/lms/course-data";
import { createAdminClient } from "@/lib/db/admin";
import { playbackUrls } from "@/lib/video/bunny";

export const dynamic = "force-dynamic";

const querySchema = z.object({ lessonId: z.uuid() });
const captionsSchema = z
  .object({ captions: z.array(z.object({ srclang: z.string(), label: z.string() })).default([]) })
  .catch({ captions: [] });

function deny(status: 401 | 403 | 404 | 409 | 503, message: string) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * P4-3: signed Bunny playback for one lesson. Only staff, free previews, or an active,
 * unlocked enrollment get URLs; they expire after 2 hours (docs/08 §2).
 */
export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({ lessonId: request.nextUrl.searchParams.get("lessonId") });
  if (!parsed.success) return deny(404, "Lesson not found.");

  const session = await getSessionUser();
  if (!session) return deny(401, "Please sign in.");

  const db = createAdminClient();
  const { data: lesson } = await db
    .from("lessons")
    .select("module_id")
    .eq("id", parsed.data.lessonId)
    .maybeSingle();
  if (!lesson) return deny(404, "Lesson not found.");
  const { data: moduleRow } = await db
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .single();
  const { data: course } = moduleRow
    ? await db.from("courses").select("slug").eq("id", moduleRow.course_id).single()
    : { data: null };
  if (!course) return deny(404, "Lesson not found.");

  const learner = await getLearnerCourse(course.slug, session.user.id, session.profile.role);
  const item = learner?.lessons.find((l) => l.id === parsed.data.lessonId);
  if (!learner || !item) return deny(404, "Lesson not found.");
  if (!item.canView) return deny(403, "Enroll in this course to watch this lesson.");

  const content = await getLessonContent(item.id);
  if (!content?.bunny_video_id || content.video_status !== "ready") {
    return deny(409, "This video is still processing. Try again in a few minutes.");
  }
  const urls = playbackUrls(
    content.bunny_video_id,
    captionsSchema.parse(content.video_meta).captions,
  );
  if (!urls) return deny(503, "Video playback isn't available right now.");

  return NextResponse.json(
    { ...urls, resumeAt: item.completed ? 0 : item.positionSec, completed: item.completed },
    { headers: { "Cache-Control": "no-store" } },
  );
}
