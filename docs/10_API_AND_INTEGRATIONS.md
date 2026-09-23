# 10 — API and Integrations

## 1. Route handlers (`app/api`)
| Route | Method | Auth | Purpose |
|---|---|---|---|
| /api/chat | POST (stream) | public, rate-limited | Web chatbot |
| /api/whatsapp/webhook | GET/POST | Meta signature | WhatsApp verify + inbound |
| /api/stripe/webhook | POST | Stripe signature | Payment events |
| /api/video/token | GET | enrolled student | Signed Bunny playback URL |
| /api/video/upload | POST | instructor/admin | Bunny tus upload credentials |
| /api/certificates/[id]/pdf | GET | owner/admin | Signed download |
| /api/revalidate | POST | secret header | On-demand ISR after admin edits |
| /api/cron/daily-stats | GET | Vercel cron secret | Fill daily_stats |
| /api/cron/expiry-reminders | GET | Vercel cron secret | Access-expiry emails |

## 2. Server Actions (examples)
`submitLead`, `createCheckout`, `submitManualPayment`, `approveManualPayment`, `saveProgress`, `startAttempt`, `submitAttempt`, `issueCertificate`, `revokeCertificate`, `upsertCourse`, `upsertLesson`, `upsertKbDocument`, `assignLead`, `addLeadNote`, `agentReply`.
Each: zod-validate → auth + role check → DB → `revalidatePath` → audit_log (admin actions).

## 3. Payments
**Stripe:** Checkout Session in USD; metadata `{order_id}`; webhook events `checkout.session.completed`, `charge.refunded`; idempotent handling keyed by event id.
**Manual:** show bank / JazzCash / Easypaisa details from `settings`; student uploads proof (image/PDF ≤ 5MB) to private bucket; admin approves → enrollment.
**Geo pricing:** show PKR to visitors from Pakistan (Vercel `x-vercel-ip-country`), USD elsewhere; user can switch.

## 4. Email (Resend + React Email templates)
Verify email · welcome · password reset · order receipt · manual payment received / approved / rejected · enrollment welcome · certificate issued · access expiring · lead notification (internal) · handoff alert (internal) · newsletter confirm.

## 5. Third-party accounts needed
| Service | Owner account | Notes |
|---|---|---|
| Vercel | Client (SylJo as member) | Pro plan for team + cron |
| Supabase | Client | Pro plan for backups/PITR |
| Bunny.net | Client | Stream library |
| Stripe | Client | Business verification needed |
| Resend | Client | Verify sending domain (SPF/DKIM/DMARC) |
| Meta Business / WhatsApp | Client | Business verification + number |
| LLM provider | Client | API key with billing |
| Upstash | Client | Free tier OK at start |
| Cloudflare Turnstile | Client | Free |
| Google Analytics/GTM/Search Console | Client | SylJo as admin |
| Sentry | Client or SylJo | Free/Team |
