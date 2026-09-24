import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPostDate } from "@/components/marketing/post-list";
import { Prose } from "@/components/marketing/prose";
import { CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts, postCategories } from "@/lib/content/markdown";
import { articleJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title.length > 48 ? `${post.title.slice(0, 45).trimEnd()}…` : post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const category = postCategories[post.category] ?? post.category;
  const more = getPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);
  const forPractices = post.audience === "practices";

  return (
    <>
      <PageHero
        eyebrow={category}
        title={post.title}
        intro={post.description}
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name: category, path: `/blog/category/${post.category}` },
          { name: post.title, path },
        ]}
      >
        <p className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span>{post.readingMinutes} min read</span>
        </p>
      </PageHero>
      <Section tone="white">
        <article>
          <Prose markdown={post.body} />
        </article>
      </Section>
      {more.length > 0 && (
        <Section title="Keep reading">
          <ul className="grid gap-6 md:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug} className="relative flex flex-col gap-2">
                <Badge variant="neutral">{postCategories[p.category] ?? p.category}</Badge>
                <h3 className="text-xl">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="after:absolute after:inset-0 hover:text-teal-deep"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground">{p.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {forPractices ? (
        <CtaBand title="Want these fixes applied to your practice?" />
      ) : (
        <CtaBand
          title="Turn what you've learned into a career"
          href="/school/courses"
          label="Browse courses"
        />
      )}
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path,
          publishedAt: post.publishedAt,
          author: post.author,
        })}
      />
    </>
  );
}
