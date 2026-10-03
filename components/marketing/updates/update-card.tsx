import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { withReg } from "@/components/ui/reg";
import { categoryLabel, formatUpdateDate, type Update } from "@/lib/updates/logic";
import { cn } from "@/lib/utils";

/**
 * One update (home "Latest Updates" and /updates): category chip, date, title, short text,
 * optional 16:9 image and button. Same card style and hover as the site's other cards
 * (16px radius, lift 4px, shadow); cards in a row are equal height (button pinned to the
 * bottom). The title links to the update's own page when it has a full text.
 */
export function UpdateCard({
  update,
  imageUrl,
  headingLevel = 3,
}: {
  update: Update;
  imageUrl: string | null;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const detailHref = update.bodyMd ? `/updates/${update.slug}` : null;
  const external = update.linkUrl?.startsWith("http");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={1600}
          height={900}
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-navy">
            {categoryLabel(update.category)}
          </span>
          <time dateTime={update.publishAt} className="text-muted-foreground">
            {formatUpdateDate(update.publishAt)}
          </time>
        </div>
        <Heading className="text-xl leading-snug">
          {detailHref ? (
            <Link href={detailHref} className="hover:underline">
              {withReg(update.title)}
            </Link>
          ) : (
            withReg(update.title)
          )}
        </Heading>
        <p className="text-muted-foreground">{withReg(update.summary)}</p>
        {update.linkUrl && update.linkLabel && (
          <Link
            href={update.linkUrl}
            prefetch={false}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(buttonVariants({ variant: "secondary" }), "mt-auto self-start")}
          >
            {withReg(update.linkLabel)}
            <ArrowRight aria-hidden="true" />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </Link>
        )}
      </div>
    </article>
  );
}
