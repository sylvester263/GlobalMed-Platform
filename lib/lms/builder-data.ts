import "server-only";

import { notFound, redirect } from "next/navigation";

import type { SessionUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";

/** Courses a staff member can edit: all for admins, their own for instructors. */
export async function listEditableCourses(session: SessionUser) {
  const db = createAdminClient();
  let query = db
    .from("courses")
    .select("id, slug, title, status, price_usd, updated_at, instructor_id")
    .order("updated_at", { ascending: false });
  if (session.profile.role !== "admin") query = query.eq("instructor_id", session.user.id);
  const { data: courses } = await query;
  const ids = (courses ?? []).map((c) => c.id);
  const { data: modules } = ids.length
    ? await db.from("modules").select("id, course_id").in("course_id", ids)
    : { data: [] };
  const { data: lessons } = modules?.length
    ? await db
        .from("lessons")
        .select("module_id")
        .in(
          "module_id",
          modules.map((m) => m.id),
        )
    : { data: [] };
  return (courses ?? []).map((c) => {
    const moduleIds = new Set((modules ?? []).filter((m) => m.course_id === c.id).map((m) => m.id));
    return { ...c, lessonCount: (lessons ?? []).filter((l) => moduleIds.has(l.module_id)).length };
  });
}

/** Everything the builder needs for one course, after an ownership check. */
export async function getBuilderCourse(courseId: string, session: SessionUser) {
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) notFound();
  const db = createAdminClient();
  const { data: course } = await db.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (!course) notFound();
  if (session.profile.role !== "admin" && course.instructor_id !== session.user.id) {
    redirect("/dashboard/instructor/courses?denied=1");
  }
  const { data: modules } = await db
    .from("modules")
    .select("id, title, position")
    .eq("course_id", courseId)
    .order("position");
  const { data: lessons } = modules?.length
    ? await db
        .from("lessons")
        .select(
          "id, module_id, title, type, position, is_preview, required, video_status, duration_sec, unlock_rule",
        )
        .in(
          "module_id",
          modules.map((m) => m.id),
        )
        .order("position")
    : { data: [] };
  const { data: instructors } =
    session.profile.role === "admin"
      ? await db
          .from("profiles")
          .select("id, full_name")
          .in("role", ["instructor", "admin"])
          .order("full_name")
      : { data: [] };
  return {
    course,
    modules: (modules ?? []).map((m) => ({
      ...m,
      lessons: (lessons ?? []).filter((l) => l.module_id === m.id),
    })),
    instructors: instructors ?? [],
  };
}

export async function getBuilderLesson(courseId: string, lessonId: string, session: SessionUser) {
  const data = await getBuilderCourse(courseId, session);
  const allLessons = data.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title })),
  );
  if (!allLessons.some((l) => l.id === lessonId)) notFound();
  const db = createAdminClient();
  const [{ data: lesson }, { data: resources }] = await Promise.all([
    db.from("lessons").select("*").eq("id", lessonId).single(),
    db
      .from("lesson_resources")
      .select("id, label, storage_path")
      .eq("lesson_id", lessonId)
      .order("label"),
  ]);
  if (!lesson) notFound();
  return { ...data, lesson, resources: resources ?? [], allLessons };
}
