import { ArrowRight, Award, CircleCheck, Clock, MonitorPlay } from "lucide-react";
import Link from "next/link";

import {
  BestValue,
  CheckList,
  PriceBlock,
  WhatsAppLink,
} from "@/components/marketing/aapc-course-card";
import { DeferredRegistrationForm } from "@/components/marketing/deferred-registration-form";
import { CourseCoversTabs } from "@/components/marketing/course-covers-tabs";
import { FaqList, PageHero, Section } from "@/components/marketing/sections";
import { heroImages } from "@/content/images";
import { buttonVariants } from "@/components/ui/button";
import { withReg } from "@/components/ui/reg";
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
import { features } from "@/config/features";
import { cn } from "@/lib/utils";

const courseHeroImages = {
  cpc: heroImages.courseCpc,
  cpb: heroImages.courseCpb,
  "cpc-cpb": heroImages.courseCpcCpb,
} as const;

/** The old "What's included" list is shown only if its flag is back on (config/features.ts). */
const legacyIncluded: Record<AapcCourseSlug, boolean> = {
  cpc: features.cpcIncludedLegacy,
  cpb: features.cpbIncludedLegacy,
  "cpc-cpb": features.dualIncludedLegacy,
};

/** "What it covers": one card per group with its sub-points. */
function GroupCards({ groups }: { groups: CourseGroup[] }) {
  return (
    <ul
      className={cn(
        // Inside the main column beside the price card: 2 columns, 3 on very wide screens.
        "grid gap-grid md:grid-cols-2",
        groups.length >= 3 && "2xl:grid-cols-3",
      )}
    >
      {groups.map((group, i) => (
        <li
          key={group.title}
          className={cn(
            "flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm",
            // An odd last card spans both columns, so no empty slot is left beside it.
            groups.length % 2 === 1 && i === groups.length - 1 && "md:col-span-2",
            groups.length === 3 && "2xl:col-span-1",
          )}
        >
          <h3 className="flex items-start gap-2 text-lg leading-snug">
            <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-sky" />
            {withReg(group.title)}
          </h3>
          <CheckList items={group.items} className="text-sm" />
        </li>
      ))}
    </ul>
  );
}

/** "Register for AAPC Training" band (id="register"), with the role line and WhatsApp. */
export function AapcRegisterBand({ defaultCourse }: { defaultCourse?: AapcCourseSlug }) {
  return (
    <section
      id="register"
      data-tone="ink"
      aria-labelledby="register-title"
      className="bg-ink text-white"
    >
      <div className="container-fluid grid split-cols-reverse gap-10 section-y lg:items-start">
        <div className="flex flex-col gap-5 lg:self-center">
          <h2 id="register-title" className="text-2xl text-white lg:text-3xl">
            Register for AAPC Training
          </h2>
          <p className="max-w-prose text-white/85">{withReg(approvedWording.role)}</p>
          <p className="max-w-prose text-white/85">
            {withReg(`${approvedWording.training} ${approvedWording.certification}`)}
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
        <DeferredRegistrationForm defaultCourse={defaultCourse} title="Your details" />
      </div>
    </section>
  );
}

/** A section of the course page's main column (the Phase 2 course template layout). */
function CourseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-5">
      <h2 id={`${id}-title`} className="text-2xl lg:text-3xl">
        {withReg(title)}
      </h2>
      {children}
    </section>
  );
}

