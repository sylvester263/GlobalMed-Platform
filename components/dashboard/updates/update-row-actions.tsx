"use client";

import { Pin, PinOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { setUpdatePinned, setUpdateStatus } from "@/lib/updates/actions";

/** Publish / unpublish and pin / unpin from the list (no hard delete). */
export function UpdateRowActions({
  id,
  status,
  pinned,
}: {
  id: string;
  status: "draft" | "published";
  pinned: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (action: () => Promise<unknown>) =>
    start(async () => {
      await action();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={status === "published" ? "secondary" : "default"}
        disabled={pending}
        onClick={() =>
          run(() => setUpdateStatus(id, status === "published" ? "draft" : "published"))
        }
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run(() => setUpdatePinned(id, !pinned))}
      >
        {pinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
        {pinned ? "Unpin" : "Pin"}
      </Button>
    </div>
  );
}
