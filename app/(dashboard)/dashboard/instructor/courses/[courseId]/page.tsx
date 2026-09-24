import { ArrowLeft, Eye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseAdminForm, CourseDetailsForm } from "@/components/lms/builder/course-forms";
import { CurriculumEditor } from "@/components/lms/builder/curriculum-editor";
import { Badge } from "@/components/ui/badge";
import { requireArea } from "@/lib/auth/session";
import { getBuilderCourse } from "@/lib/lms/builder-data";

export const metadata: Metadata = { title: "Edit course" };

type Props = { params: Promise<{ courseId: string }> };

/** P4-1: course details, admin-only publishing and pricing, and the curriculum. */
export default async function CourseBuilderPage({ params }: Props) {
  const { courseId } = await params;
  const session = await requireArea("instructor", `/dashboard/instructor/courses/${courseId}`);
  const { course, modules, instructors } = await getBuilderCourse(courseId, session);
  const isAdmin = session.profile.role === "admin";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href={isAdmin ? "/dashboard/admin/courses" : "/dashboard/instructor/courses"}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> All courses
        </Link>
        <DashboardPageHeader
          title={course.title}
          description={
            course.status === "published"
              ? "Published. Changes to lessons show to students straight away."
              : "Draft. Students can't see this course until an admin publishes it."
          }
          actions={
            <div className="flex items-center gap-3">
              <Badge variant={course.status === "published" ? "success" : "neutral"}>
                {course.status}
              </Badge>
              <Link
                href={`/learn/${course.slug}`}
                className="inline-flex h-10 items-center gap-2 rounded-md border bg-card px-4 text-sm font-semibold hover:bg-mint"
              >
                <Eye aria-hidden="true" className="size-4" /> Preview as student
              </Link>
            </div>
          }
        />
      </div>

      <section aria-labelledby="curriculum-heading" className="flex flex-col gap-4">
        <h2 id="curriculum-heading" className="text-xl">
          Curriculum
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag the handles, use the arrow buttons, or focus a handle and press Space then the arrow
          keys to reorder.
        </p>
        <CurriculumEditor
          courseId={course.id}
          modules={modules.map((m) => ({
            id: m.id,
            title: m.title,
            lessons: m.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              type: l.type,
              is_preview: l.is_preview,
              video_status: l.video_status,
            })),
          }))}
        />
      </section>

      <section aria-labelledby="details-heading" className="flex flex-col gap-4">
        <h2 id="details-heading" className="text-xl">
          Course details
        </h2>
        <CourseDetailsForm course={course} />
      </section>

      {isAdmin && (
        <section
          aria-labelledby="admin-heading"
          className="flex flex-col gap-4 rounded-lg border bg-ledger p-5"
        >
          <h2 id="admin-heading" className="text-xl">
            Publishing and pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            Admins only. Every change is written to the audit log.
          </p>
          <CourseAdminForm course={course} instructors={instructors} />
        </section>
      )}
    </div>
  );
}
