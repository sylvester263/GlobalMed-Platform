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

## 9. Monthly dependency check
On the first working day of each month (and whenever the scanner raises a high or critical alert):
1. Run `npm audit --omit=dev` and `npm audit`, and note every high or critical alert.
2. For each one, run `npm ls <pkg>` to find out whether it is direct or transitive, production or dev, and which package pulls it in.
3. Fix it with our own controlled update:
   - a direct dependency: `npm install <pkg>@<patched>`;
   - a transitive one: `npm update <pkg>`;
   - if the lockfile still resolves the vulnerable version, add an `overrides` entry.
   Don't use `npm audit fix --force`: it can downgrade packages across major versions.
4. Run lint, typecheck, `npm test`, `npm run test:e2e` and `next build`. Commit package.json and package-lock.json together (`fix(deps): …`), then deploy.
5. When an alert has no patched version, record it in pm/DECISIONS.md with the exposure and the mitigation, and re-check it weekly.
