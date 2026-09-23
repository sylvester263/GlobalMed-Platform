# 03 — System Architecture

## 1. High-level diagram

```mermaid
flowchart LR
  subgraph Users
    V[Visitor] --- S[Student] --- I[Instructor] --- A[Admin / Sales]
    W[WhatsApp user]
  end

  subgraph Vercel["Vercel — Next.js 15 app"]
    MKT[Public site<br/>app/(marketing)]
    DASH[Dashboards<br/>app/(dashboard)]
    API[Route handlers<br/>app/api/*]
    SA[Server Actions]
  end

  subgraph Supabase
    AUTH[Auth]
    DB[(Postgres + RLS<br/>+ pgvector)]
    ST[Storage<br/>PDFs, avatars, receipts]
    EF[Edge Functions<br/>cron jobs]
  end

  BUNNY[Bunny Stream<br/>video]
  STRIPE[Stripe]
  RESEND[Resend email]
  LLM[Client's LLM API]
  WA[WhatsApp Cloud API]
  GA[GA4 / GTM / Meta Pixel]
  SENTRY[Sentry]

  V & S & I & A --> MKT & DASH
  MKT & DASH --> SA --> DB
  DASH --> BUNNY
  API --> STRIPE
  STRIPE -- webhook --> API
  API --> RESEND
  API --> LLM
  W <--> WA <--> API
  SA & API --> AUTH
  EF --> DB & RESEND
  MKT --> GA
  Vercel --> SENTRY
```

## 2. Stack and why
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SEO-friendly SSR/SSG for marketing + app dashboards in one codebase |
| UI | Tailwind v4 + shadcn/ui + 21st.dev Magic | Fast, consistent, owned component code |
| DB/Auth/Storage | Supabase | Postgres + RLS + Auth + Storage in one; team already uses it |
| Video | Bunny Stream | Low cost per GB, token-authenticated playback, HLS, captions |
| Payments | Stripe + manual flow | International cards + local Pakistani payment reality |
| Email | Resend + React Email | Simple, reliable transactional email |
| AI | Client LLM via provider-agnostic adapter | Client supplies key; can swap providers |
| Vector search | pgvector in Supabase | No extra vendor for RAG |
| Rate limit | Upstash Redis | Protect auth, forms, chatbot, webhooks |
| Anti-spam | Cloudflare Turnstile | Privacy-friendly CAPTCHA alternative |

## 3. Rendering strategy
| Area | Strategy |
|---|---|
| Home, service, specialty, about, legal | Static (SSG) with on-demand revalidation when admin edits |
| Course catalog & course detail | ISR (revalidate on course update) |
| Blog | ISR |
| Dashboards | Dynamic, server-rendered per user |
| Certificate verify | Dynamic, cached 1 hour |

## 4. Core flows

**Enrollment (Stripe)**
Course page → "Enroll" → Server Action creates `orders` row (pending) → Stripe Checkout Session → Stripe webhook `checkout.session.completed` → verify signature → mark order paid → create `enrollments` row → send receipt + welcome email → redirect student to course player.

**Enrollment (manual payment)**
Checkout → choose "Bank transfer / JazzCash / Easypaisa" → upload proof → order `awaiting_verification` → admin approves in dashboard → enrollment created → email.

**Lesson playback**
Player requests `/api/video/token?lessonId=` → server checks active enrollment → returns Bunny signed URL (expires in 2h) → player reports progress every 15s via Server Action → `lesson_progress` upserted.

**Certificate**
On lesson completion or exam pass → DB function `check_course_completion()` → if rules met, insert `certificates` row with unique code → Edge Function renders PDF → stored in Storage → email with link.

**Chatbot**
Widget → `/api/chat` (streaming) → rate limit → embed question → pgvector similarity search on `kb_chunks` → prompt with guardrails + retrieved context → client LLM → stream answer → log conversation → if intent = lead or human requested → create lead + notify sales.

**WhatsApp**
Meta webhook → `/api/whatsapp/webhook` → verify signature → same chat engine → reply via Cloud API → handoff flag pauses bot so a human replies from the admin inbox.

## 5. Folder structure
```
app/
  (marketing)/            # public pages
    page.tsx
    services/[slug]/
    specialties/[slug]/
    school/
      courses/[slug]/
      pathways/
    blog/[slug]/
    verify/[code]/
    about/ contact/ faq/ legal/[slug]/
  (auth)/login/ signup/ reset/ verify-email/
  (dashboard)/
    student/ instructor/ admin/ sales/
  learn/[courseSlug]/[lessonId]/   # distraction-free course player
  api/
    chat/ whatsapp/webhook/ stripe/webhook/ video/token/ revalidate/
components/
  ui/            # shadcn + 21st.dev base
  marketing/     # sections
  dashboard/     # tables, charts, stat blocks
  lms/           # player, curriculum, quiz, exam
  chat/          # widget
lib/
  db/            # typed supabase clients, queries
  auth/          # role guards
  payments/      # stripe, manual
  video/         # bunny signing
  ai/            # llm adapter, rag, prompts
  whatsapp/
  email/         # react-email templates
  validation/    # zod schemas
  seo/           # metadata + json-ld builders
content/         # markdown copy until CMS entries exist
supabase/
  migrations/ functions/ seed.sql
design-system/MASTER.md
tests/ (unit, e2e)
```

## 6. Environments
| Env | URL | Data |
|---|---|---|
| Local | localhost:3000 | Supabase local (CLI) |
| Staging | staging.globalmedtranscriptions.com (Vercel preview) | Supabase staging project |
| Production | globalmedtranscriptions.com | Supabase production project |

## 7. Scalability notes
- Video bandwidth is the main variable cost → Bunny, not Supabase Storage.
- Chatbot cost controlled by rate limits, max tokens, and caching common answers.
- Heavy reports computed by nightly Edge Function into summary tables.
