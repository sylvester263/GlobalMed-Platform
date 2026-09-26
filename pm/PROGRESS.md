# PROGRESS — single source of truth

Last updated: 2026-09-26 · Current phase: **5 — Payments & enrollment** (card checkout built but hidden: AAPC registration form replaces it, ADR-026) · Overall: **43%**

| Phase | Status | % |
|---|---|---|
| 0 Foundation | 🟥 Blocked on client accounts (P0-4, P0-9) | 75 |
| 1 Design system | 🟨 Built; awaiting client sign-off (P1-7, P1-10) | 85 |
| 2 Public website | 🟨 Pages built; awaiting content review, motion assets, perf check on Vercel | 80 |
| 3 Auth & dashboard shells | 🟨 Built and tested without Supabase; end-to-end auth verification pending P0-4 | 90 |
| 4 LMS core | 🟨 Built and tested without Supabase/Bunny; signing formats + webhook verification pending (docs/17 §4) | 90 |
| 5 Payments & enrollment | 🟨 Card checkout + webhook built; manual payments next | 30 |
| 6 Quizzes, exams, certificates | ⬜ | 0 |
| 7 AI chatbot + WhatsApp | ⬜ | 0 |
| 8 CRM, analytics, marketing | ⬜ | 0 |
| 9 QA & launch | ⬜ | 0 |

Legend: ⬜ not started · 🟨 in progress · ✅ done · 🟥 blocked

## Phase 0 — Foundation
- [x] P0-1 Scaffold Next.js 15 + TS strict + Tailwind v4 + shadcn/ui
- [x] P0-2 ESLint, Prettier, Husky, lint-staged, commitlint
- [x] P0-3 Folder structure per docs/03 §5
- [ ] P0-4 Supabase projects (staging/prod) linked; 0001_init.sql applied — 🟥 blocked: Supabase org invite
- [ ] P0-5 Generated DB types in lib/db/types.ts — 🟨 provisional types generated from the migration SQL; rerun `npm run db:types` after P0-4
- [x] P0-6 Supabase SSR clients + middleware
- [x] P0-7 .env.local + .env.example synced
- [x] P0-8 GitHub Actions CI
- [ ] P0-9 Vercel staging deploy — 🟥 blocked: Vercel team invite
- [x] P0-10 Sentry installed (inert until SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN set)

