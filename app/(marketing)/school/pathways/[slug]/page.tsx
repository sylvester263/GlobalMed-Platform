import { Briefcase } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CourseCard,
  CtaBand,
  formatPkr,
  formatUsd,
  PageHero,
  Section,
} from "@/components/marketing/sections";
import { PathwayLine } from "@/components/motion/pathway-line";
import { buttonVariants } from "@/components/ui/button";
import { getCourse, getPathway, getPathways } from "@/lib/content";
import type { Course } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPathways().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pathway = getPathway((await params).slug);
  if (!pathway) return {};
  return pageMetadata({
    title: pathway.metaTitle,
    description: pathway.metaDescription,
    path: `/education/pathways/${pathway.slug}`,
  });
}

/** Pathway page (docs/05): steps as a visual path with courses per step, total vs bundle price. */
export default async function PathwayPage({ params }: Props) {
  const pathway = getPathway((await params).slug);
  if (!pathway) notFound();
  const path = `/education/pathways/${pathway.slug}`;

  const steps = pathway.steps.map((step) => ({
    ...step,
    courseList: step.courses.map(getCourse).filter((c): c is Course => c !== undefined),
  }));
  const allCourses = steps.flatMap((s) => s.courseList);
  const totalUsd = allCourses.reduce((sum, c) => sum + c.priceUsd, 0);
  const totalPkr = allCourses.reduce((sum, c) => sum + c.pricePkr, 0);

  return (
    <>
      <PageHero
        eyebrow="Certification pathway"
        title={pathway.title}
        intro={pathway.summary}
        crumbs={[
          { name: "Education", path: "/education" },
          { name: "Pathways", path: "/education/pathways" },
          { name: pathway.title, path },
        ]}
      />
      <Section tone="white">
        <PathwayLine
          stages={pathway.steps.map((s) => ({ label: s.label, description: s.description }))}
          current={0}
        />
      </Section>

      {steps
        .filter((s) => s.courseList.length > 0)
        .map((step, i) => (
          <Section key={step.label} title={`Step ${i + 1}: ${step.label}`} intro={step.description}>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {step.courseList.map((c) => (
                <li key={c.slug}>
                  <CourseCard course={c} />
                </li>
              ))}
            </ul>
          </Section>
        ))}

      <Section tone="mint" className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl">Where this pathway leads</h2>
          <p>{pathway.outcome}</p>
          <ul className="flex flex-col gap-2">
            {pathway.careers.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <Briefcase aria-hidden="true" className="size-4 text-teal-deep" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
          <h2 className="text-xl">Bundle price</h2>
          <p className="text-muted-foreground">
            {allCourses.length} courses bought separately:{" "}
            <s className="tabular-nums">{formatUsd(totalUsd)}</s>
          </p>
          <p>
            <span className="font-serif text-4xl font-semibold">
              {formatUsd(pathway.bundlePriceUsd)}
            </span>
            <span className="ml-2 font-semibold text-success-ink">
              Save {formatUsd(totalUsd - pathway.bundlePriceUsd)}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Or {formatPkr(pathway.bundlePricePkr)} (separately {formatPkr(totalPkr)}) by bank
            transfer, JazzCash or Easypaisa.
          </p>
          <Link href={`/signup?pathway=${pathway.slug}`} className={buttonVariants({ size: "lg" })}>
            Enroll in the pathway
          </Link>
        </div>
      </Section>
      <CtaBand title="Questions about the pathway?" href="/contact" label="Talk to an advisor" />
    </>
  );
}
