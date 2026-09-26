# Architecture & Change Decisions (ADR log)

<!-- Template
## ADR-NNN: Title
- Date:
- Status: proposed | accepted | superseded
- Context:
- Decision:
- Consequences (cost/time/risk):
-->

## ADR-001: Next.js 15 + Supabase as core stack
- Date: 2026-09-24 · Status: accepted
- Context: Need SEO-strong marketing site + authenticated LMS + dashboards; team already experienced with Supabase.
- Decision: Single Next.js App Router codebase on Vercel; Supabase for DB/Auth/Storage/pgvector.
- Consequences: One deployable, shared components; vendor costs on client accounts.

## ADR-002: Bunny Stream for video instead of Supabase Storage or YouTube
- Date: 2026-09-24 · Status: accepted
- Context: Paid course video must be protected and cheap at scale.
- Decision: Bunny Stream with token-auth HLS.
- Consequences: Extra vendor; low bandwidth cost; signed playback.

## ADR-003: Website does not process PHI
- Date: 2026-09-24 · Status: accepted
- Context: HIPAA obligations; website vendors not all under BAA.
- Decision: No PHI collection on site/LMS/chatbot; file exchange stays in GlobalMed's existing compliant systems.
- Consequences: Secure client portal would be a separate scoped project.

## ADR-004: Provider-agnostic LLM adapter
- Date: 2026-09-24 · Status: accepted
- Context: Client supplies LLM key; provider not yet confirmed.
- Decision: `lib/ai/provider.ts` adapter; pgvector for embeddings.
- Consequences: Embedding dimension must match chosen embedding model (default 1536; migrate if different).

## ADR-005: Dual payment rails (Stripe + manual)
- Date: 2026-09-24 · Status: accepted
- Context: International card buyers + Pakistani students paying by bank/JazzCash/Easypaisa.
- Decision: Stripe Checkout (USD) and admin-verified manual payments (PKR).
- Consequences: Admin workload for approvals; can add a local gateway later.

## ADR-006: Motion stack and signature animation
- Date: 2026-09-24 · Status: accepted
- Context: Client wants a motion-rich website; must keep Lighthouse ≥ 90 and WCAG 2.1 AA.
- Decision: Motion (motion/react) as default; GSAP ScrollTrigger only for scroll-scrubbed storytelling; dotLottie/Rive for illustrated assets, all lazy-loaded. One signature motif (the claim line) reused across hero, claim journey, pathway, progress and certificate.
- Consequences: Needs a motion designer for Lottie/Rive assets; strict performance budget in docs/15 §7.

## ADR-007: Patch Next 15's bundled PostCSS via npm override
- Date: 2026-09-24 · Status: accepted
- Context: `npm audit` flagged high-severity PostCSS advisories in next@15.5.26's pinned postcss@8.4.31. The auto-fix upgrades to Next 16, which changes the locked stack (CLAUDE.md §3).
- Decision: Stay on Next 15; `"overrides": { "next": { "postcss": "^8.5.23" } }` in package.json. Build verified green.
- Consequences: Remove the override when upgrading Next. If a Next patch ever breaks with the newer PostCSS, revisit.

## ADR-008: Sentry collects no request/user data
- Date: 2026-09-24 · Status: accepted
- Context: Sentry v11 collects request bodies, headers, cookies, query params, user info and gen-AI inputs by default. Forms and chat could carry PHI despite warnings (R3).
- Decision: Shared `lib/monitoring/sentry-options.ts` disables every `dataCollection` category on server, edge and client. Sentry only runs when a DSN is set.
- Consequences: Less debugging context per error; add a specific non-sensitive field only through a new ADR.

## ADR-009: Provisional DB types until Supabase is linked
- Date: 2026-09-24 · Status: accepted (temporary)
- Context: CLAUDE.md requires typed clients from `supabase gen types`, but the Supabase project isn't available yet.
- Decision: Generate `lib/db/types.ts` from `supabase/migrations/0001_init.sql` in the same shape (no relationship metadata). Replace with `npm run db:types` as soon as P0-4 is done.
- Consequences: Nested-select typing is weaker until real types land; any schema change must also regenerate the file.

