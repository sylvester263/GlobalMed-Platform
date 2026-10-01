# 09 — AI Chatbot and WhatsApp

## 1. Purpose
Answer questions about GlobalMed's services (medical transcription, billing and coding) and about the three AAPC courses GlobalMed registers students for, capture leads and course registrations, and hand off to a human when needed. It is complimentary in the contract and runs on the **client's own LLM API key**.

**Business model (client, 2026-09-26; ADR-026).** GlobalMed Transcriptions is a services company and **AAPC's Strategic Partner in Pakistan** for medical billing and coding. GlobalMed does **not** teach, run classes (online or onsite) or issue certificates. AAPC faculty teach AAPC's live, instructor-led online courses, and AAPC awards the certification. Approved role line (client, 2026-09-28), use verbatim: "As AAPC's Strategic Partner in Pakistan, we support students throughout the enrollment process by coordinating batch schedules, payment processing, and access to required books and online learning resources. AAPC provides the training and credentials."

## 2. Architecture
- `lib/ai/provider.ts` — adapter interface `generate(messages, opts)` and `embed(text)`; implementations for OpenAI / Anthropic / Gemini selected by `LLM_PROVIDER`.
- `lib/ai/rag.ts` — embed query → `match_kb()` top 5 → build context.
- `lib/ai/prompts.ts` — system prompt + guardrails.
- `/api/chat` — streaming route for the web widget.
- `/api/whatsapp/webhook` — GET verify, POST receive; signature verified with `WHATSAPP_APP_SECRET`.
- Same engine for both channels; channel-specific formatting (WhatsApp: short, no markdown tables).

## 3. Knowledge base
Sources: service pages, the three AAPC course pages, the training FAQs, policies, admin-added documents. GlobalMed's own courses, pathways, batches and certificates are hidden (`config/features.ts`) and must **not** be indexed while their flags are off.

**Pinned knowledge document.** Generate it at build/seed time from these files, so the bot never drifts from the site:
- `lib/site.ts`: contact details
- `data/courses.ts`: courses, packages and prices
- `content/courses/*.ts`: course descriptions
- `content/aapc.ts`: approved wording and FAQs

When an admin edits a document: chunk (≈800 tokens, 100 overlap) → embed → replace the chunks.

### 3.1 Company facts (client-confirmed)
- Address (single source `data/site.ts`, 2026-10-01): 44 Dilkusha Garden, Near S Block Ext., Model Town, Lahore, PO Box 54700
- Phone: +92 42 3594 6342 · WhatsApp: +92 300 419 8760 · Email: info@globalmedtranscriptions.com · Hours: Open 24/7
- Founded 2007 by Riaz Naveed. Medical transcription, billing and coding services for hospitals and clinics in the USA, Canada, UK, Australia and Saudi Arabia.
- "GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding."
- **Registered, certified & compliant (source `data/credentials.ts`; home and About pages):**
  - PSEB: Registered with Pakistan Software Export Board, No. Z-25-8395/23, valid Feb 2026 – Jan 2027.
  - LCCI (2026-10-01): Corporate Member, The Lahore Chamber of Commerce & Industry. Membership No. 94721 C · Member since 04/06/2018 · valid until 31 Mar 2027 · Issued by The Lahore Chamber of Commerce & Industry.
- **Our Story (client, 2026-09-29; source `content/about-story.ts`, About page):**
  - Legal name: GlobalMed Transcriptions (SMC) Pvt. Ltd. Founded in Pakistan in 2007. Founder & CEO: Riaz Naveed (experience in clinical laboratory work, medical transcription, quality assurance, and CPC and CPB training).
  - Purpose: to help healthcare professionals spend less time on documentation and more time caring for patients. Began as a medical transcription business.
  - Countries served: United States, Canada, United Kingdom, Australia, Saudi Arabia.
  - Specialties: Family Medicine, Cardiology, Psychiatry, Orthopedics, Pathology, Radiology. Team: transcriptionists, editors and quality assurance professionals, experienced with different accents, dictation styles, templates and turnaround time (TAT) requirements.
  - Documentation: works directly within a client's EMR or EHR system, or provides access to a subscription-based dictation and documentation platform. Reviews and edits voice recognition and AI-generated drafts.
  - Services: clinical documentation, AI-assisted clinical documentation editing, medical coding, medical billing, revenue cycle management. Coding and billing by AAPC certified coders and billers: insurance verification and eligibility, prior authorizations, provider credentialing, medical coding, charge entry, claims preparation and submission, denial management, payment posting, accounts receivable follow-up, billing audits and reporting.
  - Training: through a strategic partnership with AAPC, GlobalMed supports training in Pakistan for CPC® and CPB®, coordinating enrollment, training schedules, payments and required learning resources with AAPC. (AAPC teaches and certifies; see §4.)