## Phase 1 — Design system
- [x] P1-1 Run ui-ux-pro-max design system generation
- [x] P1-2 Write design-system/MASTER.md
- [x] P1-3 Tokens in globals.css + fonts via next/font
- [x] P1-4 Base components (docs/06 §6)
- [x] P1-5 /styleguide page
- [x] P1-6 Key screen designs: home, course detail, student dashboard, admin overview
- [ ] P1-7 Client design sign-off — 🟨 ready: /styleguide + /styleguide/screens/* + design-system/screens/*.png
- [x] P1-8 Motion tokens + lib/motion.ts + components/motion primitives
- [x] P1-9 Motion section in /styleguide with reduced-motion toggle
- [ ] P1-10 Motion graphics storyboard (hero, claim journey, pathway, exam-passed) approved by client — 🟨 storyboards in design-system/motion-storyboards/, awaiting approval

## Phase 2 — Public website
- [x] P2-1 Header/mega menu + footer
- [x] P2-2 Home
- [x] P2-3 Service pages (template + 6 pages)
- [x] P2-4 Specialties index + template
- [x] P2-5 Free billing audit form → leads — live once Supabase, Resend, Turnstile and Upstash keys are set (fails closed until then)
- [x] P2-6 School landing + catalog + course detail
- [x] P2-7 Pathways + exam prep + batches + corporate training
- [x] P2-8 Blog index/category/post
- [x] P2-9 About, team, careers, contact, FAQ
- [x] P2-10 Legal pages — drafts; counsel/compliance review required before launch
- [x] P2-11 Verify certificate page — live once Supabase is linked (P0-4)
- [x] P2-12 Metadata, sitemap, robots, JSON-LD, llms.txt
- [x] P2-13 WhatsApp click-to-chat + newsletter — needs the WhatsApp number and Resend segment
- [ ] P2-14 Content review with client — ⬜ [CLIENT TO CONFIRM] markers across content/ and pages (more added 2026-09-24 for the CPC®/CPB® home page)
- [ ] P2-15 Motion graphics produced (Lottie/Rive assets per docs/15 §6) — 🟥 external (motion designer); lib/motion-assets.ts switches each on
- [ ] P2-16 MG-1 hero sequence + MG-2 claim-form animation — 🟨 MG-1 done; MG-2 shows its poster until the asset arrives
- [x] P2-17 MG-3 scroll-scrubbed claim journey
- [ ] P2-18 MG-4 to MG-8 service & trust animations — 🟨 MG-4, MG-6, MG-7, MG-8 done; MG-5 icon animations need the Lottie icon set
- [ ] P2-19 MG-9 to MG-13 school & course animations — 🟨 MG-9, MG-11 done; MG-10 static until asset; MG-12 needs practice logos; MG-13 needs AAPC permission
- [ ] P2-20 MG-14 to MG-18 forms, verify, page transitions, menu, chat launcher — 🟨 MG-14–17 done; MG-18 moves to P7-4 with the chat widget
- [x] P2-22 Client review 2026-09-25: hero slider, Education rename (/education, ADR-024), AAPC Certification page, AAPC instructors band, credentials section, About rewrite, expanded footer — images/numbers pending client
- [x] P2-23 Business-model correction (ADR-026): AAPC partner only, 3 AAPC courses, registration form, GlobalMed education hidden behind flags; chatbot knowledge (docs/09) and wording sweep done
- [x] P2-24 AAPC course pages with confirmed packages and prices (CPC® USD 1,050 · CPB® USD 1,050 · CPC® + CPB® USD 1,600), comparison table, 10 FAQs, registration consent, public login links hidden
- [x] P2-25 "How it works" scroll-up bug fixed (CSS sticky, no GSAP pin); browser check 360/768/1280 ± reduced motion (138 checks) and E2E (146 pass, 53 skipped by flag); pm/CHANGE_REPORT_2026-09-26.md
- [ ] P2-21 Motion performance + reduced-motion QA — 🟨 reduced motion + CLS 0 verified; mobile perf 73–90 locally, re-measure on Vercel preview

## Phase 3 — Auth & dashboard shells
- [x] P3-1 Sign up / login / reset / verify email — server actions + /auth/confirm; live once Supabase is set up per docs/16
- [x] P3-2 Google OAuth — needs Google OAuth client in Supabase (docs/16 §3)
- [x] P3-3 Role guards + requireRole helper — requireUser / requireArea / authorize in lib/auth/session.ts
- [x] P3-4 Dashboard shell (sidebar, topbar, notifications)
- [x] P3-5 Student, instructor, admin, sales shells
- [x] P3-6 Admin MFA — TOTP enrolment + /mfa challenge; admins need aal2 for every area
- [x] P3-7 Dashboard motion DM-1, DM-9, DM-10

## Phase 4 — LMS core
- [x] P4-1 Course builder (modules/lessons CRUD, drag order) — dnd-kit + keyboard + up/down buttons; admin-only publish/price (DB trigger)
- [x] P4-2 Bunny upload (tus) + webhook for processing status — ⚠ signature verify on staging (docs/17 §4)
- [x] P4-3 Signed playback + player — 2h directory token, hls.js, watermark, captions, speed
- [x] P4-4 Resume position + rewatch
- [x] P4-5 Progress + continue learning — server-only writes, clamped positions; My courses + overview
- [x] P4-6 Resources, notes, Q&A — plus instructor Q&A inbox and Students page
- [x] P4-7 Drip rules — after lesson / days after enroll / date
- [x] P4-8 Batches (P1) — sessions (local time zones), members, announcements → notifications
- [x] P4-9 DM-2 progress animation + DM-3 lesson-complete animation

## Phase 5 — Payments & enrollment
- [x] P5-1 Orders + Stripe Checkout — /dashboard/student/checkout/[slug]; verify in Stripe test mode
- [x] P5-2 Stripe webhook → enrollment — fulfil_order() (ADR-025); verify with `stripe listen`
- [ ] P5-3 Manual payment + proof upload + admin approval
- [ ] P5-4 Geo pricing USD/PKR
- [ ] P5-5 Coupons + bundles
- [ ] P5-6 Receipts + orders page — 🟨 orders list + order status page done; receipts/PDF + email pending
- [ ] P5-7 Refunds / revoke

## Phase 6 — Quizzes, exams, certificates
- [ ] P6-1 Quiz builder + Aiken/CSV import
- [ ] P6-2 Server grading
- [ ] P6-3 Timed mock exams + review mode
- [ ] P6-4 Completion rules
- [ ] P6-5 Certificate PDF + storage + email
- [ ] P6-6 Verify page wired + revoke/reissue
- [ ] P6-7 DM-4 quiz feedback, DM-5 exam timer states, DM-6 exam-passed moment

## Phase 7 — AI chatbot + WhatsApp
- [ ] P7-1 LLM provider adapter
- [ ] P7-2 KB admin + chunk/embed pipeline
- [ ] P7-3 /api/chat streaming + guardrails
- [ ] P7-4 Web widget
- [ ] P7-5 Lead capture from chat
- [ ] P7-6 WhatsApp webhook + replies
- [ ] P7-7 Handoff inbox (realtime)
- [ ] P7-8 WhatsApp templates approved

## Phase 8 — CRM, analytics, marketing
- [ ] P8-1 Leads pipeline (kanban + table)
- [ ] P8-2 Lead detail + notes + assign
- [ ] P8-3 Admin KPIs + charts + daily_stats cron
- [ ] P8-4 Content manager (pages, posts, testimonials, FAQs)
- [ ] P8-5 Landing pages /lp/*
- [ ] P8-6 GTM/GA4/Pixel events + consent
- [ ] P8-7 Audit log viewer
- [ ] P8-8 DM-7 KPI/chart animation + DM-8 kanban drag

## Phase 9 — QA & launch
- [ ] P9-1 Unit + RLS + E2E suites green
- [ ] P9-2 Accessibility + Lighthouse ≥ 90 (with all motion enabled)
- [ ] P9-3 Security headers + pen-test checklist
- [ ] P9-4 Redirect map
- [ ] P9-5 UAT with client
- [ ] P9-6 Production cutover + DNS
- [ ] P9-7 Admin training + handover docs
- [ ] P9-8 Launch report + final invoice
