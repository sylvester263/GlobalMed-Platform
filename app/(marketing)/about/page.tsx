import { ArrowRight, Check, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CredentialsSection } from "@/components/marketing/credentials-section";
import { CtaBand, PageHero, Section, StatsStrip } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { about, values } from "@/content/company";
import { publicAssetExists } from "@/lib/public-asset";
import { pageMetadata } from "@/lib/seo/metadata";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About GlobalMed Transcriptions",
  description:
    "GlobalMed Transcriptions Pvt. Ltd., founded in 2007 by Riaz Naveed, is the leading medical transcription company in Pakistan, serving hospitals and clinics in the USA, Canada, UK, Australia and Saudi Arabia.",
  path: "/about",
});

export default function AboutPage() {
  const { leader } = about;
  const hasPhoto = publicAssetExists(leader.photo);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={about.title}
        intro={about.intro}
        crumbs={[{ name: "About Us", path: "/about" }]}
      />

      <Section className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Our Story</h2>
          {about.story.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="max-w-prose">
              {paragraph}
            </p>
          ))}
        </div>
        <article className="flex flex-col gap-5 self-start rounded-lg border bg-card p-6 shadow-sm">
          <div className="relative aspect-[4/5] w-full max-w-60 overflow-hidden rounded-md bg-ledger">
            {hasPhoto ? (
              <Image
                src={leader.photo}
                alt={`${leader.name}, ${leader.role}`}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-2 flex items-center justify-center rounded-md border-2 border-dashed border-input p-3 text-center text-xs font-semibold text-muted-foreground">
                Photo: {leader.name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl">{leader.name}</h3>
            <p className="text-sm font-semibold text-teal-deep">{leader.role}</p>
            <p className="text-muted-foreground">{leader.bio}</p>
          </div>
        </article>
      </Section>

      <Section tone="white" className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">What We Do</h2>
          {about.whatWeDo.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="max-w-prose">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-teal-deep uppercase">
            Areas of expertise
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {about.specialties.map((specialty) => (
              <li key={specialty} className="flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 shrink-0 text-sky" />
                {specialty}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">Quality First</h2>
            <p className="max-w-prose">{about.quality}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-primary p-6 text-white">
            <h2 className="flex items-center gap-2 text-xl text-white">
              <Target aria-hidden="true" className="size-5 text-sky" /> Our Mission
            </h2>
            <p className="text-white/90">{about.mission}</p>
          </div>
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

      <StatsStrip stats={about.facts} confirmed />

      <Section tone="mint" title="Strategic Partnership">
        <p className="max-w-3xl font-serif text-xl leading-snug font-semibold text-primary lg:text-2xl">
          {about.partnership}
        </p>
        <p className="max-w-3xl text-muted-foreground">{about.partnershipDetail}</p>
        <Link
          href={aapcCertificationPath}
          className={cn(buttonVariants({ size: "lg" }), "self-start")}
        >
          AAPC Certification in Pakistan <ArrowRight aria-hidden="true" />
        </Link>
      </Section>

      <CredentialsSection id="about-credentials" />

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

      <CtaBand
        title="Let's talk about your transcription, billing or coding work"
        body="Try us with a free trial before you outsource."
        href="/contact"
        label="Request a Free Quote"
        secondary={{ href: "/careers", label: "Apply Now" }}
      />
    </>
  );
}
