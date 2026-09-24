import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { getLearnerCourse } from "@/lib/lms/course-data";

type Props = { params: Promise<{ courseSlug: string }> };

/** /learn/[course] → the lesson to continue with (docs/08 §3 "continue learning"). */
export default async function CourseEntry({ params }: Props) {
  const { courseSlug } = await params;
  const session = await requireUser(`/learn/${courseSlug}`);
  const course = await getLearnerCourse(courseSlug, session.user.id, session.profile.role);
  if (!course) notFound();
  const target =
    course.lessons.find((l) => l.id === course.continueLessonId && l.canView) ??
    course.lessons.find((l) => l.canView);
  if (!target) redirect(`/school/courses/${courseSlug}`);
  redirect(`/learn/${courseSlug}/${target.id}`);
}
