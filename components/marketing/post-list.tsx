import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { blogCovers } from "@/content/images";
import { postCategories, type Post } from "@/lib/content/markdown";
import { cn } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export function formatPostDate(date: string): string {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y border-y">
      {posts.map((post) => {
        const cover = blogCovers[post.slug];
        return (
          <li key={post.slug}>
            {/* With a cover: photo left (16:9), date and text right; the photo comes first on phones. */}
            <article
              className={cn(
                "relative grid gap-4 py-8 md:gap-8",
                cover
                  ? "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center"
                  : "md:grid-cols-[180px_1fr]",
              )}
            >
              {cover ? (
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  sizes="(min-width: 768px) 38vw, calc(100vw - 40px)"
                  className="aspect-video h-auto w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex flex-row gap-3 text-sm text-muted-foreground md:flex-col md:gap-1">
                  <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                  <span>{post.readingMinutes} min read</span>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {cover && (
                  <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    <span>{post.readingMinutes} min read</span>
                  </p>
                )}
                <Badge variant="neutral">{postCategories[post.category] ?? post.category}</Badge>
                <h2 className="text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 hover:text-teal-deep"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="max-w-prose text-muted-foreground">{post.description}</p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            aria-current={!active ? "page" : undefined}
            className="inline-flex h-11 items-center rounded-full border bg-card px-4 text-sm font-semibold hover:bg-mint aria-[current=page]:border-teal aria-[current=page]:bg-mint aria-[current=page]:text-teal-deep"
          >
            All articles
          </Link>
        </li>
        {Object.entries(postCategories).map(([slug, name]) => (
          <li key={slug}>
            <Link
              href={`/blog/category/${slug}`}
              aria-current={active === slug ? "page" : undefined}
              className="inline-flex h-11 items-center rounded-full border bg-card px-4 text-sm font-semibold hover:bg-mint aria-[current=page]:border-teal aria-[current=page]:bg-mint aria-[current=page]:text-teal-deep"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
