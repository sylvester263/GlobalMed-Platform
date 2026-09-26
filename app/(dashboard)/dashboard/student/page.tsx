import { BookOpen, IdCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MyCourseCard } from "@/components/lms/my-course-card";
import { PathwayLine } from "@/components/motion/pathway-line";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPathway } from "@/lib/content";
import { requireArea } from "@/lib/auth/session";
import { getMyCourses } from "@/lib/lms/course-data";

export const metadata: Metadata = { title: "Overview" };

/** Student overview (docs/07 §1): continue where you left off, then the certification route. */
export default async function StudentOverviewPage() {
  const session = await requireArea("student", "/dashboard/student");
  const courses = (await getMyCourses(session.user.id)).filter((c) => c.active);
  // The course touched most recently comes first; untouched courses keep enrollment order.
  const recent = [...courses].sort((a, b) =>
    (b.lastTouchedAt ?? "").localeCompare(a.lastTouchedAt ?? ""),
  );
  const current = recent[0];
  const pathway = getPathway("billing-and-coding-career");
  const firstName = session.profile.full_name?.split(/\s+/)[0];

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title={firstName ? `Welcome, ${firstName}` : "Welcome"}
        description="Your courses, progress and certificates in one place."
      />

      {!session.profile.certificate_name && (
        <Alert variant="info">
          <IdCard aria-hidden="true" />
          <AlertTitle>Add the name for your certificates</AlertTitle>
          <AlertDescription>
            Certificates use the exact name you give us.{" "}
            <Link href="/dashboard/account">Set it in account settings</Link>.
          </AlertDescription>
        </Alert>
      )}

      {!current ? (
        <EmptyState
          icon={BookOpen}
          title="You haven't enrolled in a course yet"
          description="Watch free preview lessons, then enroll when you're ready. Your progress will appear here."
          action={
            <Link href="/education/courses" className={buttonVariants({ size: "lg" })}>
              Browse courses
            </Link>
          }
        />
      ) : (
        <section aria-labelledby="continue" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="continue" className="text-xl">
              Continue learning
            </h2>
            {courses.length > 1 && (
              <Link
                href="/dashboard/student/courses"
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                All {courses.length} courses
              </Link>
            )}
          </div>
          <MyCourseCard item={current} />
        </section>
      )}

      {pathway && (
        <section
          aria-labelledby="pathway"
          className="flex flex-col gap-6 rounded-lg border bg-card p-6"
        >
          <h2 id="pathway" className="text-xl">
            Your route to certification
          </h2>
          <PathwayLine
            stages={pathway.steps.map((s) => ({ label: s.label, description: s.description }))}
            current={0}
          />
        </section>
      )}
    </div>
  );
}
