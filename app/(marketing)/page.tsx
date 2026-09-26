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
import Link from "next/link";

import { AapcCourseCard } from "@/components/marketing/aapc-course";
import { AapcInstructorsBand } from "@/components/marketing/aapc-instructors-band";
import { CredentialsSection } from "@/components/marketing/credentials-section";
import { ClaimJourneySection } from "@/components/marketing/home/claim-journey";
import { HeroSlider } from "@/components/marketing/home/hero-slider";
import { CtaBand, FaqList, Section } from "@/components/marketing/sections";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { Testimonial } from "@/components/marketing/testimonial";
import { CountUp } from "@/components/motion/count-up";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { buttonVariants } from "@/components/ui/button";
import { features } from "@/config/features";
import { aapcFaqs, aapcSteps, approvedWording } from "@/content/aapc";
import {
  partnership,
  programs,
  serviceSlugs,
  testimonials,
  upcomingBatches,
  whyUs,
} from "@/content/home";
import { getCourse, getServices } from "@/lib/content";
import { educationalOrganizationJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { aapcCourseFacts, getAapcCoursesDualCentred } from "@/data/courses";
import { aapcCertificationPath, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const description =
  "Medical transcription, billing and coding services since 2007, and AAPC's Strategic Partner in Pakistan for CPC® and CPB® online courses.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "AAPC Strategic Partner in Pakistan | CPC & CPB",
    description,
    path: "/",
  }),
  title: { absolute: "AAPC Strategic Partner in Pakistan | CPC® & CPB® | GlobalMed" },
};

const whyIcons = [Users, BookOpenCheck, PlayCircle, Briefcase] as const;

const registerHref = `${aapcCertificationPath}#register`;

export default function HomePage() {
  const services = getServices().filter((s) =>
    (serviceSlugs as readonly string[]).includes(s.slug),
  );
  const studentTestimonials = testimonials.filter((t) => t.audience === "student");
  const practiceTestimonials = testimonials.filter((t) => t.audience === "practice");
  const whatsapp = whatsappHref("Hello GlobalMed, I'd like advice on CPC and CPB training.");

  return (
    <>
      {/* Hidden at client request — GlobalMed education plans are future scope. GlobalMed is
          described by the Organization/ProfessionalService markup in the marketing layout. */}
      {features.educationSchema && (
        <JsonLd
          data={educationalOrganizationJsonLd({
            description,
            courses: programs.map((p) => ({
              name: `${p.credential} ${p.name} training`,
              description: getCourse(p.slug)?.summary ?? p.audience.join(". "),
              path: `/education/courses/${p.slug}`,
            })),
          })}
        />
      )}

      {/* 1. Hero slider (client review 2026-09-25). The page's h1 sits outside the rotating
          slides so it never becomes hidden when a slide changes. */}
      <h1 className="sr-only">
        GlobalMed Transcriptions: medical transcription, billing and coding since 2007, and
        AAPC&apos;s Strategic Partner in Pakistan for Medical Billing and Coding
      </h1>
      <HeroSlider />

      {/* 1a. Get Trained by AAPC Instructors */}
      <AapcInstructorsBand href="#certification-programs" />

      {/* 1b. Registered, Certified & Compliant */}
      <CredentialsSection />

      {/* 2. Partnership strip (MG-4 count-up) */}
      <section aria-label="GlobalMed and AAPC partnership" className="bg-primary text-white">
        <div className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-14 md:px-6">
          <p className="max-w-4xl font-serif text-xl leading-snug font-semibold text-white lg:text-2xl">
            {approvedWording.partnership}
          </p>
          <p className="max-w-3xl text-white/85">{approvedWording.role}</p>
          {/* Hidden at client request — GlobalMed education plans are future scope. */}
          {features.trainingStats && (
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
          )}
        </div>
      </section>

      {/* 3. The three AAPC courses (client, 2026-09-26) */}
      <Section
        id="certification-programs"
        title="AAPC certification courses"
        intro={`${approvedWording.training} ${approvedWording.certification}`}
      >
        <ul className="grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {getAapcCoursesDualCentred().map((course) => (
            <li key={course.slug} className="flex">
              <AapcCourseCard
                course={course}
                registerHref={`${aapcCertificationPath}?course=${course.slug}#register`}
              />
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">{aapcCourseFacts.priceNote}</p>
      </Section>

      {/* 4. Why register through GlobalMed */}
      <Section tone="white" title="Why register through GlobalMed">
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

      {/* 5. How it works (MG-3 claim line) */}
      <ClaimJourneySection
        id="certification-path"
        title="How it works"
        intro="From registration to your AAPC credential, in five steps."
        stages={aapcSteps}
      >
        <Link href={registerHref} className={cn(buttonVariants({ size: "lg" }), "self-start")}>
          Register Now
        </Link>
      </ClaimJourneySection>

      {/* 6. Upcoming batches. Hidden at client request — GlobalMed education plans are future scope. */}
      {features.batches && (
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
      )}

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
          <h2 className="text-2xl lg:text-3xl">Questions about CPC® and CPB®</h2>
          <Link href="/faq" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            All FAQs
          </Link>
        </div>
        <FaqList faqs={aapcFaqs} />
      </Section>

      {/* 10. Final CTA */}
      <CtaBand
        title="Start your medical coding career with AAPC's online courses"
        body={`${approvedWording.training} ${approvedWording.certification}`}
        href={registerHref}
        label="Register Now"
        secondary={{ href: whatsapp ?? "/contact", label: "Talk to an Advisor on WhatsApp" }}
      />
    </>
  );
}
