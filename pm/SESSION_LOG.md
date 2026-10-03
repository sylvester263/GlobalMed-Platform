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
### Session 007 — Brand logo, credentials, business-model correction (AAPC partner only)
- **Date:** 2026-09-26
- **Done:**
  - Brand: horizontal logo built from the supplied stacked artwork; official favicons; PSEB and HIPAA training credentials (SECP and third credential hidden); credential tiles centred.
  - Business model (ADR-026): feature flags in config/features.ts with redirects; GlobalMed's 8 courses, 2 pathways, batches, onsite wording, learning platform, instructor area, certificates/verify, checkout and refund policy hidden, not deleted.
  - Three AAPC courses (data/courses.ts) with pages /education/cpc, /cpb, /cpc-cpb; AAPC page rebuilt (cards with dual in the middle, comparison table, how it works, FAQs, registration).
  - "Register for AAPC Training" form → leads (aapc_registration) + email to info@; sales Leads pipeline page; admin overview shows registrations.
  - Approved wording across home, About, FAQ, careers, contact, meta, JSON-LD (no EducationalOrganization), llms.txt, sitemap, blog, legal (hidden via markdown feature blocks; new legal lines marked for counsel).
- **Verified:** tsc, eslint, 107 unit tests.
- **Next:**
  - Update chatbot knowledge (docs/09) for the AAPC-only model.
  - Final sweep for onsite, batch, pathways and similar words on visible pages.
  - Browser check at 360/768/1280 and the e2e suite.
- **Blockers:** CPB included items and session details from AAPC; dual-course price; USD 1,050 confirmation; whether registration details are shared with AAPC (privacy policy).

---
### Session 007b — AAPC course content, scroll fix, browser check, change report
- **Date:** 2026-09-26
- **Done:**
  - Fixed "How it works" disappearing on scroll up. There were two causes: the page-enter animation kept a transform on the wrapper, which broke the GSAP pin (`position: fixed`), and the pin was created mid-scroll after a reload. The section is now CSS sticky; scroll only draws the line and highlights the active step.
  - Course pages: `data/courses.ts` has the confirmed prices and packages, and `content/courses/*.ts` has the client copy. There is a 12-section template, tabs on the dual page, and Course JSON-LD with AAPC as provider and a USD offer. The AAPC page has the comparison table per the client layout, and the 10 FAQs are everywhere.
  - Registration form: shows the price per course and has a required consent checkbox (stored with the lead). The footer card lists all three prices. The `publicLogin` flag hides the login links; `/login` is for staff.
  - Wording sweep (pm/WORDING_SWEEP_2026-09-26.md): nothing visible left to change.
  - Browser check: 138 checks, all pass. E2E: 146 passed, 53 skipped by flag. Screenshots are in pm/screenshots/.
  - Fixes the checks found:
    - footer saving-line contrast
    - AAPC table clipping at 360px
    - home meta description length
    - staff login notice
  - Change report: pm/CHANGE_REPORT_2026-09-26.md. Chatbot knowledge: docs/09.
- **Files touched:** see pm/CHANGE_REPORT_2026-09-26.md.
- **Next:**
  - Client inputs (AAPC data sharing, AAPC approval of course descriptions, counsel review of the Terms/Privacy lines, SECP certificate).
  - Vercel project under the client team (P0-9), then deploy and re-run the browser check on the preview URL.
- **Blockers:** no Vercel project exists for this repo (the only connected account is a personal one with no GlobalMed project), so there is no production URL yet. Supabase, Resend, Turnstile and Upstash are needed for the registration form to store leads.

---
### Session 008 — Home services stack, approved wording, registration Address, footer app badges
- **Date:** 2026-09-28
- **Done:**
  - Home "Our Services" directly after the hero: client text used exactly (content/home-services.ts), sky note linking to the AAPC page, four cards with the client's photos (converted from .jfif to 1600×1200 JPG).
    - ≥768px with motion: sticky stacking cards (top 88 + 28px × index), the cards underneath scale 4% per card above (min 0.88) with a 0→10% navy overlay, driven by Motion `useScroll` + `useTransform`. All cards get the tallest card's height; a card taller than the screen sticks higher so it can be read (ADR-027).
    - Phones and reduced motion: plain cards with a one-time fade; `md:motion-safe:` keeps the server HTML right before hydration.
    - Old services list hidden (`homeServicesOverviewOld`). The page transition drops its class after the animation.
  - Wording: `approvedWording.role` is the client's line (batch schedules, payment processing, books and online resources; AAPC provides training and credentials). Used by the FAQ, AAPC, About and course pages, home and the blog. docs/09 updated. Sweep amended: "batch" only as "batch schedules". Privacy has a [CLIENT TO CONFIRM] payment paragraph.
  - Registration: Address (required, 2 rows, 10–250 chars, live count) replaces City (`registrationCityField: false`). Migration 0005_leads_address (nullable `address`, ≤250 check; tested on a throwaway Postgres 16). Saved with the lead and in the info@ email. Sales table Address column, new lead detail page, admin CSV export `/api/admin/leads/export` (admin + MFA, RLS client, formula-injection safe).
  - Footer: official black App Store (Apple SVG) and Google Play badges, always shown; "Coming soon" disabled badges until `appLinks` are set (ADR-027).
