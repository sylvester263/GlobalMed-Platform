import "server-only";

import { notFound, redirect } from "next/navigation";

import type { SessionUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";
import { enrollmentActive } from "@/lib/lms/rules";

/** Batches on the courses this staff member runs, with member and session counts. */
export async function getStaffBatches(session: SessionUser) {
  const db = createAdminClient();
  let coursesQuery = db.from("courses").select("id, title").order("title");
  if (session.profile.role !== "admin") {
    coursesQuery = coursesQuery.eq("instructor_id", session.user.id);
  }
  const { data: courses } = await coursesQuery;
  if (!courses?.length) return { courses: [], batches: [] };
  const { data: batches } = await db
    .from("batches")
    .select("id, course_id, name, starts_at, schedule, seats")
    .in(
      "course_id",
      courses.map((c) => c.id),
    )
    .order("starts_at", { ascending: false });
  const ids = (batches ?? []).map((b) => b.id);
  const [{ data: members }, { data: sessions }] = ids.length
    ? await Promise.all([
        db.from("batch_members").select("batch_id").in("batch_id", ids),
        db.from("batch_sessions").select("batch_id, starts_at").in("batch_id", ids),
      ])
    : [{ data: [] }, { data: [] }];
  const now = new Date().toISOString();
  return {
    courses,
    batches: (batches ?? []).map((b) => ({
      ...b,
      courseTitle: courses.find((c) => c.id === b.course_id)?.title ?? "",
      memberCount: (members ?? []).filter((m) => m.batch_id === b.id).length,
      upcomingSessions: (sessions ?? []).filter((s) => s.batch_id === b.id && s.starts_at >= now)
        .length,
    })),
  };
}

/** One batch for its course staff: sessions, members, announcements and who can be added. */
export async function getStaffBatch(batchId: string, session: SessionUser) {
  if (!/^[0-9a-f-]{36}$/i.test(batchId)) notFound();
  const db = createAdminClient();
  const { data: batch } = await db.from("batches").select("*").eq("id", batchId).maybeSingle();
  if (!batch) notFound();
  const { data: course } = await db
    .from("courses")
    .select("id, title, instructor_id")
    .eq("id", batch.course_id)
    .single();
  if (!course) notFound();
  if (session.profile.role !== "admin" && course.instructor_id !== session.user.id) {
    redirect("/dashboard/instructor/batches");
  }

  const [{ data: sessions }, { data: members }, { data: announcements }, { data: enrollments }] =
    await Promise.all([
      db.from("batch_sessions").select("*").eq("batch_id", batchId).order("starts_at"),
      db.from("batch_members").select("user_id, joined_at").eq("batch_id", batchId),
      db
        .from("batch_announcements")
        .select("id, title, body, created_at")
        .eq("batch_id", batchId)
        .order("created_at", { ascending: false }),
      db.from("enrollments").select("user_id, status, expires_at").eq("course_id", batch.course_id),
    ]);
  const userIds = [
    ...new Set([
      ...(members ?? []).map((m) => m.user_id),
      ...(enrollments ?? []).map((e) => e.user_id),
    ]),
  ];
  const { data: profiles } = userIds.length
    ? await db.from("profiles").select("id, full_name").in("id", userIds)
    : { data: [] };
  const nameOf = (id: string) => profiles?.find((p) => p.id === id)?.full_name ?? "Unnamed student";
  const memberIds = new Set((members ?? []).map((m) => m.user_id));

  return {
    batch,
    course,
    sessions: sessions ?? [],
    announcements: announcements ?? [],
    members: (members ?? [])
      .map((m) => ({ userId: m.user_id, name: nameOf(m.user_id), joinedAt: m.joined_at }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    candidates: (enrollments ?? [])
      .filter((e) => enrollmentActive(e) && !memberIds.has(e.user_id))
      .map((e) => ({ userId: e.user_id, name: nameOf(e.user_id) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/** Student view: batches they belong to, upcoming sessions and recent announcements. */
export async function getMyBatches(userId: string) {
  const db = createAdminClient();
  const { data: memberships } = await db
    .from("batch_members")
    .select("batch_id")
    .eq("user_id", userId);
  const batchIds = (memberships ?? []).map((m) => m.batch_id);
  if (batchIds.length === 0) return { batches: [], sessions: [], announcements: [] };

  // Join links are for members with active access only.
  const { data: batches } = await db
    .from("batches")
    .select("id, name, starts_at, schedule, course_id")
    .in("id", batchIds);
  const courseIds = [...new Set((batches ?? []).map((b) => b.course_id))];
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    db.from("courses").select("id, title").in("id", courseIds),
    db
      .from("enrollments")
      .select("course_id, status, expires_at")
      .eq("user_id", userId)
      .in("course_id", courseIds),
  ]);
  const activeCourses = new Set(
    (enrollments ?? []).filter((e) => enrollmentActive(e)).map((e) => e.course_id),
  );
  const visible = (batches ?? []).filter((b) => activeCourses.has(b.course_id));
  const visibleIds = visible.map((b) => b.id);
  if (visibleIds.length === 0) return { batches: [], sessions: [], announcements: [] };

  // Sessions that started up to 3 hours ago still show so latecomers can join.
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const [{ data: sessions }, { data: announcements }] = await Promise.all([
    db
      .from("batch_sessions")
      .select("id, batch_id, title, starts_at, duration_min, join_url")
      .in("batch_id", visibleIds)
      .gte("starts_at", since)
      .order("starts_at")
      .limit(20),
    db
      .from("batch_announcements")
      .select("id, batch_id, title, body, created_at")
      .in("batch_id", visibleIds)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);
  const label = (batchId: string) => {
    const b = visible.find((x) => x.id === batchId);
    const course = courses?.find((c) => c.id === b?.course_id);
    return [course?.title, b?.name].filter(Boolean).join(" · ");
  };
  return {
    batches: visible.map((b) => ({
      ...b,
      courseTitle: courses?.find((c) => c.id === b.course_id)?.title ?? "",
    })),
    sessions: (sessions ?? []).map((s) => ({ ...s, batchLabel: label(s.batch_id) })),
    announcements: (announcements ?? []).map((a) => ({ ...a, batchLabel: label(a.batch_id) })),
  };
}
