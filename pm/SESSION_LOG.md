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

---
### Session 002 — Phase 1 design system
- **Date:** 2026-09-24
- **Done:**
  - P1-1 ui-ux-pro-max run (4 queries), raw output in design-system/ui-ux-pro-max-output.md.
  - P1-2 design-system/MASTER.md locked (v1.0): reconciliation log vs docs/06, tokens, computed WCAG contrast table, type scale, layout, claim-line spec, component rules + inventory, motion tokens, anti-patterns, a11y checklist. Two docs/06 pairings failed contrast and were fixed (teal text on mint → teal-deep; gold text → gold-ink); input border darkened to ≥ 3:1.
  - P1-3 Tokens in app/globals.css (Tailwind v4 @theme); fonts via next/font: Source Serif 4, Public Sans, JetBrains Mono. Light-only launch: `dark:` pinned to an unused .dark class so OS dark mode can't half-theme components.
  - P1-4 Base components: shadcn (Base UI) restyled to MASTER. Competing 50%-opacity focus rings and `outline-none` removed so one visible focus style applies everywhere; tabs contrast fixed. New: FormField, ChoiceField, PhiNotice, ClaimProgress, StatBlock, EmptyState, DataTable (TanStack v9), chart wrappers (Recharts + sr-only data tables), PricingBlock, Testimonial, QuizQuestion (DM-4), CertificatePreview, VideoPlayerShell.
  - P1-5 /styleguide with every component and state. P1-6 four key screens under /styleguide/screens/{home,course,student,admin}; screenshots at 360/768/1280 in design-system/screens/.
  - P1-8 lib/motion.ts + components/motion: ClaimLine, CountUp, Reveal, StaggerGroup, PathwayLine, SealStamp, PageTransition, LottiePlayer, MotionProvider. P1-9 Motion lab with reduced-motion preview toggle.
  - P1-10 storyboards for MG-1, MG-2, MG-3, MG-9, DM-6 in design-system/motion-storyboards/ (approval pending).
  - Playwright + axe audit (tests/e2e/visual-audit.spec.ts): 6 pages × 3 widths, no horizontal scroll, 0 serious/critical axe issues. 24/24 pass.
  - Performance: Sentry browser SDK now lazy and DSN-gated (ADR-013): shared JS 168 kB → 104 kB; home 113 kB.
- **Bugs found and fixed in review:** Motion `whileInView` shipped opacity:0 in server HTML (content invisible without JS) → CSS scroll-driven reveal (ADR-010); claim line drew dashed because `pathLength` breaks on stretched SVGs → `scaleX`; sr-only chart tables caused 360px overflow; Base UI toggles had no accessible name → ChoiceField; alert text at 90% opacity failed contrast; Recharts focusable SVG inside aria-hidden; certificate clipped at 360px.
- **Files touched:** design-system/*, app/globals.css, app/layout.tsx, app/styleguide/**, components/{ui,motion,dashboard,lms,marketing}/**, lib/motion.ts, instrumentation-client.ts, public/motion/posters/hero-claim-form.svg, playwright.config.ts, tests/e2e/visual-audit.spec.ts, package.json, pm/*
- **Next:** Send /styleguide + key screens + storyboards to the client (P1-7, P1-10). Start Phase 2: P2-1 header/mega menu + footer, then P2-2 home (promote screens/home).
- **Blockers:** Client design sign-off and storyboard approval; logo SVG (screens use a placeholder "GM" wordmark); Supabase/Vercel/GitHub access from Phase 0.
- **Notes:** 21st.dev Magic MCP isn't connected here, so components were built from shadcn/ui directly (ADR-012). Playwright's Chromium download times out on this network; tests use installed Chrome locally (CI installs Chromium). On Windows, never leave a shell's cwd inside .next: it locks the folder and `next build` hangs silently.

<!-- Template
---
### Session NNN — <title>
- **Date:**
- **Done:**
- **Files touched:**
- **Next:**
- **Blockers:**
-->
