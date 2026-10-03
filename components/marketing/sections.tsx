import { ArrowRight, Clock, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { ClaimLine } from "@/components/motion/claim-line";
import { DeferredFaqAccordion } from "@/components/defer/islands";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { withReg } from "@/components/ui/reg";
import { StatBlock } from "@/components/ui/stat-block";
import { companyStats } from "@/content/company";
import type { SiteImage } from "@/content/images";
import { categoryLabels, levelLabels } from "@/lib/content/catalog";
import type { Course, Faq } from "@/lib/content/schema";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Breadcrumb links: 44px tap targets (the row keeps its visual size). */
const crumbLink = "inline-flex min-h-11 min-w-11 items-center";

/**
 * Page heading band with breadcrumbs (and BreadcrumbList JSON-LD). With an `image`, the text
 * sits left and the photo right (about 45%) from 1024px; below that the photo comes first.
 * The photo is the page's largest above-the-fold element, so it loads with priority.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  aside,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  image?: SiteImage;
  /** Shown under the photo (right column from 1024px, last on phones). */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section data-tone="ledger" className={cn("border-b bg-ledger", className)}>
      <div className="container-fluid flex flex-col gap-6 section-y">
        {crumbs && crumbs.length > 0 && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />} className={crumbLink}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((crumb, i) => (
                  <Fragment key={crumb.path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {i === crumbs.length - 1 ? (
                        <BreadcrumbPage>{withReg(crumb.name)}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.path} />} className={crumbLink}>
                          {withReg(crumb.name)}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, ...crumbs])} />
          </>
        )}
        {/* With a photo: the shared split grid (7/5 from 1280px, 60/40 at 1024–1279px), photo
            top level with the eyebrow and heading, and an optional `aside` (e.g. the course
            price card) under the photo so the columns stay balanced. Phones: photo, text,
            then the aside. */}
        <div className={cn(image && "split lg:grid-rows-[auto_1fr]")}>
          {/* Centred against the photo column: when the text is taller it starts level with the
              photo's top; when it's shorter it sits in the middle, so no empty band. */}
          <div className="flex flex-col gap-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="flex max-w-3xl flex-col gap-4">
              {eyebrow && (
                <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
                  {withReg(eyebrow)}
                </p>
              )}
              <h1 className="text-3xl lg:text-4xl">{withReg(title)}</h1>
              <ClaimLine trigger="mount" ticks={8} className="max-w-sm" />
              {intro && (
                <p className="max-w-prose text-lg text-muted-foreground">{withReg(intro)}</p>
              )}
            </div>
            {children}
          </div>
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              fetchPriority="high"
              sizes="(min-width: 1920px) 760px, (min-width: 1280px) 38vw, (min-width: 1024px) 36vw, calc(100vw - 40px)"
              className="order-first aspect-[4/3] h-auto w-full rounded-2xl object-cover shadow-sm lg:order-none lg:col-start-2 lg:row-start-1"
              data-hero-image
            />
          )}
          {image && aside && <div className="lg:col-start-2 lg:row-start-2">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

/** Standard content band. `tone` alternates full-bleed backgrounds (MASTER.md §3). */
export function Section({
  title,
  intro,
  tone = "ledger",
  id,
  children,
  className,
  deferRender = false,
}: {
  title?: string;
  intro?: string;
  tone?: "ledger" | "white" | "mint" | "ink";
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Below the fold on a long page: render lazily (content-visibility, 2026-10-01). */
  deferRender?: boolean;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      data-tone={tone === "mint" ? "mint" : tone === "ink" ? "ink" : "white"}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        tone === "white" && "border-y bg-card",
        tone === "mint" && "bg-mint",
        tone === "ink" && "bg-ink text-white",
        deferRender && "cv-auto",
      )}
    >
      <div className={cn("container-fluid flex flex-col gap-10 section-y", className)}>
        {title && (
          <div className="flex max-w-3xl flex-col gap-4">
            <h2
              id={headingId}
              className={cn("text-2xl lg:text-3xl", tone === "ink" && "text-white")}
            >
              {withReg(title)}
            </h2>
            {intro && (
              <p
                className={cn(
                  "max-w-prose",
                  tone === "ink" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {withReg(intro)}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** FAQ accordion with FAQPage JSON-LD (docs/12). */
export function FaqList({ faqs, withJsonLd = true }: { faqs: Faq[]; withJsonLd?: boolean }) {
  return (
    <>
      <DeferredFaqAccordion faqs={faqs} />
      {withJsonLd && <JsonLd data={faqJsonLd(faqs)} />}
    </>
  );
}

/** Closing call to action on an ink band. */
export function CtaBand({
  title,
  body,
  href = "/free-billing-audit",
  label = "Book your free billing audit",
  secondary,
}: {
  title: string;
  body?: string;
  href?: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section data-tone="ink" className="bg-ink text-white cv-auto">
      <div className="container-fluid flex flex-col items-start gap-4 section-y">
        <h2 className="max-w-3xl text-2xl text-white lg:text-3xl">{withReg(title)}</h2>
        {body && <p className="max-w-prose text-white/80">{body}</p>}
        <ClaimLine trigger="inView" ticks={8} goldEnd className="max-w-md" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {/* Sky with ink text: a navy button would disappear on the dark band. */}
          <Link
            href={href}
            className={cn(buttonVariants({ size: "lg" }), "bg-sky text-ink hover:bg-white")}
          >
            {label} <ArrowRight aria-hidden="true" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={cn(
                buttonVariants({ size: "lg", variant: "ghost" }),
                "text-white hover:bg-white/10",
              )}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function CourseCard({
  course,
  headingLevel = "h3",
}: {
  course: Course;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-colors hover:border-teal">
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{levelLabels[course.level]}</Badge>
        <Badge variant="secondary">{categoryLabels[course.category]}</Badge>
      </div>
      <Heading className="text-xl">
        <Link href={`/education/courses/${course.slug}`} className="after:absolute after:inset-0">
          {withReg(course.title)}
        </Link>
      </Heading>
      <p className="text-muted-foreground">{withReg(course.summary)}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" /> {course.hours} hours
        </li>
        <li className="flex items-center gap-1.5">
          <PlayCircle aria-hidden="true" className="size-4" /> {course.lessonCount} lessons
        </li>
      </ul>
      <p className="mt-auto flex items-baseline justify-between gap-2 pt-2">
        <span className="font-serif text-2xl font-semibold">{usd.format(course.priceUsd)}</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-teal-deep">
          View course <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </p>
    </article>
  );
}

type Stat = { label: string; value: number; suffix: string; decimals: number };

/**
 * Stat item hover (home card and About strip, 2026-10-02), pointer devices only (Tailwind's
 * hover variant needs a hovering pointer): lifts 4px onto #EEF6FC with a 16px radius, the
 * number turns #3A73C2 and a 3px sky underline grows from its centre, 200ms. Items aren't
 * links, so they aren't focusable. Reduced motion: no lift and no growth, colour only.
 */
const statItemClass =
  "group/stat rounded-2xl px-4 py-3 transition-[translate,background-color] duration-200 ease-out hover:-translate-y-1 hover:bg-surface-soft motion-reduce:transition-colors motion-reduce:hover:translate-y-0";
const statValueClass =
  "relative w-fit transition-colors duration-200 ease-out group-hover/stat:text-mid-blue after:absolute after:-bottom-1 after:left-1/2 after:h-[3px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-sky after:transition-[width] after:duration-200 after:ease-out group-hover/stat:after:w-full motion-reduce:after:transition-none";

/**
 * Per-cell layout of the overlapping stats card (five facts): 5 columns with dividers from
 * 1024px, 3 + 2 on tablets, 2 columns on phones with the last item full width.
 */
const overlapCells = [
  "",
  "md:border-l",
  "md:border-l",
  "md:col-span-3 md:border-t md:pt-3 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0",
  "col-span-2 md:col-span-3 md:border-t md:border-l md:pt-3 lg:col-span-1 lg:border-t-0 lg:pt-0",
];

/**
 * Trust strip (MG-4). Defaults to the company stats, which show "Illustrative" until the
 * client confirms them; pass `stats` (with `confirmed`) for client-supplied figures.
 *
 * `variant="overlap"` (home, 2026-10-01): a white card pulled up over the bottom of the hero
 * (half its height from 768px, 32px on phones). It belongs to the section after the hero, so
 * it scrolls with the page content, not with the slider; the slider's controls sit above the
 * overlap (hero-carousel.tsx).
 */
export function StatsStrip({
  stats = companyStats.items,
  confirmed = companyStats.confirmed,
  variant = "strip",
}: {
  stats?: Stat[];
  confirmed?: boolean;
  variant?: "strip" | "overlap";
}) {
  if (variant === "overlap") {
    return (
      <section
        data-tone="white"
        aria-label="GlobalMed in numbers"
        className="relative z-10 flow-root bg-card"
      >
        {/* band-y: joins the next white section's spacing (globals.css). Overlap: 32px on
            phones, 64px on tablets, half the card (72px) from 1024px. flow-root keeps the
            card's negative margin from collapsing through the section, so only the card (not
            the section's white background) covers the hero. */}
        <div className="band-y container-fluid">
          <ul
            className={cn(
              "-mt-8 grid grid-cols-2 gap-y-2 rounded-[20px] bg-card px-2 py-3 shadow-[0_20px_50px_rgb(23_38_92/0.14)] transition-shadow duration-200 ease-out hover:shadow-[0_24px_60px_rgb(23_38_92/0.2)] md:-mt-16 md:grid-cols-6 md:px-4 md:py-5 lg:-mt-[72px] lg:grid-cols-5",
              stats.length !== 5 && "md:grid-cols-3",
            )}
          >
            {stats.map((stat, i) => (
              <li
                key={stat.label}
                className={cn(
                  "flex justify-center border-[#D9E3F0] px-1 md:col-span-2 lg:col-span-1",
                  stats.length === 5 && overlapCells[i],
                )}
              >
                <StatBlock
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  illustrative={!confirmed}
                  className={cn("items-center text-center", statItemClass)}
                  valueClassName={cn("text-navy lg:text-4xl", statValueClass)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  return (
    <section data-tone="white" aria-label="GlobalMed in numbers" className="border-y bg-card">
      <div
        className={cn(
          "band-y container-fluid grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:gap-8",
          stats.length === 5 ? "md:grid-cols-3 lg:grid-cols-5" : "lg:grid-cols-4",
        )}
      >
        {stats.map((stat) => (
          <StatBlock
            key={stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            decimals={stat.decimals}
            illustrative={!confirmed}
            className={cn("-mx-4 -my-3", statItemClass)}
            // 24px on phones: a long figure ("125,000+") must fit a 2-column phone grid
            // even in the fallback serif (ADR-035).
            valueClassName={cn("text-2xl sm:text-3xl", statValueClass)}
          />
        ))}
      </div>
    </section>
  );
}

export function formatUsd(value: number): string {
  return usd.format(value);
}

export function formatPkr(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}
