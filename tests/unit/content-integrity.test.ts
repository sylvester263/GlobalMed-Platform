import { describe, expect, it } from "vitest";

import { services } from "@/content/services";
import { courses, instructors, pathways } from "@/content/school";
import { specialties } from "@/content/specialties";
import { getLegalPages, getPosts, postCategories } from "@/lib/content/markdown";

// The root layout appends " | GlobalMed" (12 chars); titles must stay within 60 (docs/12 §1).
const SUFFIX = " | GlobalMed".length;

describe("content integrity", () => {
  it("has unique slugs per collection", () => {
    for (const list of [services, specialties, courses, pathways]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("links services only to existing specialties", () => {
    const known = new Set(specialties.map((s) => s.slug));
    for (const service of services) {
      for (const slug of service.specialties)
        expect(known.has(slug), `${service.slug} → ${slug}`).toBe(true);
    }
  });

  it("links pathway steps only to existing courses", () => {
    const known = new Set(courses.map((c) => c.slug));
    for (const pathway of pathways) {
      for (const slug of pathway.steps.flatMap((s) => s.courses)) {
        expect(known.has(slug), `${pathway.slug} → ${slug}`).toBe(true);
      }
    }
  });

  it("assigns every course an existing instructor", () => {
    const known = new Set(instructors.map((i) => i.id));
    for (const course of courses) expect(known.has(course.instructor), course.slug).toBe(true);
  });

  it("prices every pathway bundle below the sum of its courses", () => {
    for (const pathway of pathways) {
      const slugs = pathway.steps.flatMap((s) => s.courses);
      const total = courses
        .filter((c) => slugs.includes(c.slug))
        .reduce((sum, c) => sum + c.priceUsd, 0);
      expect(pathway.bundlePriceUsd, pathway.slug).toBeLessThan(total);
    }
  });

  it("keeps page titles within 60 characters including the suffix", () => {
    const titles = [...services, ...specialties, ...courses, ...pathways].map((x) => x.metaTitle);
    for (const title of titles) expect(title.length + SUFFIX, title).toBeLessThanOrEqual(60);
  });

  it("parses every blog post and gives it a known category", () => {
    const posts = getPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) expect(postCategories[post.category], post.slug).toBeDefined();
  });

  it("parses every legal page", () => {
    const slugs = getLegalPages().map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "privacy",
        "terms",
        "refund-policy",
        "hipaa-notice",
        "cookie-policy",
      ]),
    );
  });
});
