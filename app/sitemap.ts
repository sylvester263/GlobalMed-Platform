import type { MetadataRoute } from "next";

import { features } from "@/config/features";
import { aapcCoursePath, getAapcCourses } from "@/data/courses";
import { getCourses, getPathways, getServices, getSpecialties } from "@/lib/content";
import { getLegalPages, getPosts, postCategories } from "@/lib/content/markdown";
import { absoluteUrl } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

/**
 * docs/12 §1: every published entity. Thank-you, verify results and the styleguide are excluded,
 * and so is everything hidden by config/features.ts (those routes redirect).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/services",
    "/specialties",
    "/free-billing-audit",
    ...(features.educationLanding ? ["/education"] : []),
    "/education/aapc-certification-pakistan",
    ...getAapcCourses().map((c) => aapcCoursePath(c.slug)),
    ...(features.globalmedCourses ? ["/education/courses"] : []),
    ...(features.pathways ? ["/education/pathways"] : []),
    ...(features.examPrep ? ["/education/exam-prep"] : []),
    ...(features.batches ? ["/education/batches"] : []),
    ...(features.corporateTraining ? ["/education/corporate-training"] : []),
    ...(site.features.aapcPartnership ? ["/education/aapc-partnership"] : []),
    "/blog",
    "/resources/guides",
    "/faq",
    ...(features.certificates ? ["/verify"] : []),
    "/about",
    "/about/team",
    "/careers",
    "/contact",
  ];

  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    ...staticPaths.map((p) => entry(p)),
    ...getServices().map((s) => entry(`/services/${s.slug}`)),
    ...getSpecialties().map((s) => entry(`/specialties/${s.slug}`)),
    ...getCourses().map((c) => entry(`/education/courses/${c.slug}`)),
    ...getPathways().map((p) => entry(`/education/pathways/${p.slug}`)),
    ...Object.keys(postCategories).map((c) => entry(`/blog/category/${c}`)),
    ...getPosts().map((p) => entry(`/blog/${p.slug}`, p.publishedAt)),
    ...getLegalPages().map((p) => entry(`/legal/${p.slug}`, p.updatedAt)),
  ];
}
