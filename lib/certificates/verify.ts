import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/lib/db/types";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/env";

/** Certificate codes are 12 hex characters (0001_init.sql default). Case-insensitive input. */
export const certificateCodeSchema = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s-]/g, "").toUpperCase())
  .pipe(z.string().regex(/^[A-F0-9]{12}$/));

export type VerifyResult =
  | { kind: "valid" | "revoked"; name: string; course: string; issuedAt: string }
  | { kind: "not-found" }
  | { kind: "invalid-code" }
  | { kind: "unavailable" };

/**
 * Public certificate check via the `verify_certificate` RPC — the only anonymous path to
 * certificate data (docs/04 RLS plan). Uses the anon key without cookies.
 */
export async function verifyCertificate(rawCode: string): Promise<VerifyResult> {
  const parsed = certificateCodeSchema.safeParse(rawCode);
  if (!parsed.success) return { kind: "invalid-code" };
  if (!isSupabaseConfigured()) return { kind: "unavailable" };

  const { url, anonKey } = getSupabasePublicConfig();
  const supabase = createClient<Database>(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("verify_certificate", { p_code: parsed.data });
  if (error) return { kind: "unavailable" };

  const row = data?.[0];
  if (!row) return { kind: "not-found" };
  return {
    kind: row.status === "valid" ? "valid" : "revoked",
    name: row.name_on_cert,
    course: row.course_title,
    issuedAt: row.issued_at,
  };
}
