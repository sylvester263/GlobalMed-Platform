import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AapcCourseCard, AapcRegisterBand } from "@/components/marketing/aapc-course";
import { AapcInstructorsBand } from "@/components/marketing/aapc-instructors-band";
import { ClaimJourney } from "@/components/marketing/home/claim-journey";
import { FaqList, PageHero, Section } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { aapcFaqs, aapcHero, aapcSteps } from "@/content/aapc";
import {
  aapcCourseFacts,
  getAapcCoursesDualCentred,
  priceText,
  type AapcCourse,
} from "@/data/courses";
import { pageMetadata } from "@/lib/seo/metadata";
import { aapcCertificationPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "AAPC Certification in Pakistan: CPC® and CPB®",
  description:
    "AAPC's CPC®, CPB® and dual courses, taught live online by AAPC faculty. Register in Pakistan with GlobalMed Transcriptions, AAPC's Strategic Partner.",
  path: aapcCertificationPath,
});

const comparisonRows: { label: string; value: (course: AapcCourse) => string }[] = [
  { label: "Duration", value: (c) => c.compare.duration },
  { label: "Format", value: () => aapcCourseFacts.format },
  { label: "Membership", value: (c) => c.compare.membership },
  { label: "Exams included", value: (c) => c.compare.exams },
  { label: "Practice tests", value: (c) => c.compare.practiceTests },
  { label: "Internship", value: (c) => c.compare.internship },
  { label: "Codify", value: (c) => c.compare.codify },
  { label: "Price", value: (c) => priceText(c) },
];

/**
 * AAPC Certification in Pakistan (client, 2026-09-26): the three AAPC courses (dual in the
 * middle), a comparison table, how it works, FAQs and the registration form. GlobalMed is
 * AAPC's Strategic Partner; AAPC faculty teach online and AAPC awards the certification.
 * Reached at /education/aapc-certification-pakistan via the /education rewrite (ADR-024).
 */
export default function AapcCertificationPage() {
  const courses = getAapcCoursesDualCentred();

  return (
    <>
      <PageHero
        eyebrow="AAPC's Strategic Partner in Pakistan"
        title={aapcHero.title}
        intro={aapcHero.intro}
        crumbs={[{ name: "Education", path: aapcCertificationPath }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#register" className={buttonVariants({ size: "lg" })}>
            Register Now <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="#compare" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Compare the courses
          </Link>
        </div>
      </PageHero>

      <AapcInstructorsBand href="#courses" id="aapc-instructors" />

      <Section
        id="courses"
        title="AAPC courses available in Pakistan"
        intro="Three AAPC official courses, taught live online by AAPC faculty. Choose one credential, or both."
      >
        <ul className="grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {courses.map((course) => (
            <li key={course.slug} className="flex">
              <AapcCourseCard course={course} registerHref={`?course=${course.slug}#register`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="compare" title="Compare the courses">
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">
              Comparison of the CPC®, CPC® + CPB® and CPB® AAPC courses
            </caption>
            <thead className="bg-ledger">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  <span className="sr-only">Detail</span>
                </th>
                {courses.map((course) => (
                  <th
                    key={course.slug}
                    scope="col"
                    className={cn(
                      "px-4 py-3 font-serif text-lg font-semibold text-primary",
                      course.bestValue && "bg-mint",
                    )}
                  >
                    {course.credential}
                    {course.bestValue && (
                      <span className="block font-sans text-xs font-semibold text-teal-deep">
                        Best value: two certifications
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-t">
                  <th scope="row" className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.label}
                  </th>
                  {courses.map((course) => (
                    <td
                      key={course.slug}
                      className={cn(
                        "px-4 py-3 text-muted-foreground",
                        course.bestValue && "bg-mint/50",
                      )}
                    >
                      {row.value(course)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">{aapcCourseFacts.priceNote}</p>
      </Section>

      <Section
        tone="mint"
        id="how-it-works"
        title="How it works"
        intro="From registration to your AAPC credential, in five steps."
      >
        <ClaimJourney stages={aapcSteps} />
      </Section>

      <Section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-2xl lg:text-3xl">Questions about AAPC certification</h2>
        <FaqList faqs={aapcFaqs} />
      </Section>

      <AapcRegisterBand />
    </>
  );
}
