import { ArrowRight, Award, BadgeCheck, Check, CircleCheck, MessageCircle } from "lucide-react";
import Link from "next/link";

import { AapcRegistrationForm } from "@/components/marketing/aapc-registration-form";
import { CourseCoversTabs } from "@/components/marketing/course-covers-tabs";
import { FaqList, PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { approvedWording } from "@/content/aapc";
import { coursePageContent, type CourseGroup } from "@/content/courses";
import {
  aapcCourseFacts,
  aapcCoursePath,
  formatUsdPrice,
  getAapcCourses,
  type AapcCourse,
  type AapcCourseSlug,
} from "@/data/courses";
import type { Faq } from "@/lib/content/schema";
import { aapcCourseJsonLd, JsonLd } from "@/lib/seo/json-ld";
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

function BestValue({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white",
        className,
      )}
    >
      <Award aria-hidden="true" className="size-3.5" /> Best value: two certifications
    </p>
  );
}

/** Price, the dual course's saving, and the delivery note that sits under every price. */
function PriceBlock({ course }: { course: AapcCourse }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-muted-foreground">Price</p>
      <p className="font-serif text-3xl font-semibold">{formatUsdPrice(course.priceUsd)}</p>
      {course.priceSaving && (
        <p className="text-sm font-semibold text-success-ink">{course.priceSaving}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">{aapcCourseFacts.priceNote}</p>
    </div>
  );
}

/** Format, taught by, duration and who awards the certification. */
function CourseFacts({ course }: { course: AapcCourse }) {
  const rows = [
    ["Format", aapcCourseFacts.format],
    ["Taught by", aapcCourseFacts.taughtBy],
    ["Duration", course.duration],
    ["Certification awarded by", aapcCourseFacts.awardedBy],
  ] as const;
  return (
    <dl className="grid grid-cols-1 gap-y-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col">
          <dt className="font-semibold">{label}</dt>
          <dd className="text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item, i) => (
        <li key={item} className="flex items-start gap-2">
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
          <span
            className={
              i === 0 && item === "Healthcare professionals and billers"
                ? "font-semibold"
                : undefined
            }
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** "What it covers": one card per group with its sub-points. */
function GroupCards({ groups }: { groups: CourseGroup[] }) {
  return (
    <ul
      className={cn(
        "grid gap-6 md:grid-cols-2",
        groups.length > 3 ? "xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {groups.map((group) => (
        <li
          key={group.title}
          className="flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm"
        >
          <h3 className="flex items-start gap-2 text-lg leading-snug">
            <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-sky" />
            {group.title}
          </h3>
          <CheckList items={group.items} className="text-sm" />
        </li>
      ))}
    </ul>
  );
}

/**
 * One AAPC course card (client, 2026-09-26): official badge, facts, who it's for, price with
 * the delivery note, and Register Now / Ask on WhatsApp. The dual course is marked best value.
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
  const who = coursePageContent[course.slug].who.items;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm",
        course.bestValue && "border-2 border-primary shadow-md lg:-my-3 lg:py-9",
      )}
    >
      {course.bestValue && <BestValue className="absolute -top-3.5 left-6" />}
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="self-start">
          <BadgeCheck aria-hidden="true" /> {aapcCourseFacts.badge}
        </Badge>
        <p className="font-serif text-3xl font-semibold text-primary">{course.credential}</p>
        <Heading className="text-lg leading-snug">{course.title}</Heading>
        <p className="text-sm text-muted-foreground">{course.summary}</p>
      </div>
      <CourseFacts course={course} />
      <div className="flex flex-col gap-2">
        <p className={eyebrowClass}>Who it&apos;s for</p>
        <CheckList items={who} className="text-sm" />
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

/** "Register for AAPC Training" band (id="register"), with the role line and WhatsApp. */
export function AapcRegisterBand({ defaultCourse }: { defaultCourse?: AapcCourseSlug }) {
  return (
    <section id="register" aria-labelledby="register-title" className="bg-ink text-white">
      <div className="mx-auto grid max-w-300 gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-5">
          <h2 id="register-title" className="text-2xl text-white lg:text-3xl">
            Register for AAPC Training
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
        <AapcRegistrationForm defaultCourse={defaultCourse} title="Your details" />
      </div>
    </section>
  );
}

/**
 * One AAPC course page: /education/cpc, /education/cpb, /education/cpc-cpb (client template,
 * 2026-09-26). Copy comes from content/courses/<slug>.ts; facts and price from data/courses.ts.
 */
export function AapcCoursePage({ course, faqs }: { course: AapcCourse; faqs: Faq[] }) {
  const content = coursePageContent[course.slug];
  const others = getAapcCourses().filter((c) => c.slug !== course.slug);
  const path = aapcCoursePath(course.slug);

  return (
    <>
      <JsonLd
        data={aapcCourseJsonLd({
          name: course.title,
          description: course.summary,
          path,
          priceUsd: course.priceUsd,
        })}
      />

      {/* 1. Hero */}
      <PageHero
        eyebrow={aapcCourseFacts.badge}
        title={course.title}
        intro={course.summary}
        crumbs={[
          { name: "Education", path: aapcCertificationPath },
          { name: course.credential, path },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="flex flex-col gap-4">
            {course.bestValue && <BestValue className="self-start" />}
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold">Format</dt>
              <dd className="text-muted-foreground">
                {aapcCourseFacts.format}, taught by {aapcCourseFacts.taughtBy}
              </dd>
              <dt className="font-semibold">Duration</dt>
              <dd className="text-muted-foreground">{course.duration}</dd>
              <dt className="font-semibold">Certification awarded by</dt>
              <dd className="text-muted-foreground">{aapcCourseFacts.awardedBy}</dd>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="#register" className={buttonVariants({ size: "lg" })}>
                Register Now <ArrowRight aria-hidden="true" />
              </Link>
              <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <PriceBlock course={course} />
          </div>
        </div>
      </PageHero>

      {/* 2. What is a …? */}
      <Section id="what-is" title={content.intro.heading}>
        <div className="flex max-w-prose flex-col gap-4">
          {content.intro.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        {content.intro.columns && (
          <div className="grid gap-6 md:grid-cols-2">
            {content.intro.columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3 rounded-lg border bg-card p-6">
                <h3 className="text-xl">{col.heading}</h3>
                <p className="text-muted-foreground">{col.body}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 3. What's included */}
      <Section tone="white" id="included" title="What's included">
        <ul className="grid gap-3 sm:grid-cols-2">
          {course.included.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sky" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Why earn it */}
      <Section id="why" title={content.why.heading}>
        <div className={cn("grid gap-8", content.why.groups.length > 1 && "md:grid-cols-2")}>
          {content.why.groups.map((group) => (
            <div key={group.title ?? "why"} className="flex flex-col gap-3">
              {group.title && <h3 className="text-xl">{group.title}</h3>}
              <CheckList items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      {/* 5. What it covers */}
      <Section tone="white" id="covers" title={content.covers.heading}>
        {content.covers.tabs ? (
          <CourseCoversTabs
            tabs={content.covers.tabs.map((tab) => ({
              label: tab.label,
              panel: <GroupCards groups={tab.groups} />,
            }))}
          />
        ) : (
          <GroupCards groups={content.covers.groups ?? []} />
        )}
      </Section>

      {/* 6. Curriculum overview and training objectives (CPB® only) */}
      {content.curriculum && (
        <Section id="curriculum" title={content.curriculum.heading}>
          <div className="flex max-w-prose flex-col gap-4">
            {content.curriculum.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl">{content.curriculum.objectivesHeading}</h3>
            <CheckList items={content.curriculum.objectives} />
          </div>
        </Section>
      )}

      {/* 7. Who should earn it */}
      <Section tone={content.curriculum ? "white" : "ledger"} id="who" title={content.who.heading}>
        <CheckList items={content.who.items} />
      </Section>

      {/* 8–9. Experience requirements and maintaining the certification */}
      <Section
        tone={content.curriculum ? "ledger" : "white"}
        className="lg:grid lg:grid-cols-2 lg:gap-16"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">{content.experience.heading}</h2>
          {content.experience.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="max-w-prose">
              {p}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">{content.maintaining.heading}</h2>
          {content.maintaining.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="max-w-prose">
              {p}
            </p>
          ))}
        </div>
      </Section>

      {/* 10. Expand your opportunities */}
      <Section tone="mint" id="opportunities" title={content.closing.heading}>
        <div className="flex max-w-prose flex-col gap-4">
          {content.closing.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#register" className={buttonVariants({ size: "lg" })}>
            Register Now <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            href={aapcCertificationPath}
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Compare all three courses
          </Link>
        </div>
      </Section>

      {/* 11. FAQ (FaqList emits the FAQPage JSON-LD) */}
      {faqs.length > 0 && (
        <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="text-2xl lg:text-3xl">Questions about {course.credential}</h2>
          <FaqList faqs={faqs} />
        </Section>
      )}

      {/* Other courses */}
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
                <span className="text-sm text-muted-foreground">
                  {formatUsdPrice(other.priceUsd)} · {other.compare.duration}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 12. CTA band */}
      <AapcRegisterBand defaultCourse={course.slug} />
    </>
  );
}
