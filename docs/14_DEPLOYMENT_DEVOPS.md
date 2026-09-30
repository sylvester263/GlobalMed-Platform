# 14 — Deployment and DevOps

## 1. Repos & branches
GitHub repo (client-owned, SylJo Tech as maintainer). `main` = production, `develop` = staging, feature branches `feat/*`, PRs required, squash merge.

## 2. CI (GitHub Actions)
On PR: install → typecheck → lint → unit tests → build → Playwright smoke (CI) → Lighthouse CI.
On merge to `main`: Supabase migrations applied via `supabase db push` (production project) → the hosting (Hostinger) pulls `main`, builds and restarts the app (ADR-032). Check the deployed commit at `/api/health`.

## 3. Environments
Local (Supabase CLI) → Staging (staging subdomain on the hosting + Supabase staging) → Production. Separate keys per environment; Stripe test mode on staging.

## 4. Cron (hosting panel cron jobs, calling the routes with the cron secret)
- 02:00 UTC daily-stats
- 09:00 PKT expiry reminders
- every 15 min: batch session reminders

## 5. Monitoring
Sentry (errors + performance), Supabase logs, uptime check (Better Stack or UptimeRobot) on `/` and `/api/health`, alert emails to SylJo + client admin.

## 6. Backups & recovery
Supabase daily backups + PITR (Pro). Monthly restore test into staging. Bunny videos retained in library; keep original uploads in client's cloud drive.

## 7. DNS & email
Domain stays with client registrar. A/CNAME records point at the hosting; Resend DKIM/SPF; DMARC `p=quarantine` after 2 weeks monitoring.

## 8. Handover
Admin user guide (PDF + short Loom videos), credentials transferred to client password manager, architecture docs (this pack), 30-day post-launch support window *(confirm in contract)*.
