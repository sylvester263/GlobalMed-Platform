import { Check, ShieldCheck, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CodeChips } from "@/components/marketing/motion-graphics/code-chips";
import { DenialBars } from "@/components/marketing/motion-graphics/denial-bars";
import { VoiceToNote } from "@/components/marketing/motion-graphics/voice-to-note";
import { CtaBand, FaqList, PageHero, Section } from "@/components/marketing/sections";
import { ClaimLine } from "@/components/motion/claim-line";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { buttonVariants } from "@/components/ui/button";
import { StatBlock } from "@/components/ui/stat-block";
import { getService, getServices, getSpecialty } from "@/lib/content";
import { JsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

const graphics = {
  waveform: VoiceToNote,
  "code-chips": CodeChips,
  "denial-bars": DenialBars,
};

/** Service template (docs/05): problem → included → process → results → specialties → compliance → FAQ → CTA. */
export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const Graphic = service.motion ? graphics[service.motion] : null;
  const specialties = service.specialties.map(getSpecialty).filter((s) => s !== undefined);
  const path = `/services/${service.slug}`;

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.headline}
        intro={service.intro}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/free-billing-audit" className={buttonVariants({ size: "lg" })}>
            Book your free billing audit
          </Link>
          <Link href="/contact" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Talk to our team
          </Link>
        </div>
      </PageHero>

      {/* Problem, in practice-owner language */}
      <Section className={Graphic ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-16" : undefined}>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl lg:text-3xl">Sound familiar?</h2>
          <ul className="flex flex-col gap-4">
            {service.problems.map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-lg">
                <TriangleAlert
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-warning-ink"
                />
                {problem}
              </li>
            ))}
          </ul>
        </div>
        {Graphic && <Graphic />}
      </Section>

      <Section tone="white" title={`What's included in ${service.name.toLowerCase()}`}>
        <StaggerGroup as="ul" className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {service.included.map((item) => (
            <StaggerItem as="li" key={item.title} className="flex gap-3">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <h3 className="font-sans text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section tone="mint" title="How it works">
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="font-serif text-3xl font-semibold text-teal-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ClaimLine
                trigger="inView"
                ticks={service.process.length}
                filled={i + 1}
                delay={i * 0.15}
                className="max-w-40"
              />
              <h3 className="text-xl">{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Results we work toward"
        intro="Targets we agree with you from your audit baseline and report against every month."
      >
        <div className="grid gap-8 rounded-lg border bg-card p-6 sm:grid-cols-3">
          {service.results.map((r) => (
            <StatBlock
              key={r.label}
              label={r.label}
              value={r.value}
              suffix={r.suffix}
              decimals={r.decimals}
            />
          ))}
        </div>
      </Section>

      {specialties.length > 0 && (
        <Section tone="white" title="Specialties we serve">
          <ul className="flex flex-wrap gap-3">
            {specialties.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/specialties/${s.slug}`}
                  className="inline-flex h-11 items-center rounded-full border bg-card px-4 font-semibold hover:border-teal hover:bg-mint"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Questions about {service.name.toLowerCase()}</h2>
          <div className="flex items-start gap-3 rounded-lg bg-mint p-4 text-teal-deep">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm">{service.compliance}</p>
          </div>
        </div>
        <FaqList faqs={service.faqs} />
      </Section>

      <CtaBand
        title={`See what better ${service.name.toLowerCase()} would recover for your practice`}
        body="Our free audit reviews a sample of your recent claims and shows you the biggest fixes."
      />
      <JsonLd
        data={serviceJsonLd({ name: service.name, description: service.metaDescription, path })}
      />
    </>
  );
}
