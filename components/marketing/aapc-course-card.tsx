import { ArrowRight, Award, BadgeCheck, Check, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { coursePageContent } from "@/content/courses";
import { aapcCourseFacts, aapcCoursePath, formatUsdPrice, type AapcCourse } from "@/data/courses";
import { cn } from "@/lib/utils";

// The AAPC course card and its parts, in their own module so pages that only list courses
// (home, AAPC page) don't pull the registration form into their bundle (2026-10-01).
export const eyebrowClass =
  "font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase";

export function WhatsAppLink({ className }: { className?: string }) {
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

export function BestValue({ className }: { className?: string }) {
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

/** "Package Includes" (client, 2026-09-30): bold heading, sky checks, 8px between items. */
export function PackageIncludes({ course }: { course: AapcCourse }) {
  const headingId = `package-${course.slug}`;
  return (
    <div className="flex flex-col gap-2" data-package-includes>
      <p id={headingId} className="text-base font-bold text-ink">
        Package Includes
      </p>
      <ul aria-labelledby={headingId} className="flex flex-col gap-2 text-base md:text-sm">
        {course.packageIncludes.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Price, the dual course's saving, the delivery note that sits under every price, and the
 * course's "Package Includes" (cards on the home and AAPC pages, and each course page hero).
 */
export function PriceBlock({ course }: { course: AapcCourse }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-muted-foreground">Price</p>
        <p className="font-serif text-3xl font-semibold">{formatUsdPrice(course.priceUsd)}</p>
        {course.priceSaving && (
          <p className="text-sm font-semibold text-success-ink">{course.priceSaving}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{aapcCourseFacts.priceNote}</p>
      </div>
      <PackageIncludes course={course} />
    </div>
  );
}

/** Format, taught by, duration and who awards the certification. */
export function CourseFacts({ course }: { course: AapcCourse }) {
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

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex max-w-[75ch] flex-col gap-2", className)}>
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
        "relative flex h-full flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm",
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
          <Link prefetch={false} href={registerHref} className={buttonVariants({ size: "lg" })}>
            Register Now <span className="sr-only">for {course.credential}</span>
          </Link>
          <WhatsAppLink className={buttonVariants({ size: "lg", variant: "secondary" })} />
        </div>
        <Link
          prefetch={false}
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
