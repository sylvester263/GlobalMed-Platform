import { Users } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireArea } from "@/lib/auth/session";
import { getStaffStudents } from "@/lib/lms/instructor-data";

export const metadata: Metadata = { title: "Students" };

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** Progress and last activity for every student on the instructor's courses. */
export default async function InstructorStudentsPage() {
  const session = await requireArea("instructor", "/dashboard/instructor/students");
  const { rows } = await getStaffStudents(session);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Students"
        description="Progress and last activity per course. Quiz scores arrive with the exam engine."
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Students appear here as soon as they enroll in one of your courses."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <caption className="sr-only">Students and their progress</caption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Student</TableHead>
                <TableHead scope="col">Course</TableHead>
                <TableHead scope="col" className="text-right">
                  Progress
                </TableHead>
                <TableHead scope="col">Last activity</TableHead>
                <TableHead scope="col">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">{r.name}</TableCell>
                  <TableCell>{r.courseTitle}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.progress.completed}/{r.progress.total} · {r.progress.percent}%
                  </TableCell>
                  <TableCell>
                    {r.lastActivity ? date.format(new Date(r.lastActivity)) : "Not started"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.active ? "success" : "neutral"}>
                      {r.active ? "Active" : r.status === "active" ? "Expired" : r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
