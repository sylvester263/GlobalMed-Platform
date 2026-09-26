import { Check, Clock, Lock, PlayCircle, Star } from "lucide-react";
import type { Metadata } from "next";

import { CertificatePreview } from "@/components/lms/certificate-preview";
import { PricingBlock } from "@/components/marketing/pricing-block";
import { Testimonial } from "@/components/marketing/testimonial";
import { ClaimLine } from "@/components/motion/claim-line";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";

import { MarketingFrame } from "../_components/frames";

export const metadata: Metadata = { title: "Screen: Course detail", robots: { index: false } };

const outcomes = [
  "Assign ICD-10-CM diagnosis codes with the official guidelines",
  "Code E/M, surgery and radiology services with CPT",
  "Apply modifiers correctly and avoid common denials",
  "Read an EOB and trace why a claim was paid or denied",
  "Work confidently in a practice management system",
  "Sit timed mock exams in the CPC format",
];

const curriculum = [
  {
    title: "Module 1 · How a claim gets paid",
    lessons: [
      { title: "The revenue cycle in 10 minutes", minutes: 10, preview: true },
      { title: "Payers, plans and eligibility", minutes: 14 },
      { title: "Anatomy of a CMS-1500", minutes: 12 },
    ],
  },
  {
    title: "Module 2 · ICD-10-CM",
    lessons: [
      { title: "Code structure and conventions", minutes: 18, preview: true },
      { title: "Chapter-specific guidelines", minutes: 22 },
      { title: "Practice set: 25 scenarios", minutes: 30 },
    ],
  },
  {
    title: "Module 3 · CPT and HCPCS",
    lessons: [
      { title: "E/M levels", minutes: 20 },
      { title: "Modifiers 25, 59 and friends", minutes: 16 },
      { title: "Mock exam 1 (timed)", minutes: 60 },
    ],
  },
];

export default function CourseScreen() {
  return (
    <MarketingFrame screen="Course detail (P1-6)">
      <div className="border-b bg-ledger">
        <div className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-10 md:px-6 lg:py-14">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Education</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Medical Coding Foundations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">Beginner</Badge>
              <Badge variant="gold">Certificate included</Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl">Medical Coding Foundations</h1>
            <p className="text-lg text-muted-foreground">
              Learn ICD-10-CM, CPT and HCPCS coding from certified coders, with practice sets and
              timed mock exams. [CLIENT TO CONFIRM]
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Star aria-hidden="true" className="size-4 fill-gold text-gold" />
                <span>
                  <strong className="text-foreground">4.8</strong> (126 reviews, sample)
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" /> 32 hours
              </li>
              <li className="flex items-center gap-1.5">
                <PlayCircle aria-hidden="true" className="size-4" /> 64 lessons
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-300 gap-12 px-4 py-12 md:px-6 lg:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-14">
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl">What you’ll learn</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-2xl">Curriculum</h2>
              <p className="text-sm text-muted-foreground">
                12 modules · 64 lessons · 3 mock exams
              </p>
            </div>
            <Accordion
              defaultValue={[curriculum[0]!.title]}
              className="rounded-lg border bg-card px-6"
            >
              {curriculum.map((m) => (
                <AccordionItem key={m.title} value={m.title}>
                  <AccordionTrigger>{m.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col divide-y">
                      {m.lessons.map((l) => (
                        <li key={l.title} className="flex items-center gap-3 py-3">
                          {l.preview ? (
                            <PlayCircle aria-hidden="true" className="size-4 shrink-0 text-teal" />
                          ) : (
                            <Lock
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground"
                            />
                          )}
                          <span className="flex-1">{l.title}</span>
                          {l.preview && <Badge variant="secondary">Free preview</Badge>}
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {l.minutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl">Your instructor</h2>
            <div className="flex items-start gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-mint text-lg font-semibold text-teal-deep">
                  SI
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-serif text-xl font-semibold">Sample Instructor, CPC</p>
                <p className="text-muted-foreground">
                  12 years coding for multispecialty practices. [CLIENT TO CONFIRM]
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl">Your certificate</h2>
            <p className="max-w-prose text-muted-foreground">
              Every certificate has a unique ID and QR code that employers can check on our
              verification page.
            </p>
            <CertificatePreview
              nameOnCertificate="Your Name"
              courseTitle="Medical Coding Foundations"
              issuedAt={new Date("2026-09-24")}
              code="SAMPLE000000"
            />
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl">Student reviews</h2>
            <Testimonial
              audience="student"
              quote="The practice sets after every module made the codes stick. [SAMPLE]"
              name="Sample Student"
              role="Billing assistant, Karachi"
            />
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <PricingBlock
              title="Full course"
              priceUsd={299}
              pricePkr={45000}
              accessMonths={12}
              includes={[
                "64 lessons you can rewatch",
                "3 timed mock exams",
                "Verifiable certificate",
              ]}
              action={<span className={buttonVariants({ size: "lg" })}>Enroll now</span>}
            />
          </div>
        </aside>
      </div>

      <section className="border-t bg-card">
        <div className="mx-auto flex max-w-300 flex-col gap-4 px-4 py-12 md:px-6">
          <h2 className="text-2xl">Related courses</h2>
          <ClaimLine trigger="static" ticks={10} filled={1} className="max-w-xs" />
          <p className="text-muted-foreground">CPC Exam Preparation · Medical Billing Essentials</p>
        </div>
      </section>

      {/* Sticky enroll bar on mobile (docs/05) */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t bg-card px-4 py-3 shadow-lg lg:hidden">
        <div>
          <p className="font-serif text-xl font-semibold">$299</p>
          <p className="text-xs text-muted-foreground">or PKR 45,000</p>
        </div>
        <span className={buttonVariants({ size: "lg" })}>Enroll now</span>
      </div>
    </MarketingFrame>
  );
}
