import { Check, Clock, FileCheck2, Lock, PlayCircle, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CertificatePreview } from "@/components/lms/certificate-preview";
import { PricingBlock } from "@/components/marketing/pricing-block";
import {
  CourseCard,
  FaqList,
  formatPkr,
  formatUsd,
  PageHero,
  Section,
} from "@/components/marketing/sections";
import { TrackView } from "@/components/marketing/track-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { courseLessonMinutes, getCourse, getCourses, getInstructor } from "@/lib/content";
import { categoryLabels, levelLabels } from "@/lib/content/catalog";
import { courseJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  if (!course) return {};
  return pageMetadata({
    title: course.metaTitle,
    description: course.metaDescription,
    path: `/school/courses/${course.slug}`,
  });
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();

  const instructor = getInstructor(course.instructor);
  const path = `/school/courses/${course.slug}`;
  // Enrollment and checkout arrive in Phases 3 and 5; the CTA carries the course through sign-up.
  const enrollHref = `/signup?course=${course.slug}`;
  const related = getCourses()
    .filter((c) => c.slug !== course.slug && c.category === course.category)
    .concat(getCourses().filter((c) => c.slug !== course.slug && c.category !== course.category))
    .slice(0, 3);
  const previewCount = course.curriculum.flatMap((m) => m.lessons).filter((l) => l.preview).length;
  let firstPreviewSeen = false;

  return (
    <>
      <TrackView event="course_view" params={{ course: course.slug }} />
      <PageHero
        eyebrow={`${categoryLabels[course.category]} course`}
        title={course.title}
        intro={course.summary}
        crumbs={[
          { name: "School", path: "/school" },
          { name: "Courses", path: "/school/courses" },
          { name: course.title, path },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{levelLabels[course.level]}</Badge>
          <Badge variant="gold">Certificate included</Badge>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-4" /> {course.hours} hours
          </li>
          <li className="flex items-center gap-1.5">
            <PlayCircle aria-hidden="true" className="size-4" /> {course.lessonCount} lessons
          </li>
          {course.mockExams > 0 && (
            <li className="flex items-center gap-1.5">
              <FileCheck2 aria-hidden="true" className="size-4" /> {course.mockExams}{" "}
              {course.mockExams === 1 ? "mock exam" : "mock exams"}
            </li>
          )}
        </ul>
      </PageHero>

      <div className="mx-auto grid max-w-300 gap-12 px-4 py-12 md:px-6 lg:grid-cols-[1fr_360px] lg:py-16">
        <div className="flex min-w-0 flex-col gap-14">
          <section aria-labelledby="about" className="flex flex-col gap-4">
            <h2 id="about" className="text-2xl">
              About this course
            </h2>
            <p className="max-w-prose text-lg">{course.description}</p>
          </section>

          <section aria-labelledby="outcomes" className="flex flex-col gap-5">
            <h2 id="outcomes" className="text-2xl">
              What you&apos;ll learn
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="curriculum" className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 id="curriculum" className="text-2xl">
                Curriculum
              </h2>
              <p className="text-sm text-muted-foreground">
                {previewCount} free preview {previewCount === 1 ? "lesson" : "lessons"} · sample of{" "}
                {course.lessonCount} lessons
              </p>
            </div>
            {/* MG-11: smooth height via the accordion; first preview icon pulses once. */}
            <Accordion
              defaultValue={[course.curriculum[0]!.title]}
              className="rounded-lg border bg-card px-6"
            >
              {course.curriculum.map((module, mi) => (
                <AccordionItem key={module.title} value={module.title}>
                  <AccordionTrigger>
                    Module {mi + 1} · {module.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col divide-y">
                      {module.lessons.map((lesson) => {
                        const pulse = lesson.preview && !firstPreviewSeen;
                        if (lesson.preview) firstPreviewSeen = true;
                        return (
                          <li key={lesson.title} className="flex items-center gap-3 py-3 text-base">
                            {lesson.preview ? (
                              <PlayCircle
                                aria-hidden="true"
                                className={cn(
                                  "size-5 shrink-0 rounded-full text-teal",
                                  pulse && "pulse-once",
                                )}
                              />
                            ) : (
                              <Lock
                                aria-hidden="true"
                                className="size-4 shrink-0 text-muted-foreground"
                              />
                            )}
                            <span className="flex-1">{lesson.title}</span>
                            {lesson.preview && <Badge variant="secondary">Free preview</Badge>}
                            <span className="text-sm text-muted-foreground tabular-nums">
                              {lesson.minutes} min
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-sm text-muted-foreground">
              Showing {Math.round(courseLessonMinutes(course) / 60)} of {course.hours} hours. The
              full outline unlocks when you enroll.
            </p>
          </section>

          <section aria-labelledby="for-whom" className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h2 id="for-whom" className="text-xl">
                Who it&apos;s for
              </h2>
              <ul className="flex flex-col gap-2">
                {course.audience.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <Users aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl">Requirements</h2>
              <ul className="flex flex-col gap-2">
                {course.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {instructor && (
            <section aria-labelledby="instructor" className="flex flex-col gap-5">
              <h2 id="instructor" className="text-2xl">
                Your instructor
              </h2>
              <div className="flex items-start gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-mint text-lg font-semibold text-teal-deep">
                    {instructor.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-serif text-xl font-semibold">{instructor.name}</p>
                  <p className="text-sm font-semibold text-teal-deep">{instructor.title}</p>
                  <p className="text-muted-foreground">{instructor.bio}</p>
                </div>
              </div>
            </section>
          )}

          <section aria-labelledby="certificate" className="flex flex-col gap-5">
            <h2 id="certificate" className="text-2xl">
              Your certificate
            </h2>
            <p className="max-w-prose text-muted-foreground">
              Finish every lesson and pass the final assessment to earn a certificate with a unique
              ID and QR code. Employers can check it on our{" "}
              <Link href="/verify" className="text-primary underline underline-offset-4">
                verification page
              </Link>
              .
            </p>
            <CertificatePreview
              nameOnCertificate="Your Name"
              courseTitle={course.title}
              issuedAt={new Date("2026-09-24")}
              code="SAMPLE000000"
            />
          </section>

          <section aria-labelledby="faq" className="flex flex-col gap-5">
            <h2 id="faq" className="text-2xl">
              Frequently asked questions
            </h2>
            <FaqList faqs={course.faqs} />
          </section>
        </div>

        <aside aria-label="Enroll" className="hidden lg:block">
          <div className="sticky top-24">
            <PricingBlock
              title="Full course"
              priceUsd={course.priceUsd}
              pricePkr={course.pricePkr}
              accessMonths={course.accessMonths}
              includes={[
                `${course.lessonCount} lessons you can rewatch`,
                course.mockExams > 0
                  ? `${course.mockExams} timed mock ${course.mockExams === 1 ? "exam" : "exams"}`
                  : "Practice after every module",
                "Verifiable certificate",
              ]}
              action={
                <Link href={enrollHref} className={buttonVariants({ size: "lg" })}>
                  Enroll now
                </Link>
              }
            />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <Section tone="white" title="Related courses">
          <ul className="grid gap-6 md:grid-cols-3">
            {related.map((c) => (
              <li key={c.slug}>
                <CourseCard course={c} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Sticky enroll bar on mobile (docs/05) */}
      <div
        data-sticky-cta
        className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t bg-card px-4 py-3 shadow-lg lg:hidden"
      >
        <div>
          <p className="font-serif text-xl font-semibold">{formatUsd(course.priceUsd)}</p>
          <p className="text-xs text-muted-foreground">or {formatPkr(course.pricePkr)}</p>
        </div>
        <Link href={enrollHref} className={buttonVariants({ size: "lg" })}>
          Enroll now
        </Link>
      </div>

      <JsonLd
        data={courseJsonLd({
          name: course.title,
          description: course.metaDescription,
          path,
          priceUsd: course.priceUsd,
          hours: course.hours,
        })}
      />
    </>
  );
}
