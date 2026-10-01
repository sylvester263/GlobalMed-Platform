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

## ADR-027: Home services stack uses CSS sticky + page-scroll MotionValues; footer badges always shown
- Date: 2026-09-28 · Status: accepted (client request)
- Context: the client wants the four services as sticky stacking cards that scale and darken as the next card covers them. The "How it works" scroll bug (Session 007b) showed that pinning with transforms, or any transformed/clipping ancestor, breaks when scrolling up or after a reload.
- Decision: the cards are flat siblings in one container, CSS `position: sticky` at 88 + 28px × index, separated by 70vh spacer divs (not margins, which would unstick them early). A zero-height marker before each card records its natural position. Motion `useScroll()` (page scroll) + `useTransform` turns scroll into each card's arrival 0→1. The cards underneath get `scale = max(0.88, 1 − 0.04 × Σ arrivals above)` and a navy overlay at 10% × the next card's arrival. Only transform and opacity animate. All cards take the tallest card's height, so a taller card can't show below the one covering it. If that height doesn't fit the screen, the sticky top goes up (possibly negative) so the whole card stays readable. `md:motion-safe:` gates sticky and the spacers in CSS, so phones and reduced motion get plain cards in the server HTML. The page transition removes its class after animating, so no ancestor keeps a transform. Footer app badges use the official artwork and always show: a disabled "Coming soon" badge (aria-disabled, no href) until `data/site.ts` has the store URL. Lead exports go through an admin-only route handler with the user's RLS client, not the service role.
- Consequences: no GSAP for this section. Short viewports (~800px) show little of the stacked edges, because the cards are tall. The tall-card fallback keeps text readable instead. Cards must stay direct children of the stack wrapper, and no wrapper above them may add overflow or transform (e2e checks this).

## ADR-028: Claim-line motif removed site-wide at client request
- Date: 2026-09-28 · Status: accepted (client request)
- Context: the client asked to remove the ticked "claim line" (navy fill, light grey track, blue ticks) from every visible page. The motif was the design system's signature (MASTER.md §4, docs/15 §3). It drew the hero slider progress, the "How it works" connector, heading dividers, the service-card motif and the audit form progress.
- Decision: claim-line motif removed site-wide at client request; replaced by dots (slider), numbered steps (How it works) and plain step text with a solid bar (forms). `features.claimLine: false` makes `ClaimLine` and `PathwayLine` return null, so they reserve no space. `ClaimProgress` keeps its progressbar role and text. Nothing is deleted.
  - Slider: an invisible, zero-size `.slide-timer` runs the same 6s CSS clock, so autoplay, hover/focus pause and reduced motion are unchanged. Dots: active navy #283F93, others `dot-muted` #C9D6EE.
  - "How it works" (Home, AAPC page): numbered 48px navy circles with white numbers. A row from 1024px, a vertical list below. Visible in the server HTML with a one-time fade (`FadeInOnce`, now shared with the services stack). No sticky wrapper or scroll listeners.
  - Audit form: "Step x of y" plus a 4px rounded bar.
  - Dividers under headings and on the service cards: removed, no replacement. The "01–04" card numbers stay.
- Consequences: the design system has no signature motif until the client picks another. MASTER.md §4, docs/06 and docs/15 §3 are marked retired but kept. Hidden features (course progress, certificate, pathways, exam-passed) are covered by the same flag. Setting the flag to true restores the line everywhere, including the MG-3 scroll-linked "How it works".

## ADR-029: Fluid full-width container on desktop
- Date: 2026-09-28 · Status: accepted (client request)
- Context: the client wants the site to use the full desktop width instead of a fixed ~1200px column, while text stays readable.
- Decision: one shared `container-fluid` utility (app/globals.css) with tokens `--container-max: 1920px` and `--gutter` (20px on phones, 32px at 768–1023px, clamp(32px, 5vw, 96px) from 1024px). It replaces every `mx-auto max-w-300 px-4 md:px-6` container, plus the header, both footers and the hero slider; no per-section max-widths remain. Section backgrounds stay full-bleed; content centres at 1920px on wider screens.
  - Readability: a zero-specificity base rule caps `main p` at 75ch (any `max-w-*` class still wins).
  - Grids: services, specialties, service features and credential tiles go 1 / 2 / 3 / 4 columns at <768 / 768 / 1024 / 1440px, via a new `wide` breakpoint (90rem). An arbitrary `min-[1440px]:` variant sorted before `lg:` and lost.
  - "Our Services": the intro uses the full container, with the AAPC note beside the lead from 1280px (60/40). From 1024px the stacking cards span the container, min-height 560px, text 50% (padding clamp(32px, 4vw, 72px), paragraphs 65ch) and image 50% flush to the card edge. The article clips the image with `overflow: hidden`; the article is inside the sticky element, not an ancestor of it. The height measurement reads the text column, so the stretched grid doesn't feed back.
