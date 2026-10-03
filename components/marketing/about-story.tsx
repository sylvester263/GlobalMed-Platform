import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PartnerLockup } from "@/components/marketing/partner-lockup";
import { FadeInView } from "@/components/motion/fade-in-view";
import { buttonVariants } from "@/components/ui/button";
import { aboutStory } from "@/content/about-story";
import { publicAssetExists } from "@/lib/public-asset";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { withReg } from "@/components/ui/reg";

const band = "container-fluid section-y";
const heading = "text-2xl lg:text-3xl";

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return items.map((paragraph) => (
    <p key={paragraph.slice(0, 40)} className={cn("max-w-[75ch]", className)}>
      {withReg(paragraph)}
    </p>
  ));
}

function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase">
        {withReg(label)}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-sky/40 bg-white px-3 py-1.5 text-sm font-medium text-ink"
          >
            {withReg(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** About page "Our Story": four parts and a closing statement, client text used exactly. */
export function AboutStory() {
  const { story, documentation, revenueCycle, workforce, closing } = aboutStory;
  const hasPhoto = publicAssetExists(story.founder.photo);

  return (
    <div data-about-story data-tone-group>
      <section data-tone="white" aria-labelledby="our-story-title" className="bg-card">
        {/* Split grid (client, 2026-09-30): text 7 / photo 5 from 1280px, 60/40 at 1024–1279px,
            photo max 400px (380px at 1024–1279px); photo and heading + text are centred against
            each other (empty rows above and below the text absorb any difference)
            (client, 2026-09-30). Below 1024px: heading, photo (centred, max 360px, 32px under
            the heading), then the text. */}
        <FadeInView className={cn(band, "split gap-y-0 lg:grid-rows-[1fr_auto_auto_1fr]")}>
          <h2 id="our-story-title" className={cn(heading, "lg:col-start-1 lg:row-start-2")}>
            {withReg(story.title)}
          </h2>
          <figure className="mx-auto mt-8 flex w-full max-w-[360px] flex-col gap-3 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:mr-0 lg:ml-auto lg:max-w-[380px] lg:self-center xl:max-w-[400px]">
            <div className="rounded-2xl bg-ledger p-4 shadow-sm">
              {hasPhoto ? (
                <Image
                  src={story.founder.photo}
                  alt={story.founder.alt}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1280px) 368px, (min-width: 1024px) 348px, 328px"
                  // The About page's largest above-the-fold image on phones (its LCP).
                  priority
                  fetchPriority="high"
                  className="aspect-[4/5] h-auto w-full rounded-2xl object-contain"
                />
              ) : (
                <span className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border-2 border-dashed border-input p-3 text-center text-sm font-semibold text-muted-foreground">
                  Photo: {story.founder.name}
                </span>
              )}
            </div>
            <figcaption className="flex flex-col items-start gap-2">
              <span className="text-sm text-muted-foreground">
                {withReg(story.founder.caption)}
              </span>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">
                {story.founder.badge}
              </span>
            </figcaption>
          </figure>
          <div className="mt-8 flex flex-col gap-4 lg:col-start-1 lg:row-start-3 lg:mt-4">
            <Paragraphs items={story.paragraphs} className="lg:text-lg" />
          </div>
        </FadeInView>
      </section>

      <section
        data-tone="ledger"
        aria-labelledby="documentation-title"
        className="bg-ledger cv-auto"
      >
        <FadeInView className={cn(band, "split")}>
          <div className="flex flex-col gap-4">
            <h2 id="documentation-title" className={heading}>
              {withReg(documentation.title)}
            </h2>
            <Paragraphs items={documentation.paragraphs} />
          </div>
          <div className="flex flex-col gap-8 self-center">
            <Chips label="Countries" items={documentation.countries} />
            <Chips label="Specialties" items={documentation.specialties} />
          </div>
        </FadeInView>
      </section>

      <section
        data-tone="white"
        aria-labelledby="revenue-cycle-title"
        className="border-y bg-card cv-auto"
      >
        <FadeInView className={cn(band, "split")}>
          <div className="flex flex-col gap-4">
            <h2 id="revenue-cycle-title" className={heading}>
              {withReg(revenueCycle.title)}
            </h2>
            <Paragraphs items={revenueCycle.paragraphs} />
          </div>
          <ul className="grid gap-x-6 gap-y-3 self-center rounded-2xl border bg-ledger/50 p-6 sm:grid-cols-2">
            {revenueCycle.services.map((service) => (
              <li key={service} className="flex items-start gap-2">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                {service}
              </li>
            ))}
          </ul>
        </FadeInView>
      </section>

      <section
        data-tone="primary"
        aria-labelledby="workforce-title"
        className="bg-primary text-white cv-auto"
      >
        <FadeInView className={cn(band, "split lg:items-center")}>
          <div className="flex flex-col gap-4">
            <h2 id="workforce-title" className={cn(heading, "text-white")}>
              {withReg(workforce.title)}
            </h2>
            <Paragraphs items={workforce.paragraphs} className="text-white/90" />
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <PartnerLockup missingLogo="hide" className="lg:self-end" />
            {/* Ink on sky is 5.4:1 (navy on sky is 3.8:1, below AA for button text). */}
            <Link
              href={aapcCertificationPath}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-sky text-ink hover:bg-white focus-visible:outline-white",
              )}
            >
              {withReg(workforce.cta)} <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </FadeInView>
      </section>

      <section data-tone="white" aria-label="Our purpose" className="bg-card cv-auto">
        <FadeInView className={cn(band, "flex flex-col items-center gap-8 text-center")}>
          <span aria-hidden="true" className="block h-0.5 w-20 bg-sky" />
          <blockquote className="max-w-[60ch]">
            <p className="max-w-[60ch] font-serif text-xl leading-snug font-semibold text-ink md:text-2xl lg:text-[1.875rem]">
              {closing}
            </p>
          </blockquote>
        </FadeInView>
      </section>
    </div>
  );
}
