import {
  Award,
  Briefcase,
  ClipboardCheck,
  GraduationCap,
  PlayCircle,
  Repeat,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AapcInstructorsBand } from "@/components/marketing/aapc-instructors-band";
import {
  CourseCard,
  CtaBand,
  FaqList,
  formatPkr,
  formatUsd,
  PageHero,
  Section,
} from "@/components/marketing/sections";
import { PathwayLine } from "@/components/motion/pathway-line";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { faqGroups } from "@/content/company";
import { instructors } from "@/content/school";
import { getFeaturedCourses, getPathways } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "GlobalMed Education",
  description:
    "Online medical billing and coding courses with rewatchable video lessons, mock exams and verifiable certificates. Pay in USD or PKR.",
  path: "/education",
});

const audiences = [
  {
    icon: GraduationCap,
    title: "Career-changers",
    body: "Start from zero and become job-ready for billing and coding roles with US practices.",
  },
  {
    icon: UserRound,
    title: "Working coders",
    body: "Go deeper on E/M, diagnosis coding and denials, or prepare for certification.",
  },
  {
    icon: Briefcase,
    title: "Employers",
    body: "Train your billing team with courses built by people who do the work every day.",
  },
];

/** MG-10: static until the "how learning works" Lottie loop is delivered (P2-15). */
const learningLoop = [
  {
    icon: PlayCircle,
    title: "Watch",
    body: "Short video lessons you can rewatch any time, resuming where you left off.",
  },
  { icon: Repeat, title: "Practise", body: "Quizzes with instant feedback after every module." },
  {
    icon: ClipboardCheck,
    title: "Mock exam",
    body: "Timed, randomised exams with full review of every answer.",
  },
  {
    icon: Award,
    title: "Certificate",
    body: "A certificate with a unique ID employers can verify online.",
  },
];

export default function EducationPage() {
  const featured = getFeaturedCourses();
  const pathways = getPathways();
  const primary = pathways[0];
  const schoolFaqs = faqGroups.find((g) => g.id === "school")?.faqs ?? [];

  return (
    <>
      <PageHero
        eyebrow={site.schoolName}
        title="Job-ready medical billing and coding skills, taught by people who do the work"
        intro="Video lessons you can rewatch, practice after every module, timed mock exams and a certificate employers can verify online. Pay by card in USD or locally in PKR."
        crumbs={[{ name: "Education", path: "/education" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/education/courses" className={buttonVariants({ size: "lg" })}>
            Browse courses
          </Link>
          <Link
            href="/education/pathways"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            See certification pathways
          </Link>
        </div>
      </PageHero>

      <AapcInstructorsBand />

      <Section title="Who it's for">
        <ul className="grid gap-6 md:grid-cols-3">
          {audiences.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-md bg-mint text-teal-deep">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-xl">{title}</h3>
              <p className="text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {primary && (
        <Section tone="white" title="From beginner to certified" intro={primary.summary}>
          <PathwayLine
            stages={primary.steps.map((s) => ({ label: s.label, description: s.description }))}
            current={0}
          />
          <Link
            href={`/education/pathways/${primary.slug}`}
            className={cn(buttonVariants({ variant: "secondary" }), "self-start")}
          >
            Explore the {primary.title}
          </Link>
        </Section>
      )}

      <Section title="Featured courses">
        <StaggerGroup as="ul" className="grid gap-6 md:grid-cols-3">
          {featured.map((course) => (
            <StaggerItem as="li" key={course.slug}>
              <CourseCard course={course} />
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Link
          href="/education/courses"
          className={cn(buttonVariants({ variant: "link" }), "self-start")}
        >
          See all courses
        </Link>
      </Section>

      <Section tone="mint" title="How learning works">
        <StaggerGroup as="ol" className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {learningLoop.map(({ icon: Icon, title, body }, i) => (
            <StaggerItem as="li" key={title} className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-teal bg-card">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                Step {i + 1}
              </span>
              <h3 className="text-xl">{title}</h3>
              <p>{body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section title="Learn from working professionals">
        <ul className="grid gap-6 md:grid-cols-2">
          {instructors.map((i) => (
            <li key={i.id} className="flex gap-4 rounded-lg border bg-card p-6">
              <Avatar className="size-14">
                <AvatarFallback className="bg-mint text-lg font-semibold text-teal-deep">
                  {i.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-serif text-xl font-semibold">{i.name}</p>
                <p className="text-sm font-semibold text-teal-deep">{i.title}</p>
                <p className="text-muted-foreground">{i.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" title="Save with a pathway bundle">
        <ul className="grid gap-6 md:grid-cols-2">
          {pathways.map((p) => (
            <li key={p.slug} className="flex flex-col gap-3 rounded-lg border bg-ledger p-6">
              <h3 className="text-xl">{p.title}</h3>
              <p className="text-muted-foreground">{p.summary}</p>
              <p>
                <span className="font-serif text-3xl font-semibold">
                  {formatUsd(p.bundlePriceUsd)}
                </span>{" "}
                <span className="text-sm text-muted-foreground">
                  or {formatPkr(p.bundlePricePkr)}
                </span>
              </p>
              <Link
                href={`/education/pathways/${p.slug}`}
                className={cn(buttonVariants({ variant: "secondary" }), "self-start")}
              >
                View pathway
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Questions students ask">
        <FaqList faqs={schoolFaqs} />
      </Section>

      <CtaBand
        title="Start learning today"
        body="Watch free preview lessons before you enroll."
        href="/education/courses"
        label="Browse courses"
        secondary={{ href: "/education/batches", label: "See upcoming live batches" }}
      />
    </>
  );
}
