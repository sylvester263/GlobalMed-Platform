/**
 * Seeds / rebuilds the chatbot knowledge base from the LIVE site (docs/09 §3):
 * the pinned site-data document plus the home, About, AAPC, course, services, FAQ, contact
 * and privacy pages, chunked (~800 tokens, 100 overlap) and embedded.
 *
 *   KB_SYNC_SECRET=… npm run kb:sync                       # against NEXT_PUBLIC_SITE_URL
 *   KB_SYNC_SECRET=… npm run kb:sync -- https://example.com
 *
 * Runs on the server (POST /api/admin/kb-sync), which needs Supabase, the embedding key
 * and the same KB_SYNC_SECRET.
 */
const base = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL;
const secret = process.env.KB_SYNC_SECRET;
if (!base || !secret) {
  process.stderr.write("Set KB_SYNC_SECRET and pass the site URL (or NEXT_PUBLIC_SITE_URL).\n");
  process.exit(1);
}

const res = await fetch(new URL("/api/admin/kb-sync", base), {
  method: "POST",
  headers: { "x-kb-sync-secret": secret },
});
const body = await res.json().catch(() => ({}));
if (!res.ok) {
  process.stderr.write(`Sync failed (${res.status}): ${JSON.stringify(body)}\n`);
  process.exit(1);
}
for (const row of body.report ?? []) {
  process.stdout.write(
    `${row.error ? "✗" : "✓"} ${row.title}: ${row.chunks} chunks${row.error ? ` — ${row.error}` : ""}\n`,
  );
}
