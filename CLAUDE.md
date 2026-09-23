# CLAUDE.md — GlobalMed Platform

You are the lead engineer building the GlobalMed Transcriptions & Billing Solutions website and School of Billing and Coding platform for SylJo Tech. Follow these rules in every session.

## 1. Start of every session
1. Read `pm/PROGRESS.md`, then the last 3 entries of `pm/SESSION_LOG.md`.
2. Read the docs file(s) for the phase you are working on. Do not re-read the whole pack each time.
3. State the next open task and start it. Do not ask for permission to continue unless a task is blocked by a client input listed in `pm/CLIENT_INPUTS_NEEDED.md`.

## 2. End of every session (or when told "checkpoint")
1. Tick finished items in `pm/PROGRESS.md` and update the phase percentage.
2. Add a `pm/SESSION_LOG.md` entry: date, what was done, files touched, what's next, blockers.
3. Record any architecture choice in `pm/DECISIONS.md`.
4. Commit with a Conventional Commit message.

## 3. Tech stack (do not change without an ADR in pm/DECISIONS.md)
- Next.js 15 (App Router, Server Components, Server Actions), TypeScript strict
- Tailwind CSS v4, shadcn/ui, 21st.dev Magic MCP components, lucide-react
- Motion (motion/react) for UI animation, GSAP + ScrollTrigger for scroll-scrubbed sections, dotLottie / Rive for motion-graphic assets — rules in docs/15_MOTION_DESIGN.md
- Supabase: Postgres, Auth, Storage, Edge Functions, pgvector, Row Level Security on every table
- Video: Bunny Stream (signed, token-authenticated playback)
- Payments: Stripe Checkout + webhooks; manual bank-transfer flow for local students
- Email: Resend + React Email
- Certificates: @react-pdf/renderer + public verification page with QR code
- AI chatbot: client-supplied LLM API behind a server route, RAG over pgvector
- WhatsApp: Meta WhatsApp Cloud API webhook
- Forms/validation: react-hook-form + zod
- Data tables/charts: TanStack Table, Recharts
- Monitoring: Sentry, Vercel Analytics; GA4 + GTM + Meta Pixel for marketing
- Hosting: Vercel (app), Supabase (data)

## 4. Code rules
- `app/(marketing)` public site, `app/(auth)` auth, `app/(dashboard)/student|instructor|admin` dashboards, `app/api` route handlers.
- Business logic in `lib/`, database access in `lib/db/` using typed Supabase clients generated with `supabase gen types`.
- Server Components by default. `"use client"` only when interactivity requires it.
- Every mutation is a Server Action or route handler that validates input with zod and checks the user's role server-side.
- Never expose the Supabase service role key to the client. Never trust a role sent from the browser.
- No `any`. No unused code. No console.log in committed code.
- Every new table ships with RLS policies in the same migration.
- All secrets live in `.env.local`; add every new variable to `.env.example`.

## 5. UI rules
- Before building any page, lock the design system with UI UX Pro Max and keep `design-system/MASTER.md` as the source of truth.
- Use 21st.dev Magic (`/ui ...`) for component generation, always pasting the locked tokens from `design-system/MASTER.md` into the prompt so components stay consistent.
- The public site takes structural inspiration from aapc.com (information architecture, course catalog patterns, certification pathways). Do NOT copy AAPC's logo, brand colors, imagery, copy or trademarks.
- AAPC name/logo appears only where the client has written permission (see pm/CLIENT_INPUTS_NEEDED.md).
- Accessibility: WCAG 2.1 AA, visible focus, keyboard navigable, reduced motion respected, Lighthouse ≥ 90 on all four scores.
- Mobile-first. Test at 360px, 768px, 1280px.
- Motion: follow docs/15_MOTION_DESIGN.md. Use tokens from lib/motion.ts, use `/motion` for new animations, always ship the reduced-motion version, never let animation delay LCP or cause CLS.

## 6. Compliance rules
- The public website and LMS must not collect Protected Health Information (PHI). Lead forms ask for business info only. Chatbot tells users not to share patient data and never stores it intentionally.
- Any feature that would handle PHI (client document uploads for transcription) is out of scope unless an ADR and a BAA-covered architecture are approved.

## 7. Brand
- Company building this: "SylJo Tech". Footer credit: "Designed & developed by SylJo Tech".
- Client brand name: "GlobalMed Transcriptions and Billing Solutions"; short form "GlobalMed".
- Education brand: "GlobalMed School of Billing and Coding".
