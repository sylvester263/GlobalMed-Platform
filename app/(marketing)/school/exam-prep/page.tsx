import { BookOpenCheck, Clock3, ListChecks, Shuffle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CourseCard, CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { getCourses } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "CPC Exam Preparation",
  description:
    "Prepare for medical coding certification with timed full-length mock exams, randomised question banks and answer-by-answer review.",
  path: "/school/exam-prep",
});

const features = [
  {
    icon: Clock3,
    title: "Timed like the real thing",
    body: "Mock exams run against the clock and submit automatically when time is up.",
  },
  {
    icon: Shuffle,
    title: "Randomised question banks",
    body: "Every attempt draws a different set of questions, so you learn concepts, not answers.",
  },
  {
    icon: ListChecks,
    title: "Section scores",
    body: "See which sections cost you points and where to focus next.",
  },
  {
    icon: BookOpenCheck,
    title: "Review mode",
    body: "Go back through every question with the correct answer and an explanation.",
  },
];

export default function ExamPrepPage() {
  const prep = getCourses().filter((c) => c.category === "exam-prep" || c.mockExams >= 3);
  return (
    <>
      <PageHero
        eyebrow="Exam preparation"
        title="Walk into your certification exam already knowing how it feels"
        intro="Practise under real timing with full-length mock exams, then review every answer until you're consistently passing."
        crumbs={[
          { name: "School", path: "/school" },
          { name: "Exam preparation", path: "/school/exam-prep" },
        ]}
      >
        <Link
          href="/school/courses/cpc-exam-preparation"
          className={buttonVariants({ size: "lg" })}
        >
          View CPC Exam Preparation
        </Link>
      </PageHero>
      <Section title="How our mock exams work">
        <ul className="grid gap-8 md:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-mint text-teal-deep">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-1 text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
        <Alert variant="info">
          <AlertTitle>We prepare you; the certifying body runs the exam</AlertTitle>
          <AlertDescription>
            Certification exams such as the CPC are booked and taken through the certifying body.
            GlobalMed courses prepare you for them but don&apos;t award those credentials.
          </AlertDescription>
        </Alert>
      </Section>
      <Section tone="white" title="Courses with mock exams">
        <ul className="grid gap-6 md:grid-cols-3">
          {prep.map((c) => (
            <li key={c.slug}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand
        title="Ready to find out where you stand?"
        href="/school/courses/cpc-exam-preparation"
        label="Start exam preparation"
      />
    </>
  );
}
