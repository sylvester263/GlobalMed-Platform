import type { Metadata } from "next";

import { UpdateEditor } from "@/components/dashboard/updates/update-editor";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New update" };

export default async function NewSalesUpdatePage() {
  await requireArea("sales", "/dashboard/sales/updates/new");
  return <UpdateEditor basePath="/dashboard/sales/updates" />;
}
