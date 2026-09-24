import "server-only";

import type { SessionUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";
import { courseProgress, enrollmentActive } from "@/lib/lms/rules";

/** Courses this staff member can see: all for admins, their own for instructors. */
async function staffCourses(session: SessionUser) {
  const db = createAdminClient();
  let query = db.from("courses").select("id, slug, title").order("title");
  if (session.profile.role !== "admin") query = query.eq("instructor_id", session.user.id);
  const { data } = await query;
  return data ?? [];
}

async function courseLessons(courseIds: string[]) {
  if (courseIds.length === 0) return [];
  const db = createAdminClient();
  const { data: modules } = await db
    .from("modules")
    .select("id, course_id")
    .in("course_id", courseIds);
  if (!modules?.length) return [];
  const { data: lessons } = await db
    .from("lessons")
    .select("id, module_id, title, required")
    .in(
      "module_id",
      modules.map((m) => m.id),
    );
  return (lessons ?? []).map((l) => ({
    ...l,
    courseId: modules.find((m) => m.id === l.module_id)?.course_id ?? "",
  }));
}

/** "Amina Khan" → "Amina K." — enough for staff to recognise a student in lists. */
function shortName(fullName: string | null | undefined) {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Student";
  return parts.length === 1 ? parts[0]! : `${parts[0]} ${parts.at(-1)![0]}.`;
}

/** P4-6: questions on the instructor's courses, unanswered first then newest. */
export async function getStaffQuestions(session: SessionUser) {
  const courses = await staffCourses(session);
  const lessons = await courseLessons(courses.map((c) => c.id));
  if (lessons.length === 0) return [];
  const db = createAdminClient();
  const { data: questions } = await db
    .from("lesson_questions")
    .select("id, lesson_id, user_id, body, created_at")
    .in(
      "lesson_id",
      lessons.map((l) => l.id),
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (!questions?.length) return [];
  const { data: answers } = await db
    .from("lesson_answers")
    .select("id, question_id, user_id, body, created_at")
    .in(
      "question_id",
      questions.map((q) => q.id),
    )
    .order("created_at");
  const userIds = [
    ...new Set([...questions, ...(answers ?? [])].flatMap((r) => (r.user_id ? [r.user_id] : []))),
  ];
  const { data: profiles } = await db
    .from("profiles")
    .select("id, full_name, role")
    .in("id", userIds);
  const person = (id: string | null) => profiles?.find((p) => p.id === id);

  const threads = questions.map((q) => {
    const lesson = lessons.find((l) => l.id === q.lesson_id);
    const course = courses.find((c) => c.id === lesson?.courseId);
    const replies = (answers ?? []).filter((a) => a.question_id === q.id);
    return {
      id: q.id,
      body: q.body,
      createdAt: q.created_at ?? "",
      author: shortName(person(q.user_id)?.full_name),
      lessonTitle: lesson?.title ?? "Lesson",
      lessonHref: course && lesson ? `/learn/${course.slug}/${lesson.id}` : null,
      courseTitle: course?.title ?? "",
      answered: replies.some((a) => {
        const role = person(a.user_id)?.role;
        return role === "instructor" || role === "admin";
      }),
      answers: replies.map((a) => {
        const p = person(a.user_id);
        return {
          id: a.id,
          body: a.body,
          createdAt: a.created_at ?? "",
          author: shortName(p?.full_name),
          byStaff: p?.role === "instructor" || p?.role === "admin",
        };
      }),
    };
  });
  return threads.sort((a, b) => Number(a.answered) - Number(b.answered));
}

/** Instructor "Students" page: progress and last activity per enrollment. */
export async function getStaffStudents(session: SessionUser) {
  const courses = await staffCourses(session);
  if (courses.length === 0) return { courses, rows: [] };
  const db = createAdminClient();
  const { data: enrollments } = await db
    .from("enrollments")
    .select("id, user_id, course_id, status, starts_at, expires_at, completed_at")
    .in(
      "course_id",
      courses.map((c) => c.id),
    )
    .order("starts_at", { ascending: false })
    .limit(1000);
  if (!enrollments?.length) return { courses, rows: [] };
  const [lessons, { data: progress }, { data: profiles }] = await Promise.all([
    courseLessons(courses.map((c) => c.id)),
    db
      .from("lesson_progress")
      .select("enrollment_id, lesson_id, completed_at, updated_at")
      .in(
        "enrollment_id",
        enrollments.map((e) => e.id),
      ),
    db
      .from("profiles")
      .select("id, full_name")
      .in("id", [...new Set(enrollments.map((e) => e.user_id))]),
  ]);

  const rows = enrollments.map((e) => {
    const mine = (progress ?? []).filter((p) => p.enrollment_id === e.id);
    const done = new Set(mine.filter((p) => p.completed_at).map((p) => p.lesson_id));
    const last = mine.reduce<string | null>(
      (max, p) => (max === null || p.updated_at > max ? p.updated_at : max),
      null,
    );
    return {
      id: e.id,
      userId: e.user_id,
      name: profiles?.find((p) => p.id === e.user_id)?.full_name ?? "Unnamed student",
      courseTitle: courses.find((c) => c.id === e.course_id)?.title ?? "",
      active: enrollmentActive(e),
      status: e.status,
      progress: courseProgress(
        lessons.filter((l) => l.courseId === e.course_id),
        done,
      ),
      lastActivity: last,
      enrolledAt: e.starts_at,
    };
  });
  return { courses, rows };
}
