import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

type Props = { params: Promise<{ section: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  return <SectionPlaceholder area="student" slug={section} />;
}
