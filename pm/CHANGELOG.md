# Changelog

Format: Keep a Changelog · Semantic Versioning

## [Unreleased]
### Added
- Project documentation pack (2026-09-24)
- Motion design spec docs/15, /motion command, motion tasks across phases (2026-09-24)
- Phase 0 foundation: Next.js 15 app, tooling, CI, Supabase clients, Sentry, security headers (2026-09-24)
- Phase 1 design system: MASTER.md, tokens, components, motion primitives, /styleguide, key screens, motion storyboards, Playwright/axe audit (2026-09-24)
- Phase 2 public website: all docs/05 pages, audit/contact/newsletter forms, certificate verification, SEO (sitemap, robots, llms.txt, JSON-LD, OG), website motion graphics (2026-09-24)
- Phase 3: sign-up/login/reset/MFA, Google sign-in, role guards, dashboard shells for student/instructor/admin/sales, account settings (2026-09-24)
- Phase 4 LMS core: course builder, Bunny tus upload + webhook, signed HLS player with resume, server-verified progress, notes, resources, Q&A, drip rules, live batches, My courses, instructor Q&A and Students pages (2026-09-24)
- Client review: hero slider, Education rename (/education), AAPC Certification page, credentials section, About rewrite, expanded footer (2026-09-25)
- Phase 5 start: orders, Stripe Checkout, webhook fulfilment (hidden since 2026-09-26, ADR-026) (2026-09-26)
- AAPC course pages /education/cpc, /cpb, /cpc-cpb with confirmed packages and prices; comparison table; "Register for AAPC Training" form with consent → leads; sales Leads pipeline; admin AAPC registrations (2026-09-26)
- Official brand icons, horizontal logo lockup, PSEB and HIPAA training credentials (2026-09-26)

### Changed
- GlobalMed presented as AAPC's Strategic Partner in Pakistan only: AAPC faculty teach online, AAPC certifies; approved wording site-wide, chatbot knowledge updated (ADR-026) (2026-09-26)
- GlobalMed's own courses, pathways, batches, corporate training, exam prep, learning platform, instructor area, certificates/verify, checkout, refund policy and public login links hidden behind feature flags with redirects; nothing deleted (2026-09-26)

### Fixed
- "How it works" no longer disappears when scrolling up (CSS sticky instead of GSAP pin; page transition leaves no transform) (2026-09-26)
- Footer price contrast, AAPC comparison table clipping at 360px, home meta description length (2026-09-26)

<!-- Next release template
## [0.1.0] - YYYY-MM-DD
### Added
### Changed
### Fixed
-->