/**
 * One AAPC course page: /education/cpc, /education/cpb, /education/cpc-cpb. Copy comes from
 * content/courses/<slug>.ts; facts and price from data/courses.ts.
 *
 * Layout (client, 2026-10-01): the original Phase 2 course template, i.e. a compact hero with
 * the facts, then one body with the sections in a main column beside a sticky price card
 * (price, delivery note, Package Includes, Register Now, WhatsApp), related courses, the
 * registration band, and a sticky price + Register bar on phones. All content is unchanged.
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

      {/* Hero: title, summary and the key facts (price and CTAs are in the side card). */}
      <PageHero
        eyebrow={aapcCourseFacts.badge}
        title={course.title}
        intro={course.summary}
        image={courseHeroImages[course.slug]}
        crumbs={[
          { name: "Education", path: aapcCertificationPath },
          { name: course.credential, path },
        ]}
      >
        <div className="flex flex-col gap-4">
          {course.bestValue && <BestValue className="self-start" />}
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MonitorPlay aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-foreground">Format: </span>
                {aapcCourseFacts.format}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-foreground">Duration: </span>
                {course.duration}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-foreground">Certification awarded by: </span>
                {aapcCourseFacts.awardedBy}
              </span>
            </li>
          </ul>
        </div>
      </PageHero>

      {/* A white-tone section, so it shares its padding with "Other AAPC courses" below. */}
      <section data-tone="white" aria-label={`${course.credential} course details`}>
        <div className="container-fluid grid gap-12 section-y lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          {/* Price card: first on phones and tablets, a sticky side column from 1024px. */}
          <aside aria-label="Price and registration" className="lg:order-last">
            <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <PriceBlock course={course} />
              <div className="flex flex-col gap-3">
                <Link href="#register" className={buttonVariants({ size: "lg" })}>
                  Register Now <ArrowRight aria-hidden="true" />
                </Link>
                <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-14">
            <CourseSection id="what-is" title={content.intro.heading}>
              <div className="flex max-w-prose flex-col gap-4">
                {content.intro.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{withReg(p)}</p>
                ))}
              </div>
              {content.intro.columns && (
                <div className="grid gap-grid md:grid-cols-2">
                  {content.intro.columns.map((col) => (
                    <div
                      key={col.heading}
                      className="flex flex-col gap-3 rounded-2xl border bg-card p-6"
                    >
                      <h3 className="text-xl">{withReg(col.heading)}</h3>
                      <p className="text-muted-foreground">{withReg(col.body)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CourseSection>

            {/* Old "What's included", replaced by "Package Includes" (2026-09-30). */}
            {legacyIncluded[course.slug] && (
              <CourseSection id="included" title="What's included">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {course.included.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border bg-card p-4"
                    >
                      <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sky" />
                      <span>{withReg(item)}</span>
                    </li>
                  ))}
                </ul>
              </CourseSection>
            )}

            <CourseSection id="why" title={content.why.heading}>
              <div className={cn("grid gap-8", content.why.groups.length > 1 && "md:grid-cols-2")}>
                {content.why.groups.map((group) => (
                  <div key={group.title ?? "why"} className="flex flex-col gap-3">
                    {group.title && <h3 className="text-xl">{withReg(group.title)}</h3>}
                    <CheckList items={group.items} />
                  </div>
                ))}
              </div>
            </CourseSection>

            <CourseSection id="covers" title={content.covers.heading}>
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
            </CourseSection>

            {content.curriculum && (
              <CourseSection id="curriculum" title={content.curriculum.heading}>
                <div className="flex max-w-prose flex-col gap-4">
                  {content.curriculum.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{withReg(p)}</p>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl">{withReg(content.curriculum.objectivesHeading)}</h3>
                  <CheckList items={content.curriculum.objectives} />
                </div>
              </CourseSection>
            )}

            {/* "Who it's for" and the requirements side by side, as in the original template. */}
            <div className="grid gap-12 md:grid-cols-2">
              <CourseSection id="who" title={content.who.heading}>
                <CheckList items={content.who.items} />
              </CourseSection>
              <CourseSection id="experience" title={content.experience.heading}>
                {content.experience.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="max-w-prose">
                    {withReg(p)}
                  </p>
                ))}
              </CourseSection>
            </div>

            <CourseSection id="maintaining" title={content.maintaining.heading}>
              {content.maintaining.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="max-w-prose">
                  {withReg(p)}
                </p>
              ))}
            </CourseSection>

            <CourseSection id="opportunities" title={content.closing.heading}>
              <div className="flex max-w-prose flex-col gap-4">
                {content.closing.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{withReg(p)}</p>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
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
            </CourseSection>

            {/* FAQ (FaqList emits the FAQPage JSON-LD) */}
            {faqs.length > 0 && (
              <CourseSection id="faq" title={`Questions about ${course.credential}`}>
                <FaqList faqs={faqs} />
              </CourseSection>
            )}
          </div>
        </div>
      </section>

      {/* Related courses */}
      <Section tone="white" title="Other AAPC courses" id="other-courses">
        <ul className="grid gap-grid md:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                prefetch={false}
                href={aapcCoursePath(other.slug)}
                className="group flex h-full flex-col gap-2 rounded-2xl border bg-card p-6 transition-colors hover:border-primary"
              >
                <span className="font-serif text-2xl font-semibold text-primary">
                  {withReg(other.credential)}
                </span>
                <span className="font-semibold group-hover:underline">{withReg(other.title)}</span>
                <span className="text-sm text-muted-foreground">
                  {formatUsdPrice(other.priceUsd)} · {other.compare.duration}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <AapcRegisterBand defaultCourse={course.slug} />

      {/* Sticky price + Register bar on phones and tablets (original template, docs/05). The
          right padding leaves room for the 60px help button, so it never covers the button. */}
      <div
        data-sticky-cta
        className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t bg-card py-3 pr-[92px] pl-(--gutter) shadow-[0_-4px_16px_rgb(23_38_92/0.08)] md:pr-[112px] lg:hidden"
      >
        <p className="font-serif text-xl font-semibold">{formatUsdPrice(course.priceUsd)}</p>
        <Link href="#register" className={buttonVariants({ size: "lg" })}>
          Register Now
        </Link>
      </div>
    </>
  );
}
