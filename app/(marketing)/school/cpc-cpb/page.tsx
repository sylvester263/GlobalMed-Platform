import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AapcCoursePage } from "@/components/marketing/aapc-course";
import { courseFaqs } from "@/content/aapc";
import { aapcCoursePath, getAapcCourse } from "@/data/courses";
import { pageMetadata } from "@/lib/seo/metadata";

const course = getAapcCourse("cpc-cpb");

export const metadata: Metadata = course
  ? pageMetadata({
      title: course.metaTitle,
      description: course.metaDescription,
      path: aapcCoursePath(course.slug),
    })
  : {};

/** AAPC course page (client, 2026-09-26), served at /education/cpc-cpb via the /education rewrite. */
export default function Page() {
  if (!course) notFound();
  return <AapcCoursePage course={course} faqs={courseFaqs} />;
}
