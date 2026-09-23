# Task Backlog (detail for each PROGRESS item)

Format: **ID — task** · depends on · definition of done

## Phase 0
- **P0-1** Scaffold · – · `npm run dev` shows placeholder home; TS strict on
- **P0-4** Supabase · P0-1 · migrations applied on staging; RLS enabled on all tables (check `select tablename from pg_tables where schemaname='public'` vs policies)
- **P0-6** SSR auth · P0-4 · `lib/db/server.ts`, `lib/db/client.ts`, `middleware.ts` refresh session
- **P0-8** CI · P0-2 · PR shows green checks for typecheck/lint/test/build
- **P0-9** Staging · P0-8 · preview URL shared with client

## Phase 1
- **P1-1** ui-ux-pro-max · P0 · run its design-system generation with the brief in docs/06 §2; save raw output to design-system/ui-ux-pro-max-output.md
- **P1-2** MASTER.md · P1-1 · tokens, type, spacing, radius, component rules, anti-patterns; conflicts with docs/06 resolved and noted
- **P1-4** Components · P1-3 · each component in /styleguide with default/hover/focus/disabled/error states; axe clean
- **P1-6** Key screens · P1-4 · 4 screens built in code (not static images) at 360/1280, screenshots in design-system/screens/

- **P1-8** Motion primitives · P1-3 · lib/motion.ts matches docs/15 §2; each primitive has a reduced-motion branch; unit-rendered in /styleguide
- **P1-10** Storyboard · P1-2 · frame-by-frame storyboard (6–8 frames each) for MG-1, MG-2, MG-3, MG-9, DM-6 saved to design-system/motion-storyboards/ and approved

## Phase 2
- **P2-5** Audit form · P1 · zod schema, Turnstile, rate limit, inserts lead, emails sales, GA4 `audit_request`, thank-you page
- **P2-6** Catalog · P1 · filters in URL params, server-side filtering, empty state, JSON-LD Course on detail
- **P2-12** SEO · all pages · Lighthouse SEO 100 on sampled pages; sitemap lists all published entities

- **P2-15** Assets · P1-10 · .lottie/.riv files ≤ 150KB each in public/motion/, posters in public/motion/posters/, source files in client drive
- **P2-17** Claim journey · P2-16 · GSAP ScrollTrigger scrubbed, pinned on desktop only, becomes static stacked steps on mobile < 768px and with reduced motion
- **P2-21** Motion QA · P2-16..20 · home mobile Lighthouse ≥ 90, CLS 0, LCP unchanged vs no-motion build; axe clean; reduced-motion walkthrough recorded

## Phase 4
- **P4-2** Bunny upload · P4-1 · resumable upload from browser; lesson shows processing → ready via Bunny webhook
- **P4-3** Playback · P4-2 · non-enrolled user gets 403 from /api/video/token; token expires; HLS plays on iOS Safari
- **P4-4** Resume/rewatch · P4-3 · reopening a lesson resumes within 15s of last position; completed lesson shows "Watch again"

## Phase 5
- **P5-2** Webhook · P5-1 · replaying the same event does not double-enroll (idempotency test)
- **P5-3** Manual · P5-1 · proof in private bucket; approve/reject emails; audit log entry

## Phase 6
- **P6-2** Grading · P6-1 · answers never in client payload before submit (verify in network tab test)
- **P6-3** Exam timer · P6-2 · server enforces limit even if client clock is changed
- **P6-5** Certificates · P6-4 · PDF matches design; QR resolves to verify page

- **P6-7** Exam-passed moment · P6-5 · ≤ 2s, skippable with Esc/click, reduced-motion version shows result instantly

## Phase 7
- **P7-3** Chat API · P7-2 · streams; refuses PHI; answers pricing from KB; rate limited
- **P7-6** WhatsApp · P7-3 · signature verified; replies within 24h window; templates outside it
- **P7-7** Handoff · P7-6 · agent reply reaches user on both channels; bot paused while handoff = true

## Phase 9
- **P9-5** UAT · all · client signs UAT script in docs/13 §2
