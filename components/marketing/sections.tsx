import { ArrowRight, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { ClaimLine } from "@/components/motion/claim-line";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { StatBlock } from "@/components/ui/stat-block";
import { companyStats } from "@/content/company";
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

/** Page heading band with breadcrumbs (and BreadcrumbList JSON-LD). */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b bg-ledger", className)}>
      <div className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-12 md:px-6 lg:py-16">
        {crumbs && crumbs.length > 0 && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((crumb, i) => (
                  <Fragment key={crumb.path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {i === crumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.path} />}>
                          {crumb.name}
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
        <div className="flex max-w-3xl flex-col gap-4">
          {eyebrow && (
            <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl lg:text-4xl">{title}</h1>
          <ClaimLine trigger="mount" ticks={8} className="max-w-sm" />
          {intro && <p className="max-w-prose text-lg text-muted-foreground">{intro}</p>}
        </div>
        {children}
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
}: {
  title?: string;
  intro?: string;
  tone?: "ledger" | "white" | "mint" | "ink";
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        tone === "white" && "border-y bg-card",
        tone === "mint" && "bg-mint",
        tone === "ink" && "bg-ink text-white",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6 lg:py-20",
          className,
        )}
      >
        {title && (
          <div className="flex max-w-3xl flex-col gap-3">
            <h2
              id={headingId}
              className={cn("text-2xl lg:text-3xl", tone === "ink" && "text-white")}
            >
              {title}
            </h2>
            {intro && (
              <p
                className={cn(
                  "max-w-prose",
                  tone === "ink" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {intro}
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
      <Accordion className="rounded-lg border bg-card px-6">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
    <section className="bg-ink text-white">
      <div className="mx-auto flex max-w-300 flex-col items-start gap-6 px-4 py-16 md:px-6">
        <h2 className="max-w-3xl text-2xl text-white lg:text-3xl">{title}</h2>
        {body && <p className="max-w-prose text-white/80">{body}</p>}
        <ClaimLine trigger="inView" ticks={8} goldEnd className="max-w-md" />
        <div className="flex flex-col gap-3 sm:flex-row">
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
    <article className="relative flex h-full flex-col gap-4 rounded-lg border bg-card p-6 transition-colors hover:border-teal">
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{levelLabels[course.level]}</Badge>
        <Badge variant="secondary">{categoryLabels[course.category]}</Badge>
      </div>
      <Heading className="text-xl">
        <Link href={`/school/courses/${course.slug}`} className="after:absolute after:inset-0">
          {course.title}
        </Link>
      </Heading>
      <p className="text-muted-foreground">{course.summary}</p>
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

/** Trust strip (MG-4). Figures show "Illustrative" until the client confirms them. */
export function StatsStrip() {
  return (
    <section aria-label="GlobalMed in numbers" className="border-y bg-card">
      <div className="mx-auto grid max-w-300 grid-cols-2 gap-8 px-4 py-10 md:px-6 lg:grid-cols-4">
        {companyStats.items.map((stat) => (
          <StatBlock
            key={stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            decimals={stat.decimals}
            illustrative={!companyStats.confirmed}
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
