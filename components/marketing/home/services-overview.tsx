import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeferredServicesStack } from "@/components/defer/islands";
import type { StackCard } from "@/components/marketing/home/services-stack";
import { ClaimLine } from "@/components/motion/claim-line";
import { buttonVariants } from "@/components/ui/button";
import { serviceCards, servicesIntro, type ServiceCard } from "@/content/home-services";
import { publicAssetExists } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

/** Card backgrounds in order: white, soft sky, white, navy (client, 2026-09-28). */
const tones: StackCard["tone"][] = ["white", "soft", "white", "navy"];

function CardImage({ card, dark }: { card: ServiceCard; dark: boolean }) {
  if (publicAssetExists(card.image.src)) {
    return (
      <Image
        src={card.image.src}
        alt={card.image.alt}
        width={800}
        height={600}
        sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 100vw"
        loading="lazy"
        className="aspect-[4/3] w-full rounded-2xl object-cover md:h-full lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none"
      />
    );
  }
  // Labelled slot until the client supplies the photo (same 4:3 box, so no layout shift).
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${card.image.alt}`}
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center text-sm font-semibold md:h-full lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none",
        dark
          ? "border-white/40 bg-white/10 text-white"
          : "border-border bg-ledger text-muted-foreground",
      )}
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span>Photo: {card.title}</span>
        <span className="font-normal break-all">{card.image.src}</span>
      </span>
    </div>
  );
}

function CardContent({ card, index }: { card: ServiceCard; index: number }) {
  const dark = tones[index] === "navy";
  const muted = dark ? "text-white/90" : "text-muted-foreground";
  const flip = index % 2 === 1;

  return (
    // ≥1024px (client, 2026-09-28): text 50% / image 50%, the image flush to the card's edge
    // (the card clips it to its outer corners). 768–1023px keeps the 55/45 layout. The photo
    // alternates sides from 768px: right on cards 1 and 3, left on 2 and 4 (2026-09-30).
    <div
      className={cn(
        "grid gap-6 md:gap-10 lg:flex-1 lg:grid-cols-2 lg:gap-0",
        flip
          ? "md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]"
          : "md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]",
      )}
    >
      <div
        data-stack-text
        className="flex flex-col gap-3 lg:self-start lg:p-[clamp(32px,4vw,72px)] lg:[&_p]:max-w-[65ch]"
      >
        {/* Decorative ordinal in the client's sky blue; the heading carries the meaning. Sky on
            white is under 3:1, so it stays decoration (WCAG 1.4.3 exemption): the digits are
            drawn by CSS, so they are not text for screen readers or contrast checkers. */}
        <span
          aria-hidden="true"
          data-decorative-ordinal={String(index + 1).padStart(2, "0")}
          className="block h-6 font-serif text-2xl leading-none font-semibold text-sky before:content-[attr(data-decorative-ordinal)]"
        />
        <h3 id={`${card.id}-title`} className={cn("text-2xl lg:text-3xl", dark && "text-white")}>
          {card.title}
        </h3>
        <ClaimLine
          trigger="static"
          ticks={8}
          className={cn("max-w-xs", dark && "[&_.claim-fill]:stroke-white")}
        />
        {card.paragraphs.map((p) => (
          <p key={p} className={muted}>
            {p}
          </p>
        ))}
        {card.chips && (
          <ul className="flex flex-wrap gap-2">
            {card.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full bg-sky-soft px-3 py-1 text-sm font-semibold text-navy"
              >
                {chip}
              </li>
            ))}
          </ul>
        )}
        {card.checklist && (
          <div className="flex flex-col gap-3">
            <p className="font-semibold">{card.checklist.label}</p>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {card.checklist.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <Check
                    aria-hidden="true"
                    className={cn("mt-0.5 size-4 shrink-0", dark ? "text-sky" : "text-teal-deep")}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {card.strong && <p className="font-semibold">{card.strong}</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {card.ctas.map((cta, i) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={cn(
                buttonVariants({ size: "lg", variant: i === 0 ? "default" : "secondary" }),
                // Navy card: sky with ink text, and a white outline (both AA on navy).
                dark && i === 0 && "bg-sky text-ink hover:bg-white",
                dark &&
                  i > 0 &&
                  "border-white! bg-transparent text-white hover:bg-white hover:text-navy",
              )}
            >
              {cta.label}
              {i === 0 && <ArrowRight aria-hidden="true" />}
            </Link>
          ))}
        </div>
      </div>
      <div className={cn("order-first lg:relative", flip ? "md:order-first" : "md:order-none")}>
        <CardImage card={card} dark={dark} />
      </div>
    </div>
  );
}

/**
 * "Our Services" (client text, 2026-09-28), directly after the hero slider: intro, a sky
 * note about the AAPC partnership, then the four service cards as a sticky stack.
 */
export function ServicesOverview() {
  const cards: StackCard[] = serviceCards.map((card, i) => ({
    id: card.id,
    tone: tones[i] ?? "white",
    content: <CardContent card={card} index={i} />,
  }));

  return (
    <section id="services" aria-labelledby="services-title" className="bg-card">
      <div className="container-fluid flex flex-col gap-10 section-y">
        {/* Full container width; from 1280px the AAPC note sits beside the lead (60/40). */}
        <div className="grid gap-4 xl:grid-cols-[3fr_2fr] xl:items-center xl:gap-12">
          <p className="max-w-[75ch] text-lg text-muted-foreground">{servicesIntro.lead}</p>
          <Link
            href={servicesIntro.note.href}
            className="group rounded-2xl border border-sky/40 bg-sky-soft p-5 text-ink transition-colors hover:border-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {servicesIntro.note.text}
            <ArrowRight
              aria-hidden="true"
              className="ml-1 inline size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        {/* Heading sits directly above the card stack (client, 2026-09-30). */}
        <div className="flex flex-col gap-4">
          <h2 id="services-title" className="max-w-[28ch] text-2xl lg:text-3xl">
            {servicesIntro.title}
          </h2>
          <ClaimLine trigger="inView" ticks={8} className="max-w-sm" />
        </div>
        <DeferredServicesStack cards={cards} />
      </div>
    </section>
  );
}
