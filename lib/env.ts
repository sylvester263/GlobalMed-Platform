/**
 * Public (browser-safe) settings. Validated without zod on purpose: the header and footer
 * import this through lib/site, and zod would add ~24 kB to every page (2026-10-01 perf work).
 */
function optionalUrl(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`${name} must be a valid URL, got "${value}".`);
  }
}

// Next.js inlines NEXT_PUBLIC_* only when referenced literally, so list each one.
export const publicEnv = {
  NEXT_PUBLIC_SITE_URL:
    optionalUrl("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL) ??
    "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, anonKey };
}
