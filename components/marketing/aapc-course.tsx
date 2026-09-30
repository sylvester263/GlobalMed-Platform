import { ArrowRight, CircleCheck } from "lucide-react";
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
        "grid gap-grid md:grid-cols-2",
        groups.length > 3 ? "xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {groups.map((group) => (
        <li
          key={group.title}
          className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm"
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

/** "Register for AAPC Training" band (id="register"), with the role line and WhatsApp. */
export function AapcRegisterBand({ defaultCourse }: { defaultCourse?: AapcCourseSlug }) {
  return (
    <section id="register" aria-labelledby="register-title" className="bg-ink text-white">
      <div className="container-fluid grid split-cols-reverse gap-10 section-y lg:items-start">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
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
        <DeferredRegistrationForm defaultCourse={defaultCourse} title="Your details" />
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
        image={courseHeroImages[course.slug]}
        aside={
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <PriceBlock course={course} />
          </div>
        }
        crumbs={[
          { name: "Education", path: aapcCertificationPath },
          { name: course.credential, path },
        ]}
      >
        {/* Facts and buttons; the price card sits under the photo (hero aside). */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {course.bestValue && <BestValue className="self-start" />}
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold">Format</dt>
              <dd className="text-muted-foreground">{aapcCourseFacts.format}</dd>
              <dt className="font-semibold">Duration</dt>
              <dd className="text-muted-foreground">{course.duration}</dd>
              <dt className="font-semibold">Certification awarded by</dt>
              <dd className="text-muted-foreground">{aapcCourseFacts.awardedBy}</dd>
            </dl>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="#register" className={buttonVariants({ size: "lg" })}>
              Register Now <ArrowRight aria-hidden="true" />
            </Link>
            <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
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
          <div className="grid gap-grid md:grid-cols-2">
            {content.intro.columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
                <h3 className="text-xl">{col.heading}</h3>
                <p className="text-muted-foreground">{col.body}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 3. What's included: replaced by "Package Includes" in the hero (2026-09-30). */}
      {legacyIncluded[course.slug] && (
        <Section tone="white" id="included" title="What's included">
          <ul className="grid gap-3 sm:grid-cols-2">
            {course.included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sky" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

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
        <Section className="split-cols-reverse lg:grid lg:items-start">
          <h2 className="text-2xl lg:sticky lg:top-24 lg:self-start lg:text-3xl">
            Questions about {course.credential}
          </h2>
          <FaqList faqs={faqs} />
        </Section>
      )}

      {/* Other courses */}
      <Section tone="white" title="Other AAPC courses" id="other-courses">
        <ul className="grid gap-grid md:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={aapcCoursePath(other.slug)}
                className="group flex h-full flex-col gap-2 rounded-2xl border bg-card p-6 transition-colors hover:border-primary"
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
