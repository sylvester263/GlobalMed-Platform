import { Megaphone, Pin, Plus } from "lucide-react";
import Link from "next/link";

import { UpdateRowActions } from "@/components/dashboard/updates/update-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";
import { toUpdate } from "@/lib/updates/data";
import {
  categoryLabel,
  formatUpdateDate,
  orderUpdates,
  updateState,
  type UpdateState,
} from "@/lib/updates/logic";

const stateBadge: Record<
  UpdateState,
  { label: string; variant: "neutral" | "warning" | "success" | "secondary" }
> = {
  draft: { label: "Draft", variant: "neutral" },
  scheduled: { label: "Scheduled", variant: "warning" },
  live: { label: "Live", variant: "success" },
  expired: { label: "Expired", variant: "secondary" },
};

/**
 * Every update with its state (draft / scheduled / live / expired). Cards, not a table, so it
 * works on a phone. Staff read all updates under the "staff manage updates" RLS policy.
 */
export async function UpdatesManager({ basePath }: { basePath: string }) {
  let updates: ReturnType<typeof toUpdate>[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.from("updates").select("*").limit(500);
    updates = orderUpdates((data ?? []).map(toUpdate));
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href={`${basePath}/new`} className={buttonVariants({ className: "self-start" })}>
        <Plus aria-hidden="true" /> New update
      </Link>
      {!updates.length ? (
        <EmptyState
          icon={Megaphone}
          title="No updates yet"
          description="Post course news, batch dates, events and announcements. Published updates appear on the home page and /updates."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {updates.map((u) => {
            const state = stateBadge[updateState(u)];
            return (
              <li key={u.id} className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant={state.variant}>{state.label}</Badge>
                  {u.pinned && (
                    <Badge variant="outline">
                      <Pin aria-hidden="true" /> Pinned
                    </Badge>
                  )}
                  <span className="text-muted-foreground">
                    {categoryLabel(u.category)} · {formatUpdateDate(u.publishAt)}
                    {u.expiresAt && ` → ${formatUpdateDate(u.expiresAt)}`}
                  </span>
                </div>
                <Link
                  href={`${basePath}/${u.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {u.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground">{u.summary}</p>
                <UpdateRowActions id={u.id} status={u.status} pinned={u.pinned} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
