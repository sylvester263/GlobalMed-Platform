import { ArrowLeft, Download, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseOutline } from "@/components/lms/course-outline";
import { LessonBody } from "@/components/lms/lesson-body";
import { NotesPanel } from "@/components/lms/notes-panel";
import { QaPanel } from "@/components/lms/qa-panel";
import { Prose } from "@/components/marketing/prose";
import { Wordmark } from "@/components/marketing/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/auth/session";
import { getLearnerCourse, getLessonContent } from "@/lib/lms/course-data";
import { signedDownloadUrl } from "@/lib/lms/files";
import { getLessonNote, getLessonThreads, signResources } from "@/lib/lms/lesson-page-data";
import { nextLesson } from "@/lib/lms/rules";

type Props = { params: Promise<{ courseSlug: string; lessonId: string }> };

export const metadata: Metadata = { title: "Lesson", robots: { index: false, follow: false } };

/**
 * Distraction-free course player (docs/03 §5, docs/07 §1). Access is decided by
 * getLearnerCourse (staff, preview, or active + unlocked enrollment).
 */
export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonId } = await params;
  const path = `/learn/${courseSlug}/${lessonId}`;
  const session = await requireUser(path);
  const course = await getLearnerCourse(courseSlug, session.user.id, session.profile.role);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  if (!course || !lesson) notFound();

  const next = nextLesson(course.lessons, lesson.id);
  const nextLink = next?.canView
    ? { href: `/learn/${course.slug}/${next.id}`, title: next.title }
    : undefined;

  const header = (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <Link
        href="/dashboard/student/courses"
        aria-label="Back to my courses"
        className="flex size-10 items-center justify-center rounded-md hover:bg-mint"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
      </Link>
      <Link href="/" aria-label="GlobalMed home" className="hidden sm:block">
        <Wordmark size="compact" />
      </Link>
      <p className="truncate font-semibold sm:border-l sm:pl-4">{course.title}</p>
      {(course.enrollmentActive || course.isStaff) && (
        <p className="ml-auto hidden text-sm whitespace-nowrap text-muted-foreground md:block">
          {course.progress.percent}% complete
        </p>
      )}
    </header>
  );

  if (!lesson.canView) {
    return (
      <div className="min-h-dvh bg-ledger">
        {header}
        <main
          id="main"
          className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center"
        >
          <Lock aria-hidden="true" className="size-10 text-muted-foreground" />
          <h1 className="text-2xl">{lesson.title}</h1>
          <p className="text-muted-foreground">
            {course.enrollmentActive
              ? "This lesson unlocks later in the course. Keep going with the lessons before it."
              : "Enroll in this course to open this lesson. Free preview lessons are available now."}
          </p>
          <Link
            href={
              course.enrollmentActive
                ? `/learn/${course.slug}`
                : `/education/courses/${course.slug}`
            }
            className={buttonVariants({ size: "lg" })}
          >
            {course.enrollmentActive ? "Continue where I left off" : "View the course"}
          </Link>
        </main>
      </div>
    );
  }

  const content = await getLessonContent(lesson.id);
  if (!content) notFound();
  const [note, threads, resources, pdfUrl] = await Promise.all([
    course.enrollmentActive ? getLessonNote(lesson.id, session.user.id) : Promise.resolve(""),
    getLessonThreads(lesson.id, new Set(course.instructorId ? [course.instructorId] : [])),
    signResources(content.resources),
    content.type === "pdf" && content.pdf_path
      ? signedDownloadUrl(content.pdf_path)
      : Promise.resolve(null),
  ]);
  const canPost = course.enrollmentActive || course.isStaff;

  return (
    <div className="min-h-dvh bg-ledger">
      {header}
      <div className="mx-auto grid max-w-360 gap-8 px-4 py-6 md:px-6 lg:grid-cols-[1fr_340px]">
        <main id="main" className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-1">
            {!course.enrollmentActive && lesson.isPreview && !course.isStaff && (
              <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
                Free preview
              </p>
            )}
            <h1 className="text-2xl lg:text-3xl">{lesson.title}</h1>
          </div>

          <LessonBody
            lesson={{
              id: lesson.id,
              title: lesson.title,
              type: lesson.type,
              liveUrl: content.live_url,
              pdfUrl,
            }}
            textContent={content.content_md ? <Prose markdown={content.content_md} /> : undefined}
            completed={lesson.completed}
            canTrackProgress={course.enrollmentActive}
            watermark={session.user.email ?? ""}
            coursePath={`/learn/${course.slug}`}
            next={nextLink}
          />

          <Tabs defaultValue={resources.length ? "resources" : canPost ? "notes" : "qa"}>
            <TabsList>
              <TabsTrigger value="resources">Resources ({resources.length})</TabsTrigger>
              {course.enrollmentActive && <TabsTrigger value="notes">Notes</TabsTrigger>}
              <TabsTrigger value="qa">Q&amp;A ({threads.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="resources" className="pt-4">
              {resources.length ? (
                <ul className="flex flex-col gap-2">
                  {resources.map((r) => (
                    <li key={r.id}>
                      <a
                        href={r.url}
                        className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 hover:bg-mint"
                      >
                        <Download aria-hidden="true" className="size-4 text-teal" />
                        <span>{r.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No downloads for this lesson.</p>
              )}
            </TabsContent>
            {course.enrollmentActive && (
              <TabsContent value="notes" className="pt-4">
                <NotesPanel lessonId={lesson.id} initial={note} />
              </TabsContent>
            )}
            <TabsContent value="qa" className="pt-4">
              <QaPanel lessonId={lesson.id} path={path} threads={threads} canPost={canPost} />
            </TabsContent>
          </Tabs>
        </main>

        <aside className="lg:sticky lg:top-22 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto">
          <details className="rounded-lg border bg-card p-4 lg:hidden">
            <summary className="cursor-pointer font-semibold">Course contents</summary>
            <div className="pt-4">
              <CourseOutline course={course} currentLessonId={lesson.id} />
            </div>
          </details>
          <div className="hidden rounded-lg border bg-card p-4 lg:block">
            <CourseOutline course={course} currentLessonId={lesson.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
