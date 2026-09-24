import { ArrowLeft, Eye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PdfUploader, ResourceManager } from "@/components/lms/builder/file-uploader";
import { LessonForm } from "@/components/lms/builder/lesson-form";
import { VideoUploader } from "@/components/lms/builder/video-uploader";
import { requireArea } from "@/lib/auth/session";
import { getBuilderLesson } from "@/lib/lms/builder-data";
import { unlockRuleSchema } from "@/lib/lms/rules";

export const metadata: Metadata = { title: "Edit lesson" };

type Props = { params: Promise<{ courseId: string; lessonId: string }> };

/** P4-1/2/7: lesson settings, video or PDF upload, resources and drip rules. */
export default async function LessonEditorPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const session = await requireArea(
    "instructor",
    `/dashboard/instructor/courses/${courseId}/lessons/${lessonId}`,
  );
  const { course, modules, lesson, resources, allLessons } = await getBuilderLesson(
    courseId,
    lessonId,
    session,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={`/dashboard/instructor/courses/${course.id}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> {course.title}
        </Link>
        <DashboardPageHeader
          title={lesson.title}
          description={`Module: ${allLessons.find((l) => l.id === lesson.id)?.moduleTitle ?? ""}`}
          actions={
            <Link
              href={`/learn/${course.slug}/${lesson.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border bg-card px-4 text-sm font-semibold hover:bg-mint"
            >
              <Eye aria-hidden="true" className="size-4" /> Preview lesson
            </Link>
          }
        />
      </div>

      {lesson.type === "video" && (
        <VideoUploader
          lessonId={lesson.id}
          status={lesson.video_status}
          durationSec={lesson.duration_sec}
        />
      )}
      {lesson.type === "pdf" && (
        <PdfUploader lessonId={lesson.id} hasPdf={Boolean(lesson.pdf_path)} />
      )}
      <ResourceManager lessonId={lesson.id} resources={resources} />

      <LessonForm
        lesson={lesson}
        unlockRule={unlockRuleSchema.parse(lesson.unlock_rule ?? {})}
        otherLessons={allLessons.filter((l) => l.id !== lesson.id)}
        modules={modules.map((m) => ({ id: m.id, title: m.title }))}
      />
    </div>
  );
}