### 3.2 The only courses offered (confirmed 2026-09-26; dual price, duration and sessions line updated 2026-09-29)
All three:
- **Badge:** AAPC Official Course.
- **Format:** online sessions conducted by AAPC certified trainers (instructor-led, online only; site wording 2026-09-29).
- **Certification:** awarded by AAPC.
- **How to register:** the Register Now form on the site, or WhatsApp +92 300 419 8760.
- **Delivery note:** "Training is delivered online by AAPC. GlobalMed Transcriptions is AAPC's Strategic Partner in Pakistan."

| Course | Page | Price | Duration | Package Includes (client, 2026-09-30) |
|---|---|---|---|---|
| Certified Professional Coder (CPC)® | /education/cpc | USD 1,050 | 16 weeks, live online sessions of 1.5 hours per week, plus optional one-on-one virtual time with the instructor | Instructor-led CPC Training delivered by AAPC-certified instructors · Six months of Blackboard access · CPC Examination with two attempts · One-year AAPC Membership · Latest edition of the required books |
| Certified Professional Biller (CPB)® | /education/cpb | USD 1,050 | 16 weeks | Instructor-led CPB Training delivered by AAPC-certified instructors · Six months of Blackboard access · CPB Examination with two attempts · One-year AAPC Membership · Latest edition of the required books |
| CPC® + CPB® dual certifications | /education/cpc-cpb | USD 1,800 (saves USD 300 vs USD 2,100 separately) | 16 weeks | Instructor-led CPC and CPB Training delivered by AAPC-certified instructors · Six months of Blackboard access · CPC and CPB Examinations with two attempts each · One-year AAPC Membership · Latest edition of the required books |

- **Only the "Package Includes" items above are part of a package.** Practice tests, Practicode, Codify, the Denials Management guide, a two-year membership and prerequisite-course discounts are no longer offered; don't mention them. If asked, say the package is as listed and offer the form or WhatsApp.
- **Prerequisites:** knowledge of medical terminology, anatomy and pathophysiology. AAPC offers prerequisite courses for anyone without that background.

### 3.2a Why register through GlobalMed Transcriptions (client, 2026-09-30)
GlobalMed Transcriptions, in strategic partnership with AAPC, helps aspiring professionals in Pakistan take the next step toward CPC® and CPB® certification.
- **Special pricing for Pakistan:** making training more accessible and affordable.
- **Local registration support:** guidance with enrollment and coordination with AAPC.
- **Program guidance:** help understanding medical coding and billing pathways before choosing your course.
- **Industry experience:** GlobalMed's practical understanding of international healthcare documentation and billing services.
- **Flexible payment options / installments:** GlobalMed facilitates installment plans when needed. Don't quote instalment amounts or schedules; offer the form or WhatsApp.
- **Upcoming batch:** for the date of the upcoming batch, fees and package inclusions, invite the user to contact GlobalMed (form or WhatsApp). Don't invent dates.
- Tagline: "Get Trained. Get Certified. Go Global."

- **CPC exam:** the exam voucher is included. Students schedule the exam in their AAPC account when ready, at least three weeks before the exam date.
- **Maintaining a credential:** keep the AAPC annual membership and earn 36 CEUs every two years. For both credentials, CEUs as required by AAPC for each; don't state a combined number.

### 3.3 Answering course questions
- Always offer the two routes: "Register Now" on the site (form: `/education/aapc-certification-pakistan#register`) or WhatsApp +92 300 419 8760.
- Our team then contacts the student to complete their AAPC enrollment.

## 4. Guardrails (system prompt must include)
- You are GlobalMed's assistant. Answer only about GlobalMed's services, the three AAPC courses above, and GlobalMed's policies.
- GlobalMed does not teach and does not issue certificates. AAPC faculty teach AAPC's courses live online, and AAPC awards the certification. Say so whenever it's relevant.
- Only CPC®, CPB® and CPC® + CPB® are offered. **Never mention** GlobalMed's own (hidden) courses, pathways, batches (the only allowed uses of "batch" are "batch schedules" in the approved role line, GlobalMed coordinates AAPC batch schedules, and "the upcoming batch" from §3.2a), exam prep, corporate training, onsite, in-person or classroom training, Lahore classes, GlobalMed certificates or certificate verification. If asked about in-person classes, answer: training is online only, taught live by AAPC faculty.
- Course prices and packages only from §3.2. For anything not listed there, offer the registration form, WhatsApp or a human.
- For course questions, end with the registration form or WhatsApp (§3.3).
- Never request or accept patient information (names, DOB, MRN, diagnoses). If a user shares it, tell them not to and do not repeat it.
- Do not give legal, coding-compliance or medical advice as final; suggest a consultation.
- Prices and dates only from the knowledge base; if unknown, offer a human.
- Do not claim AAPC endorsement beyond the approved partnership line (§3.1).

