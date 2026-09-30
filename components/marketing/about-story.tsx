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

const band = "container-fluid section-y";
const heading = "text-2xl lg:text-3xl";

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return items.map((paragraph) => (
    <p key={paragraph.slice(0, 40)} className={cn("max-w-[75ch]", className)}>
      {paragraph}
    </p>
  ));
}

function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase">
        {label}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-sky/40 bg-white px-3 py-1.5 text-sm font-medium text-ink"
          >
            {item}
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
  const [introParagraphs, founderParagraphs] = [
    story.paragraphs.slice(0, 1),
    story.paragraphs.slice(1),
  ];

  return (
    <div data-about-story>
      <section aria-labelledby="our-story-title" className="bg-card">
        <FadeInView className={cn(band, "flex flex-col gap-4")}>
          <h2 id="our-story-title" className={heading}>
            {story.title}
          </h2>
          <Paragraphs items={introParagraphs} />
          {/* ≥1280px the founder photo sits beside the "Our founder…" paragraph; below that it
              comes first, above the paragraph (client, 2026-09-30). */}
          <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-start xl:gap-16">
            <figure className="flex w-full max-w-sm flex-col gap-4 xl:order-last xl:max-w-md xl:justify-self-end">
              <div className="rounded-2xl bg-ledger p-4 shadow-sm">
                {hasPhoto ? (
                  <Image
                    src={story.founder.photo}
                    alt={story.founder.alt}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1280px) 416px, (min-width: 640px) 352px, calc(100vw - 64px)"
                    className="h-auto w-full rounded-2xl"
                  />
                ) : (
                  <span className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border-2 border-dashed border-input p-3 text-center text-sm font-semibold text-muted-foreground">
                    Photo: {story.founder.name}
                  </span>
                )}
              </div>
              <figcaption className="flex flex-col items-start gap-2">
                <span className="font-semibold text-ink">{story.founder.caption}</span>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">
                  {story.founder.badge}
                </span>
              </figcaption>
            </figure>
            <Paragraphs items={founderParagraphs} />
          </div>
        </FadeInView>
      </section>

      <section aria-labelledby="documentation-title" className="bg-ledger">
        <FadeInView
          className={cn(band, "flex flex-col gap-12 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-16")}
        >
          <div className="flex flex-col gap-4">
            <h2 id="documentation-title" className={heading}>
              {documentation.title}
            </h2>
            <Paragraphs items={documentation.paragraphs} />
          </div>
          <div className="flex flex-col gap-8 self-center">
            <Chips label="Countries" items={documentation.countries} />
            <Chips label="Specialties" items={documentation.specialties} />
          </div>
        </FadeInView>
      </section>

      <section aria-labelledby="revenue-cycle-title" className="border-y bg-card">
        <FadeInView
          className={cn(band, "flex flex-col gap-12 lg:grid lg:grid-cols-[11fr_9fr] lg:gap-16")}
        >
          <div className="flex flex-col gap-4">
            <h2 id="revenue-cycle-title" className={heading}>
              {revenueCycle.title}
            </h2>
            <Paragraphs items={revenueCycle.paragraphs} />
          </div>
          <ul className="grid gap-x-6 gap-y-3 self-center rounded-lg border bg-ledger/50 p-6 sm:grid-cols-2">
            {revenueCycle.services.map((service) => (
              <li key={service} className="flex items-start gap-2">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                {service}
              </li>
            ))}
          </ul>
        </FadeInView>
      </section>

      <section aria-labelledby="workforce-title" className="bg-primary text-white">
        <FadeInView
          className={cn(
            band,
            "flex flex-col gap-12 lg:grid lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16",
          )}
        >
          <div className="flex flex-col gap-4">
            <h2 id="workforce-title" className={cn(heading, "text-white")}>
              {workforce.title}
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
              {workforce.cta} <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </FadeInView>
      </section>

      <section aria-label="Our purpose" className="bg-card">
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
