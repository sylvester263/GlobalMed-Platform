import { z } from "zod";

import { courseCategories, courseLevels, type Course, type Pathway } from "@/lib/content/schema";

export const priceBands = ["under-150", "150-300", "over-300"] as const;
export const sortOptions = ["featured", "price-asc", "price-desc", "shortest"] as const;

/** Catalog filters live in URL params (P2-6) so results are shareable and server-rendered. */
export const catalogParamsSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  level: z.enum(courseLevels).optional().catch(undefined),
  category: z.enum(courseCategories).optional().catch(undefined),
  pathway: z.string().max(60).optional().catch(undefined),
  price: z.enum(priceBands).optional().catch(undefined),
  sort: z.enum(sortOptions).default("featured").catch("featured"),
});
export type CatalogParams = z.infer<typeof catalogParamsSchema>;

export function parseCatalogParams(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogParams {
  const flat = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || undefined]),
  );
  return catalogParamsSchema.parse(flat);
}

function inPriceBand(price: number, band: (typeof priceBands)[number]): boolean {
  if (band === "under-150") return price < 150;
  if (band === "150-300") return price >= 150 && price <= 300;
  return price > 300;
}

export function filterCourses(
  courses: Course[],
  pathways: Pathway[],
  params: CatalogParams,
): Course[] {
  const q = params.q?.toLowerCase();
  const pathwayCourses = params.pathway
    ? new Set(
        pathways.find((p) => p.slug === params.pathway)?.steps.flatMap((s) => s.courses) ?? [],
      )
    : null;

  const filtered = courses.filter((course) => {
    if (params.level && course.level !== params.level) return false;
    if (params.category && course.category !== params.category) return false;
    if (params.price && !inPriceBand(course.priceUsd, params.price)) return false;
    if (pathwayCourses && !pathwayCourses.has(course.slug)) return false;
    if (q) {
      const haystack = [course.title, course.summary, ...course.outcomes].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (params.sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    case "shortest":
      return sorted.sort((a, b) => a.hours - b.hours);
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export const levelLabels: Record<(typeof courseLevels)[number], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const categoryLabels: Record<(typeof courseCategories)[number], string> = {
  billing: "Billing",
  coding: "Coding",
  "exam-prep": "Exam prep",
};
