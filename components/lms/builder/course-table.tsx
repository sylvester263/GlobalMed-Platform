import { BookOpen } from "lucide-react";
import Link from "next/link";

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

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  price_usd: number;
  updated_at: string;
  lessonCount: number;
};

const statusBadge = {
  draft: { label: "Draft", variant: "neutral" },
  published: { label: "Published", variant: "success" },
  archived: { label: "Archived", variant: "warning" },
} as const;

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** Course list shared by the instructor builder and admin course pages. */
export function CourseTable({ courses, caption }: { courses: Row[]; caption: string }) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses yet"
        description="Create your first course above. It stays a draft until an admin publishes it."
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Course</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Lessons
            </TableHead>
            <TableHead scope="col" className="text-right">
              Price
            </TableHead>
            <TableHead scope="col">Last edited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link
                  href={`/dashboard/instructor/courses/${c.id}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {c.title}
                </Link>
                <span className="block font-mono text-xs text-muted-foreground">/{c.slug}</span>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadge[c.status].variant}>{statusBadge[c.status].label}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{c.lessonCount}</TableCell>
              <TableCell className="text-right tabular-nums">{usd.format(c.price_usd)}</TableCell>
              <TableCell>{date.format(new Date(c.updated_at))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
