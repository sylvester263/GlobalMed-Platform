import { z } from "zod";

/**
 * Content schemas (ADR-014). Page copy lives in typed files under content/ until it moves
 * to the CMS tables in Phase 8; every file is parsed at build time, so a malformed entry
 * fails the build instead of rendering a broken page.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugs are kebab-case");

export const faqSchema = z.object({ question: z.string().min(5), answer: z.string().min(20) });
export type Faq = z.infer<typeof faqSchema>;

const titledText = z.object({ title: z.string(), body: z.string() });

export const serviceSchema = z.object({
  slug,
  name: z.string(),
  metaTitle: z.string().max(48),
  metaDescription: z.string().max(155),
  eyebrow: z.string(),
  headline: z.string(),
  intro: z.string(),
  /** Short line for cards and menus. */
  summary: z.string(),
  problems: z.array(z.string()).min(2),
  included: z.array(titledText).min(3),
  process: z.array(titledText).min(3),
  results: z
    .array(
      z.object({
        value: z.number(),
        suffix: z.string().default(""),
        decimals: z.number().default(0),
        label: z.string(),
      }),
    )
    .min(2),
  specialties: z.array(slug),
  compliance: z.string(),
  faqs: z.array(faqSchema).min(2),
  /** Page-specific motion graphic (docs/15 §4). */
  motion: z.enum(["waveform", "code-chips", "denial-bars"]).optional(),
});
export type Service = z.infer<typeof serviceSchema>;

export const specialtySchema = z.object({
  slug,
  name: z.string(),
  metaTitle: z.string().max(48),
  metaDescription: z.string().max(155),
  headline: z.string(),
  intro: z.string(),
  challenges: z.array(titledText).min(3),
  codes: z.array(z.object({ code: z.string(), description: z.string() })).min(3),
  howWeHelp: z.array(z.string()).min(3),
  faqs: z.array(faqSchema).min(2),
});
export type Specialty = z.infer<typeof specialtySchema>;

export const courseLevels = ["beginner", "intermediate", "advanced"] as const;
export const courseCategories = ["billing", "coding", "exam-prep"] as const;

export const courseSchema = z.object({
  slug,
  title: z.string(),
  metaTitle: z.string().max(48),
  metaDescription: z.string().max(155),
  summary: z.string(),
  description: z.string(),
  level: z.enum(courseLevels),
  category: z.enum(courseCategories),
  hours: z.number().positive(),
  lessonCount: z.number().int().positive(),
  mockExams: z.number().int().min(0),
  priceUsd: z.number().positive(),
  pricePkr: z.number().positive(),
  /** null = lifetime access (docs/02 L-11). */
  accessMonths: z.number().int().positive().nullable(),
  outcomes: z.array(z.string()).min(4),
  requirements: z.array(z.string()).min(1),
  audience: z.array(z.string()).min(2),
  curriculum: z
    .array(
      z.object({
        title: z.string(),
        lessons: z
          .array(
            z.object({
              title: z.string(),
              minutes: z.number().int().positive(),
              preview: z.boolean().default(false),
            }),
          )
          .min(2),
      }),
    )
    .min(3),
  instructor: z.string(),
  faqs: z.array(faqSchema).min(2),
  featured: z.boolean().default(false),
});
export type Course = z.infer<typeof courseSchema>;

export const pathwaySchema = z.object({
  slug,
  title: z.string(),
  metaTitle: z.string().max(48),
  metaDescription: z.string().max(155),
  summary: z.string(),
  outcome: z.string(),
  careers: z.array(z.string()).min(2),
  steps: z
    .array(z.object({ label: z.string(), description: z.string(), courses: z.array(slug) }))
    .min(3),
  bundlePriceUsd: z.number().positive(),
  bundlePricePkr: z.number().positive(),
});
export type Pathway = z.infer<typeof pathwaySchema>;

export const instructorSchema = z.object({
  id: slug,
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  initials: z.string().max(3),
});
export type Instructor = z.infer<typeof instructorSchema>;

export const postFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().max(155),
  category: slug,
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string(),
  readingMinutes: z.number().int().positive(),
  audience: z.enum(["practices", "students", "everyone"]),
});
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export const legalFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().max(155),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
