import type { Metadata } from "next";

import { CategoryNav, PostList } from "@/components/marketing/post-list";
import { PageHero, Section } from "@/components/marketing/sections";
import { getPosts } from "@/lib/content/markdown";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Medical Billing and Coding Blog",
  description:
    "Practical articles on claim denials, coding, practice revenue and starting a career in medical billing and coding.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Billing and coding, explained plainly"
        intro="Practical articles for practice owners, billing teams and students."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      />
      <Section className="gap-8">
        <CategoryNav />
        <PostList posts={getPosts()} />
      </Section>
    </>
  );
}
