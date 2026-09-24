import type { Metadata } from "next";

import { CurriculumEditor } from "@/components/lms/builder/curriculum-editor";
import { LessonForm } from "@/components/lms/builder/lesson-form";
import { VideoUploader } from "@/components/lms/builder/video-uploader";
import { CourseOutline } from "@/components/lms/course-outline";
import { MyCourseCard } from "@/components/lms/my-course-card";
import type { LearnerCourse, LearnerLesson } from "@/lib/lms/course-data";

import { DashboardFrame } from "../_components/frames";

export const metadata: Metadata = { title: "Screen: LMS", robots: { index: false } };

const COURSE = "00000000-0000-4000-8000-000000000001";
const id = (n: number) => `00000000-0000-4000-8000-0000000001${String(n).padStart(2, "0")}`;

const sampleModules = [
  {
    id: id(1),
    title: "Foundations",
    lessons: [
      {
        id: id(11),
        title: "How a claim moves",
        type: "video",
        is_preview: true,
        video_status: "ready",
      },
      {
        id: id(12),
        title: "Reading an encounter note",
        type: "text",
        is_preview: false,
        video_status: "none",
      },
      { id: id(13), title: "Payer glossary", type: "pdf", is_preview: false, video_status: "none" },
    ],
  },
  {
    id: id(2),
    title: "ICD-10-CM",
    lessons: [
      {
        id: id(21),
        title: "Chapter structure",
        type: "video",
        is_preview: false,
        video_status: "processing",
      },
      {
        id: id(22),
        title: "Live coding lab",
        type: "live",
        is_preview: false,
        video_status: "none",
      },
    ],
  },
] as const;

function learnerLesson(
  l: (typeof sampleModules)[number]["lessons"][number],
  moduleId: string,
  i: number,
): LearnerLesson {
  return {
    id: l.id,
    moduleId,
    title: l.title,
    type: l.type,
    durationSec: 540,
    isPreview: l.is_preview,
    required: true,
    videoStatus: l.video_status,
    unlock:
      i < 4
        ? { unlocked: true }
        : { unlocked: false, reason: "date", unlocksAt: new Date("2026-11-01T00:00:00Z") },
    completed: i < 2,
    positionSec: 0,
    canView: i < 4,
  };
}

let n = 0;
const outlineModules = sampleModules.map((m) => ({
  id: m.id,
  title: m.title,
  lessons: m.lessons.map((l) => learnerLesson(l, m.id, n++)),
}));

const course: LearnerCourse = {
  id: COURSE,
  slug: "medical-coding-foundations",
  title: "Medical Coding Foundations",
  summary: null,
  instructorId: null,
  isStaff: false,
  enrollment: null,
  enrollmentActive: true,
  modules: outlineModules,
  lessons: outlineModules.flatMap((m) => m.lessons),
  progress: { completed: 2, total: 5, percent: 40, requiredComplete: false },
  continueLessonId: id(13),
};

/**
 * LMS components with sample data (P4) so the builder and player UI can be reviewed and
 * audited (Playwright + axe) without Supabase or Bunny. Buttons here call real server
 * actions, which refuse without a signed-in staff session.
 */
export default function LmsScreen() {
  return (
    <DashboardFrame
      screen="LMS: builder and player (P4)"
      role="admin"
      user={{ name: "Sample Instructor", initials: "SI", label: "Instructor · sample" }}
    >
      <div className="flex flex-col gap-12">
        <section aria-labelledby="sg-my-course" className="flex max-w-xl flex-col gap-3">
          <h2 id="sg-my-course" className="text-xl">
            Continue learning (DM-2)
          </h2>
          <MyCourseCard
            item={{
              course: { id: COURSE, slug: course.slug, title: course.title },
              enrollment: {
                id: id(90),
                course_id: COURSE,
                status: "active",
                starts_at: "2026-09-01T00:00:00Z",
                expires_at: "2027-09-01T00:00:00Z",
                completed_at: null,
              },
              active: true,
              progress: course.progress,
              lastTouchedAt: null,
            }}
            headingLevel={3}
          />
        </section>

        <section aria-labelledby="sg-outline" className="flex max-w-sm flex-col gap-3">
          <h2 id="sg-outline" className="text-xl">
            Player outline
          </h2>
          <CourseOutline course={course} currentLessonId={id(13)} />
        </section>

        <section aria-labelledby="sg-curriculum" className="flex flex-col gap-3">
          <h2 id="sg-curriculum" className="text-xl">
            Curriculum editor
          </h2>
          <CurriculumEditor
            courseId={COURSE}
            modules={sampleModules.map((m) => ({
              id: m.id,
              title: m.title,
              lessons: m.lessons.map((l) => ({ ...l })),
            }))}
          />
        </section>

        <section aria-labelledby="sg-lesson" className="flex flex-col gap-6">
          <h2 id="sg-lesson" className="text-xl">
            Lesson editor
          </h2>
          <VideoUploader lessonId={id(21)} status="processing" durationSec={null} />
          <LessonForm
            lesson={{
              id: id(21),
              module_id: id(2),
              title: "Chapter structure",
              type: "video",
              is_preview: false,
              required: true,
              content_md: null,
              live_url: null,
              duration_sec: null,
            }}
            unlockRule={{ days_after_enroll: 7 }}
            otherLessons={outlineModules.flatMap((m) =>
              m.lessons
                .filter((l) => l.id !== id(21))
                .map((l) => ({ id: l.id, title: l.title, moduleTitle: m.title })),
            )}
            modules={sampleModules.map((m) => ({ id: m.id, title: m.title }))}
          />
        </section>
      </div>
    </DashboardFrame>
  );
}
