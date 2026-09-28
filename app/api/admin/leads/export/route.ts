import { NextResponse, type NextRequest } from "next/server";

import { authorize } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { leadsToCsv } from "@/lib/leads/csv";
import { leadSourceLabels } from "@/lib/leads/labels";

export const dynamic = "force-dynamic";

/**
 * Admin export of leads as CSV, optionally for one source (?source=aapc_registration).
 * Admins only (role from `profiles`, MFA required, CLAUDE.md §4). Reads with the admin's own
 * session under the "staff leads" RLS policy, never the service role.
 */
export async function GET(request: NextRequest) {
  const session = await authorize(["admin"]);
  if (!session) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const source = request.nextUrl.searchParams.get("source");
  const activeSource = source && leadSourceLabels[source] ? source : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(
      "created_at, source, status, name, email, phone, interest, address, practice_name, specialty, message, details",
    )
    .order("created_at", { ascending: false })
    .limit(10000);
  if (activeSource) query = query.eq("source", activeSource);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Export failed" }, { status: 500 });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(leadsToCsv(data ?? []), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="globalmed-leads-${activeSource ?? "all"}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
