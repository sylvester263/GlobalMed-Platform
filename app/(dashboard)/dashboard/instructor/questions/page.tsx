import { MessageCircleQuestion } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StaffReply } from "@/components/lms/staff-reply";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { requireArea } from "@/lib/auth/session";
import { getStaffQuestions } from "@/lib/lms/instructor-data";

export const metadata: Metadata = { title: "Q&A" };

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const PATH = "/dashboard/instructor/questions";

/** P4-6: student questions on the instructor's courses, unanswered first. */
export default async function InstructorQuestionsPage() {
  const session = await requireArea("instructor", PATH);
  const threads = await getStaffQuestions(session);
  const open = threads.filter((t) => !t.answered).length;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Q&A"
        description={
          threads.length === 0
            ? "Student questions, unanswered first."
            : `${open} ${open === 1 ? "question needs" : "questions need"} an answer.`
        }
      />
      {threads.length === 0 ? (
        <EmptyState
          icon={MessageCircleQuestion}
          title="No questions yet"
          description="When students ask about a lesson, their questions appear here."
        />
      ) : (
        <ol className="flex flex-col gap-4">
          {threads.map((t) => (
            <li key={t.id}>
              <article
                aria-labelledby={`q-${t.id}`}
                className="flex flex-col gap-3 rounded-lg border bg-card p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant={t.answered ? "success" : "warning"}>
                    {t.answered ? "Answered" : "Needs an answer"}
                  </Badge>
                  <span className="text-muted-foreground">
                    {t.courseTitle} ·{" "}
                    {t.lessonHref ? (
                      <Link href={t.lessonHref} className="underline underline-offset-4">
                        {t.lessonTitle}
                      </Link>
                    ) : (
                      t.lessonTitle
                    )}
                  </span>
                </div>
                <h2 id={`q-${t.id}`} className="sr-only">
                  Question from {t.author}
                </h2>
                <p className="whitespace-pre-line">{t.body}</p>
                <p className="text-xs text-muted-foreground">
                  {t.author}
                  {t.createdAt && ` · ${date.format(new Date(t.createdAt))}`}
                </p>
                {t.answers.length > 0 && (
                  <ul className="flex flex-col gap-3 border-l-2 border-mint pl-4">
                    {t.answers.map((a) => (
                      <li key={a.id} className="flex flex-col gap-1">
                        <p className="whitespace-pre-line">{a.body}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.author}
                          {a.byStaff && " (staff)"}
                          {a.createdAt && ` · ${date.format(new Date(a.createdAt))}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <StaffReply questionId={t.id} path={PATH} />
              </article>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
