import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AapcInstructorsBand } from "@/components/marketing/aapc-instructors-band";
import { CertificationPriceCard } from "@/components/marketing/certification-price-card";
import { ContactForm } from "@/components/marketing/contact-form";
import { ClaimJourney } from "@/components/marketing/home/claim-journey";
import { FaqList, PageHero, Section } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import {
  aapcFaqs,
  aapcHero,
  aapcSteps,
  certificationPrice,
  certifications,
  examDetails,
} from "@/content/aapc";
import { pageMetadata } from "@/lib/seo/metadata";
import { aapcCertificationPath, educationBase, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "AAPC Certification in Pakistan: CPC® and CPB® Training",
  description:
    "Prepare for AAPC's CPC® and CPB® certifications with GlobalMed Transcriptions, AAPC's strategic partner in Pakistan. Training in Lahore and online with AAPC instructors.",
  path: aapcCertificationPath,
});

const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber.replace(/\D/g, "")}`;

const eyebrowClass = "font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase";

/**
 * AAPC Certification in Pakistan (client review 2026-09-25). Reached at
 * /education/aapc-certification-pakistan via the /education rewrite (ADR-024).
 * Overview → who it's for → what you'll learn → exam → how to start; original copy only.
 */
export default function AapcCertificationPage() {
  return (
    <>
      <PageHero
        eyebrow="AAPC strategic partner in Pakistan"
        title={aapcHero.title}
        intro={aapcHero.intro}
        crumbs={[
          { name: "Education", path: educationBase },
          { name: "AAPC Certification in Pakistan", path: aapcCertificationPath },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#reserve-seat" className={buttonVariants({ size: "lg" })}>
            Reserve Your Seat <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            href="#certifications"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Compare CPC® and CPB®
          </Link>
        </div>
      </PageHero>

      <AapcInstructorsBand href="#certifications" id="aapc-instructors" />

      <Section
        id="certifications"
        title="CPC® and CPB® certifications"
        intro="Two AAPC credentials for two careers in US healthcare: coding and billing. AAPC awards the certification; GlobalMed trains and prepares you for the exam."
      >
        <ul className="grid gap-6 lg:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert.id}
              className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm lg:p-8"
            >
              <div className="flex flex-col gap-1">
                <p className="font-serif text-4xl font-semibold text-primary">{cert.credential}</p>
                <h3 className="text-xl">{cert.name}</h3>
                <p className="mt-2 text-muted-foreground">{cert.overview}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={eyebrowClass}>Who it&apos;s for</h4>
                <ul className="flex flex-col gap-1.5">
                  {cert.audience.map((line, i) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
                      <span className={i === 0 ? "font-semibold" : undefined}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={eyebrowClass}>What you&apos;ll learn</h4>
                <ul className="flex flex-col gap-1.5">
                  {cert.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sky" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={eyebrowClass}>The {cert.credential} exam</h4>
                <dl className="grid gap-x-6 gap-y-2 border-t pt-4 text-sm sm:grid-cols-[auto_1fr]">
                  {examDetails.map((detail) => (
                    <div key={detail.label} className="contents">
                      <dt className="font-semibold">{detail.label}</dt>
                      <dd className="text-muted-foreground">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Link
                href={`${educationBase}/courses/${cert.courseSlug}`}
                className={cn(buttonVariants({ variant: "secondary" }), "mt-auto self-start")}
              >
                View the {cert.credential} course <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="white"
        id="pricing"
        title="Certification pricing"
        className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16"
      >
        <div className="flex flex-col gap-4 lg:col-start-1">
          <p className="max-w-prose text-muted-foreground">
            One clear fee for {certificationPrice.label}. Ask an advisor about batch dates and what
            the fee includes.
          </p>
          <p className="max-w-prose text-sm text-muted-foreground">
            CPC® and CPB® are awarded by AAPC. Exam registration support is [CLIENT TO CONFIRM].
          </p>
        </div>
        <CertificationPriceCard
          href="#reserve-seat"
          cta="Reserve Your Seat"
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
        />
      </Section>

      <Section
        tone="mint"
        id="how-it-works"
        title="How it works"
        intro="From enrolment to your AAPC credential, in five steps."
      >
        <ClaimJourney stages={aapcSteps} />
      </Section>

      <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-2xl lg:text-3xl">Questions about AAPC certification</h2>
        <FaqList faqs={aapcFaqs} />
      </Section>

      <section id="reserve-seat" aria-labelledby="reserve-seat-title" className="bg-ink text-white">
        <div className="mx-auto grid max-w-300 gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 id="reserve-seat-title" className="text-2xl text-white lg:text-3xl">
              Reserve Your Seat
            </h2>
            <p className="max-w-prose text-white/80">
              Tell us which certification you&apos;re interested in and an advisor will confirm the
              next CPC® or CPB® batch, fees and schedule. Please don&apos;t include any patient
              information.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "self-start bg-sky text-ink hover:bg-white",
              )}
            >
              <MessageCircle aria-hidden="true" /> WhatsApp {site.contact.whatsappDisplay}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <div className="rounded-lg bg-card p-6 text-foreground">
            <ContactForm defaultInterest="Courses and certification" />
          </div>
        </div>
      </section>
    </>
  );
}
