import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, PageHero, Section, StatsStrip } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { values } from "@/content/company";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About GlobalMed",
  description:
    "GlobalMed Transcriptions and Billing Solutions serves US practices with billing, coding and documentation, and trains billers and coders through its school.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A revenue-cycle company that also teaches the work"
        intro={`${site.name} helps US practices get paid accurately and on time. Through the ${site.schoolName}, we train the billers and coders the industry needs. [CLIENT TO CONFIRM company story]`}
        crumbs={[{ name: "About", path: "/about" }]}
      />
      <Section className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Two sides, one standard</h2>
          <p>
            Our services team bills and codes for US practices every day. Our school is taught by
            that same team, so students learn the workflows employers actually use, and our clients
            benefit from a steady pipeline of well-trained staff.
          </p>
          <p className="text-muted-foreground">
            [CLIENT TO CONFIRM] Founding year, history and milestones.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <li key={v.title} className="flex flex-col gap-2 rounded-lg border bg-card p-5">
              <h3 className="text-lg">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <StatsStrip />
      <Section title="The people behind the work">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/about/team" className={buttonVariants({ variant: "secondary" })}>
            Meet the team
          </Link>
          <Link href="/careers" className={cn(buttonVariants({ variant: "ghost" }))}>
            Work with us
          </Link>
        </div>
      </Section>
      <CtaBand title="Let's talk about your practice" href="/contact" label="Contact us" />
    </>
  );
}
