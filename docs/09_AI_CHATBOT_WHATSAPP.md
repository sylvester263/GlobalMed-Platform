# 09 — AI Chatbot and WhatsApp

## 1. Purpose
Answer questions about GlobalMed's services (medical transcription, billing and coding) and about the three AAPC courses GlobalMed registers students for, capture leads and course registrations, and hand off to a human when needed. It is complimentary in the contract and runs on the **client's own LLM API key**.

**Business model (client, 2026-09-26; ADR-026).** GlobalMed Transcriptions is a services company and **AAPC's Strategic Partner in Pakistan** for medical billing and coding. GlobalMed does **not** teach, run classes (online or onsite) or issue certificates. AAPC faculty teach AAPC's live, instructor-led online courses, and AAPC awards the certification. GlobalMed helps students in Pakistan register for AAPC's official online courses and supports them through enrollment.

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
- Address: 44 Dilkusha Garden, Near S Block Ext., Model Town, Lahore, PO Box 54700, Pakistan
- Phone: +92 42 3594 6342 · WhatsApp: +92 300 419 8760 · Email: info@globalmedtranscriptions.com · Hours: Open 24/7
- Founded 2007 by Riaz Naveed. Medical transcription, billing and coding services for hospitals and clinics in the USA, Canada, UK, Australia and Saudi Arabia.
- "GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding."

### 3.2 The only courses offered (confirmed 2026-09-26)
All three:
- **Badge:** AAPC Official Course.
- **Format:** instructor-led online course, taught by AAPC faculty, online only.
- **Certification:** awarded by AAPC.
- **How to register:** the Register Now form on the site, or WhatsApp +92 300 419 8760.
- **Delivery note:** "Training is delivered online by AAPC. GlobalMed Transcriptions is AAPC's Strategic Partner in Pakistan."

| Course | Page | Price | Duration | What's included |
|---|---|---|---|---|
| Certified Professional Coder (CPC)® | /education/cpc | USD 1,050 | 16 weeks, live online sessions of 1.5 hours per week, plus optional one-on-one virtual time with the instructor | 16-week online training led by world-class AAPC faculty · One-year AAPC membership and networking benefits · Virtual internship through Practicode · Codify by AAPC code look-up assistance app subscription · CPC Certification Exam, along with 3 practice tests · 1/2 off Prerequisite course |
| Certified Professional Biller (CPB)® | /education/cpb | USD 1,050 | 16 weeks | 16-week online course led by AAPC faculty · One-year AAPC membership and benefits · Denials Management & Appeals Reference Guide · Three practice tests · Certification Exam · 1/2 off Prerequisite course |
| CPC® + CPB® dual certifications | /education/cpc-cpb | USD 1,600 (saves USD 500 vs USD 2,100 separately) | 32 weeks (16 CPC + 16 CPB) | Instructor-led 32-week online courses led by world-class AAPC faculty · Two-year AAPC membership and networking benefits · Virtual internship through Practicode · CPB Denials Management and Appeals Reference Guide · Codify by AAPC code look-up assistance app subscription · CPC & CPB certification exams, along with 6 practice tests · 1/2 off Prerequisite course |

- **Prerequisites:** knowledge of medical terminology, anatomy and pathophysiology. AAPC's prerequisite courses are 1/2 off with any of these courses.
- **CPC exam:** the exam voucher is included. Students schedule the exam in their AAPC account when ready, at least three weeks before the exam date.
- **Maintaining a credential:** keep the AAPC annual membership and earn 36 CEUs every two years. For both credentials, CEUs as required by AAPC for each; don't state a combined number.

### 3.3 Answering course questions
- Always offer the two routes: "Register Now" on the site (form: `/education/aapc-certification-pakistan#register`) or WhatsApp +92 300 419 8760.
- Our team then contacts the student to complete their AAPC enrollment.

## 4. Guardrails (system prompt must include)
- You are GlobalMed's assistant. Answer only about GlobalMed's services, the three AAPC courses above, and GlobalMed's policies.
- GlobalMed does not teach and does not issue certificates. AAPC faculty teach AAPC's courses live online, and AAPC awards the certification. Say so whenever it's relevant.
- Only CPC®, CPB® and CPC® + CPB® are offered. **Never mention** GlobalMed's own (hidden) courses, pathways, batches, exam prep, corporate training, onsite, in-person or classroom training, Lahore classes, GlobalMed certificates or certificate verification. If asked about in-person classes, answer: training is online only, taught live by AAPC faculty.
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
  - The form fields are name, email, WhatsApp number, city, course (CPC® / CPB® / CPC® + CPB®), background, preferred contact time and message.
  - The student must also agree to be contacted and to have their details shared with AAPC.
  - The bot saves a lead with source `aapc_registration` (or `chatbot`/`whatsapp` plus the course in `interest`), so it appears in the Sales leads pipeline.

## 6. Human handoff
Triggers: user asks for a person, 2 low-confidence answers in a row, complaint keywords, payment issue. Sets `handoff = true`, bot pauses, conversation appears in Sales inbox; agent replies from dashboard (web via realtime, WhatsApp via Cloud API). Outside business hours the bot says when a person will reply.

## 7. WhatsApp specifics
- Meta Business verification + WhatsApp Business Account + dedicated number *(client input)*.
- 24-hour customer service window: free-form replies within 24h of the user's last message; outside it only approved templates (e.g. "course reminder", "follow-up").
- Templates to prepare: welcome, lead follow-up, AAPC registration follow-up ("our team will help you complete your AAPC enrollment"). No batch reminders or payment receipts (GlobalMed doesn't run classes or take course payments online).
- Click-to-chat button on site: `https://wa.me/<number>?text=...`.

## 8. Widget UX
Floating button bottom-right, opens panel; greeting + 3 quick replies (Billing services / AAPC courses: CPC®, CPB® / Talk to a person); streaming responses; "Continue on WhatsApp" link; clear note "Please don't share patient information."

## 9. Limits & cost control
Rate limit 20 messages / 10 min per visitor; max tokens per reply; conversation history trimmed to last 10 turns; cache identical FAQ answers 24h.
