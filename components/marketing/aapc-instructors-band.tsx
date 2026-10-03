import { ArrowRight, BadgeCheck, ClipboardCheck, Target, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ClaimLine } from "@/components/motion/claim-line";
import { ScrollBackground } from "@/components/motion/scroll-background";
import { buttonVariants } from "@/components/ui/button";
import { features } from "@/config/features";
import { instructorsBand } from "@/content/aapc";
import type { SiteImage } from "@/content/images";
import { publicAssetExists } from "@/lib/public-asset";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { withReg } from "@/components/ui/reg";

const pointIcons = [Video, ClipboardCheck, BadgeCheck] as const;

/**
 * "Get Trained by AAPC Instructors" highlight (home, AAPC Certification page, Education
 * landing). Instructor photos are optional: each slot shows a labelled placeholder until
 * its file is in public/images/instructors/. With a `background` (home), the band sits on a
 * scrolling photo under a navy overlay, with white text.
 */
export function AapcInstructorsBand({
  href = `${aapcCertificationPath}#courses`,
  id = "aapc-instructors",
  background,
}: {
  href?: string;
  id?: string;
  background?: SiteImage;
}) {
  const headingId = `${id}-title`;
  const dark = !!background;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-dark-band={dark || undefined}
      data-tone={dark ? "navy" : "mint"}
      className={cn("border-b cv-auto", dark ? "relative isolate bg-navy text-white" : "bg-mint")}
    >
      {background && <ScrollBackground image={background} />}
      <div
        className={cn(
          "container-fluid grid items-center gap-10 section-y",
          features.instructorPhotos && "lg:grid-cols-[1.3fr_1fr]",
        )}
      >
        <div className="flex flex-col gap-4">
          <h2 id={headingId} className={cn("text-2xl lg:text-3xl", dark && "text-white")}>
            {withReg(instructorsBand.title)}
          </h2>
          <ClaimLine trigger="inView" ticks={8} className="max-w-xs" />
          <p
            className={cn("max-w-prose text-lg", dark ? "text-white/90" : "text-muted-foreground")}
          >
            {withReg(instructorsBand.body)}
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {instructorsBand.points.map((point, i) => {
              const Icon = pointIcons[i] ?? Target;
              return (
                <li key={point} className="flex items-center gap-3 font-semibold">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-sm">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  {point}
                </li>
              );
            })}
          </ul>
          <Link
            href={href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-4 self-start",
              // On navy: sky with ink text (5.4:1), like the About workforce band.
              dark && "bg-sky text-ink hover:bg-white",
            )}
          >
            {withReg(instructorsBand.cta)} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {/* Hidden at client request (2026-09-29): see features.instructorPhotos. */}
        {features.instructorPhotos && (
          <ul className="grid grid-cols-3 gap-4" aria-label="AAPC instructors">
            {instructorsBand.photos.map((photo) => (
              <li
                key={photo.src}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-card"
              >
                {publicAssetExists(photo.src) ? (
                  <Image
                    src={photo.src}
                    alt="AAPC instructor"
                    fill
                    sizes="(min-width: 1024px) 160px, 30vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-2 flex items-center justify-center rounded-md border-2 border-dashed border-input p-2 text-center text-xs font-semibold text-muted-foreground">
                    {photo.placeholder}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
