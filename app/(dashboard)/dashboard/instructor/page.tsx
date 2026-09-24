import { Hammer } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatBlock } from "@/components/ui/stat-block";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Overview" };

/** Instructor overview (docs/07 §2). Courses are scoped by RLS to the instructor's own. */
export default async function InstructorOverviewPage() {
  const session = await requireArea("instructor", "/dashboard/instructor");
  const supabase = await createClient();
  const { count: courseCount } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("instructor_id", session.user.id);

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
        <StatBlock label="My courses" value={courseCount ?? 0} animate={false} />
        <StatBlock label="Active students" value={0} animate={false} />
        <StatBlock label="Unanswered questions" value={0} animate={false} />
      </section>
      {(courseCount ?? 0) === 0 && (
        <EmptyState
          icon={Hammer}
          title="No courses yet"
          description="The course builder opens soon. You'll create modules and lessons and upload videos from here."
        />
      )}
    </div>
  );
}
