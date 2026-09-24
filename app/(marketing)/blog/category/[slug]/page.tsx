import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryNav, PostList } from "@/components/marketing/post-list";
import { PageHero, Section } from "@/components/marketing/sections";
import { getPosts, postCategories } from "@/lib/content/markdown";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(postCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = postCategories[slug];
  if (!name) return {};
  return pageMetadata({
    title: `${name} articles`,
    description: `GlobalMed articles about ${name.toLowerCase()} for US practices and billing and coding students.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = postCategories[slug];
  if (!name) notFound();
  const posts = getPosts().filter((p) => p.category === slug);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={`${name} articles`}
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name, path: `/blog/category/${slug}` },
        ]}
      />
      <Section className="gap-8">
        <CategoryNav active={slug} />
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-muted-foreground">No articles in this category yet.</p>
        )}
      </Section>
    </>
  );
}
