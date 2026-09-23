# 09 — AI Chatbot and WhatsApp

## 1. Purpose
Answer questions about services, courses, pricing, enrollment and certificates; capture leads; hand off to a human when needed. It is complimentary in the contract and runs on the **client's own LLM API key**.

## 2. Architecture
- `lib/ai/provider.ts` — adapter interface `generate(messages, opts)` and `embed(text)`; implementations for OpenAI / Anthropic / Gemini selected by `LLM_PROVIDER`.
- `lib/ai/rag.ts` — embed query → `match_kb()` top 5 → build context.
- `lib/ai/prompts.ts` — system prompt + guardrails.
- `/api/chat` — streaming route for the web widget.
- `/api/whatsapp/webhook` — GET verify, POST receive; signature verified with `WHATSAPP_APP_SECRET`.
- Same engine for both channels; channel-specific formatting (WhatsApp: short, no markdown tables).

## 3. Knowledge base
Sources: service pages, course catalog (auto-synced on publish), FAQs, policies, admin-added documents. Admin edits a document → chunk (≈800 tokens, 100 overlap) → embed → replace chunks.

## 4. Guardrails (system prompt must include)
- You are GlobalMed's assistant. Answer only about GlobalMed services, courses and policies.
- Never request or accept patient information (names, DOB, MRN, diagnoses). If a user shares it, tell them not to and do not repeat it.
- Do not give legal, coding-compliance or medical advice as final; suggest a consultation.
- Prices and dates only from the knowledge base; if unknown, offer a human.
- Do not claim AAPC endorsement beyond what the knowledge base states.

## 5. Lead capture
Intent detection (service enquiry / course enquiry / human request). When detected, the bot asks for name, email/phone, and (for services) practice name + specialty; creates `leads` row with source `chatbot` or `whatsapp`; notifies sales by email.

## 6. Human handoff
Triggers: user asks for a person, 2 low-confidence answers in a row, complaint keywords, payment issue. Sets `handoff = true`, bot pauses, conversation appears in Sales inbox; agent replies from dashboard (web via realtime, WhatsApp via Cloud API). Outside business hours the bot says when a person will reply.

## 7. WhatsApp specifics
- Meta Business verification + WhatsApp Business Account + dedicated number *(client input)*.
- 24-hour customer service window: free-form replies within 24h of the user's last message; outside it only approved templates (e.g. "course reminder", "follow-up").
- Templates to prepare: welcome, lead follow-up, batch reminder, payment received.
- Click-to-chat button on site: `https://wa.me/<number>?text=...`.

## 8. Widget UX
Floating button bottom-right, opens panel; greeting + 3 quick replies (Billing services / Courses / Talk to a person); streaming responses; "Continue on WhatsApp" link; clear note "Please don't share patient information."

## 9. Limits & cost control
Rate limit 20 messages / 10 min per visitor; max tokens per reply; conversation history trimmed to last 10 turns; cache identical FAQ answers 24h.
