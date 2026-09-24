import { BookOpen, IdCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PathwayLine } from "@/components/motion/pathway-line";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPathway } from "@/lib/content";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Overview" };

/** Student overview (docs/07 §1). Continue-learning and progress fill in with Phase 4. */
export default async function StudentOverviewPage() {
  const session = await requireArea("student", "/dashboard/student");
  const supabase = await createClient();
  const { count } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("status", "active");
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

      {(count ?? 0) === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You haven't enrolled in a course yet"
          description="Watch free preview lessons, then enroll when you're ready. Your progress will appear here."
          action={
            <Link href="/school/courses" className={buttonVariants({ size: "lg" })}>
              Browse courses
            </Link>
          }
        />
      ) : (
        <section
          aria-labelledby="continue"
          className="flex flex-col gap-3 rounded-lg border bg-card p-6"
        >
          <h2 id="continue" className="text-xl">
            Continue learning
          </h2>
          <p className="text-muted-foreground">
            You&apos;re enrolled in {count} {count === 1 ? "course" : "courses"}. The course player
            and progress tracking open soon.
          </p>
          <Link
            href="/dashboard/student/courses"
            className={buttonVariants({ variant: "secondary", className: "self-start" })}
          >
            My courses
          </Link>
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
