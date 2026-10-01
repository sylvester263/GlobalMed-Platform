import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "@/lib/env";

import type { Database } from "./types";

/**
 * Anon client without cookies, for public data on cached pages (e.g. live updates). RLS
 * applies exactly as for a signed-out visitor, and the page can stay static/ISR because no
 * request cookies are read.
 */
export function createAnonClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
