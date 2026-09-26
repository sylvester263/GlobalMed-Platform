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

---
### Session 003 — Phase 2 public website
- **Date:** 2026-09-24
- **Done:**
  - P2-1 Header with disclosure-pattern mega menu (ADR-016), lazily loaded mobile sheet, footer with newsletter, legal nav and SylJo credit; skip link; floating WhatsApp button; Organization JSON-LD; MG-16 page transition; MG-17 menu stagger.
  - Content layer (ADR-014): typed, zod-validated content in content/*.ts (6 services, 6 specialties, 6 courses, 2 pathways, FAQs, company) and Markdown for 4 blog posts and 5 legal drafts. 55 [CLIENT TO CONFIRM] markers; stats labelled illustrative; no fabricated reviews.
  - Pages: home, services (+6), specialties (+6), free billing audit (+ thank-you), school, catalog with URL filters, course detail (+6), pathways (+2), exam prep, batches, corporate training, AAPC (flag-gated 404), blog (+ categories, posts), about, team, careers, contact, FAQ, guides, legal (+5), verify (+ result), newsletter confirm, 404, login/signup placeholders.
  - Forms: audit (2-step, MG-14) and contact → leads via Server Actions (zod → rate limit → Turnstile → service-role insert → sales email). Newsletter double opt-in with signed 48h tokens; confirmation happens on a button press so link scanners can't subscribe people. Migration 0002 adds leads.details.
  - SEO (P2-12): per-page metadata + canonical + OG, default OG image, sitemap, robots, llms.txt, JSON-LD (Organization, Breadcrumb, Service, Course, FAQPage, Article).
  - Motion: MG-1, MG-3 (GSAP, desktop only, lazy), MG-4, MG-6, MG-7, MG-8, MG-9, MG-11, MG-14, MG-15, MG-16, MG-17.
  - Tests: 30 unit tests (catalog, content integrity, tokens, schemas); 145 Playwright checks — 32 pages × 360/768/1280 with no horizontal scroll and 0 serious/critical axe issues, plus form, catalog, verify, navigation and SEO flows.
  - Performance work (P2-21): dotLottie runtime no longer loads without an asset (−165 kB), newsletter form without RHF/zod, CSS-only motion primitives (ADR-015), disclosure nav, lazy mobile nav, inline CSS, GSAP skipped on mobile, mono font not preloaded. Home first-load JS 196 → 143 kB. Lighthouse mobile (local, noisy machine): Accessibility/Best Practices/SEO 100 everywhere; Performance blog 90, services 86, service 80, audit 78, home 75–78, course 73–74; CLS 0 (services 0.013).
- **Bugs found and fixed in QA:** the audit form's Continue click submitted the form (React reused the button, which became type="submit" mid-event) and flooded step 2 with errors; breadcrumb list semantics broken by wrapper spans (axe, every page); newsletter GET confirmation vulnerable to link pre-fetching; floating WhatsApp overlapping the mobile sticky enroll bar.
- **Files touched:** app/(marketing)/**, app/(auth)/**, app/{layout,not-found,sitemap,robots,opengraph-image}.tsx, app/llms.txt, app/globals.css, components/{marketing,motion,lms,ui}/**, content/**, lib/{content,leads,newsletter,email,security,certificates,seo,validation,hooks}/**, lib/{site,server-env,analytics,motion-assets}.ts, supabase/migrations/0002_leads_details.sql, tests/**, next.config.ts, vitest.config.mts, .env.example, package.json, design-system/MASTER.md, pm/*
- **Next:** Phase 3 (auth, roles, dashboard shells). In parallel: client content review (P2-14), motion assets (P2-15), and Lighthouse on the Vercel preview once P0-9 is unblocked.
- **Blockers:** Supabase/Vercel/GitHub access (Phase 0); WhatsApp number; Turnstile, Upstash and Resend accounts; motion assets; practice logos and testimonials; counsel review of legal pages.
- **Notes:** .env.local was regenerated from .env.example this session (all values were empty placeholders). `next start` runs in production mode, so forms correctly refuse submissions locally without Turnstile keys; use `npm run dev` with FORMS_DRY_RUN=true to click through the success path.

---
### Session 004 — Phase 3 auth, roles and dashboard shells
- **Date:** 2026-09-24
- **Done:**
  - P3-1 Auth: sign-up (email confirmation), log in, password reset + update, verify-email page, sign-out. Server actions with zod, per-IP rate limits, no account enumeration (reset and sign-up answer the same either way), friendly Supabase error mapping (weak/breached password, unconfirmed email). Forms post without JavaScript (useActionState). `/auth/confirm` (token-hash email links) and `/auth/callback` (OAuth/PKCE).
  - P3-2 Google sign-in via server action (works without JS).
  - P3-3 lib/auth/session.ts: `getSessionUser` (verified getUser + profiles role, per-request cache), `requireUser`, `requireArea`, `authorize` for actions. `safeNext` blocks open redirects. Middleware now runs only on session routes and gates /dashboard and /learn (fails closed without Supabase); marketing pages no longer pay a Supabase round-trip.
  - P3-4/P3-5 DashboardShell (collapsible sidebar, top bar, notifications menu with mark-all-read, account menu with dashboard switcher, mobile sheet) and four area shells at /dashboard/{student,instructor,admin,sales} (ADR-018). Overviews query real tables through RLS: student enrollments, instructor courses, admin counts (enrollments, payments to approve, new leads, chat handoffs), sales list of the latest website leads. Every sidebar section resolves (placeholder naming the phase that builds it).
  - A-4 account settings for all roles: profile incl. name on certificates, password change, two-step verification.
  - P3-6 Admin MFA: TOTP enrolment (QR + manual key), /mfa challenge; admins need aal2 for every dashboard area and for admin actions.
  - P3-7 DM-1 sidebar layout animation + route fade, DM-9 overlays on motion tokens, DM-10 skeleton loaders.
  - docs/16_AUTH_SETUP.md: Supabase URL config, email templates, Google provider, MFA, password rules, first-admin SQL, post-set-up checks.
  - Tests: 63 unit (safeNext against open-redirect payloads, role/area matrix, protected paths, schemas); 173 Playwright checks including fail-closed dashboard redirects, auth page states, open-redirect rejection, and the real shell on a sample-data screen.
- **Bugs found and fixed:** dashboards were being prerendered as static redirects when built without Supabase env (now `connection()` forces per-request rendering); zod v4 rejected emails with surrounding whitespace (autofill) on every form, including Phase 2 lead forms, because the format check ran before trim.
- **Files touched:** app/(auth)/**, app/(dashboard)/**, app/auth/**, components/{auth,dashboard}/**, components/motion/{motion-features,motion-provider}.tsx, components/ui/{dialog,sheet,dropdown-menu}.tsx, lib/auth/**, lib/{notifications,notifications-actions}.ts, lib/validation/{auth,leads}.ts, lib/db/middleware.ts, middleware.ts, lib/security/rate-limit.ts, app/globals.css, app/styleguide/screens/dashboard-shell, docs/16_AUTH_SETUP.md, tests/**, pm/*
- **Next:** Phase 4 (LMS core): course builder, Bunny upload + signed playback, player with resume/rewatch, progress. Real sign-up/login/MFA verification as soon as Supabase exists.
- **Blockers:** Supabase projects (P0-4) for any live auth test; Google OAuth client; Bunny account for Phase 4 video.
- **Notes:** Everything auth-related is type-checked against supabase-js 2.117 but has not run against a real Supabase project yet — the first staging session must walk through docs/16 §7.

---
### Session 005 — Phase 4 LMS core
- **Date:** 2026-09-24
- **Done:**
  - Migration 0003_lms:
    - lesson video state, required flag and PDF path
    - notes; Q&A policies tightened (answers are no longer public)
    - batches with sessions, members and announcements
    - private `lesson-files` bucket
    - `lesson_progress` is read-only to students
    - course-governance trigger
    - All new tables ship with RLS.
  - P4-1 Course builder (/dashboard/instructor/courses):
    - Course list and draft creation.
    - Course details form, plus an admin-only publishing/pricing form (audited).
    - Curriculum editor with dnd-kit drag, keyboard drag and up/down buttons.
    - Lesson editor: type, preview, required, text/brief, live link, move to another module, delete.
    - Admin /dashboard/admin/courses.
  - P4-2 tus upload straight to Bunny (up to 5 GB, resumable), with credentials from /api/video/upload. The webhook re-fetches the video status from Bunny; there's also a manual "Check status".
  - P4-3/P4-4 Signed 2 h HLS playback via /api/video/token. hls.js player with resume, speed, captions, a drifting watermark and token refresh.
  - P4-5 Progress:
    - Only the server writes it (ADR-020), with clamped positions; video completes at 90%.
    - Student "My courses" and "Continue learning" on the overview, with DM-2.
  - P4-6:
    - Resources and PDFs: signed uploads and 10-min downloads.
    - Notes with autosave.
    - Lesson Q&A, plus an instructor Q&A inbox (unanswered first).
    - Instructor Students page (progress, last activity).
    - Instructor overview shows real counts.
  - P4-7 Drip rules in the lesson editor (after lesson / days after enroll / date), evaluated server-side.
  - P4-8 Live batches (instructor/admin): create batch, schedule sessions (stored UTC, shown in the viewer's zone), add enrolled students, announcements that send notifications. Student "Live classes" page.
  - P4-9 DM-2 ClaimProgress in the outline and cards; DM-3 lesson-complete stamp and next-lesson slide.
  - docs/17_LMS_VIDEO_SETUP.md: Bunny library, token auth, webhook, and staging verification steps.
  - Tests:
    - 92 unit tests (LMS rules, Bunny signing, course/batch validation).
    - 177 Playwright checks, including a new /styleguide/screens/lms screen at 360/768/1280 with axe.
- **Bugs found and fixed:**
  - Locked lessons in the player outline failed contrast, because `opacity-80` sat on muted text. Found by the new axe screen.
  - Lesson titles in the curriculum editor were truncated to a few characters at 360px.
  - The lesson editor shipped the Supabase browser client up front (244 → 151 kB first load); it now loads only when a file is chosen.
- **Files touched:** supabase/migrations/0003_lms.sql, scripts/gen-provisional-types.mjs, lib/db/types.ts, lib/lms/**, lib/video/**, lib/validation/{course,batch}.ts, lib/auth/roles.ts, app/api/{video,progress}/**, app/learn/**, app/(dashboard)/dashboard/{instructor,admin,student}/**, components/lms/**, components/dashboard/shell.tsx, app/globals.css, app/styleguide/screens/lms, middleware.ts, tests/**, docs/17_LMS_VIDEO_SETUP.md, .env.example, package.json, pm/*
- **Next:** Phase 5 (payments and enrollment: Stripe Checkout + webhook → enrollment, manual bank transfer with admin approval, USD/PKR pricing, coupons).
- **Blockers:**
  - Supabase (P0-4) to apply 0001–0003 and test for real.
  - Bunny account/library to verify the tus and CDN token formats (docs/17 §4).
- **Notes:**
  - Nothing in Phase 4 has run against a real Supabase or Bunny yet. The first staging session must walk through docs/17 §4.
  - Courses must share their slug with content/courses.ts until Phase 8 (ADR-022).

---
### Session 005b — Home hero motion fix
- **Date:** 2026-09-24
- **Done:** The home hero motion graphic (MG-2) was only a static poster, because it waited for a Lottie file (P2-15) that hasn't been delivered. It's now built in code as an animated SVG with CSS (ADR-015), as docs/15 allows. It runs an 8s loop: codes appear, Denied with a red flag, then Paid with a green check, then the claim line fills with the gold end tick and check stamp. It animates only transform and opacity. Reduced-motion visitors see the final Paid frame, and the loop pauses off-screen. This also removes the dev warning about the poster image being the LCP. A delivered Lottie still replaces it automatically once `lib/motion-assets.ts` points to the file.
- **Files touched:** components/marketing/hero-claim-form.tsx, components/motion/pause-offscreen.tsx, app/(marketing)/page.tsx, app/globals.css
- **Next:** Phase 5.


---
### Session 005c — Logo, logo palette and CPC®/CPB® home page
- **Date:** 2026-09-24
- **Done:**
  - Logo: the supplied logo is now `public/logo.png`, byte-identical to the original. It's in the header (36/44px), footer (48px, on a white plate), auth pages, dashboard sidebar (cropped to the icon when collapsed), mobile sheets, course player bar, certificate, OG image and styleguide frames. Favicon cropped from the icon.
  - Palette: logo colours via tokens only (ADR-023). Contrast fixes: success-ink/warning-ink for text, sky-on-ink buttons on dark bands, secondary buttons mid-blue outline. Certificate has a navy border and a sky seal ring.
  - Home rewritten around CPC®/CPB® training as AAPC's strategic partner, in 10 sections. The claim-line path now takes any number of steps. New title, description and EducationalOrganization JSON-LD. The FAQPage JSON-LD is kept.
  - Added CPC® and CPB® courses to content/school.ts (placeholders marked). Added "CPC & CPB Training" as the first School menu item. Added the AAPC trademark line to the footer.
  - Verified: tsc, eslint, 92 unit tests, build, public-site + auth e2e (27 tests), 360px (no horizontal scroll) and 1280px screenshots.
- **Files touched:** see the commit.
- **Next:** Phase 5. Client to confirm the new [CLIENT TO CONFIRM] items and AAPC permission.
- **Blockers:** AAPC written permission for the partnership claim and logo.


---
### Session 005d — Client review changes (Education rename, slider, AAPC page, credentials, About, footer)
- **Date:** 2026-09-25 (built; not logged at the time) · verified 2026-09-26
- **Done:**
  - Home: a 3-slide hero slider with the claim-line progress. It autoplays every 6s and pauses on hover or focus, with a pause button, arrows, dots and swipe. Reduced motion: no autoplay and a fade only. Fixed height, so no layout shift. Photos show labelled placeholder slots.
  - "School" renamed to "Education" (ADR-024). `/education/*` rewrites to the existing pages; `/school/*` still works. Nav order is About Us · Education · the rest. "AAPC Certification in Pakistan" is first in the Education menu.
  - New page /education/aapc-certification-pakistan: hero, instructors band, CPC®/CPB® panels, exam details marked [CLIENT TO CONFIRM from AAPC], USD 1,050 pricing card, 5-step claim-line pathway, FAQ, and "Reserve Your Seat" with the form and WhatsApp.
  - "Get Trained by AAPC Instructors" band on Home, the AAPC page and the Education landing.
  - "Registered, Certified & Compliant" section, driven by data/credentials.ts, with an accessible certificate lightbox. On Home and About.
  - "Healthcare professionals and billers" is the first audience line on every course and panel. It was added, since no course had it before.
  - About Us rewritten with the client's content: story, what we do, quality, mission, founder card, count-up facts, strategic partnership, credentials, CTA.
  - Footer: newsletter strip, 5 columns (accordions on mobile), pricing card, social icons (hidden until links arrive), new bottom bar. Contact details are single-sourced in lib/site.ts and used by the footer, the Contact page, llms.txt and the JSON-LD. Chatbot seeding is noted in docs/09.
- **Verified (2026-09-26):** tsc, eslint, 107 unit tests. e2e against `next dev`: all 8 client-review tests pass. No horizontal scroll at 360/768/1280 on Home, About, Education, AAPC and Contact. 3 other e2e tests hit the 60s timeout on dev compiles and must be re-run against a production build.
- **Files touched:** see the commit.
- **Blockers:** slider/credential/instructor images, credential numbers, AAPC exam facts, price basis, social links (pm/CLIENT_INPUTS_NEEDED.md). AAPC written permission.

---
### Session 006 — Phase 5 start: orders, Stripe Checkout, webhook
- **Date:** 2026-09-26
- **Done:**
  - Migration 0004_commerce:
    - `stripe_events` (RLS, admin read).
    - Order indexes, and a unique (provider, provider_ref).
    - `fulfil_order()` (ADR-025): checks the amount and currency, marks the order paid, increments the coupon, and grants or extends access to each course (bundles expanded).
    - Not executable by browser roles.
  - P5-1: /dashboard/student/checkout/[slug] with an order summary and the server action `startCardCheckout`:
    - The price comes from the DB.
    - The order is created before the Stripe session.
    - Stripe idempotency key per order.
    - Rate-limited.
    - Fails closed without Stripe keys.
    - Courses not in the LMS show a "contact admissions" notice.
  - P5-2: /api/stripe/webhook:
    - Verifies the signature on the raw body.
    - Idempotent by event id.
    - Only paid sessions fulfil; delayed methods wait, expired sessions cancel.
    - DB errors return 500 so Stripe retries.
  - Order status page (polls while confirming) and a basic orders list (/dashboard/student/orders). Receipts are still to come in P5-6.
  - The Enroll flow ends at checkout: after sign-up or login, `?course=` goes to checkout, and signed-in users visiting /login or /signup are sent straight on.
  - stripe SDK 22 added. STRIPE_* in the server env schema.
- **Tests:**
  - 15 new unit tests: money, session outcomes, the event handler, signature checks.
  - 16 SQL scenarios for `fulfil_order` and RLS, run on a throwaway local Postgres 16 with a Supabase shim. This is also the first real run of 0001–0003, and all apply cleanly. The harness wasn't committed.
- **Files touched:** supabase/migrations/0004_commerce.sql, lib/payments/*, app/api/stripe/webhook, app/(dashboard)/dashboard/student/{checkout,orders}, components/payments/*, app/(auth)/{login,signup}, lib/auth/redirect.ts, lib/server-env.ts, lib/security/rate-limit.ts, lib/db/types.ts, scripts/gen-provisional-types.mjs, tests, pm/*
- **Next:**
  - P5-3 manual payment: proof upload to a private bucket, then admin approval via `fulfil_order(p_verified_by)`.
  - P5-4 USD/PKR geo pricing.
  - Run `npm run build` + the full e2e suite against a production build.
- **Blockers:** Stripe test keys and webhook secret to verify end-to-end. Supabase (P0-4) to apply 0004.

---
### Session NNN — <title>
- **Date:**
- **Done:**
- **Files touched:**
- **Next:**
- **Blockers:**
-->
