import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, PageHero, Section, StatsStrip } from "@/components/marketing/sections";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Medical Billing & Coding Services",
  description:
    "Medical billing, coding, transcription, AI clinical documentation, RCM and denial management for US practices, from one accountable team.",
  path: "/services",
});

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <PageHero
        eyebrow="Services for US practices"
        title="Every step of the revenue cycle, handled by one team"
        intro="Choose a single service or hand over the whole cycle. Either way, you get certified people, HIPAA-compliant processes and a monthly report you can read."
        crumbs={[{ name: "Services", path: "/services" }]}
      />
      <Section>
        <StaggerGroup as="ul" className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <StaggerItem as="li" key={service.slug}>
              <article className="relative flex h-full gap-5 rounded-lg border bg-card p-6 transition-colors hover:border-teal">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-mint text-teal-deep">
                  <ServiceIcon slug={service.slug} className="size-6" />
                </span>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl">
                    <Link
                      href={`/services/${service.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {service.name}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground">{service.intro}</p>
                  <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-teal-deep">
                    Learn more <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>
      <StatsStrip />
      <CtaBand
        title="Not sure which service you need?"
        body="Start with a free billing audit. We'll show you where revenue is leaking and what would fix it."
      />
    </>
  );
}
