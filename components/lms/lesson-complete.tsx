"use client";

import { ArrowRight } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";

import { CheckStamp } from "@/components/motion/check-stamp";
import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { buttonVariants } from "@/components/ui/button";
import { distance, dur, ease } from "@/lib/motion";

/**
 * DM-3: the checkmark draws, then the next-lesson card slides in. Status is announced
 * (role="status"), never conveyed by motion alone.
 */
export function LessonComplete({
  next,
  courseHref,
}: {
  next?: { href: string; title: string };
  courseHref: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <MotionFeatures>
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:items-center"
      >
        <CheckStamp size={56} />
        <div className="flex-1">
          <p className="font-serif text-xl font-semibold">Lesson complete</p>
          <p className="text-sm text-muted-foreground">Your progress has been saved.</p>
        </div>
        <m.div
          initial={reduced ? false : { opacity: 0, x: distance.md }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: dur.slow, ease: ease.enter, delay: reduced ? 0 : dur.slow }}
        >
          {next ? (
            <Link href={next.href} className={buttonVariants({ size: "lg" })}>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs font-normal opacity-90">Next lesson</span>
                {next.title}
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <Link href={courseHref} className={buttonVariants({ size: "lg" })}>
              Back to my courses
            </Link>
          )}
        </m.div>
      </div>
    </MotionFeatures>
  );
}
