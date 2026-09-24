import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  ArrowRight,
  BookOpenCheck,
  Briefcase,
  CalendarDays,
  Check,
  MapPin,
  PlayCircle,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ClaimJourney } from "@/components/marketing/home/claim-journey";
import { HeroClaimForm } from "@/components/marketing/hero-claim-form";
import { HeroCtas } from "@/components/marketing/home/hero-ctas";
import { CtaBand, FaqList, Section } from "@/components/marketing/sections";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { Testimonial } from "@/components/marketing/testimonial";
import { Wordmark } from "@/components/marketing/wordmark";
import { ClaimLine } from "@/components/motion/claim-line";
import { CountUp } from "@/components/motion/count-up";
import { LottiePlayer } from "@/components/motion/lottie-player";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  certificationPath,
  cpcCourseSlug,
  faqs,
  hero,
  partnership,
  programs,
  serviceSlugs,
  testimonials,
  upcomingBatches,
  whyUs,
} from "@/content/home";
import { getCourse, getServices } from "@/lib/content";
import { motionAssets } from "@/lib/motion-assets";
import { educationalOrganizationJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const description =
  "GlobalMed Transcriptions is AAPC's strategic partner in Pakistan, offering CPC and CPB medical coding and billing certification training in Lahore and online.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "AAPC Strategic Partner in Pakistan | CPC & CPB Training",
    description,
    path: "/",
  }),
  title: { absolute: "AAPC Strategic Partner in Pakistan | CPC & CPB Training | GlobalMed" },
};

const whyIcons = [Users, BookOpenCheck, PlayCircle, Briefcase] as const;

/** The AAPC mark is shown only once the client supplies it with permission (pm/CLIENT_INPUTS_NEEDED.md). */
const aapcLogo = [
  { src: "/aapc-logo.png", width: 160, height: 48 },
  { src: "/aapc-logo.svg", width: 146, height: 51 },
].find((logo) => existsSync(join(process.cwd(), "public", logo.src)));

const cpcHref = `/school/courses/${cpcCourseSlug}`;

