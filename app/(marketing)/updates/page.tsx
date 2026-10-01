import { Megaphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, Section } from "@/components/marketing/sections";
import { UpdateCard } from "@/components/marketing/updates/update-card";
import { EmptyState } from "@/components/ui/empty-state";
import { JsonLd, newsArticleJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLiveUpdates, updateImageUrl } from "@/lib/updates/data";
import { categoryLabel, isUpdateCategory, paginate, updateCategories } from "@/lib/updates/logic";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Updates",
  description:
    "News from GlobalMed Transcriptions: AAPC CPC® and CPB® course updates, batch and enrollment news, events and announcements.",
  path: "/updates",
});

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

function href(params: { category?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const qs = query.toString();
  return `/updates${qs ? `?${qs}` : ""}`;
}

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * All live updates (2026-10-02): newest first with pinned ones on top, category chips,
 * 12 per page. Drafts, scheduled and expired updates never appear (RLS + lib/updates/logic).
 */
export default async function UpdatesPage({ searchParams }: Props) {
  const params = await searchParams;
  const category =
    params.category && isUpdateCategory(params.category) ? params.category : undefined;
  const all = await getLiveUpdates();
  const filtered = category ? all.filter((u) => u.category === category) : all;
  const { items, page, pages } = paginate(filtered, Number(params.page ?? 1));

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Updates"
        intro="Course updates, batch and enrollment news, events and announcements from GlobalMed Transcriptions."
        crumbs={[{ name: "Updates", path: "/updates" }]}
      />
      <Section tone="white" className="gap-8">
        <nav aria-label="Filter updates by category">
          <ul className="flex flex-wrap gap-2">
            {[{ id: undefined, label: "All" }, ...updateCategories].map((c) => {
              const active = c.id === category;
              return (
                <li key={c.label}>
                  <Link
                    href={href({ category: c.id })}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      chipClass,
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-primary",
                    )}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {items.length ? (
          <>
            <JsonLd
              data={items.map((u) =>
                newsArticleJsonLd({
                  title: u.title,
                  description: u.summary,
                  path: u.bodyMd ? `/updates/${u.slug}` : "/updates",
                  publishedAt: u.publishAt,
                  image: updateImageUrl(u.imagePath),
                }),
              )}
            />
            <ul className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
              {items.map((u) => (
                <li key={u.id} className="flex">
                  <div className="w-full">
                    <UpdateCard
                      update={u}
                      imageUrl={updateImageUrl(u.imagePath)}
                      headingLevel={2}
                    />
                  </div>
                </li>
              ))}
            </ul>
            {pages > 1 && (
              <nav aria-label="Pages" className="flex items-center justify-between gap-4">
                {page > 1 ? (
                  <Link
                    href={href({ category, page: page - 1 })}
                    rel="prev"
                    className={cn(chipClass, "bg-card text-primary")}
                  >
                    Newer updates
                  </Link>
                ) : (
                  <span />
                )}
                <p className="text-sm text-muted-foreground">
                  Page {page} of {pages}
                </p>
                {page < pages ? (
                  <Link
                    href={href({ category, page: page + 1 })}
                    rel="next"
                    className={cn(chipClass, "bg-card text-primary")}
                  >
                    Older updates
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        ) : (
          <EmptyState
            icon={Megaphone}
            title={category ? `No ${categoryLabel(category)} right now` : "No updates yet"}
            description="Check back soon, or contact us about the next AAPC CPC® and CPB® batch."
            action={
              <Link
                href="/contact"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Contact GlobalMed
              </Link>
            }
          />
        )}
      </Section>
    </>
  );
}
