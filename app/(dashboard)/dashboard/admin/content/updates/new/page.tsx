import type { Metadata } from "next";

import { UpdateEditor } from "@/components/dashboard/updates/update-editor";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New update" };

export default async function NewAdminUpdatePage() {
  await requireArea("admin", "/dashboard/admin/content/updates/new");
  return <UpdateEditor basePath="/dashboard/admin/content/updates" />;
}