export default function HomePage() {
  const services = getServices().filter((s) =>
    (serviceSlugs as readonly string[]).includes(s.slug),
  );
  const studentTestimonials = testimonials.filter((t) => t.audience === "student");
  const practiceTestimonials = testimonials.filter((t) => t.audience === "practice");
  const whatsapp = whatsappHref("Hello GlobalMed, I'd like advice on CPC and CPB training.");

  return (
    <>
      <JsonLd
        data={educationalOrganizationJsonLd({
          description,
          courses: programs.map((p) => ({
            name: `${p.credential} ${p.name} training`,
            description: getCourse(p.slug)?.summary ?? p.audience,
            path: `/school/courses/${p.slug}`,
          })),
        })}
      />

      {/* 1. Hero. MG-1 enhances; text is SSR and never hidden. */}
      <section className="bg-ledger">
        <div className="mx-auto grid max-w-300 items-center gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <Badge variant="gold" className="h-auto py-1 whitespace-normal">
              {hero.badge}
            </Badge>
            <h1 className="text-3xl text-primary lg:text-4xl">{hero.headline}</h1>
            <ClaimLine trigger="mount" ticks={8} delay={0.1} className="max-w-md" />
            <p className="max-w-prose text-lg text-muted-foreground">{hero.intro}</p>
            <HeroCtas />
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Wordmark size="compact" />
              <span aria-hidden="true" className="h-10 w-px bg-border" />
              {aapcLogo ? (
                <Image
                  src={aapcLogo.src}
                  alt="AAPC logo"
                  width={aapcLogo.width}
                  height={aapcLogo.height}
                  unoptimized={aapcLogo.src.endsWith(".svg")}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="flex h-10 items-center rounded-md border-2 border-dashed border-input px-3 text-xs font-semibold text-muted-foreground">
                  AAPC partner logo
                </span>
              )}
            </div>
          </div>
          {/* MG-2: coded SVG loop; a designer's Lottie replaces it once delivered (P2-15). */}
          {motionAssets.heroClaimForm ? (
            <LottiePlayer
              src={motionAssets.heroClaimForm}
              poster="/motion/posters/hero-claim-form.svg"
              alt="A claim form fills itself in: codes appear, a denial flag turns green, and the status changes to Paid."
              width={480}
              height={320}
              className="w-full"
            />
          ) : (
            <HeroClaimForm className="w-full" />
          )}
        </div>
      </section>

      {/* 2. Partnership strip (MG-4 count-up) */}
      <section aria-label="GlobalMed and AAPC partnership" className="bg-primary text-white">
        <div className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-14 md:px-6">
          <p className="max-w-4xl font-serif text-xl leading-snug font-semibold text-white lg:text-2xl">
            {partnership.statement}
          </p>
          <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {partnership.stats.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-1">
                <p className="font-serif text-3xl font-semibold tracking-tight text-sky">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-semibold text-white/85">{stat.label}</p>
                {!partnership.confirmed && (
                  <p className="text-xs text-white/75">[CLIENT TO CONFIRM]</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Certification programs */}
      <Section
        id="certification-programs"
        title="CPC® and CPB® certification programs"
        intro="Two AAPC credentials, two career paths. Both programs run onsite in Lahore and online."
      >
        <ul className="grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <li
              key={program.slug}
              className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm lg:p-8"
            >
              <div className="flex flex-col gap-1">
                <p className="font-serif text-4xl font-semibold text-primary">
                  {program.credential}
                </p>
                <h3 className="text-xl">{program.name}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase">
                  Who it&apos;s for
                </h4>
                <p className="text-muted-foreground">{program.audience}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase">
                  What you&apos;ll learn
                </h4>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {program.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
                <dt className="font-semibold">Course format</dt>
                <dd className="text-muted-foreground">{program.format}</dd>
                <dt className="font-semibold">Duration</dt>
                <dd className="text-muted-foreground">{program.duration}</dd>
              </dl>
              <Link
                href={`/school/courses/${program.slug}`}
                className={cn(buttonVariants({ size: "lg" }), "mt-auto self-start")}
              >
                {program.cta} <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Why train with GlobalMed */}
      <Section tone="white" title="Why train with GlobalMed">
        <StaggerGroup as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, i) => {
            const Icon = whyIcons[i] ?? Check;
            return (
              <StaggerItem as="li" key={item.title} className="flex flex-col gap-3">
                <span className="flex size-11 items-center justify-center rounded-md bg-mint text-teal-deep">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.body}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      {/* 5. Your path to certification (MG-3 claim line) */}
      <Section
        tone="mint"
        id="certification-path"
        title="Your path to certification"
        intro="From your first class to your CPC® or CPB® credential, and on to your first role."
      >
        <ClaimJourney stages={certificationPath} />
        <Link href={cpcHref} className={cn(buttonVariants({ size: "lg" }), "self-start")}>
          Enroll in CPC Training
        </Link>
      </Section>

      {/* 6. Upcoming batches */}
      <Section
        title="Upcoming CPC® and CPB® batches"
        intro="Seats are limited in every batch so instructors can give each student feedback."
      >
        <ul className="grid gap-6 md:grid-cols-2">
          {upcomingBatches.map((batch) => (
            <li
              key={batch.title}
              className="flex flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm"
            >
              <h3 className="text-xl">{batch.title}</h3>
              <dl className="grid gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
                  <dt className="font-semibold">Starts:</dt>
                  <dd className="text-muted-foreground">{batch.starts}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
                  <dt className="font-semibold">Mode:</dt>
                  <dd className="text-muted-foreground">{batch.mode}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
                  <dt className="font-semibold">Seats left:</dt>
                  <dd className="text-muted-foreground">{batch.seatsLeft}</dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className={cn(buttonVariants({ size: "lg" }), "mt-auto self-start")}
              >
                Reserve a Seat
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 7. Student testimonials, shown only once the client supplies consent-approved quotes */}
      {studentTestimonials.length > 0 && (
        <Section tone="white" title="What our students say">
          <div className="grid gap-6 md:grid-cols-2">
            {studentTestimonials.map((t) => (
              <Testimonial key={t.quote} {...t} />
            ))}
          </div>
        </Section>
      )}

      {/* 8. Services for US practices (the hero's services link lands here) */}
      <Section id="services" className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Medical billing services for US practices</h2>
          <p className="max-w-prose text-muted-foreground">
            HIPAA-aware processes, certified coders and one team accountable for every claim.
          </p>
          <Link
            href="/free-billing-audit"
            className={cn(buttonVariants({ size: "lg" }), "self-start")}
          >
            Book a Free Billing Audit <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <StaggerGroup as="ul" className="divide-y border-y">
          {services.map((service) => (
            <StaggerItem as="li" key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex gap-4 py-6 transition-colors hover:bg-card"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-mint text-teal-deep">
                  <ServiceIcon slug={service.slug} className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-serif text-xl font-semibold group-hover:text-teal-deep">
                    {service.name}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <span className="text-muted-foreground">{service.summary}</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
        {practiceTestimonials.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
            {practiceTestimonials.map((t) => (
              <Testimonial key={t.quote} {...t} />
            ))}
          </div>
        )}
      </Section>

      {/* 9. FAQ (FaqList emits the FAQPage JSON-LD) */}
      <Section tone="white" className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl lg:text-3xl">Questions about CPC® and CPB® training</h2>
          <Link href="/faq" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            All FAQs
          </Link>
        </div>
        <FaqList faqs={faqs} />
      </Section>

      {/* 10. Final CTA */}
      <CtaBand
        title="Start your medical coding career with AAPC's strategic partner in Pakistan"
        body="CPC® and CPB® training onsite in Lahore and online, with recorded lessons and mock exams."
        href={cpcHref}
        label="Enroll in CPC Training"
        secondary={{ href: whatsapp ?? "/contact", label: "Talk to an Advisor on WhatsApp" }}
      />
    </>
  );
}
