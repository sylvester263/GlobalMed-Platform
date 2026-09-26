import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MyCourseCard } from "@/components/lms/my-course-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireArea } from "@/lib/auth/session";
import { getMyCourses } from "@/lib/lms/course-data";

export const metadata: Metadata = { title: "My courses" };

/** P4-5: every enrollment with progress and access dates. */
export default async function MyCoursesPage() {
  const session = await requireArea("student", "/dashboard/student/courses");
  const courses = await getMyCourses(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My courses"
        description="Every course you're enrolled in, with progress and access dates."
      />
      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Enroll in a course and it will appear here with your progress."
          action={
            <Link href="/education/courses" className={buttonVariants({ size: "lg" })}>
              Browse courses
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((item) => (
            <MyCourseCard key={item.enrollment.id} item={item} headingLevel={2} />
          ))}
        </div>
      )}
    </div>
  );
}
