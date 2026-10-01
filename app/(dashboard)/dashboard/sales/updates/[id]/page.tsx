import type { Metadata } from "next";

import { UpdateEditor } from "@/components/dashboard/updates/update-editor";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Edit update" };

type Props = { params: Promise<{ id: string }> };

export default async function EditSalesUpdatePage({ params }: Props) {
  const { id } = await params;
  await requireArea("sales", `/dashboard/sales/updates/${id}`);
  return <UpdateEditor id={id} basePath="/dashboard/sales/updates" />;
}
