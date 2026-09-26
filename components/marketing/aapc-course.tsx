import { ArrowRight, Award, BadgeCheck, Check, MessageCircle } from "lucide-react";
import Link from "next/link";

import { AapcRegistrationForm } from "@/components/marketing/aapc-registration-form";
import { FaqList, PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  aapcCourseFacts,
  aapcCoursePath,
  getAapcCourses,
  type AapcCourse,
  type AapcCourseSlug,
} from "@/data/courses";
import { approvedWording } from "@/content/aapc";
import type { Faq } from "@/lib/content/schema";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";

const eyebrowClass = "font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase";

function WhatsAppLink({ className }: { className?: string }) {
  return (
    <a
      href={aapcCourseFacts.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <MessageCircle aria-hidden="true" /> Ask on WhatsApp
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Price, its confirmation marker, and the delivery note that sits under every price. */
function PriceBlock({ course, onDark = false }: { course: AapcCourse; onDark?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p
        className={cn("text-sm font-semibold", onDark ? "text-white/80" : "text-muted-foreground")}
      >
        Price
      </p>
      <p className="font-serif text-3xl font-semibold">{course.price ?? "To be confirmed"}</p>
      {!course.priceConfirmed && (
        <p className={cn("text-xs", onDark ? "text-white/75" : "text-muted-foreground")}>
          [CLIENT TO CONFIRM]
        </p>
      )}
      <p className={cn("mt-1 text-xs", onDark ? "text-white/80" : "text-muted-foreground")}>
        {aapcCourseFacts.priceNote}
      </p>
    </div>
  );
}

/** Format, taught by, duration and who awards the certification. */
function CourseFacts({ course, compact = false }: { course: AapcCourse; compact?: boolean }) {
  const rows = [
    ["Format", aapcCourseFacts.format],
    ["Taught by", aapcCourseFacts.taughtBy],
    ["Duration", course.duration],
    ["Certification awarded by", aapcCourseFacts.awardedBy],
  ] as const;
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-2 text-sm",
        compact ? "grid-cols-1" : "sm:grid-cols-[auto_1fr]",
      )}
    >
      {rows.map(([label, value]) => (
        <div key={label} className={compact ? "flex flex-col" : "contents"}>
          <dt className="font-semibold">{label}</dt>
          <dd className="text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AudienceList({ className }: { className?: string }) {
  return (
    <ol className={cn("flex flex-col gap-1.5", className)}>
      {aapcCourseFacts.audience.map((line, i) => (
        <li key={line} className="flex items-start gap-2">
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
          <span className={i === 0 ? "font-semibold" : undefined}>{line}</span>
        </li>
      ))}
    </ol>
  );
}

/** What's included, or labelled placeholder rows while AAPC's list is unconfirmed. */
function IncludedList({ course }: { course: AapcCourse }) {
  if (!course.included) {
    return (
      <ul className="flex flex-col gap-2" aria-label="What's included (to be confirmed)">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
            <span className="flex-1 rounded-md border-2 border-dashed border-input px-3 py-1 text-sm text-muted-foreground">
              Included item {n}: [CLIENT TO CONFIRM from AAPC CPB page]
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {course.included.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One AAPC course card (client, 2026-09-26): official badge, facts, audience, price with the
 * delivery note, and Register Now / Ask on WhatsApp. The dual course is marked best value.
 */
export function AapcCourseCard({
  course,
  registerHref,
  headingLevel = 3,
}: {
  course: AapcCourse;
  /** Where Register Now goes (the form, preselected with this course). */
  registerHref: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm",
        course.bestValue && "border-2 border-primary shadow-md lg:-my-3 lg:py-9",
      )}
    >
      {course.bestValue && (
        <p className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          <Award aria-hidden="true" className="size-3.5" /> Best value: two certifications
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="self-start">
          <BadgeCheck aria-hidden="true" /> {aapcCourseFacts.badge}
        </Badge>
        <p className="font-serif text-3xl font-semibold text-primary">{course.credential}</p>
        <Heading className="text-lg leading-snug">{course.title}</Heading>
        <p className="text-sm text-muted-foreground">{course.summary}</p>
      </div>
      <CourseFacts course={course} compact />
      <div className="flex flex-col gap-2">
        <p className={eyebrowClass}>Who it&apos;s for</p>
        <AudienceList className="text-sm" />
      </div>
      <div className="mt-auto flex flex-col gap-4 border-t pt-4">
        <PriceBlock course={course} />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href={registerHref} className={buttonVariants({ size: "lg" })}>
            Register Now <span className="sr-only">for {course.credential}</span>
          </Link>
          <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
        </div>
        <Link
          href={aapcCoursePath(course.slug)}
          className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold text-primary underline underline-offset-4"
        >
          Course details<span className="sr-only">: {course.credential}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

/** Registration form band (id="register"), with the role line and WhatsApp. */
export function AapcRegisterBand({ defaultCourse }: { defaultCourse?: AapcCourseSlug }) {
  return (
    <section id="register" aria-labelledby="register-title" className="bg-ink text-white">
      <div className="mx-auto grid max-w-300 gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-5">
          <h2 id="register-title" className="text-2xl text-white lg:text-3xl">
            Register Now
          </h2>
          <p className="max-w-prose text-white/85">{approvedWording.role}</p>
          <p className="max-w-prose text-white/85">
            {approvedWording.training} {approvedWording.certification}
          </p>
          <p className="max-w-prose text-sm text-white/75">
            Please don&apos;t include any patient information.
          </p>
          <WhatsAppLink
            className={cn(
              buttonVariants({ size: "lg" }),
              "self-start bg-sky text-ink hover:bg-white",
            )}
          />
        </div>
        <AapcRegistrationForm defaultCourse={defaultCourse} />
      </div>
    </section>
  );
}

/** One AAPC course page: /education/cpc, /education/cpb, /education/cpc-cpb. */
export function AapcCoursePage({ course, faqs }: { course: AapcCourse; faqs: Faq[] }) {
  const others = getAapcCourses().filter((c) => c.slug !== course.slug);
  return (
    <>
      <PageHero
        eyebrow={aapcCourseFacts.badge}
        title={course.title}
        intro={course.summary}
        crumbs={[
          { name: "Education", path: aapcCertificationPath },
          { name: course.credential, path: aapcCoursePath(course.slug) },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#register" className={buttonVariants({ size: "lg" })}>
            Register Now <ArrowRight aria-hidden="true" />
          </Link>
          <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
        </div>
      </PageHero>

      <Section className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">Course at a glance</h2>
            <CourseFacts course={course} />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">What&apos;s included</h2>
            <IncludedList course={course} />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">What you&apos;ll learn</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {course.learn.map((topic) => (
                <li key={topic} className="flex items-start gap-2">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">Who it&apos;s for</h2>
            <AudienceList />
          </div>
        </div>
        <aside
          aria-label="Price and registration"
          className={cn(
            "mt-10 flex flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:mt-0",
            course.bestValue && "border-2 border-primary",
          )}
        >
          {course.bestValue && (
            <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              <Award aria-hidden="true" className="size-3.5" /> Best value: two certifications
            </p>
          )}
          <Badge variant="secondary" className="self-start">
            <BadgeCheck aria-hidden="true" /> {aapcCourseFacts.badge}
          </Badge>
          <PriceBlock course={course} />
          <div className="flex flex-col gap-2">
            <Link href="#register" className={buttonVariants({ size: "lg" })}>
              Register Now
            </Link>
            <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
          </div>
        </aside>
      </Section>

      <Section tone="white" title="Other AAPC courses" id="other-courses">
        <ul className="grid gap-6 md:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={aapcCoursePath(other.slug)}
                className="group flex h-full flex-col gap-2 rounded-lg border bg-card p-6 transition-colors hover:border-primary"
              >
                <span className="font-serif text-2xl font-semibold text-primary">
                  {other.credential}
                </span>
                <span className="font-semibold group-hover:underline">{other.title}</span>
                <span className="text-sm text-muted-foreground">{other.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={aapcCertificationPath}
          className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
        >
          Compare all three courses <ArrowRight aria-hidden="true" />
        </Link>
      </Section>

      {faqs.length > 0 && (
        <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="text-2xl lg:text-3xl">Questions about {course.credential}</h2>
          <FaqList faqs={faqs} />
        </Section>
      )}

      <AapcRegisterBand defaultCourse={course.slug} />
    </>
  );
}
