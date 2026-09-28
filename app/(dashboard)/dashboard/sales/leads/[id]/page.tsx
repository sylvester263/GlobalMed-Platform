import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { leadDetail, leadSourceLabels } from "@/lib/leads/labels";

export const metadata: Metadata = { title: "Lead" };

type Props = { params: Promise<{ id: string }> };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/**
 * One lead with everything the form sent (sales and admin). Readable under the "staff leads"
 * RLS policy. AAPC registrations show the address (client, 2026-09-28); registrations sent
 * before then show the city they gave instead.
 */
export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  await requireArea("sales", `/dashboard/sales/leads/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) notFound();

  const d = (key: string) => leadDetail(lead.details, key);
  const consentAt = d("consentAt");
  const rows: [string, string | null][] = [
    ["Received", dateFormat.format(new Date(lead.created_at))],
    ["Source", leadSourceLabels[lead.source] ?? lead.source],
    ["Course / interest", lead.interest],
    ["Email", lead.email],
    [lead.source === "aapc_registration" ? "WhatsApp" : "Phone", lead.phone],
    ["Address", lead.address],
    // Older AAPC registrations (before Address replaced City).
    ["City", d("city")],
    ["Current background", d("background")],
    ["Preferred contact time", d("contactTime")],
    ["Practice / organisation", lead.practice_name],
    ["Specialty", lead.specialty],
    ["Monthly claims", d("claimVolume")],
    ["Billing today", d("billingSetup")],
    ["Role", d("role")],
    ["Best time to call", d("bestTime")],
    ["Consent", consentAt ? `Agreed on ${dateFormat.format(new Date(consentAt))}` : null],
    ["Message", lead.message],
  ];

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard/sales/leads"
        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Leads pipeline
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <DashboardPageHeader title={lead.name ?? "Lead"} />
        <Badge variant={lead.status === "new" ? "secondary" : "neutral"} className="capitalize">
          {lead.status}
        </Badge>
      </div>
      <dl className="grid max-w-3xl gap-x-8 rounded-lg border bg-card p-6 text-sm sm:grid-cols-[12rem_1fr]">
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]))
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="pt-3 font-semibold sm:py-3">{label}</dt>
              <dd className="border-b pb-3 break-words whitespace-pre-line text-muted-foreground sm:py-3">
                {label === "Email" ? (
                  <a href={`mailto:${value}`} className="hover:underline">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
