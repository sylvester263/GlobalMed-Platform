import "server-only";

import { createAdminClient } from "@/lib/db/admin";
import type { Json, TablesInsert } from "@/lib/db/types";
import { sendEmail } from "@/lib/email/send";
import { LeadNotification } from "@/lib/email/templates/lead-notification";
import { isSupabaseConfigured } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo/metadata";
import { formsDryRun, serverEnv } from "@/lib/server-env";
import { site } from "@/lib/site";

export type NewLead = Omit<
  TablesInsert<"leads">,
  "id" | "status" | "assigned_to" | "created_at"
> & {
  details?: Json;
};

/**
 * Stores a lead with the service role (leads have no public insert policy; docs/04) and
 * emails the sales inbox. Returns false if the lead could not be stored.
 */
export async function storeLead(
  lead: NewLead,
  summary: { label: string; value: string }[],
): Promise<boolean> {
  if (formsDryRun()) return true;
  if (!isSupabaseConfigured() || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) return false;

  const { error } = await createAdminClient().from("leads").insert(lead);
  if (error) return false;

  // Notifications go to ADMIN_NOTIFY_EMAIL, or the company inbox (info@) when it isn't set.
  const notifyTo = serverEnv.ADMIN_NOTIFY_EMAIL ?? site.contact.email;
  if (notifyTo) {
    // A failed notification must not lose the lead: it is already stored.
    await sendEmail({
      to: notifyTo,
      subject:
        lead.source === "aapc_registration"
          ? `New AAPC registration: ${lead.interest ?? "course not given"}`
          : `New lead: ${lead.source}`,
      replyTo: lead.email ?? undefined,
      react: LeadNotification({
        source: lead.source,
        fields: summary,
        dashboardUrl: absoluteUrl("/dashboard/sales"),
      }),
    });
  }
  return true;
}
