import { ArrowRight, BadgeCheck, ClipboardCheck, Target, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ClaimLine } from "@/components/motion/claim-line";
import { buttonVariants } from "@/components/ui/button";
import { instructorsBand } from "@/content/aapc";
import { publicAssetExists } from "@/lib/public-asset";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";

const pointIcons = [Video, ClipboardCheck, BadgeCheck] as const;

/**
 * "Get Trained by AAPC Instructors" highlight (home, AAPC Certification page, Education
 * landing). Instructor photos are optional: each slot shows a labelled placeholder until
 * its file is in public/images/instructors/.
 */
export function AapcInstructorsBand({
  href = `${aapcCertificationPath}#courses`,
  id = "aapc-instructors",
}: {
  href?: string;
  id?: string;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-b bg-mint">
      <div className="mx-auto grid max-w-300 items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-16">
        <div className="flex flex-col gap-5">
          <h2 id={headingId} className="text-2xl lg:text-3xl">
            {instructorsBand.title}
          </h2>
          <ClaimLine trigger="inView" ticks={8} className="max-w-xs" />
          <p className="max-w-prose text-lg text-muted-foreground">{instructorsBand.body}</p>
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
          <Link href={href} className={cn(buttonVariants({ size: "lg" }), "self-start")}>
            {instructorsBand.cta} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-4" aria-label="AAPC instructors">
          {instructorsBand.photos.map((photo) => (
            <li
              key={photo.src}
              className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-card"
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
      </div>
    </section>
  );
}
