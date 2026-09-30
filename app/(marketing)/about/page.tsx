import { ArrowRight, Check, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AboutStory } from "@/components/marketing/about-story";
import { CredentialsSection } from "@/components/marketing/credentials-section";
import { CtaBand, PageHero, Section, StatsStrip } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { features } from "@/config/features";
import { about, values } from "@/content/company";
import { publicAssetExists } from "@/lib/public-asset";
import { pageMetadata } from "@/lib/seo/metadata";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About GlobalMed Transcriptions",
  // Client's description (2026-09-29), trimmed to 160 characters with the same meaning.
  description:
    "Founded in Pakistan in 2007, GlobalMed offers clinical documentation, AI-assisted editing, coding, billing and RCM, and supports AAPC CPC® and CPB® training.",
  path: "/about",
});

/** The Leadership card (Riaz Naveed), unchanged; shown whichever "Our Story" is on. */
function LeaderCard({ className }: { className?: string }) {
  const { leader } = about;
  const hasPhoto = publicAssetExists(leader.photo);
  return (
    <article
      className={cn(
        "flex flex-col gap-5 self-start rounded-2xl border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="w-full max-w-60 rounded-2xl bg-ledger p-3 shadow-sm">
        {hasPhoto ? (
          <Image
            src={leader.photo}
            alt={`${leader.name}, ${leader.role} of GlobalMed Transcriptions`}
            width={400}
            height={500}
            sizes="216px"
            className="h-auto w-full rounded-2xl"
          />
        ) : (
          <span className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border-2 border-dashed border-input p-3 text-center text-xs font-semibold text-muted-foreground">
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
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={about.title}
        intro={about.intro}
        crumbs={[{ name: "About Us", path: "/about" }]}
      />

      <AboutStory />

      {/* Hidden at client request (2026-09-29): replaced by the new "Our Story" above. */}
      {features.aboutStoryOld ? (
        <>
          <Section className="split-cols lg:grid lg:items-start">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl lg:text-3xl">Our Story</h2>
              {about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="max-w-prose">
                  {paragraph}
                </p>
              ))}
            </div>
            <LeaderCard />
          </Section>

          <Section tone="white" className="split-cols lg:grid lg:items-start">
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
        </>
      ) : (
        // Hidden at client request (2026-09-29): the founder is already shown in "Our Story".
        features.aboutLeaderCard && (
          <Section>
            <LeaderCard className="sm:grid sm:max-w-3xl sm:grid-cols-[12rem_1fr] sm:items-start sm:gap-8" />
          </Section>
        )
      )}

      <Section deferRender className="lg:grid lg:grid-cols-2 lg:gap-16">
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
        <ul className="grid gap-grid sm:grid-cols-2">
          {values.map((v) => (
            <li key={v.title} className="flex flex-col gap-2 rounded-2xl border bg-card p-6">
              <h3 className="text-lg">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <StatsStrip stats={about.facts} confirmed />

      {/* Hidden at client request (2026-09-29): replaced by "Investing in Pakistan's Healthcare Workforce". */}
      {features.aboutPartnershipBlockOld && (
        <Section tone="mint" title="Strategic Partnership">
          <p className="max-w-3xl font-serif text-xl leading-snug font-semibold text-primary lg:text-2xl">
            {about.partnership}
          </p>
          <p className="max-w-[75ch] text-muted-foreground">{about.partnershipDetail}</p>
          <Link
            href={aapcCertificationPath}
            className={cn(buttonVariants({ size: "lg" }), "self-start")}
          >
            AAPC Certification in Pakistan <ArrowRight aria-hidden="true" />
          </Link>
        </Section>
      )}

      <CredentialsSection id="about-credentials" />

      <Section deferRender title="The people behind the work">
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