## ADR-010: CSS scroll-driven reveal instead of Motion whileInView
- Date: 2026-09-24 · Status: accepted
- Context: Motion's `whileInView` writes opacity:0 into server HTML, so below-the-fold content is invisible without JavaScript, in print, and until scrolled into view. docs/15 requires that content never depend on animation.
- Decision: Reveal/StaggerGroup are server components using CSS `animation-timeline: view()` inside `@supports` and `prefers-reduced-motion: no-preference`. All other docs/15 motion still uses Motion.
- Consequences: Zero JS for reveals and content always visible. Reveals scrub with scroll instead of playing once; Firefox shows content without animation.

## ADR-011: TanStack Table v9
- Date: 2026-09-24 · Status: accepted
- Context: npm's latest is v9 (feature-registration API); most examples online are v8.
- Decision: Use v9. `components/dashboard/data-table.tsx` registers sorting + pagination; define columns with `dataTableColumns<T>()`.
- Consequences: Add features (filtering, selection) to `dataTableFeatures` when needed; don't copy v8 snippets.

## ADR-012: Components built from shadcn/ui while 21st.dev Magic is unavailable
- Date: 2026-09-24 · Status: accepted (temporary)
- Context: CLAUDE.md §5 asks for 21st.dev Magic generation; the Magic MCP isn't connected in this environment (needs TWENTYFIRST_API_KEY).
- Decision: Build base components from shadcn/ui (Base UI), restyled to MASTER.md tokens. Use Magic for richer marketing sections once connected, always restyled to tokens.
- Consequences: None for consistency: every component follows MASTER.md.

## ADR-013: Sentry browser SDK loads lazily
- Date: 2026-09-24 · Status: accepted
- Context: The Sentry browser SDK added ~65 kB gzipped to every page, even without a DSN, threatening Lighthouse ≥ 90.
- Decision: `instrumentation-client.ts` dynamically imports Sentry only when NEXT_PUBLIC_SENTRY_DSN is set. Server/edge Sentry unchanged.
- Consequences: Client errors in roughly the first second, before the SDK loads, aren't captured.