- Consequences: new sections must use `container-fluid`. The AAPC course cards stay at 3 columns (there are only three). The 768–1023px layouts are unchanged apart from the 32px gutter.

## ADR-030: Image pipeline: WebP masters + next/image (AVIF/WebP), JPG social images
- Date: 2026-09-30 · Status: accepted
- Context: 25 AI photos arrived at 2–3 MB each (pm/IMAGE_PLAN.md). The client wants the originals kept, WebP/AVIF at 640/960/1280/1920 (+2560 for banners) and size budgets (banners ≤350 KB at 1920, cards/heroes ≤180 KB, OG ≤250 KB JPG).
- Decision: `scripts/optimize-images.mjs` writes one WebP master per photo next to its original, cropped to the slot (banners 2560 wide, heroes and cards 1600×1200 4:3, blog covers 1920×1080 16:9), with a per-photo crop position chosen by eye. Pages use next/image on the master; `images.formats` = AVIF then WebP and `deviceSizes` = 640/750/828/960/1080/1280/1920/2560, so the responsive widths are produced and cached by the image optimizer rather than committed as files. Social share backgrounds are 1200×630 JPGs (`*-1200.jpg`); the Open Graph routes put the logo and title over them and re-encode to JPEG. The script prints a size report against the budgets (`--check`).
- Consequences: originals stay in public/ (unused, not linked). Re-run the script after replacing an original. Budgets are checked on the master at the budget width with quality 75 (next/image's default).

## ADR-031: Stop inlining CSS (experimental.inlineCss off)
- Date: 2026-09-30 · Status: accepted
- Context: `inlineCss` was turned on in P2-21, when the stylesheet was small. It is now 125 kB (23 kB gzipped), and Next.js inlines it into every page twice: a `<style>` tag and again in the RSC payload. Home HTML was 545 kB, of which ~260 kB was CSS; Lighthouse mobile showed 6.6 s of script evaluation and 3.0 s of style and layout on the home page.
- Decision: `experimental.inlineCss: false`. The CSS is a normal cached stylesheet again.
- Consequences: home HTML 545 → 279 kB; on the home page main-thread script evaluation 6.6 → 2.7 s and style/layout 3.0 → 1.6 s (Lighthouse mobile, local). One render-blocking stylesheet request (≈170–470 ms estimated by Lighthouse), cached across pages. Desktop Performance now 94–100 on the seven key pages. Mobile Performance is still 44–65: the remaining cost is hydration JavaScript, which predates this change (the live build scored 50–62). See pm/UI_UX_REPORT_2026-09-30.md.

## ADR-032: Own hosting (Hostinger), not Vercel
- Date: 2026-09-30 · Status: accepted (client decision)
- Context: CLAUDE.md §3 named Vercel as the host. The client runs the site on its own hosting (Hostinger Node.js) at https://papayawhip-narwhal-751592.hostingersite.com, which builds from GitHub `main`. `NEXT_PUBLIC_SITE_URL` was set nowhere, so canonical URLs, og:image, the sitemap and robots.txt all said `http://localhost:3000`.
- Decision: hosting is Hostinger; CLAUDE.md, docs/02, 03, 10, 14 and 17 updated where they described Vercel as the current host. `NEXT_PUBLIC_SITE_URL=https://papayawhip-narwhal-751592.hostingersite.com` is committed in `.env.production` (a public, non-secret value; Next.js reads it at build time, and a value set in the hosting panel still takes precedence). `/api/health` reports the commit baked in at build time (git), so any host can be checked. Vercel Analytics is dropped from the stack (it only works on Vercel).
- Consequences: crons, geo-IP pricing and preview deployments need hosting-side equivalents when those features are switched on. The old Vercel project (global-med-platform.vercel.app, global-med-platform-tljk.vercel.app) is still live and is a duplicate of the site: the client deletes it or adds noindex + a redirect. When the client's own domain goes live, change `.env.production` and redeploy.

## ADR-033: Deferred hydration and lean first loads on the public pages
- Date: 2026-10-01 · Status: accepted
- Context: live mobile Lighthouse was 56–63 on Home, About, AAPC Certification and CPC® (target 90). First-load JS was 213–278 kB; Motion, Base UI menus/dialogs/tooltips, sonner, zod and react-hook-form loaded on pages that didn't need them up front.
- Decision:
  - Keep client code only where it's interactive, and load it late: `components/defer/defer-hydration.tsx` renders full server HTML and hydrates later ("load": after the load event when idle, for the slider; "visible": within 400px of the screen, for the stacking cards, How it works, FAQ accordions). Hover, focus or touch starts loading at once; a button click that lands before hydration is caught on `window` and replayed once afterwards. The registration form hydrates on visibility the same way (React.lazy + Suspense).
  - The help menu and the certificate dialog load on first click; the form's success tick loads after submit.
  - No animation library on these pages: CSS fade (FadeInView), and small rAF scroll handlers for the stacking cards and the band background. Motion stays only in the service-page graphics and the success tick.
  - Tooltip/toast providers only in the dashboard and styleguide layouts. Public env parsed without zod. The course card lives apart from the registration form.
  - `prefetch={false}` on the footer and long link lists; the main nav keeps prefetching (client decision).
  - `content-visibility: auto` (`cv-auto`) on below-the-fold sections of Home and About, the footer and shared bands.
  - GSAP removed (unused since ADR-028); `sharp` declared; `@next/bundle-analyzer` (`ANALYZE=true npm run build`).
- Consequences: first-load JS home 278 → 138 kB, About 213 → 134, AAPC 250 → 146, CPC® 244 → 146. New interactive sections should go through `deferHydration` unless they are above the fold. Tests that read `innerText` of lazily rendered sections must scroll to them or use textContent.

## ADR-034: Website chatbot — AI SDK adapter, deterministic answers first, polling for visitors
- Date: 2026-10-01 · Status: accepted
- Context: Phase 7A (docs/09). The client supplies the LLM key (provider not chosen yet). Answers about prices, packages and who teaches must be exact, and the bot must never mention hidden courses or GlobalMed certificates. No Supabase project, LLM, Upstash or Turnstile keys exist yet, and our hosting may buffer streamed responses.
- Decision:
  - `ai` (AI SDK v7) + `@ai-sdk/openai|anthropic|google` behind `lib/ai/provider.ts`; the provider is chosen by `LLM_PROVIDER`. Embeddings are fixed at 1536 dimensions (matches the 0001 `vector(1536)`); Anthropic needs `EMBEDDING_PROVIDER` / `EMBEDDING_API_KEY`.
  - A deterministic layer (`lib/ai/guardrails.ts`) answers prices, packages, contact, delivery, who teaches/certifies, installments and batch dates from the site data before the model is called, refuses patient information (placeholder stored, never the text), and checks every model reply (unknown USD amounts, rupees, retired or hidden offerings → safe fallback). The bot works for those questions before any key is set.
  - Streaming as server-sent events with anti-buffering headers; `/api/chat/stream-check` tests the hosting.
  - Visitors never read the chat tables: the widget holds a random token (SHA-256 stored) and polls `/api/chat/messages` during handoff; staff get Supabase realtime under RLS.
  - Local dry run keeps chats in memory so the widget is testable without a database; production fails closed.
  - Lead/handoff links: leads carry `details.conversationId` (no new FK).
- Consequences: three new runtime dependencies (server-only, not in any page bundle). The widget loads on the first click, so page weight is unchanged. Polling adds a request every 4s only while a chat is with a person. Changing the embedding model to another size needs a migration.

## ADR-035: Heading font loads with font-display: optional
- Date: 2026-10-02 · Status: accepted
- Context: the hero headlines are set in Source Serif 4 (next/font, preloaded, size-adjusted fallback). With `display: swap`, a late font swap re-wrapped the slide 1 headline at 360px (4 → 5 lines), moving the text and buttons below it (CLS 0.018 in the stats audit; reproduced whenever the font arrived after first paint).
- Decision: Source Serif 4 uses `display: "optional"`; Public Sans (body) stays `swap`.
- Consequences: on almost every visit the font is ready before first paint (it is preloaded). On a slow first visit, that page shows the size-matched serif fallback instead of swapping; the font is cached for the next page. CLS 0 at all audited widths.
