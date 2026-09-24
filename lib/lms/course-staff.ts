import "server-only";

import { authorize, type SessionUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";

/**
 * For builder actions and upload routes: the caller must be an admin (with MFA) or the
 * course's instructor. Returns the session and course id, or null.
 */
export async function authorizeCourseStaff(
  courseId: string,
): Promise<{ session: SessionUser; courseId: string } | null> {
  const session = await authorize(["instructor", "admin"]);
  if (!session) return null;
  if (session.profile.role === "admin") return { session, courseId };
  const { data } = await createAdminClient()
    .from("courses")
    .select("instructor_id")
    .eq("id", courseId)
    .maybeSingle();
  return data?.instructor_id === session.user.id ? { session, courseId } : null;
}

/** Course id for a lesson (via its module). */
export async function courseIdForLesson(lessonId: string): Promise<string | null> {
  const db = createAdminClient();
  const { data: lesson } = await db
    .from("lessons")
    .select("module_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return null;
  const { data: moduleRow } = await db
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .maybeSingle();
  return moduleRow?.course_id ?? null;
}

export async function courseIdForModule(moduleId: string): Promise<string | null> {
  const { data } = await createAdminClient()
    .from("modules")
    .select("course_id")
    .eq("id", moduleId)
    .maybeSingle();
  return data?.course_id ?? null;
}

/** Writes an audit_log row for staff changes (docs/10 §2). Never throws. */
export async function audit(
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  diff: Record<string, unknown> = {},
): Promise<void> {
  try {
    await createAdminClient()
      .from("audit_log")
      .insert({
        actor_id: actorId,
        action,
        entity,
        entity_id: entityId,
        diff: JSON.parse(JSON.stringify(diff)),
      });
  } catch {
    // Auditing must not break the user's action; Sentry captures server errors.
  }
}