## ADR-014: Typed content files until the CMS exists
- Date: 2026-09-24 · Status: accepted
- Context: CLAUDE.md asks for copy in content/*.md, but services, courses and FAQs are structured data used across many pages; the CMS tables arrive in Phase 8 and courses move to Supabase in Phase 4.
- Decision: Structured content in content/*.ts validated by zod schemas (lib/content/schema.ts) at build time; long-form blog and legal copy in Markdown with validated frontmatter. Pages read through lib/content so the source can swap to Supabase without touching callers.
- Consequences: Content edits need a deploy until Phase 8. A content-integrity unit test catches broken references, long titles and bundle pricing errors.

## ADR-015: CSS-first motion primitives; Motion only where physics matter
- Date: 2026-09-24 · Status: accepted (refines docs/15 §1 and ADR-006)
- Context: Lighthouse showed the Motion runtime hydrating dozens of decorative claim-line elements on every page (over 1 s of throttled mobile CPU).
- Decision: ClaimLine, PathwayLine, Reveal/StaggerGroup, PageTransition and the hero CTA settle are CSS (keyframes and scroll-driven timelines, final state where unsupported). CountUp uses a small rAF loop. Motion (m.* inside <MotionFeatures>) remains for quiz feedback, seal/check stamps, service-page graphics and future dashboard motion. GSAP is loaded only on desktop for MG-3.
- Consequences: Motion loads only on pages that need it; "inView" draws scrub with scroll rather than playing once; Firefox shows final states. Visual intent of docs/15 is unchanged.

## ADR-016: Disclosure navigation instead of a menu widget
- Date: 2026-09-24 · Status: accepted
- Context: Base UI's NavigationMenu (with its positioning engine) was the heaviest client component on every page. WAI-ARIA recommends the disclosure pattern for site navigation.
- Decision: components/marketing/mega-menu.tsx uses buttons with aria-expanded and plain link panels; Escape/click-outside/route change close; focus returns to the trigger. The mobile sheet is loaded on first interaction.
- Consequences: Lighter header; arrow-key roving between top-level items isn't provided (not required by the disclosure pattern).

## ADR-017: Public forms fail closed
- Date: 2026-09-24 · Status: accepted
- Context: Forms depend on Supabase, Resend, Turnstile and Upstash, none of which are provisioned yet.
- Decision: Without Turnstile or storage, submissions are refused with a clear message; a lead is only reported as sent once it's stored. FORMS_DRY_RUN=true allows local click-through outside production only. Rate limiting falls back to per-instance memory when Upstash is missing (production must set Upstash). Newsletter confirmation happens on POST so link scanners can't subscribe people.
- Consequences: Forms can't go live until the accounts in pm/CLIENT_INPUTS_NEEDED.md are provided.

## ADR-018: Dashboards live under /dashboard/{area}
- Date: 2026-09-24 · Status: accepted
- Context: CLAUDE.md §4 names app/(dashboard)/student|instructor|admin, which would serve /student etc., while docs/05 (sitemap) and robots rules use /dashboard/student.
- Decision: app/(dashboard)/dashboard/{student,instructor,admin,sales} plus /dashboard/account; /dashboard redirects to the role's home. The (dashboard) group still holds all dashboard code.
- Consequences: One prefix to protect in middleware and robots. CLAUDE.md §4's folder names are read as "inside (dashboard)".

## ADR-019: Auth design
- Date: 2026-09-24 · Status: accepted
- Context: docs/11 §2–3 (verified email, MFA for admins, server-side role checks, rate limits).
- Decision: Supabase Auth via server actions (no client SDK sign-in), token-hash email links through /auth/confirm, role read from profiles on every request (never from the client), admins require aal2 for every dashboard area and admin action, same response for existing/non-existing accounts on sign-up and reset, same-site-only redirects. Middleware only runs on session routes.
- Consequences: Supabase email templates must be edited (docs/16 §2). Marketing pages stay static and fast.

## ADR-020: Progress is written only by the server; course governance in the database
- Date: 2026-09-24 · Status: accepted
- Context: progress drives certificates (docs/08 §3). Instructors own course content but not publishing or pricing (docs/07 §3).
- Decision: students get read-only RLS on `lesson_progress`. All writes go through `lib/lms/progress-service.ts` (service role). It checks the enrollment and unlock state and clamps position jumps: the first save is capped at 60 s, and after that each save may advance at most elapsed×2+30 s. Videos complete at 90% of their duration, and completion is never undone. A trigger (`guard_course_admin_fields`) stops non-admins from changing status, prices, access period or instructor, even through the REST API.
- Consequences: a bit more server load per heartbeat (every 15 s plus a beacon on leave). Certificate logic in Phase 6 can trust `lesson_progress`.

## ADR-021: Bunny Stream with direct HLS and a directory token
- Date: 2026-09-24 · Status: accepted (pending staging verification, docs/17 §4)
- Context: we need signed, short-lived playback, our own player (resume, speed, watermark, progress), and uploads of up to 5 GB without passing them through Vercel.
- Decision: the browser uploads with tus straight to Bunny, using a signature from `/api/video/upload`. Playback uses a native `<video>` plus hls.js (Safari plays HLS natively), fed a 2-hour CDN directory-token URL from `/api/video/token`. The Bunny embed iframe is not used. The webhook is authenticated by a secret query token, and it re-fetches the video status from the Bunny API rather than trusting the payload.
- Consequences: we maintain our own player. The token format must be confirmed against a live library.

## ADR-022: Public catalog stays on content files until Phase 8
- Date: 2026-09-24 · Status: accepted
- Context: the LMS now has DB courses, but the marketing catalog (ADR-014) is static, SEO-tuned content.
- Decision: `/school/courses/*` keeps reading `content/courses.ts`. The LMS (`/learn`, dashboards) reads the database. The two are matched by slug. Phase 8 (CMS) moves the catalog to the database.
- Consequences: a course has to exist in both places, with the same slug, until Phase 8. Admins are reminded of this in docs/17.

## ADR-023: Logo palette replaces the teal/gold palette; home page leads with CPC® and CPB® training
- Date: 2026-09-24 · Status: accepted (client request)
- Context: the client supplied the official logo (`public/logo.png`) and asked for its colours site-wide, and for the home page to present GlobalMed as AAPC's strategic training partner in Pakistan, with US billing services lower down.
- Decision: new tokens `navy`, `navy-hover`, `sky`, `mid-blue`, `ink`, `surface-soft` in `app/globals.css`. The old token names (`teal`, `mint`, `gold`, `ledger`) stay as aliases pointing at the new values, so components kept their classes. `success-ink` and `warning-ink` were added because the requested success (#1E8E5A) and warning (#D98A0B) fail 4.5:1 as text. Secondary buttons are a mid-blue outline, filled on hover. The footer is navy; the CTA band stays ink so it doesn't merge with the footer. The logo is used as supplied through `components/marketing/wordmark.tsx`, on a white plate on dark bands. The collapsed sidebar crops it to the icon with `object-position`. The favicon (`app/favicon.ico`, `app/icon.png`) is cropped from the icon.
- Consequences: the design system is the logo palette (MASTER.md §1). AAPC partnership wording and the AAPC logo now appear on the home page. This relies on AAPC's written permission, which is still an open client input. The `/school/aapc-partnership` page stays behind its feature flag.

## ADR-024: "School" becomes "Education"; /education URLs via rewrites
- Date: 2026-09-25 · Status: accepted (client review)
- Context: the client renamed the education brand to "GlobalMed Education" and wants /education URLs, while existing /school links (ads, emails, search results) must keep working.
- Decision: pages stay in `app/(marketing)/school/*`. `next.config.ts` rewrites `/education` and `/education/:path*` to them, so both URLs render the same page. Nav, footer, breadcrumbs, canonicals and the sitemap use `/education` (`educationBase` in `lib/site.ts`). Visible labels say "Education"; `site.schoolName` is "GlobalMed Education".
- Consequences: one set of page files, no redirects. Canonicals point at /education, so search engines consolidate on the new URLs. A later cleanup may move the folder and 301 /school.

## ADR-025: Card payments are fulfilled only by the webhook, atomically in the database
- Date: 2026-09-26 · Status: accepted (pending Stripe test-mode verification)
- Context: docs/10 §3. Enrollment must never depend on the browser returning from Stripe, and a replayed or tampered event must not grant access.
- Decision: `startCardCheckout` (server action) reads the price from the database, creates a pending order and its line, then a Checkout Session with `metadata.order_id` and idempotency key `checkout:<order id>`. `/api/stripe/webhook` verifies the signature on the raw body, skips event ids already in `stripe_events`, and calls `fulfil_order()`. That's a security-definer function, not executable by anon/authenticated. In one transaction it locks the order, checks the charged amount and currency against the order, marks it paid, increments the coupon and grants or extends every course on it (bundles expanded). Re-buying extends from the later of now and the current expiry. Delayed payment methods wait for `async_payment_succeeded`; expired sessions cancel the order. Database errors return 500 so Stripe retries.
- Consequences: manual-payment approval (P5-3) reuses `fulfil_order` with `p_verified_by`. Students have no insert policy on `orders`; all order writes are server-side. The success page polls briefly because the webhook can land a few seconds after the redirect.

## ADR-026: GlobalMed is AAPC's Strategic Partner, not a school; own education hidden behind flags
- Date: 2026-09-26 · Status: accepted (client business-model correction)
- Context: GlobalMed does not teach, run classes (onsite or online) or issue certificates. AAPC faculty teach AAPC's online courses and AAPC awards CPC®/CPB®. Only three AAPC courses are offered. GlobalMed's own education plans are future scope and must be hidden, not deleted.
- Decision: `config/features.ts` holds one flag per hidden feature (own courses, landing, pathways, batches, corporate training, exam prep, onsite training, training stats, learning platform, instructor dashboard, certificates, online checkout, exam-passed moment, education JSON-LD). `config/hidden-routes.ts` turns them into temporary redirects in `next.config.ts` (to /education/aapc-certification-pakistan; old CPC/CPB course URLs to /education/cpc and /education/cpb). Data uses `visible: false`; nav, footer, sitemap, llms.txt, dashboard sections and legal pages filter by flag (`<!-- feature:flag -->` blocks in markdown). The three AAPC courses live in `data/courses.ts`. Online checkout is replaced by the "Register for AAPC Training" form, stored as leads (source `aapc_registration`) and shown in the new sales leads pipeline and the admin overview.
- Consequences: turning a flag back on restores the feature with no code changes, but its copy needs a review against this model first. Phase 5 checkout and Phase 4/6 learning features stay built but unreachable. Student sign-up is hidden with the learning platform.
