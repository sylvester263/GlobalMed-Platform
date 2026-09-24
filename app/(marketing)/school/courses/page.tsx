import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CourseCard, PageHero, Section } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { getCourses, getPathways } from "@/lib/content";
import {
  categoryLabels,
  filterCourses,
  levelLabels,
  parseCatalogParams,
  priceBands,
  sortOptions,
} from "@/lib/content/catalog";
import { courseCategories, courseLevels } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Medical Billing and Coding Courses",
  description:
    "Browse online medical billing, coding and CPC exam preparation courses. Filter by level, topic, pathway and price.",
  path: "/school/courses",
});

const priceLabels: Record<(typeof priceBands)[number], string> = {
  "under-150": "Under $150",
  "150-300": "$150–$300",
  "over-300": "Over $300",
};

const sortLabels: Record<(typeof sortOptions)[number], string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  shortest: "Shortest first",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Catalog (W-5, P2-6): filters are URL params read on the server, so results are
 * shareable, indexable and work without JavaScript.
 */
export default async function CoursesPage({ searchParams }: Props) {
  const params = parseCatalogParams(await searchParams);
  const pathways = getPathways();
  const results = filterCourses(getCourses(), pathways, params);
  const filtered = Boolean(
    params.q || params.level || params.category || params.pathway || params.price,
  );

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Medical billing and coding courses"
        intro="Every course includes rewatchable video lessons, practice after each module and a verifiable certificate."
        crumbs={[
          { name: "School", path: "/school" },
          { name: "Courses", path: "/school/courses" },
        ]}
      />
      <Section className="gap-8">
        <form
          method="get"
          role="search"
          aria-label="Filter courses"
          className="grid gap-4 rounded-lg border bg-card p-5 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(4,1fr)_auto] lg:items-end"
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2 lg:col-span-1">
            Search
            <Input
              name="q"
              type="search"
              defaultValue={params.q}
              placeholder="e.g. ICD-10, CPC, denials"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Level
            <NativeSelect name="level" defaultValue={params.level ?? ""}>
              <option value="">All levels</option>
              {courseLevels.map((l) => (
                <option key={l} value={l}>
                  {levelLabels[l]}
                </option>
              ))}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Topic
            <NativeSelect name="category" defaultValue={params.category ?? ""}>
              <option value="">All topics</option>
              {courseCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Pathway
            <NativeSelect name="pathway" defaultValue={params.pathway ?? ""}>
              <option value="">Any pathway</option>
              {pathways.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Price
            <NativeSelect name="price" defaultValue={params.price ?? ""}>
              <option value="">Any price</option>
              {priceBands.map((b) => (
                <option key={b} value={b}>
                  {priceLabels[b]}
                </option>
              ))}
            </NativeSelect>
          </label>
          <button type="submit" className={cn(buttonVariants(), "lg:self-end")}>
            Apply filters
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="text-muted-foreground">
            {results.length} {results.length === 1 ? "course" : "courses"}
            {filtered && (
              <>
                {" · "}
                <Link
                  href="/school/courses"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Clear filters
                </Link>
              </>
            )}
          </p>
          <nav aria-label="Sort courses" className="flex flex-wrap gap-2 text-sm">
            {sortOptions.map((s) => {
              const qs = new URLSearchParams(
                Object.entries({ ...params, sort: s }).filter((e): e is [string, string] =>
                  Boolean(e[1]),
                ),
              );
              const active = params.sort === s;
              return (
                <Link
                  key={s}
                  href={`/school/courses?${qs.toString()}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-3",
                    active ? "border-teal bg-mint font-semibold text-teal-deep" : "hover:bg-mint",
                  )}
                >
                  {sortLabels[s]}
                </Link>
              );
            })}
          </nav>
        </div>

        {results.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((course) => (
              <li key={course.slug}>
                <CourseCard course={course} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No courses match those filters"
            description="Try a different level or topic, or clear the filters to see every course."
            action={
              <Link href="/school/courses" className={buttonVariants({ variant: "secondary" })}>
                Clear filters
              </Link>
            }
          />
        )}
      </Section>
    </>
  );
}
