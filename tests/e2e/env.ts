import { loadEnvConfig } from "@next/env";

// Read .env.local the way the app does, so tests that submit forms never write leads into the
// client's real Supabase project.
loadEnvConfig(process.cwd());

export const databaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);