## 5. Lead capture
Intent detection (service enquiry / AAPC course registration / human request).
- **Service enquiries:** the bot asks for name, email or phone, practice name and specialty. It creates a `leads` row with source `chatbot` or `whatsapp` and emails sales.
- **Course enquiries:** the bot sends the student to the Register Now form, or collects the same fields as the form.
  - The form fields are name, email, WhatsApp number, address (house / street, area, city), course (CPC® / CPB® / CPC® + CPB®), background, preferred contact time and message.
  - The student must also agree to be contacted and to have their details shared with AAPC.
  - The bot saves a lead with source `aapc_registration` (or `chatbot`/`whatsapp` plus the course in `interest`), so it appears in the Sales leads pipeline.

## 6. Human handoff
Triggers: user asks for a person, 2 low-confidence answers in a row, complaint keywords, payment issue. Sets `handoff = true`, bot pauses, conversation appears in Sales inbox; agent replies from dashboard (web via realtime, WhatsApp via Cloud API). Outside business hours the bot says when a person will reply.

## 7. WhatsApp specifics
- Meta Business verification + WhatsApp Business Account + dedicated number *(client input)*.
- 24-hour customer service window: free-form replies within 24h of the user's last message; outside it only approved templates (e.g. "course reminder", "follow-up").
- Templates to prepare: welcome, lead follow-up, AAPC registration follow-up ("our team will help you complete your AAPC enrollment"). No batch reminders or payment receipts yet: GlobalMed coordinates AAPC batch schedules and payment processing, but who processes payments and what is kept is [CLIENT TO CONFIRM] (pm/CLIENT_INPUTS_NEEDED.md).
- Click-to-chat button on site: `https://wa.me/<number>?text=...`.

## 8. Widget UX
Floating button bottom-right, opens panel; greeting + 3 quick replies (Billing services / AAPC courses: CPC®, CPB® / Talk to a person); streaming responses; "Continue on WhatsApp" link; clear note "Please don't share patient information."

## 9. Limits & cost control
Rate limit 20 messages / 10 min per visitor; max tokens per reply; conversation history trimmed to last 10 turns; cache identical FAQ answers 24h.

Instead of caching answers, the questions that must be exact (prices, packages, contact, delivery, who teaches, installments, batch dates) are answered from the site data without calling the model (§10), so they cost nothing and can't drift.

## 10. Implementation (Phase 7A, website — 2026-10-01)

**Engine** (`lib/ai/`)
- `provider.ts`: AI SDK adapter for OpenAI, Anthropic and Gemini.
  - `generate()` streams; `embed()` / `embedMany()` return 1536 dimensions, matching `kb_chunks.embedding`.
  - Defaults: `gpt-4o-mini`, `claude-haiku-4-5`, `gemini-2.5-flash`. Embeddings: `text-embedding-3-small` or `gemini-embedding-001`.
  - Anthropic has no embeddings, so set `EMBEDDING_PROVIDER` + `EMBEDDING_API_KEY` (OpenAI or Gemini).
- `guardrails.ts`, the deterministic layer that runs before and after the model:
  - Patient information is refused. A placeholder is stored in its place, never the text.
  - Exact scripted answers: prices, packages, contact and hours, online-only delivery, "GlobalMed doesn't teach or certify", courses that aren't offered, installments, the upcoming batch.
  - Every model reply is checked. A USD amount outside {1,050 · 1,800 · 2,100 · 300}, rupee amounts, retired package items, GlobalMed certificates, in-person training or hidden offerings → the reply is replaced by the safe fallback.
- `prompts.ts` + `knowledge.ts`: the system prompt with §4. It includes a pinned knowledge document built from `data/courses.ts`, `content/home.ts` (Why register), `content/home-services.ts`, `content/aapc.ts` and `lib/site.ts`.
- `rag.ts`: embed the question → `match_kb` top 5 (similarity ≥ 0.25) → context.
- `engine.ts`: the order is:
  1. Patient-information check
  2. Handed-off chats stay with the person
  3. Lead capture
  4. Quick replies
  5. Handoff triggers
  6. Scripted answers
  7. RAG + LLM, with reply checks and the `[[unsure]]` marker
