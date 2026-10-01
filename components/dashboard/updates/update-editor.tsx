import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { UpdateForm } from "@/components/dashboard/updates/update-form";
import { createClient } from "@/lib/db/server";
import { toUpdate, updateImageUrl } from "@/lib/updates/data";

/** New or edit page body for an update (admin and sales routes share it). */
export async function UpdateEditor({ id, basePath }: { id?: string; basePath: string }) {
  let update;
  if (id) {
    if (!z.uuid().safeParse(id).success) notFound();
    const supabase = await createClient();
    const { data } = await supabase.from("updates").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    update = toUpdate(data);
  }
  return (
    <div className="flex flex-col gap-6">
      <Link
        href={basePath}
        className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> All updates
      </Link>
      <h1 className="text-2xl">{update ? "Edit update" : "New update"}</h1>
      <UpdateForm
        update={update}
        imageUrl={updateImageUrl(update?.imagePath ?? null)}
        basePath={basePath}
      />
    </div>
  );
}
