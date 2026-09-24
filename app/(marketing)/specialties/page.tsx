import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { getSpecialties } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Specialty Billing and Coding",
  description:
    "Billing and coding by specialty: cardiology, orthopedics, family and internal medicine, behavioral health and urgent care.",
  path: "/specialties",
});

export default function SpecialtiesPage() {
  const specialties = getSpecialties();
  return (
    <>
      <PageHero
        eyebrow="Specialties"
        title="Billing and coding that knows your specialty"
        intro="Every specialty has its own codes, modifiers and payer rules. Our coders work in yours every day."
        crumbs={[{ name: "Specialties", path: "/specialties" }]}
      />
      <Section>
        <StaggerGroup as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s) => (
            <StaggerItem as="li" key={s.slug}>
              <article className="relative flex h-full flex-col gap-3 rounded-lg border bg-card p-6 transition-colors hover:border-teal">
                <h2 className="text-xl">
                  <Link href={`/specialties/${s.slug}`} className="after:absolute after:inset-0">
                    {s.name}
                  </Link>
                </h2>
                <p className="text-muted-foreground">{s.intro}</p>
                <p className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {s.codes.slice(0, 3).map((c) => (
                    <span
                      key={c.code}
                      className="rounded-md bg-mint px-2 py-0.5 font-mono text-xs text-teal-deep"
                    >
                      {c.code}
                    </span>
                  ))}
                </p>
                <span className="flex items-center gap-1 text-sm font-semibold text-teal-deep">
                  {s.name} billing <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="text-muted-foreground">
          Don&apos;t see your specialty?{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">
            Tell us what you need
          </Link>
          .
        </p>
      </Section>
      <CtaBand title="See how your specialty's claims are performing" />
    </>
  );
}
