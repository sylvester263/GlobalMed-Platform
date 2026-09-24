import { ArrowRight, AudioLines, FileCode2, Receipt, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { Testimonial } from "@/components/marketing/testimonial";
import { ClaimLine } from "@/components/motion/claim-line";
import { LottiePlayer } from "@/components/motion/lottie-player";
import { PathwayLine } from "@/components/motion/pathway-line";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { StatBlock } from "@/components/ui/stat-block";
import { motionAssets } from "@/lib/motion-assets";
import { cn } from "@/lib/utils";

import { MarketingFrame } from "../_components/frames";

export const metadata: Metadata = { title: "Screen: Home", robots: { index: false } };

const services = [
  {
    icon: Receipt,
    title: "Medical billing",
    body: "Charge entry, claim submission, payment posting and AR follow-up, with a monthly report you can actually read.",
  },
  {
    icon: FileCode2,
    title: "Medical coding",
    body: "Certified coders assign ICD-10-CM, CPT and HCPCS codes, checked against payer rules before claims go out.",
  },
  {
    icon: AudioLines,
    title: "Medical transcription",
    body: "Accurate, fast turnaround on dictated notes, delivered through your existing secure system.",
  },
  {
    icon: Sparkles,
    title: "AI clinical documentation",
    body: "AI-drafted notes reviewed by trained specialists, so physicians spend less time on charts.",
  },
];

const courses = [
  { title: "Medical Billing Essentials", level: "Beginner", lessons: 42, price: "$199" },
  { title: "Medical Coding Foundations", level: "Beginner", lessons: 64, price: "$299" },
  { title: "CPC Exam Preparation", level: "Advanced", lessons: 38, price: "$349" },
];

export default function HomeScreen() {
  return (
    <MarketingFrame screen="Home (P1-6)">
      {/* 1. Hero — two paths above the fold (W-1). Text is server-rendered; MG-1 enhances. */}
      <section className="bg-ledger">
        <div className="mx-auto grid max-w-300 items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
              Medical billing · coding · transcription · education
            </p>
            <h1 className="text-3xl lg:text-4xl">
              Clean claims for your practice. Career-ready skills for your future.
            </h1>
            <ClaimLine trigger="mount" ticks={8} delay={0.1} className="max-w-md" />
            <p className="max-w-prose text-lg text-muted-foreground">
              GlobalMed runs the revenue cycle for US practices and trains the next generation of
              billers and coders. [CLIENT TO CONFIRM]
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <span className={buttonVariants({ size: "lg" })}>
                Book your free billing audit <ArrowRight aria-hidden="true" />
              </span>
              <span className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Explore courses
              </span>
            </div>
          </div>
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

      {/* 2. Trust strip */}
      <section aria-label="GlobalMed in numbers" className="border-y bg-card">
        <div className="mx-auto grid max-w-300 grid-cols-2 gap-8 px-4 py-10 md:px-6 lg:grid-cols-4">
          <StatBlock label="Years in business" value={12} illustrative />
          <StatBlock label="Claims processed" value={125000} suffix="+" illustrative />
          <StatBlock label="Clean-claim rate" value={98.4} decimals={1} suffix="%" illustrative />
          <StatBlock label="Students trained" value={1500} suffix="+" illustrative />
        </div>
      </section>

      {/* 3. Services overview — a list, not a card grid */}
      <section className="mx-auto max-w-300 px-4 py-16 md:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl lg:text-3xl">Revenue-cycle services for US practices</h2>
            <p className="text-muted-foreground">
              HIPAA-aware processes, certified coders, and one team accountable for every claim.
            </p>
            <span className={cn(buttonVariants({ variant: "link" }), "self-start")}>
              See all services
            </span>
          </div>
          <StaggerGroup as="ul" className="divide-y border-y">
            {services.map(({ icon: Icon, title, body }) => (
              <StaggerItem as="li" key={title} className="flex gap-4 py-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-mint text-teal-deep">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 4. How we work (MG-3 scroll-scrubbed version comes in P2-17) */}
      <section className="bg-mint">
        <div className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6 lg:py-24">
          <h2 className="text-2xl lg:text-3xl">How we work with your practice</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              [
                "Free billing audit",
                "We review a sample of your recent claims and denials and show you where revenue is leaking.",
              ],
              [
                "Onboarding in two weeks",
                "We connect to your practice management system and set up payer rules. [CLIENT TO CONFIRM]",
              ],
              [
                "Monthly reporting",
                "Collections, denials and AR in one plain report, with a call to walk through it.",
              ],
            ].map(([title, body], i) => (
              <li key={title} className="flex flex-col gap-3">
                <span className="font-serif text-3xl font-semibold text-teal-deep">0{i + 1}</span>
                <ClaimLine
                  trigger="inView"
                  ticks={4}
                  filled={i + 2}
                  delay={i * 0.15}
                  className="max-w-48"
                />
                <h3 className="text-xl">{title}</h3>
                <p className="text-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. School intro + featured courses */}
      <section className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-prose flex-col gap-3">
            <Badge variant="gold">GlobalMed School of Billing and Coding</Badge>
            <h2 className="text-2xl lg:text-3xl">Start a career in medical billing and coding</h2>
            <p className="text-muted-foreground">
              Video lessons you can rewatch, practice quizzes, timed mock exams and a certificate
              employers can verify online.
            </p>
          </div>
          <span className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
            All courses
          </span>
        </div>
        <StaggerGroup as="ul" className="grid gap-6 md:grid-cols-3">
          {courses.map((c) => (
            <StaggerItem
              as="li"
              key={c.title}
              className="flex flex-col gap-4 rounded-lg border bg-card p-6"
            >
              <Badge variant="neutral">{c.level}</Badge>
              <h3 className="text-xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground">
                {c.lessons} lessons · certificate included
              </p>
              <p className="mt-auto font-serif text-2xl font-semibold">{c.price}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 6. Pathway preview */}
      <section className="border-y bg-card">
        <div className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6">
          <h2 className="text-2xl lg:text-3xl">Your route to certification</h2>
          <PathwayLine
            stages={[
              { label: "Foundations", description: "Terminology, anatomy" },
              { label: "Billing", description: "Claims and payers" },
              { label: "Coding", description: "ICD-10-CM, CPT" },
              { label: "Exam prep", description: "Timed mock exams" },
              { label: "Certified", description: "Verifiable online" },
            ]}
            current={0}
          />
        </div>
      </section>

      {/* 7. Testimonials — practices and students kept separate */}
      <section className="mx-auto grid max-w-300 gap-6 px-4 py-16 md:grid-cols-2 md:px-6 lg:py-24">
        <h2 className="text-2xl md:col-span-2 lg:text-3xl">What clients and students say</h2>
        <Reveal>
          <Testimonial
            audience="practice"
            quote="Our denial rate dropped within the first quarter, and we finally know where every claim stands. [SAMPLE]"
            name="Sample Practice Manager"
            role="Office manager, family practice"
          />
        </Reveal>
        <Reveal>
          <Testimonial
            audience="student"
            quote="The mock exams felt like the real thing. I knew exactly what to review. [SAMPLE]"
            name="Sample Student"
            role="Medical coder, Lahore"
          />
        </Reveal>
      </section>

      {/* 10. FAQ */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-300 gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl lg:text-3xl">Questions practices ask</h2>
          <Accordion>
            {[
              [
                "Do you handle patient information on this website?",
                "No. This website never collects patient information. Clients exchange files through GlobalMed's existing secure systems.",
              ],
              [
                "Which specialties do you bill for?",
                "[CLIENT TO CONFIRM] Family medicine, cardiology, orthopedics and more.",
              ],
              [
                "How long does onboarding take?",
                "[CLIENT TO CONFIRM] Usually about two weeks after the audit.",
              ],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 11. Final CTA band */}
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-300 flex-col items-start gap-6 px-4 py-16 md:px-6">
          <h2 className="text-2xl text-white lg:text-3xl">
            Find out what your claims are leaving on the table
          </h2>
          <ClaimLine trigger="inView" ticks={8} goldEnd className="max-w-md" />
          <span className={buttonVariants({ size: "lg" })}>Book your free billing audit</span>
        </div>
      </section>
    </MarketingFrame>
  );
}
