import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ClaimJourney } from "@/components/marketing/home/claim-journey";
import { HeroCtas } from "@/components/marketing/home/hero-ctas";
import { CourseCard, CtaBand, FaqList, Section, StatsStrip } from "@/components/marketing/sections";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { Testimonial } from "@/components/marketing/testimonial";
import { ClaimLine } from "@/components/motion/claim-line";
import { LottiePlayer } from "@/components/motion/lottie-player";
import { PathwayLine } from "@/components/motion/pathway-line";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { faqGroups } from "@/content/company";
import { claimJourney, hero, testimonials } from "@/content/home";
import { motionAssets } from "@/lib/motion-assets";
import { getFeaturedCourses, getPathway, getServices } from "@/lib/content";
import { getPosts, postCategories } from "@/lib/content/markdown";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Medical Billing, Coding & Training",
    description:
      "Medical billing, coding and transcription for US practices, and the GlobalMed School of Billing and Coding for career-ready billers and coders.",
    path: "/",
  }),
  title: { absolute: "GlobalMed | Medical Billing, Coding & Training" },
};

export default function HomePage() {
  const services = getServices().slice(0, 4);
  const featured = getFeaturedCourses().slice(0, 3);
  const pathway = getPathway("billing-and-coding-career");
  const posts = getPosts().slice(0, 3);
  const faqs = faqGroups.flatMap((g) => g.faqs).slice(0, 5);

  return (
    <>
      {/* 1. Hero: both paths above the fold (W-1). MG-1 enhances; text is SSR and never hidden. */}
      <section className="bg-ledger">
        <div className="mx-auto grid max-w-300 items-center gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
              {hero.eyebrow}
            </p>
            <h1 className="text-3xl lg:text-4xl">{hero.headline}</h1>
            <ClaimLine trigger="mount" ticks={8} delay={0.1} className="max-w-md" />
            <p className="max-w-prose text-lg text-muted-foreground">{hero.intro}</p>
            <HeroCtas />
          </div>
          {/* MG-2: poster until the Lottie asset is delivered (P2-15). */}
          <LottiePlayer
            src={motionAssets.heroClaimForm}
            poster="/motion/posters/hero-claim-form.svg"
            alt="A claim form fills itself in: codes appear, a denial flag turns green, and the status changes to Paid."
            width={480}
            height={320}
            className="w-full"
          />
        </div>
      </section>

      {/* 2. Trust strip (MG-4) */}
      <StatsStrip />

      {/* 3. Services overview: a list, not a card grid */}
      <Section className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Revenue-cycle services for US practices</h2>
          <p className="max-w-prose text-muted-foreground">
            HIPAA-aware processes, certified coders and one team accountable for every claim.
          </p>
          <Link href="/services" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            See all services
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
      </Section>

      {/* 4. How we work (MG-3) */}
      <Section
        tone="mint"
        id="how-we-work"
        title="How we work with your practice"
        intro="From the visit to the payment, every step runs through one accountable team."
      >
        <ClaimJourney stages={claimJourney} />
        <Link
          href="/free-billing-audit"
          className={cn(buttonVariants({ size: "lg" }), "self-start")}
        >
          Start with a free billing audit
        </Link>
      </Section>

      {/* 5. School intro + featured courses */}
      <Section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-prose flex-col gap-3">
            <Badge variant="gold">{site.schoolName}</Badge>
            <h2 className="text-2xl lg:text-3xl">Start a career in medical billing and coding</h2>
            <p className="text-muted-foreground">
              Video lessons you can rewatch, practice quizzes, timed mock exams and a certificate
              employers can verify online.
            </p>
          </div>
          <Link
            href="/school/courses"
            className={cn(buttonVariants({ variant: "secondary" }), "self-start")}
          >
            All courses
          </Link>
        </div>
        <StaggerGroup as="ul" className="grid gap-6 md:grid-cols-3">
          {featured.map((course) => (
            <StaggerItem as="li" key={course.slug}>
              <CourseCard course={course} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* 6. Certification pathway preview (MG-9) */}
      {pathway && (
        <Section tone="white" title="Your route to certification" intro={pathway.summary}>
          <PathwayLine
            stages={pathway.steps.map((s) => ({ label: s.label, description: s.description }))}
            current={0}
          />
          <Link
            href={`/school/pathways/${pathway.slug}`}
            className={cn(buttonVariants({ variant: "secondary" }), "self-start")}
          >
            See the full pathway
          </Link>
        </Section>
      )}

      {/* 7. Testimonials, shown only once the client supplies consent-approved quotes */}
      {testimonials.length > 0 && (
        <Section title="What clients and students say">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <Testimonial key={t.quote} {...t} />
            ))}
          </div>
        </Section>
      )}

      {/* 9. Latest articles */}
      <Section tone="white" title="Latest from the blog">
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="relative flex h-full flex-col gap-3">
                <Badge variant="neutral">{postCategories[post.category] ?? post.category}</Badge>
                <h3 className="text-xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 hover:text-teal-deep"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground">{post.description}</p>
              </article>
            </li>
          ))}
        </ul>
        <Link href="/blog" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
          All articles
        </Link>
      </Section>

      {/* 10. FAQ */}
      <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl lg:text-3xl">Questions we hear most</h2>
          <Link href="/faq" className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            All FAQs
          </Link>
        </div>
        <FaqList faqs={faqs} />
      </Section>

      {/* 11. Final CTA */}
      <CtaBand
        title="Find out what your claims are leaving on the table"
        body="Our free billing audit reviews a sample of your recent claims and denials. No cost, no commitment."
        secondary={{ href: "/school", label: "Or start a course" }}
      />
    </>
  );
}
