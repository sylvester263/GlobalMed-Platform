# Session Log

Newest entry at the bottom. One entry per Claude Code session.

---
### Session 000 — Project pack created
- **Date:** 2026-09-24
- **Done:** Project documentation pack created (brief, PRD, architecture, schema, sitemap, design brief, dashboards, LMS, chatbot, integrations, security, SEO, QA, DevOps, PM files, tooling guide).
- **Files touched:** all
- **Next:** Install tooling (tools/TOOLING_SETUP.md), collect client inputs, run MASTER_PROMPT kickoff → Phase 0.
- **Blockers:** Supabase/Vercel accounts, domain access, brand assets (see CLIENT_INPUTS_NEEDED.md).

---
### Session 001 — Phase 0 foundation
- **Date:** 2026-09-24
- **Done:**
  - Restored the pack's folder layout from globalmed-website.zip (the loose files were flattened copies, verified byte-identical before removal). Zip kept as backup.
  - P0-1 Next.js 15.5 + React 19 + TS strict (plus noUncheckedIndexedAccess) + Tailwind v4 + shadcn/ui (base-nova, Base UI primitives).
  - P0-2 ESLint (no-any, no-unused-vars, no-console as errors), Prettier + tailwind plugin, Husky pre-commit (lint-staged) + commit-msg (commitlint conventional), Vitest.
  - P0-3 Folder structure per docs/03 §5; placeholder home in app/(marketing) with the two W-1 paths; /api/health for uptime checks.
  - P0-5 (partial) Provisional lib/db/types.ts generated from 0001_init.sql, in supabase gen types format.
  - P0-6 lib/db/{client,server,admin,middleware}.ts + middleware.ts session refresh (no-op until Supabase env is set); lib/env.ts validates public env with zod.
  - P0-7 .env.local created from .env.example (all secrets empty); added Sentry + tooling vars to .env.example.
  - P0-8 GitHub Actions CI (typecheck, lint, format, test, build, npm audit) + Dependabot. `supabase init` done (config.toml).
  - P0-10 Sentry v11 wired with every data-collection category disabled (ADR-008).
  - Security headers (HSTS, nosniff, frame DENY, referrer, permissions) in next.config.ts. npm audit: 0 vulnerabilities (ADR-007).
- **Files touched:** package.json, package-lock.json, tsconfig.json, next.config.ts, eslint.config.mjs, .prettierrc.json, .prettierignore, .lintstagedrc.json, commitlint.config.mjs, vitest.config.mts, .husky/*, .github/*, components.json, components/ui/button.tsx, lib/{env,utils}.ts, lib/db/*, lib/monitoring/sentry-options.ts, middleware.ts, instrumentation*.ts, sentry.*.config.ts, app/layout.tsx, app/globals.css, app/(marketing)/page.tsx, app/api/health/route.ts, tests/unit/health.test.ts, supabase/config.toml, .env.example, pm/*
- **Next:** Phase 1 — P1-1 run ui-ux-pro-max design system generation, then P1-2 MASTER.md. Return to P0-4/P0-5/P0-9 as soon as Supabase + Vercel invites arrive.
- **Blockers:** Supabase org invite (P0-4, P0-5), Vercel team invite (P0-9), Sentry DSN, GitHub repo (client-owned per docs/14) for pushing and CI.
- **Notes for later phases (from reviewing 0001_init.sql):**
  - `lesson_progress` policy is `for all` for the owning student, so a student could write `completed_at` directly. Phase 4/6 must derive completion server-side (or restrict the policy to position updates) before certificates depend on it.
  - `lesson_answers` is readable by anyone (`using (true)`), including anon. Tighten to enrolled users when Q&A ships (P4-6).
  - No storage buckets or `updated_at` triggers yet — add in the phase that needs them.
  - Local Postgres 16 is installed but password-protected and has no `auth` schema, so the migration has not been executed yet.

<!-- Template
---
### Session NNN — <title>
- **Date:**
- **Done:**
- **Files touched:**
- **Next:**
- **Blockers:**
-->
