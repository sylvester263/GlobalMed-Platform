import { describe, expect, it } from "vitest";

import { courses, pathways } from "@/content/school";
import { filterCourses, parseCatalogParams } from "@/lib/content/catalog";

describe("parseCatalogParams", () => {
  it("defaults sort and drops unknown values instead of throwing", () => {
    const params = parseCatalogParams({ level: "expert", category: "coding", sort: "random" });
    expect(params.level).toBeUndefined();
    expect(params.category).toBe("coding");
    expect(params.sort).toBe("featured");
  });

  it("takes the first value of repeated params and ignores empty strings", () => {
    const params = parseCatalogParams({ level: ["beginner", "advanced"], q: "" });
    expect(params.level).toBe("beginner");
    expect(params.q).toBeUndefined();
  });
});

describe("filterCourses", () => {
  const base = parseCatalogParams({});

  it("returns every course with no filters, featured first", () => {
    const result = filterCourses(courses, pathways, base);
    expect(result).toHaveLength(courses.length);
    const firstNonFeatured = result.findIndex((c) => !c.featured);
    expect(result.slice(firstNonFeatured).every((c) => !c.featured)).toBe(true);
  });

  it("filters by level and category together", () => {
    const result = filterCourses(courses, pathways, {
      ...base,
      level: "intermediate",
      category: "coding",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.level === "intermediate" && c.category === "coding")).toBe(true);
  });

  it("filters by price band", () => {
    const result = filterCourses(courses, pathways, { ...base, price: "under-150" });
    expect(result.every((c) => c.priceUsd < 150)).toBe(true);
  });

  it("limits to the courses of a pathway", () => {
    const pathway = pathways[0]!;
    const allowed = new Set(pathway.steps.flatMap((s) => s.courses));
    const result = filterCourses(courses, pathways, { ...base, pathway: pathway.slug });
    expect(result.length).toBe(allowed.size);
    expect(result.every((c) => allowed.has(c.slug))).toBe(true);
  });

  it("searches title, summary and outcomes case-insensitively", () => {
    const result = filterCourses(courses, pathways, { ...base, q: "icd-10" });
    expect(result.map((c) => c.slug)).toContain("icd-10-cm-mastery");
  });

  it("sorts by price ascending", () => {
    const result = filterCourses(courses, pathways, { ...base, sort: "price-asc" });
    const prices = result.map((c) => c.priceUsd);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