- **Low confidence:** two unsure or rejected answers in a row hand the chat to a person.
- **Limits:** history is the last 10 turns; each reply is capped at 400 tokens.
- **Lead capture** (`lead-flow.ts`): name → email or WhatsApp → (services: practice → specialty). It saves a `leads` row with source `chatbot` and `details.conversationId`, and emails the sales inbox (`storeLead`).
- `store.ts`: Supabase with the service role, after the visitor's token is checked.
  - The widget holds a random token; only its SHA-256 is stored.
  - In local dry run only (`FORMS_DRY_RUN=true`, never production), chats are kept in memory so the widget can be tested without a database.

**API**
- `POST /api/chat`: streams server-sent events: `meta` → `delta`… → (`replace`) → `done`.
  - Input is validated with zod.
  - Turnstile is checked on the first message only.
  - Rate limits: 20 messages / 10 min per visitor and 60 per IP (Upstash; in-memory without it).
  - Fails closed: 503 without a database, 403 without a Turnstile secret in production.
- `GET /api/chat/messages`: the widget polls every 4s while a person has the chat. Visitors can't read the chat tables, so realtime is for staff only.
- `GET /api/chat/config`: the greeting and quick replies from admin settings.
- `GET /api/chat/stream-check`: five ticks 400ms apart, to check that the hosting streams.
- `POST /api/admin/kb-sync` (header `x-kb-sync-secret`): rebuilds the knowledge base; `npm run kb:sync` calls it.

**Streaming on our hosting** (tested live on 2026-10-01 with `/api/chat/stream-check`):
- The SSE responses send `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform`, `Connection: keep-alive` and `X-Accel-Buffering: no`.
- **Finding:** Hostinger's CDN (`Server: hcdn`) strips `X-Accel-Buffering` and still holds the whole response. All five ticks arrived together after about 3s. Switching to `text/plain` didn't help.
- **What works:** it flushes once about 1.5–2 KB has built up. With 1.5 KB or more of padding per event, the ticks arrived about 400ms apart, as sent.
- **Fix:** `/api/chat` merges text parts into flushes at most every 120ms and pads each flush to 2 KB with an SSE comment (`encodeSse`, `SSE_FLUSH_BYTES` in `lib/ai/sse.ts`). Clients ignore comments.
- **Cost:** a typical reply adds at most about 50 KB.
- **Alternative:** if Hostinger lets the CDN be bypassed for `/api/*`, padding can be turned off by setting `SSE_FLUSH_BYTES` to 0.

**Knowledge base** (`lib/ai/kb.ts`)
- **Re-sync from website / `npm run kb:sync`:**
  - Stores the pinned site-data document.
  - Fetches the live home, About, AAPC Certification, CPC®, CPB®, CPC® + CPB®, Services, FAQ, Contact and Privacy pages.
  - Takes the `<main>` text of each (`extract.ts`), chunks it (≈800 tokens, 100 overlap) and embeds it.
- Hidden courses aren't rendered, so they are never indexed.
- **Admin documents:** add or edit, and every save re-embeds.
- **Delete:** a soft delete (`deleted_at`), with restore available.
- Migration `0006_chatbot.sql` adds the new columns, `match_kb` that skips deleted documents, and realtime on the chat tables.

**Widget** (`components/marketing/chat/chat-widget.tsx`)
- The help button (same look and position) loads it on the first click. The old menu stays behind `features.chatbotWidget`.
- Contents: greeting and quick replies, streaming text with a typing indicator, the permanent patient-information note, Continue on WhatsApp / Call / Email.
- Accessibility: focus trap, Esc closes and returns focus to the button, `role="log"` for messages.
- Motion: spring opening, instant with reduced motion. Works at 360px.

**Dashboards**
- **Admin → Chatbot:**
  - Setup status, which names the missing hosting variables.
  - Knowledge base (list / add / edit / hide / re-sync).
  - Conversations (search, transcript, delete on request).
  - Settings: greeting, quick replies, handoff on/off, business hours, the model in use.
- **Sales → Inbox:** handed-off chats, live via realtime. The agent's reply appears in the widget; the agent can hand the chat back to the bot or close it.
- **Outside business hours** the bot says when the team replies.

**Hosting variables to set:**
- `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL`, `EMBEDDING_MODEL` (+ `EMBEDDING_PROVIDER`, `EMBEDDING_API_KEY` with Anthropic)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (then apply migrations 0001–0006)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`
- `KB_SYNC_SECRET`

After that, run "Re-sync from website" once.

**Tests**
- `tests/unit/chatbot.test.ts`: guardrails, RAG, chunking, lead flow, hours, rate limit, page text.
- `tests/unit/chatbot-questions.test.ts`: the 20-question set (pm/CHATBOT_TEST_QUESTIONS.md).
- `tests/e2e/chat-widget.spec.ts`:
  - Widget checks on the production build.
  - Conversation in local dry run.
  - The Sales inbox round trip, which needs Supabase: `E2E_SUPABASE=1`.
