import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/marketing/sections";
import { UpdateCard } from "@/components/marketing/updates/update-card";
import { getLiveUpdates, updateImageUrl } from "@/lib/updates/data";
import { HOME_UPDATES } from "@/lib/updates/logic";

/**
 * Home "Latest Updates" (2026-10-02): the 3 latest live updates, a pinned one first, and a
 * link to /updates. Renders nothing when there are none (no empty box).
 */
export async function LatestUpdates() {
  const updates = (await getLiveUpdates()).slice(0, HOME_UPDATES);
  if (!updates.length) return null;
  return (
    <Section id="latest-updates" tone="white" title="Latest Updates" className="gap-8">
      <ul className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {updates.map((update) => (
          <li key={update.id} className="flex">
            <div className="w-full">
              <UpdateCard update={update} imageUrl={updateImageUrl(update.imagePath)} />
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/updates"
        className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-primary underline underline-offset-4"
      >
        View all updates <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </Section>
  );
}
