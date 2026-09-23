# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | AAPC partnership not finalised or branding not permitted by launch | Medium | Medium | Build AAPC page behind a feature flag; launch without AAPC marks | Client |
| R2 | Copying AAPC design/content creates IP issues | Low | High | Inspiration for structure only; original brand, copy, visuals (CLAUDE.md §5) | SylJo |
| R3 | PHI accidentally submitted via forms/chat | Medium | High | Warnings on every form/chat, no PHI fields, chat logs retention limit, staff training | Both |
| R4 | Course content (videos, question banks) delayed | High | High | Content calendar from week 1; launch with minimum 3 courses | Client |
| R5 | Meta/WhatsApp business verification delay | Medium | Medium | Start verification in week 1; web chatbot doesn't depend on it | Client |
| R6 | Stripe account verification issues | Medium | High | Start early; manual payment rail as fallback | Client |
| R7 | LLM cost overrun | Low | Medium | Rate limits, token caps, caching, monthly usage alert | SylJo |
| R8 | Scope creep (portal, mobile app, live classes) | Medium | High | Change requests via DECISIONS.md with price/time before work | Both |
| R9 | Claude Code session limits interrupt work | High | Low | /checkpoint discipline, SESSION_LOG, small tasks | SylJo |
| R10 | Video piracy | Medium | Medium | Signed URLs, watermark, concurrent-session limit | SylJo |
| R12 | Heavy animation hurts page speed / SEO | Medium | Medium | Performance budget docs/15 §7, lazy-load GSAP/Lottie, Lighthouse CI gate | SylJo |
| R11 | SEO loss from migrating old site | Medium | Medium | Crawl old site, 301 map, Search Console monitoring | SylJo |
