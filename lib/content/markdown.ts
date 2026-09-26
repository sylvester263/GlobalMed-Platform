import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { features, type FeatureFlag } from "@/config/features";
import { applyFeatureBlocks } from "@/lib/content/feature-blocks";

import {
  legalFrontmatterSchema,
  postFrontmatterSchema,
  type PostFrontmatter,
} from "@/lib/content/schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Post = PostFrontmatter & { slug: string; body: string };
export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  body: string;
};

function readDir(dir: string): { slug: string; data: unknown; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      return { slug: file.replace(/\.md$/, ""), data, body: applyFeatureBlocks(content) };
    });
}

export const postCategories: Record<string, string> = {
  denials: "Denials",
  coding: "Coding",
  careers: "Careers",
  "practice-management": "Practice management",
};

/** Blog posts, newest first. Moves to the `posts` table in Phase 8. */
export function getPosts(): Post[] {
  return readDir("blog")
    .map(({ slug, data, body }) => ({ slug, body, ...postFrontmatterSchema.parse(data) }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Legal pages. A page whose `feature` flag is off (config/features.ts) is left out. */
export function getLegalPages(): LegalPage[] {
  return readDir("legal").flatMap(({ slug, data, body }) => {
    const { feature, ...meta } = legalFrontmatterSchema.parse(data);
    if (feature && !features[feature as FeatureFlag]) return [];
    return [{ slug, body, ...meta }];
  });
}

export function getLegalPage(slug: string): LegalPage | undefined {
  return getLegalPages().find((p) => p.slug === slug);
}
