import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseTable } from "@/components/lms/builder/course-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireArea } from "@/lib/auth/session";
import { createCourse } from "@/lib/lms/builder-actions";
import { listEditableCourses } from "@/lib/lms/builder-data";

export const metadata: Metadata = { title: "Course builder" };

const errors: Record<string, string> = {
  title: "Give the course a title of at least 3 characters.",
  create: "Couldn't create the course. Try again.",
};

type Props = { searchParams: Promise<{ error?: string; denied?: string }> };

/** P4-1: the instructor's courses plus a quick "new course" form. */
export default async function InstructorCoursesPage({ searchParams }: Props) {
  const session = await requireArea("instructor", "/dashboard/instructor/courses");
  const { error, denied } = await searchParams;
  const courses = await listEditableCourses(session);
  const message = denied
    ? "You can only edit courses assigned to you."
    : error
      ? errors[error]
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Course builder"
        description="Create courses, organise modules and lessons, and upload videos."
      />
      {message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <form
        action={createCourse}
        className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="new-course-title" className="text-sm font-semibold">
            New course title
          </label>
          <Input
            id="new-course-title"
            name="title"
            required
            minLength={3}
            maxLength={160}
            placeholder="e.g. CPC Exam Prep"
          />
        </div>
        <Button type="submit">
          <Plus aria-hidden="true" /> Create draft course
        </Button>
      </form>
      <CourseTable courses={courses} caption="Your courses" />
    </div>
  );
}
