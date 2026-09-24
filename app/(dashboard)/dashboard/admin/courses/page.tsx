import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseTable } from "@/components/lms/builder/course-table";
import { requireArea } from "@/lib/auth/session";
import { listEditableCourses } from "@/lib/lms/builder-data";

export const metadata: Metadata = { title: "Courses" };

/** Every course. Publishing, pricing and instructor assignment live in each course's builder. */
export default async function AdminCoursesPage() {
  const session = await requireArea("admin", "/dashboard/admin/courses");
  const courses = await listEditableCourses(session);
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Courses"
        description="Open a course to publish or archive it, set prices and assign an instructor."
      />
      <CourseTable courses={courses} caption="All courses" />
    </div>
  );
}
