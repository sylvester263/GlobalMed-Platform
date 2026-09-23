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