- **Verified:** tsc, eslint, 116 unit tests. Full e2e against `next start`: 157 passed and 53 skipped by flag. One failure, the home axe contrast on the sky card numbers, was fixed by marking them decorative (below). New specs pass: home-services (desktop stack down/up, 360, reduced motion), registration-form, footer-badges (360/768/1280). Manual scroll test (slow/fast, down/up, after reload, after back-navigation) at 1280, 768, 360 and with reduced motion. Screenshots are in pm/screenshots/ (services-stack-*, registration-address-*, footer-badges-*).
- **Files touched:** content/home-services.ts, components/marketing/home/services-{overview,stack}.tsx, components/motion/page-transition.tsx, config/features.ts, app/(marketing)/{page,contact/page,free-billing-audit/page}.tsx, content/{aapc,home}.ts, content/blog/start-medical-coding-career-pakistan.md, content/legal/privacy.md, docs/09, supabase/migrations/0005_leads_address.sql, lib/db/types.ts, lib/validation/leads.ts, lib/leads/{actions,labels,csv}.ts, components/marketing/aapc-registration-form.tsx, app/(dashboard)/dashboard/sales/leads/{page,[id]/page}.tsx, app/api/admin/leads/export/route.ts, data/site.ts, components/marketing/footer-compact.tsx, public/images/{services,badges}/*, tests/*, pm/*
- **Next:** apply 0005 on Supabase with the rest (P0-4); app store URLs into data/site.ts when the listings are live; client answers on the payment-processing paragraph.
- **Blockers:** Supabase (P0-4) to apply 0005 and to test the lead detail and export pages with real data; the store links; the payment-processing details.
- **Notes:**
  - The sky card numbers (#51ACE3) are under 3:1 on white. They are aria-hidden decoration and excluded from the axe run (`data-decorative-ordinal`). If the client wants them to count as text, use a darker blue on the light cards.
  - On an 800px-tall screen the cards are 681px, so earlier edges peek only a few px. Full peek from about 900px tall.

---
### Session 008b — Claim line removed site-wide
- **Date:** 2026-09-28
- **Done:**
  - `features.claimLine: false` (ADR-028). `ClaimLine` and `PathwayLine` render nothing; `ClaimProgress` keeps its role and text.
  - Places found and what replaced each:
    - Home hero slider progress → dots only (active navy, others #C9D6EE) + pause; an invisible 6s timer keeps autoplay.
    - "How it works" on Home and the AAPC page → numbered 48px navy circles, a row on desktop and a list on mobile, with a one-time fade.
    - Heading dividers (removed, no replacement): services intro, the four service card titles, the AAPC instructors band, page heroes and CTA bands (`sections.tsx`), auth card, 404, empty state.
    - Credential tiles → navy top band kept, ticks removed.
    - Service pages' "How it works" → the "01–04" numbers stay, line removed.
    - Free billing audit → "Step 1 of 2" + 4px bar.
    - Hidden or unused, covered by the flag: extended footer, certificate, verify page, course progress, pathways, student dashboard pathway, styleguide. The MG-2 hero claim form and hero CTAs aren't rendered anywhere.
  - `FadeInOnce` moved to components/motion/fade-in-once.tsx and shared. New `dot-muted` token.
  - MASTER.md §4, docs/06 and docs/15 §3 marked "Retired 2026-09-28 at client request".
- **Verified:** tsc, eslint, 119 unit tests (3 new for the flag). E2E: claim-line-removed scans 13 visible pages at 360/768/1280 (no line, no horizontal scroll) and checks the slider dots, the audit bar and reduced motion. "How it works" scroll down/up, slider autoplay and the stacking cards all pass. Screenshots: pm/screenshots/no-claim-line-*.
- **Files touched:** config/features.ts, app/globals.css, components/motion/{claim-line,pathway-line,fade-in-once}.tsx, components/marketing/home/{claim-journey,hero-carousel,services-stack}.tsx, components/marketing/audit-form.tsx, tests/e2e/{public-site,claim-line-removed}.spec.ts, tests/unit/claim-line-retired.test.ts, design-system/MASTER.md, docs/06, docs/15, pm/*
- **Next / notes:** the active navy dot is hard to see on the slider's navy photo overlay (its white outline carries it). Ask the client whether to keep navy or use white for the active dot on the hero.

---
### Session 008c — Full-width desktop layout
- **Date:** 2026-09-28
- **Done:**
  - `container-fluid` + `--container-max`/`--gutter` tokens (ADR-029). 34 containers in 15 files were converted by script, plus the compact footer (it was 1440px with 150px padding). Header, main and footer share one left edge at every width.
  - 75ch paragraph cap (base rule). The two role-line paragraphs that used max-w-3xl now use 75ch.
  - Grids: `wide` breakpoint (1440px) for 4 columns on services, specialties, service features and credential tiles. The AAPC comparison table cells get more padding from 1024px.
  - "Our Services": intro 60/40 with the AAPC note from 1280px. Cards are full width from 1024px, min 560px, text 50% / image 50% flush right, 65ch paragraphs. The measurement reads the text column.
- **Verified:** layout script on 12 visible pages at 360/768/1280/1440/1920/2560: no horizontal scroll, header/content/footer edges equal (20/32/64/72/96px, centred at 2560), no paragraph over 75ch, no container over 1920px. Grid columns 1/2/3/4/4 at 360/768/1280/1440/1920. Stacking cards at 768, 1280, 1440, 1920 and 2560: every card reaches the top, nothing fades out scrolling up, no clipping or transformed ancestor, image flush to the card edge. 119 unit tests; full e2e 200 passed, 53 skipped by flag, 0 failed (axe included).
- **Files touched:** app/globals.css, app/(marketing)/{page,about/page,services/page,services/[slug]/page,specialties/page,school/aapc-certification-pakistan/page,school/courses/[slug]/page}.tsx, components/marketing/{sections,site-header,site-footer,footer-compact,credentials-section,aapc-course,aapc-instructors-band}.tsx, components/marketing/home/{hero-carousel,claim-journey,services-overview,services-stack}.tsx, app/styleguide/*, pm/*
- **Screenshots:** pm/screenshots/fullwidth-{1440,1920}-*.png

---
### Session 009 — About page "Our Story"
- **Date:** 2026-09-29
- **Done:**
  - New "Our Story" section right after the About hero (components/marketing/about-story.tsx, text in content/about-story.ts, used exactly; no "®️" on the page).
    - Our Story: text 60% / founder photo slot 40% (/images/about/riaz-naveed.jpg, 4:5, labelled placeholder until supplied), caption "Riaz Naveed, Founder & CEO", badge "Est. 2007 · Lahore, Pakistan".
    - Clinical Documentation: #EEF6FC band, country and specialty chips beside the full paragraphs.
    - Coding, Billing and RCM: white, 55/45 with a 2-column checklist of the 10 services.
    - Investing in Pakistan's Healthcare Workforce: navy band, white text, GlobalMed + AAPC lockup, sky button "View CPC® & CPB® Courses" → /education/aapc-certification-pakistan.
    - Closing statement: centred serif pull-quote (30px desktop, 24px tablet, 20px phone), max 60ch, thin sky rule, no ticks.
  - Flags: `aboutStoryOld: false` (old Our Story + What We Do), `aboutPartnershipBlockOld: false` (old Strategic Partnership). The Leadership card is now a `LeaderCard` rendered on its own when the old story is hidden.
  - Motion: `FadeInView` (components/motion/fade-in-view.tsx), Motion `whileInView` with `viewport.once`. Visible in server HTML; only blocks below the fold are hidden after mount; reduced motion (checked directly as well as through the hook, which reads false during hydration) = no animation.
  - `PartnerLockup` moved from the hero slider to components/marketing/partner-lockup.tsx and shared; new `missingLogo="hide"` for About.
  - SEO: About meta description trimmed to 157 characters. Organization JSON-LD already had foundingDate 2007 and founder Riaz Naveed (checked in e2e). docs/09 §3.1 has the Our Story facts.
- **Deviations from the brief (for review):**
  - Button text is ink #1B2A5E, not navy: navy on #51ACE3 is 3.8:1, below AA for 16px text; ink is 5.4:1.
  - AAPC logo: the brief said show it only if public/aapc-logo.png exists. Only the client-supplied public/aapc-logo.svg exists, and it is already used on the home hero (CLIENT_INPUTS_NEEDED: "the existing SVG is used until then"), so the About lockup uses the same PNG-then-SVG lookup. With neither file, the AAPC half is hidden. Nothing is drawn.
  - Small labels "Countries" and "Specialties" above the chips, so the two lists are identifiable.
- **Verified:** tsc, eslint, 119 unit tests, `next build`. New tests/e2e/about-story.spec.ts (7 tests): exact text, placement after the hero, old blocks hidden, kept blocks visible, button link, meta ≤160, JSON-LD; at 360/768/1280/1920 no horizontal scroll, paragraphs ≤75ch (closing ≤60ch), one vs two columns, everything visible after scrolling down and back up; reduced motion with nothing faded. Full e2e: 207 passed, 53 skipped by flag, 0 failed (axe included). Screenshots: pm/screenshots/about-story-{360,1920}.png.
- **Files touched:** content/about-story.ts, components/marketing/{about-story,partner-lockup}.tsx, components/marketing/home/hero-slider.tsx, components/motion/fade-in-view.tsx, app/(marketing)/about/page.tsx, config/features.ts, docs/09_AI_CHATBOT_WHATSAPP.md, tests/e2e/about-story.spec.ts, pm/*
- **Next:** founder photo at public/images/about/riaz-naveed.jpg; AAPC logo PNG and written permission; the client may want to drop the second founder photo on the Leadership card now that Our Story shows one.
- **Blockers:** none new.

---
### Session 009b — Certification content: order, dual price, duration, sessions line
- **Date:** 2026-09-29
- **Done:**
  - Order CPC®, CPB®, CPC® + CPB® everywhere: `aapcCourses` reordered in data/courses.ts, and the home and AAPC-page cards now use `getAapcCourses()` (`getAapcCoursesDualCentred` removed). The comparison table, Education menu, registration dropdown, footer pricing card, FAQ, sitemap, llms.txt and JSON-LD already followed this order and still do. The dual card keeps "Best value" in third place.
  - Dual course: USD 1,800; saving line "Save USD 300 compared to taking CPC® and CPB® separately (USD 2,100)."; meta description USD 1,800. The FAQ price answer is computed and now reads exactly as the client asked. The Course JSON-LD Offer price is 1800.
  - Duration: dual course 16 weeks (card, hero, comparison table); package line "Instructor-led 16-week online courses led by world-class AAPC faculty"; intro now "…enrolls you in both AAPC preparation courses in a program that runs over 16 weeks, giving you…".
  - Sessions: `aapcCourseFacts.format` = "Online sessions conducted by AAPC certified trainers", shown on the cards, the three course heroes (replacing "Instructor-led online course, taught by AAPC faculty") and the table Format row. The cards keep their separate "Taught by: AAPC faculty" row. llms.txt uses the same line.
  - docs/09: dual row (USD 1,800, save USD 300, 16 weeks, 16-week package line) and the Format line.
- **Search check:** "1,600", "1600", "USD 500", "Save USD 500", "32 week", "32-week", "32 weeks": none left in app, components, content, data, lib or docs. They remain only in past records (pm history, the 2026-09-26 browser-check results, an old .playwright-mcp snapshot, and tsconfig.tsbuildinfo, a build cache). The footer pricing card is data-driven but only renders in the extended footer, which is hidden (`footerExtended: false`).
- **Verified:** tsc, eslint, 119 unit tests, `next build`. New tests/e2e/certification-content.spec.ts: no old price or duration in the visible text or JSON-LD on home, the AAPC page, the three course pages and the FAQ; card, table-column, dropdown, menu and sitemap order; dual price, saving, FAQ answer, 16 weeks and the Format row; the three heroes; the dual Offer; llms.txt; 360px with no horizontal scroll (screenshot pm/screenshots/certification-order-360.png).
- **Files touched:** data/courses.ts, content/courses/cpc-cpb.ts, app/(marketing)/page.tsx, app/(marketing)/school/aapc-certification-pakistan/page.tsx, components/marketing/{aapc-course,certification-price-card}.tsx, docs/09_AI_CHATBOT_WHATSAPP.md, tests/e2e/certification-content.spec.ts, pm/*
- **Next / notes:** the client may want the "Taught by: AAPC faculty" row on the cards dropped now that the format line names AAPC certified trainers.

---
### Session 009c — About: Leadership card hidden
- **Date:** 2026-09-29
- **Done:** the standalone Leadership card (Riaz Naveed photo slot, "Founder & CEO", the Medical Laboratory Technology bio) is hidden with `aboutLeaderCard: false`, because the founder already appears in "Our Story". `LeaderCard` stays in the code (the old story still uses it if `aboutStoryOld` is turned back on).
- **Verified:** tsc, eslint, 119 unit tests, `next build`; about-story e2e (the card's heading and bio are gone, one founder photo slot remains) and the About visual audit incl. axe at 360/768/1280. Screenshots pm/screenshots/about-story-{360,1920}.png regenerated.
- **Files touched:** config/features.ts, app/(marketing)/about/page.tsx, tests/e2e/about-story.spec.ts, pm/*

---
### Session 009d — Instructor photo slots hidden
- **Date:** 2026-09-29
- **Done:** the "Instructor photo 1/2/3" slots in the "Get Trained by AAPC Instructors" band are hidden with `instructorPhotos: false` (home and AAPC Certification page; the Education landing that also uses the band is already hidden). The band's heading, text, three points and button stay, in one full-width column. The photo list and content/aapc.ts `photos` stay in the code.
- **Verified:** tsc, eslint, prettier, `next build`; new e2e checks in tests/e2e/certification-content.spec.ts (band present, no photo list, no "Instructor photo" text on either page); full e2e suite.
- **Files touched:** config/features.ts, components/marketing/aapc-instructors-band.tsx, tests/e2e/certification-content.spec.ts, pm/*

---

### Session 010 — LCCI credential and founder photo
- **Date:** 2026-09-30
- **Done:**
  - LCCI: client files public/images/credentials/LCCI.jpg (1755×1240) and LCCI.pdf (1 page, same scan) copied, not moved, to lcci-certificate.jpg / .pdf; lcci-certificate-thumb.jpg 640×604, cropped to the certificate border (drops the scan's white margin and CamScanner mark; the full image and PDF are unchanged).
  - Certificate reads: "Membership Certificate", The Lahore Chamber of Commerce & Industry, M/s GlobalMed Transcriptions (SMC-Pvt.) Ltd, 44-Dil Khusha Garden Kot Lakhpat, Lahore; Membership No. 94721 C; NTN 3625002-3; member since 04/06/2018; given 11 Apr 2026; valid up to 31 Mar 2027 (Book No. B 19668, Serial No. B 1966773).
  - data/credentials.ts: `lcci` entry second, after PSEB, in the existing Credential shape (name/meaning/number/issuer/validity) plus a new `validTill` field. New `visibleCredentials()` drops hidden entries and any credential past `validTill`. There was no expiry rule before; this adds one. Pages are static, so an expiry takes effect on the next build/deploy.
  - Founder photo: public/images/Founder/Riaz Picture.png (1122×1402, already 4:5 with the face in the upper third) kept untouched; riaz-naveed-800.webp (800×1000, 58 KB) and riaz-naveed-400.webp (400×500, 17 KB) in public/images/about/, resized only (a 1-2 px trim to exact 4:5), no AI edits. Kept out of a lowercase `founder/` folder because Windows treats Founder/founder as one folder while Vercel (Linux) does not.
  - About "Our Story": heading and first paragraph full width; from 1280px the photo sits beside the "Our founder, Riaz Naveed…" paragraph (3fr/2fr), below 1280px it comes above that paragraph. #EEF6FC panel, 16px radius, subtle shadow, width/height 800×1000, alt "Riaz Naveed, Founder & CEO of GlobalMed Transcriptions".
  - Leadership card: uses the 400×500 photo with the same styling, but stays hidden (`aboutLeaderCard: false`, client 2026-09-29), so it doesn't show.
- **Verified:** tsc, eslint, 121 unit tests (new tests/unit/credentials.test.ts: order PSEB/LCCI/HIPAA, LCCI kept on 2027-03-31 and dropped on 2027-04-01), `next build`; e2e about-story (layout rule updated to 1280px, photo above the paragraph below that), public-site (new: LCCI lightbox and PDF link), certification-content: 43 passed. Browser check at 360/768/1280/1920 on / and /about: no horizontal scroll, three tiles, photo loaded at 288×360 / 352×440 / 403×504 / 416×520.
- **Files touched:** data/credentials.ts, components/marketing/{credentials-section,about-story}.tsx, content/{about-story,company}.ts, app/(marketing)/about/page.tsx, public/images/{credentials,about,Founder}/*, tests/unit/credentials.test.ts, tests/e2e/{about-story,public-site}.spec.ts, pm/*
- **Next:** image audit (pm/IMAGE_PLAN.md).
- **Blockers:** none. Client to confirm "04/06/2018" is 4 June 2018.

---

### Session 010b — Image audit and generation plan
- **Date:** 2026-09-30
- **Done:** pm/IMAGE_PLAN.md: every visible route scanned in the browser at 1280px (22 routes, hidden flags excluded) plus header, footer and Open Graph. 39 slots to fill: 7 P1 (AAPC logo PNG; slide 3; OG default/education/services; AAPC page and Free Billing Audit hero images) and 32 P2; 12 slots already good. Prompt rules, standard negative prompt, per-image prompts and seeds (240926, variations 240927–240932 for the similar education shots), totals and an upload naming checklist. Report only; nothing placed.
- **Findings:** slide 3 shows an instructor in a physical classroom, which breaks the online-only rule (B01, P1). Only home and About have photos; all other pages are text-only, so their hero/cover slots are proposals that need a layout change in Task 3. The default OG card still draws the retired claim-line ticks. Service card photos: a few readable words (mug, poster, book spines); the untracked `.jfif` files are 2400×1792 sources of the same four photos. The slide 3 and service-card prompts are not saved in the repo, so the plan marks them "already provided".
- **Files touched:** pm/IMAGE_PLAN.md, pm/SESSION_LOG.md, pm/CHANGELOG.md
- **Next:** Task 3 (placement) once the client says the images are uploaded.
- **Blockers:** the images themselves; AAPC logo permission.

---

### Session 011 — Images placed, UI/UX and spacing pass
- **Date:** 2026-09-30
- **Done:** (details in pm/UI_UX_REPORT_2026-09-30.md)
  - Step 1: upload check against pm/IMAGE_PLAN.md. B01 moved from credentials/ to slider/ (client OK); B11–B13 used from heroes/; B24 new; C08 regenerated; C06/C09 not uploaded. 14 images flagged for readable text or logos.
  - Step 2: scripts/optimize-images.mjs (WebP masters cropped per slot, OG backgrounds 1200×630 JPG); next/image AVIF/WebP at 640–2560 (ADR-030). All within size budgets.
  - Step 3: PageHero photo slot (text left, photo right 4:3 from 1024px, photo first on phones) on the AAPC, 3 course, Services, 6 service, Free Billing Audit and Careers pages; blog covers and cards; guide cards; new slide 3; RCM card; home AAPC band on a scrolling photo with a navy overlay; Open Graph routes (logo + title over photo, JPEG) replacing the old claim-line card; default og:image restored on pages that lost it.
  - Step 4: spacing tokens (`section-y` 56/72/96, `gap-grid` 24/32) on every section and card grid; 44px touch targets (nav, breadcrumbs, footer, inputs, buttons, chips, consent); scroll-padding for the sticky header and help button; 16px paragraphs on phones; 75ch lists; slider/band overlay contrast ≥ 4.89:1 measured; sticky first column on the comparison table; fetchpriority on LCP images; /api/health returns the commit.
  - Step 5: `experimental.inlineCss` off (ADR-031): home HTML 545 → 279 kB, main-thread work roughly halved; desktop Lighthouse 94–100; decorative ordinals drawn by CSS.
- **Verified:** tsc, eslint, 121 unit, 241 E2E (53 skipped by flag) incl. new tests/e2e/images.spec.ts; UI audit across 41 routes × 13 sizes in Chrome plus WebKit and Firefox (no horizontal scroll anywhere); screenshots pm/screenshots/2026-09-30/ (164).
- **Not met:** Lighthouse mobile Performance 44–65 (target ≥ 90), LCP 4.2–5.5s: hydration JavaScript, same on the live pre-change build (50–62). Not pushed, per the brief.
- **Files touched:** content/images.ts, components/marketing/{sections,post-list,aapc-course,aapc-instructors-band,footer-compact,site-header,mega-menu,aapc-registration-form,prose,credentials-section,about-story}.tsx, components/marketing/home/*, components/motion/scroll-background.tsx, components/ui/{button,input,native-select}.tsx, app/**/opengraph-image.tsx, app/(marketing)/** pages, app/globals.css, lib/seo/{og-image.tsx,metadata.ts}, next.config.ts, app/api/health/route.ts, scripts/optimize-images.mjs, assets/fonts/, public/images/**, tests/{audit,e2e}/*, pm/*
- **Next:** mobile performance (cut client JS on home and inner pages), then push and verify on Vercel; regenerate flagged images.
- **Blockers:** push waits on the mobile Performance target, or the client's go-ahead.

---

### Session 012 — Fixes: image placement, founder photo, packages, Why register, alignment
- **Date:** 2026-09-30
- **Done:** (details in pm/UI_UX_REPORT_2026-09-30.md, part 2)
  - Step 1: placement audit of every rendered image. All slots show their planned photo; the three service pages that reused home card photos as heroes no longer do. Band overlay on phones 80% → 65%.
  - Step 2: shared split grid; Our Story photo top-aligned with the heading, 4:5, max 460/380/360px, #EEF6FC frame, whole photo visible; help button 60px under 768px.
  - Step 3: "Package Includes" for CPC®, CPB®, CPC® + CPB® (client text) under the price note on cards and course heroes; old lists and comparison rows hidden by flags; practice-test mentions hidden; "1/2 off" clause removed from two course paragraphs and one FAQ; new home "Why register through GlobalMed Transcriptions?"; docs/09 updated.
  - Step 4: split grid for heroes, About, forms and FAQs; 4:3 hero crop with centred text; course price card under the hero photo; sticky intro columns; 48px buttons; 16px card radius and 24px padding; alternating photos on the home service cards; alignment audit script.
  - Step 5: UI audit in Chrome, WebKit, Firefox at 7 widths (no overflow, no small targets); E2E 248 passed; screenshots pm/screenshots/2026-09-30-alignment/; Lighthouse.
- **Not met:** Lighthouse mobile Performance 42–70 (desktop 92–99, A/BP/SEO 100). Cause: first-render style/layout and hydration JS, not today's changes. Not pushed yet.
- **Files touched:** content/{images,home,aapc}.ts, content/courses/{cpc,cpb}.ts, data/courses.ts, config/features.ts, components/marketing/{sections,aapc-course,about-story,help-button,…}.tsx, components/marketing/home/*, components/motion/scroll-background.tsx, components/ui/button.tsx, app/(marketing)/** pages, app/globals.css, docs/09, tests/{audit,e2e}/*, pm/*
- **Next:** mobile performance task; client answers on package details and practice-test replacement text.
- **Blockers:** push waits on mobile Performance or the client's go-ahead.

---

### Session 013 — Hosting, Our Story, exam wording, performance
- **Date:** 2026-09-30 / 2026-10-01
- **Done:** (details in pm/UI_UX_REPORT_2026-09-30.md, part 3)
  - Hosting (ADR-032): own hosting (Hostinger) documented; `.env.production` sets the live site URL (canonical, og:image, sitemap verified live); `/api/health` shows the build commit on any host. Old Vercel project still live — client to delete or redirect it. Hostinger's temporary domain serves a robots.txt that blocks Googlebot.
  - Our Story photo max 400px, photo and text centred; client's exam wording shown on the band and in "How it works".
  - Performance (ADR-033): first-load JS home 278 → 138 kB, About 213 → 134, AAPC 250 → 146, CPC® 244 → 146 (deferred hydration, no Motion on these pages, lazy help menu / certificate dialog / success tick, providers moved to dashboards, no zod in the browser for env, footer/list prefetch off, content-visibility below the fold, GSAP removed, bundle analyzer added).
- **Live mobile (median of 3):** before 56–63; best achieved AAPC 93, CPC® 94, About 82, Home 72. A second round read lower (67–72) because this machine was slower at the time — the previous build measured alongside scores the same. PageSpeed Insights quota was exhausted, so no Google-hosted numbers yet. Desktop 95–99; A/BP/SEO 100; CLS 0.
- **Verified:** tsc, eslint, 121 unit, 252 E2E (53 skipped by flag) incl. new deferred-islands spec.
- **Files touched:** CLAUDE.md, docs/{02,03,10,14,17}, .env.production, .env.example, next.config.ts, app/api/health, app/layout.tsx, app/(dashboard)/layout.tsx, app/styleguide/layout.tsx, app/(marketing)/**, components/defer/*, components/marketing/{aapc-course,aapc-course-card,deferred-registration-form,faq-accordion,help-button,help-menu,credential-lightbox,credential-dialog,sections,footer-compact,post-list,about-story,…}, components/motion/{fade-in-view,scroll-background}.tsx, components/marketing/home/*, lib/env.ts, package.json, tests/{audit,e2e}/*, pm/*
- **Next:** Home and About mobile to 90 (Contact nav prefetch, mega menu on hover, hosting cache/CDN), then re-measure with PageSpeed Insights; client's regenerated images ("images replaced: <IDs>").
- **Blockers:** Vercel project deletion and domain connection are client actions.

### Session 014 — Hero slider lockup on all three slides
- **Date:** 2026-10-01
- **Done:**
  - GlobalMed + AAPC lockup now on slides 1, 2 and 3: one shared server component (`SliderLockup`), drawn once above the slides so it stays fixed while slides change (no fade, no movement).
  - Official horizontal GlobalMed logo (public/images/brand/globalmed-logo-horizontal.png, original artwork) | 1px #D9E3F0 divider (20px each side) | AAPC logo on a white 12px-radius plate, padding 14px 20px; both logos 40px (≥1024px), 34px (768px), 28px (phones); alt texts and the plate's aria-label as specified. About keeps its own PartnerLockup unchanged.
  - Copy starts at the same top on every slide; each headline and text cell reserves the height of the longest one (invisible copies, aria-hidden), so headline, text and buttons sit at the same height on all slides at every width. Slider height on phones raised to 620px (680px under 390px) so the buttons clear the controls; desktop minimum 560px.
  - Checked with tests/audit/slider-lockup.mjs at 360, 390, 768, 1024, 1280, 1440, 1920: lockup position identical across slides, left-aligned with the headline, 20px above it, no overlap with the headline or the controls, headline/text/buttons tops identical — 0 problems. Reduced motion: slides still fade, lockup static. Overlay and text colours unchanged (contrast unchanged). E2E: 86 passed, 4 skipped.
  - Screenshots: pm/screenshots/2026-10-01/slider-lockup/ (slides 1–3 at 1920 and 390).
- **Files touched:** components/marketing/home/{slider-lockup.tsx,slider-lockup-size.ts,hero-slider.tsx,hero-carousel.tsx}, tests/audit/slider-lockup.mjs, pm/SESSION_LOG.md, pm/CHANGELOG.md, pm/screenshots/2026-10-01/slider-lockup/*
- **Next:** remaining items of the 2026-10-01 gap brief (verify remaining gaps, checks at 7 widths, before/after screenshots, report); og/og-education placement.
- **Blockers:** none.

### Session 015 — Small updates: LCCI, footer, course cards, horizontal logo
- **Date:** 2026-10-01
- **Done:** (details and the logo replacement list in pm/SMALL_UPDATES_2026-10-01.md)
  - LCCI tile: "Corporate Member, The Lahore Chamber of Commerce & Industry" (data, About via the same data, docs/09 chatbot knowledge).
  - Footer: trademark line hidden (`footerTrademarkNote`); fine print "© 2026 GlobalMed Transcriptions · Designed & developed by SylJo Tech"; copyright appears once.
  - Course cards: delivery note hidden on cards only (`courseCardPriceNote`); 24px price → Package Includes; subgrid alignment of all sections across the three cards from 1024px, dual saving's space reserved, buttons on one line at the bottom, highlighted card without vertical offset.
  - Horizontal GlobalMed logo everywhere the stacked logo was used (Wordmark, compact footer 44px on its plate, OG images, JSON-LD, certificate template); stacked files kept; favicons unchanged.
  - Verified: course-cards audit 0 problems (6 widths, 2 pages), header logo at 360/768/1280/1920, slider check 0 problems, unit 121, E2E 252 passed (53 skipped by flag). Screenshots pm/screenshots/2026-10-01/small-updates/.
- **Files touched:** config/features.ts, data/credentials.ts, docs/09_AI_CHATBOT_WHATSAPP.md, components/marketing/{aapc-course-card,footer-compact,site-footer,wordmark}.tsx, components/lms/certificate-preview.tsx, lib/seo/{json-ld,og-image}.tsx, app/(marketing)/page.tsx, app/(marketing)/school/aapc-certification-pakistan/page.tsx, tests/e2e/public-site.spec.ts, tests/audit/course-cards.mjs, pm/*
- **Next:** remaining items of the 2026-10-01 gap brief; og/og-education placement.
- **Blockers:** none.
- **Follow-up (same day):** client asked to restore the course card delivery note: `courseCardPriceNote: true`. Card audit 0 problems at 6 widths (note on every card, aligned, 24px to Package Includes); screenshots refreshed.

### Session 016 — Nav: Careers replaces Specialties; Phase 7A chatbot
- **Date:** 2026-10-01
- **Done (step 1, nav):** header and mobile menu order About Us · Education · Services · Resources · Careers · Contact; Specialties link behind `navSpecialties: false` (pages live, still linked from service pages; footer unchanged). The active item's colour was nearly identical to the others (navy-hover vs navy), so the current page is now also underlined (desktop and mobile). E2E: new test (Careers active on /careers, keyboard, mobile menu, /specialties 200); public-site + visual audit 138 passed. Screenshots pm/screenshots/2026-10-01/nav-careers/.
- **Files touched (step 1):** lib/site.ts, config/features.ts, components/marketing/{site-header,mega-menu,mobile-nav}.tsx, tests/e2e/public-site.spec.ts, pm/*
- **Done (Phase 7A, website chatbot):** details in docs/09 §10 and ADR-034.
  - Prerequisites checked: no LLM key (LLM_PROVIDER/LLM_API_KEY/LLM_MODEL/EMBEDDING_MODEL empty), Supabase not linked (P0-4), Upstash, Turnstile and Resend API keys empty. Everything is built against adapters and fails closed; scripted answers work without keys.
  - Engine (`lib/ai/*`): provider adapter (OpenAI / Anthropic / Gemini via AI SDK v7), RAG over `match_kb`, system prompt with the docs/09 guardrails + pinned site-data knowledge, deterministic guardrails (PHI refusal, exact prices/packages/contact/delivery, reply checks), lead flow, handoff, settings, store; migration 0006 (soft-delete KB, match_kb with titles, handoff status, visitor token hash, realtime).
  - `/api/chat` SSE (zod, Turnstile first message, 20 msgs / 10 min, 10 turns, 400-token cap), `/api/chat/messages` (polling during handoff), `/api/chat/config`, `/api/chat/stream-check`, `/api/admin/kb-sync` + `npm run kb:sync`.
  - Widget replaces the help menu (same button; flag `chatbotWidget`), loaded on first click; Sales → Inbox with realtime and agent replies; Admin → Chatbot (setup status, knowledge base, conversations with search/delete, settings).
  - Tests: 38 chatbot unit tests + 21 question-set tests (180 unit total); E2E 258 passed / 58 skipped on the production build (chat widget, keyboard, 360px, lazy load, fail-closed); dry-run conversation E2E 8 passed (CPC price, PHI refusal, handoff + agent reply, course lead); the Sales inbox round trip is written but needs Supabase (E2E_SUPABASE). Question set: 16 pass, 0 fail, 4 blocked on the LLM key (pm/CHATBOT_TEST_QUESTIONS.md). Lighthouse mobile Home 86 / About 86, desktop 99 / 100, A/BP/SEO 100, CLS 0; first-load JS +1 kB.
  - Screenshots: pm/screenshots/2026-10-01/chatbot/ (open, answer, handoff at 1440 and 390; taken on the local dry-run dev server).
  - The dry-run dev server was stopped by the system for low memory after the tests; not restarted.
  - Streaming on the live hosting:
    - `/api/chat/stream-check` showed Hostinger's CDN (hcdn) strips X-Accel-Buffering and buffers the whole response: 5 ticks arrived at once after ~3s.
    - Padding each flush with ≥1.5 KB made the ticks arrive 400ms apart, as sent.
    - `/api/chat` now merges text parts (≤ every 120ms) and pads each flush to 2 KB with an SSE comment.
    - Documented in docs/09 §10.
    - The full live chat stream can only be watched once the keys are set: `/api/chat` correctly returns 503 now.
  - Live check (381fd4e):
    - Widget and help-button E2E against the live site: 8 passed, 5 skipped (dry-run and Supabase only).
    - `/api/chat/config` 200; `/api/chat` 503 (fails closed); test hook 404 (dry run only); kb-sync 403 without the secret; /careers 200.
    - Unrelated to the chatbot: the existing "registration form works once it is on screen" test fails on live. Clicking within ~4s of scrolling to the form uses the browser's own required-field check (submission still blocked). The form's validation takes over once its deferred code has loaded (ADR-033). The test assumes local speed; a follow-up could wait for hydration or load the form a little earlier.
- **Files touched (Phase 7A):** lib/ai/*, app/api/chat/*, app/api/admin/kb-sync, app/(dashboard)/dashboard/admin/chatbot/*, app/(dashboard)/dashboard/sales/inbox/*, components/marketing/chat/chat-widget.tsx, components/marketing/help-button.tsx, components/dashboard/chatbot/*, supabase/migrations/0006_chatbot.sql, lib/db/types.ts, lib/server-env.ts, lib/security/rate-limit.ts, config/features.ts, app/globals.css, .env.example, package.json, scripts/kb-sync.mjs, tests/{unit,e2e,audit}/chat*, docs/09, pm/*
- **Next:** client adds the LLM key + Supabase/Upstash/Turnstile/Resend on the hosting → apply migrations 0001–0006 → Re-sync from website → run the question set on the live site and the Sales inbox E2E. Phase 7B WhatsApp once the Meta inputs arrive.
- **Blockers:** LLM key, Supabase org invite, Upstash/Turnstile/Resend keys; Phase 7B: Meta Business verification, WhatsApp number, token, app secret, templates (pm/CLIENT_INPUTS_NEEDED.md).

### Session 017 — Footer, address, home stats bar
- **Date:** 2026-10-01
- **Done (footer):** fine print "© 2026 GlobalMed Transcriptions. All rights reserved. · Designed & developed by SylJo Tech" (once). `data/site.ts` appLinks: Google Play set (the badge becomes a link, new tab, rel noopener noreferrer, aria-label "Download the GlobalMed app on Google Play"); App Store empty → "Coming soon". The Play link was opened: it loads "GlobalMed Transcriptions - Apps on Google Play". Footer badge + footer tests updated (7 passed); screenshots pm/screenshots/2026-10-01/footer-update/ (1920, 390).

- **Done (address):** `data/site.ts` `address` {lines, oneLine, postal}. Replaced:
  - the hard-coded footer address (`footer-compact.tsx`, short "44 Dilkusha Garden, Model Town, Lahore" → oneLine);
  - `lib/site.ts` contact.address (now the shared object) and `postalAddress` (→ oneLine; was "…, Pakistan"), used by the extended footer and llms.txt;
  - the Contact page (4 lines, one per line);
  - JSON-LD PostalAddress (streetAddress / addressLocality / addressRegion / postalCode / addressCountry as specified; postOfficeBoxNumber dropped);
  - Privacy and Terms (`{{address}}` placeholder filled from the source; Terms gets a short Contact section);
  - the chatbot (pinned knowledge, and the scripted contact answer now gives the office when asked);
  - docs/09.
  - No map link or embed exists. The registration success screen and the notification emails don't show an address, so nothing was added there.
  - Footer contact row: the address now uses the same box as the three links (13px, same line height); text tops identical on each line at 1920/1280/768/390, clean wrapping without stray dividers.
  - Screenshots pm/screenshots/2026-10-01/address/.

- **Done (home stats bar, years, slide gap):**
  - `StatsStrip variant="overlap"` (same component and `companyFacts` as About):
    - Placed after the hero; white card, 20px radius, the specified shadow, z-10.
    - Overlap: 72px (half the 144px card) from 1024px, 64px on tablets, 32px on phones.
    - Layout: 5 columns with #D9E3F0 dividers on desktop, 3 + 2 on tablets, 2 columns on phones (last item full width).
    - Label above, navy serif number below; count-up once, static with reduced motion.
    - `flow-root` stops the negative margin collapsing, so only the card (not the section's white background) covers the hero.
    - Our Services follows at the normal joined spacing (48/64/96).
  - Slider controls raised: bottom offset = overlap + 24px (56/88/96). Still keyboard accessible; dot clicks verified at every width.
  - No hero "curtain"/pinned effect exists in the code. The card sits in normal flow with the content after the hero, so it scrolls with that content.
  - Years in Healthcare 19+ → 25+: `content/company.ts` `companyFacts` is the one source (About `about.facts`, home card, chatbot pinned knowledge, docs/09).
  - Slide text: the invisible headline/text sizers (from the earlier equal-height brief) were removed. Headline → 20px → text → 32px → buttons on every slide; headline at the same top under the fixed lockup; leftover space below the buttons. Phone hero +24/+40px (704/660) so slide 1's buttons clear the raised controls.
  - CLS: the slider streams in after the page shell (deferred island), so with the card right below it the page jumped by a full screen (CLS 1.0). A box with the slider's height (`hero-size.ts`) now reserves its space → CLS 0.000 at all 7 widths; Lighthouse home mobile 86 / desktop 99, CLS 0.
  - Checks: `tests/audit/stats-overlap.mjs` and `slider-lockup.mjs` at 360/390/768/1024/1280/1440/1920 → 0 problems. Screenshots pm/screenshots/2026-10-01/stats-overlap/.
  - E2E 256 passed before test updates. home-services now expects the stats card between the hero and Our Services. about-story's fade check was flaky on live too (a fade paused at 0.999 while its content-visibility section was off screen); it now checks each block on screen. Both pass.

### Session 018 — Hero controls, stats animation, top contact bar
- **Date:** 2026-10-02
- **Done (hero controls):**
  - Slides now share one grid cell (no absolute stacking), so the hero is as tall as its tallest slide. Minimum heights per breakpoint (`hero-size.ts`) are the measured tallest slide + 8px, and the same box reserves the space before the deferred slider streams in (CLS 0). Desktop top padding fixed at 80px (was viewport-height based), so short laptop screens no longer push the buttons into the dots.
  - Slide bottom padding = overlap + 16 + 44 (controls row) + 32: buttons end 40–44px above the controls at every width.
  - Controls row 16px above the stats card: dots left (aligned with the text), pause/prev/next right; phones: dots centred, pause on the right, prev/next hidden (swipe + dots).
  - `slider-lockup.mjs` now hit-tests the centre of every visible button and control on every slide (`elementFromPoint`) and checks 44px targets: 0 problems at 7 widths. `stats-overlap.mjs`: 0 problems.

- **Done (stats animation):**
  - `CountUp`: only the number animates; prefix/suffix sit outside it. While counting, the number is padded with figure spaces to the final length, so the text keeps one width: the "+" stays fixed (measured 496–497px while counting 0 → 470) and there's no layout shift (right-aligning instead caused CLS 0.001–0.003).
  - 1.2s ease-out, once, starts when visible (immediately if visible on load); reduced motion shows the final number.
  - Hover (pointer only; items aren't links, so not focusable), shared by the home card and the About strip: lift 4px, #EEF6FC, 16px radius, number #3A73C2, 3px #51ACE3 underline growing from the centre, 200ms; the card's shadow strengthens. Reduced motion: colour only.
  - Item padding offset in the card so it stays 144px on desktop (72px overlap = half).
  - New `tests/e2e/stats-card.spec.ts` (count-up, +, hover styles, About, reduced motion): 4 passed. Audits 0 problems, CLS 0.

- **Done (top contact bar):**
  - `components/marketing/top-bar.tsx`: 44px sky (#51ACE3) bar above the sticky nav on every public page, including the 404 page.
  - Left: mail icon + info@ (mailto) · divider rgba(23,38,92,0.25) · phone icon + +92 300 419 8760 (tel:+923004198760). Navy #17265C 15px (5.9:1 on sky), 44px targets.
  - Right: social icons (Facebook, LinkedIn, Instagram, then YouTube/X) only when linked. **All social links in `data/site.ts` are still empty, so no icons show yet.**
  - Email and mobile come from `data/site.ts` `contactLinks` (lib/site.ts now reads them too).
  - The bar scrolls away; the nav stays sticky (scroll-padding 88px unchanged: anchors land at 88px, below the 65px nav).
  - Phones: icons only, centred.
  - New `tests/e2e/top-bar.spec.ts`: 8 passed. Full E2E: 270 passed, 58 skipped.

- **Done (no layout shift):**
  - The stats audit found CLS 0.018 at 360px. Traced: Source Serif 4 arrived after first paint and re-wrapped the slide 1 headline (fallback 4 lines → 5 lines).
  - Heading font now `display: "optional"` (ADR-035) → CLS 0.000 at all 7 widths in two full runs.
  - Lighthouse under machine load: CLS 0 on every run; performance scores noisy (desktop About 54/98/78 within one run), so no performance conclusion from this run.

- **Done (social links):**
  - `data/site.ts` social: Facebook, LinkedIn, Instagram set; YouTube and X empty (hidden). Shared `socialOrder` (Facebook, LinkedIn, Instagram, …) and `socialHoverClass` (rise 2px + 80% opacity; fade only with reduced motion) used by the top bar and the footer.
  - Links open in a new tab with rel noopener noreferrer, aria-label "GlobalMed on Facebook / LinkedIn / Instagram".
  - `lib/site.ts` `site.social` now reads the same links, so the Organization JSON-LD `sameAs` lists all three (and the hidden extended footer matches).
  - Links opened in Chrome:
    - Instagram → "Globalmed Transcriptions (@globalmedtranscriptions)" ✓.
    - Facebook → "GlobalMed School of Medical Billing & Coding | Lahore" (a GlobalMed page, but the school brand). **Client to confirm** this is the page to link.
    - LinkedIn → login wall (can't be checked without signing in); it is an /in/ (personal profile) URL, not /company/. **Client to confirm.**
  - E2E: top-bar (incl. new social + sameAs tests), footer badges, public site: 35 passed. Screenshots pm/screenshots/2026-10-02/social/ (top bar and footer at 1920 and 390).

### Session 019 — Updates (news) section
- **Date:** 2026-10-02
- **Step 1 (check):** no news/updates/announcements section on any visible page. The blog (/blog) is 4 markdown files in content/blog and not editable from the dashboard (Admin → Content was a placeholder; a `posts` table exists but is unused). The brief placed the section "after Why register (before credentials)", but Credentials comes before Why register on the home page: placed right after Why register (before How it works).
- **Done:**
  - 2A: migration 0007. `updates` table (title, 280-char summary, markdown body, category, image, link + label, publish date, expiry, pinned, draft/published).
    - RLS: public reads live only; admin/sales manage.
    - Public WebP image bucket.
    - kb kind "update".
    - Two [CLIENT TO CONFIRM] drafts.
    - `lib/updates/logic.ts`: live / scheduled / expired, pinned-first order, pagination, "2 Oct 2026" dates, slugs.
    - Cookie-less anon client for cached pages.
  - 2B: dashboard (Admin → Content → Updates and Sales → Updates, one shared list + form, phone-friendly).
    - Save draft / publish (a future date schedules it); pin; expiry; unpublish instead of delete.
    - Image upload resized to 1600×900 WebP.
    - Every change revalidates /, /updates and the sitemap.
    - Server-action limit raised to 6 MB; the share-image routes now ship the horizontal logo they use.
  - 2C/D: public pages.
    - Home "Latest Updates" after Why register: 3 latest live, pinned first, hidden when none; home revalidates every 60s, so scheduled/expired updates turn over on their own.
    - Update card: same radius, hover and spacing as other cards; equal heights.
    - /updates (category chips, 12 per page, empty state) and /updates/[slug] (updates with a full text).
    - NewsArticle JSON-LD; share image = the update's photo as JPEG, or the default card with the title.
    - Resources menu, both footers, sitemap.
  - 2F: chatbot.
    - Live updates go into every system prompt.
    - "When is the next batch?" quotes the latest live Batch & Enrollment update.
    - A "Latest updates" KB document is re-embedded on every change and on Re-sync.
  - Tests:
    - 16 unit tests for publish/expiry/order/dates/pagination/slugs/validation, plus 3 chatbot tests (202 unit total).
    - `tests/e2e/updates.spec.ts`: empty states, menu, footer, sitemap, card layout at 360/768/1280/1920.
    - Dashboard round trip (create → publish → pin → expire → unpublish → home + /updates) written, needs Supabase (`E2E_SUPABASE=1`).
- **Fixed during the checks (full E2E 281 passed, 0 failed):**
  - Regression from the stats commit (live since f07308c): count-up padding used figure spaces for every missing character, so a figure with a comma ("125,000+") was padded wider than itself. Now digits → figure space, , or . → punctuation space (same width).
  - /services and /free-billing-audit overflowed 360px when the heading font fell back (ADR-035): the fallback serif is wider, and "125,000+" no longer fit a 144px column. Strip numbers are now 24px on phones (30px from 640px) with a 24px column gap.
  - Category chip contrast 4.35:1 → navy text (AA).
- **Not verifiable yet:** with no Supabase project linked there are no live updates, so the home section stays hidden and the dashboard can't be signed into. The card layout was checked with styleguide samples (/styleguide#updates).
- **Files touched:** supabase/migrations/0007_updates.sql, lib/db/{types,anon}.ts, lib/updates/*, lib/validation/updates.ts, components/dashboard/updates/*, components/marketing/updates/*, app/(dashboard)/dashboard/{admin/content,sales/updates}/*, app/(marketing)/updates/*, app/(marketing)/page.tsx, app/sitemap.ts, lib/site.ts, lib/seo/json-ld.tsx, lib/auth/roles.ts, components/marketing/footer-compact.tsx, lib/ai/{guardrails,prompts,engine,kb}.ts, app/styleguide/page.tsx, next.config.ts, tests/*
- **Next:** link Supabase (apply 0001–0007), sign in as sales, run the round-trip E2E; client edits and publishes the two drafts.
- **Blockers:** Supabase org invite (P0-4).

### Session 020 — Small raised ® mark; About subtitle
- **Date:** 2026-10-03
- **Done:**
  - ® as a small superscript across the whole site, implemented once:
    - `components/ui/reg.tsx`: `withReg(text)` splits on "®" and wraps each in `<sup class="reg">`; `<Reg>` for literal JSX text; an `inline` option styles it inline for React Email.
    - `.reg` in app/globals.css: 0.5em, vertical-align super, line-height 0, 0.05em left margin, inherited weight.
    - Applied where content and data strings render: PageHero (eyebrow, title, intro, breadcrumbs), Section, CTA band, course cards (credential, full name, summary, facts, saving, Package Includes, Who it's for), course pages (all sections, tabs, Other AAPC courses), comparison table (headers, rows, cells), footer price card, both footers (links + trademark line), mega menu and mobile nav, FAQ accordion, claim journey (How it works), home services, instructors band, About story, update cards, empty states, form field descriptions (course price line), chat widget (greeting, quick replies, answers), the lead notification email's HTML part.
    - Markdown (blog, legal): a small rehype step in `Prose` after rehype-sanitize.
    - Left plain on purpose: `<title>`, meta descriptions, JSON-LD, alt text, aria labels and screen-reader-only text, `<option>` labels in the course select (can't hold markup), plain-text email parts, OG images.
  - About hero subtitle → "The leading medical transcription and billing company in Pakistan, since 2007." Also noted in docs/09 (chatbot knowledge). The About meta description doesn't use the sentence. The KB re-sync picks up the live About page.
- **Checks:**
  - Scan of all 41 sitemap pages (production build): 245 full-size ® before, 0 visible afterwards (the 12 left are screen-reader-only "Register Now for CPC®" / "Course details: CPC®" text).
  - New `tests/e2e/reg-mark.spec.ts`: no full-size ® on 9 key pages, and the mark is half size, raised, line height 0.
  - Chrome adds a space before a `<sup>` in accessible names ("View CPC ® & CPB ® Courses"); about-story.spec now matches either form.
  - Full E2E before the test fix: 280 passed, 1 failed (that name lookup); after it, the affected specs 17/17. Unit 202 (the chatbot-questions hook times out under parallel load; it passes alone, 21/21). Lint, typecheck, build clean.
  - Screenshots pm/screenshots/2026-10-03/reg/: course cards, CPC® + CPB® hero, About hero at 1920 and 390; no horizontal scroll at 390.
- **Files touched:** components/ui/reg.tsx (new), app/globals.css, components/marketing/{sections,aapc-course-card,aapc-course,certification-price-card,course-covers-tabs,faq-accordion,mega-menu,mobile-nav,site-footer,footer-compact,about-story,aapc-instructors-band,prose}.tsx, components/marketing/{home/claim-journey,home/services-overview,updates/update-card,chat/chat-widget}.tsx, components/ui/{empty-state,form-field,choice-field}.tsx, lib/email/templates/lead-notification.tsx, app/(marketing)/{page,faq/page,updates/page,school/aapc-certification-pakistan/page}.tsx, content/company.ts, docs/09_AI_CHATBOT_WHATSAPP.md, tests/e2e/{reg-mark,about-story}.spec.ts
- **Next:** client checks the live site; the About "Our Story" body still says "the leading medical transcription company in Pakistan" (a different sentence in the old story text, not shown while the new story is on). Change it too if the client wants.
- **Blockers:** Supabase org invite (P0-4).

---
### Session NNN — <title>
- **Date:**
- **Done:**
- **Files touched:**
- **Next:**
- **Blockers:**
-->
