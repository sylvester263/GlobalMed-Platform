import { Hammer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatBlock } from "@/components/ui/stat-block";
import { requireArea } from "@/lib/auth/session";
import { getStaffQuestions, getStaffStudents } from "@/lib/lms/instructor-data";

export const metadata: Metadata = { title: "Overview" };

/** Instructor overview (docs/07 §2): own courses only, admins see everything. */
export default async function InstructorOverviewPage() {
  const session = await requireArea("instructor", "/dashboard/instructor");
  const [{ courses, rows }, questions] = await Promise.all([
    getStaffStudents(session),
    getStaffQuestions(session),
  ]);
  const activeStudents = new Set(rows.filter((r) => r.active).map((r) => r.userId)).size;
  const unanswered = questions.filter((q) => !q.answered).length;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Overview"
        description="Your courses, your students and the questions waiting for you."
      />
      <section
        aria-label="Key figures"
        className="grid gap-8 rounded-lg border bg-card p-6 sm:grid-cols-3"
      >
        <StatBlock label="My courses" value={courses.length} animate={false} />
        <StatBlock label="Active students" value={activeStudents} animate={false} />
        <StatBlock label="Unanswered questions" value={unanswered} animate={false} />
      </section>
      {courses.length === 0 ? (
        <EmptyState
          icon={Hammer}
          title="No courses yet"
          description="Create a draft course, add modules and lessons, and upload your videos."
          action={
            <Link href="/dashboard/instructor/courses" className={buttonVariants({ size: "lg" })}>
              Open the course builder
            </Link>
          }
        />
      ) : (
        unanswered > 0 && (
          <Link
            href="/dashboard/instructor/questions"
            className={buttonVariants({ variant: "secondary", className: "self-start" })}
          >
            Answer {unanswered} {unanswered === 1 ? "question" : "questions"}
          </Link>
        )
      )}
    </div>
  );
}
