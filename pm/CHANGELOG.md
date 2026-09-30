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

- Home "Our Services" sticky stacking cards with the client's text and photos; lead detail page and admin CSV export of leads; official App Store / Google Play footer badges ("Coming soon" until links are set) (2026-09-28)
- About page "Our Story": four parts (story + founder photo slot, documentation with country/specialty chips, coding/billing/RCM checklist, navy AAPC workforce band with partner lockup and "View CPC® & CPB® Courses") and a closing statement, client text used exactly, one-time fade on scroll (2026-09-29)
- LCCI membership credential (No. 94721 C, valid until 31 Mar 2027) in "Registered, Certified & Compliant" with thumbnail, lightbox and PDF; credentials past their `validTill` date are no longer shown. Founder photo (Riaz Naveed) in About "Our Story" beside the founder paragraph (2026-09-30)
- pm/IMAGE_PLAN.md: full-site image audit with prompts for AI images and the list of real photos needed (2026-09-30)

### Changed
- GlobalMed presented as AAPC's Strategic Partner in Pakistan only: AAPC faculty teach online, AAPC certifies; approved wording site-wide, chatbot knowledge updated (ADR-026) (2026-09-26)
- GlobalMed's own courses, pathways, batches, corporate training, exam prep, learning platform, instructor area, certificates/verify, checkout, refund policy and public login links hidden behind feature flags with redirects; nothing deleted (2026-09-26)

- AAPC role wording is the client's approved line (enrollment, batch schedules, payment processing, books and online resources); privacy policy payment paragraph pending client confirmation (2026-09-28)
- Registration form: Address replaces City (City hidden by flag; migration 0005 adds `leads.address`) (2026-09-28)
- Older "Medical billing services for US practices" home list hidden (2026-09-28)

- About: previous "Our Story"/"What We Do" (`aboutStoryOld`) and "Strategic Partnership" (`aboutPartnershipBlockOld`) hidden by flag; Leadership card kept on its own; new meta description; Our Story facts in the docs/09 chatbot knowledge (2026-09-29)
- AAPC courses: order is CPC®, CPB®, then CPC® + CPB® everywhere (dual keeps "Best value" in third place); dual course USD 1,800 (save USD 300 vs USD 2,100) over 16 weeks; format line "Online sessions conducted by AAPC certified trainers" on cards, course heroes and the comparison table; docs/09 updated (2026-09-29)
- About: standalone Leadership card hidden (`aboutLeaderCard: false`); the founder is shown in "Our Story" (2026-09-29)
- "Get Trained by AAPC Instructors" band: the three instructor photo slots are hidden (`instructorPhotos: false`); text, points and button span the full width (home, AAPC Certification page) (2026-09-29)

- Claim-line motif removed site-wide at client request (ADR-028): slider shows dots only, "How it works" uses numbered steps, the audit form shows "Step x of y" with a plain bar (2026-09-28)

- Fluid full-width desktop layout: shared container up to 1920px with responsive gutters, 75ch text, 4-column grids from 1440px, full-width "Our Services" cards with images flush to the edge (ADR-029) (2026-09-28)

### Fixed
- "How it works" no longer disappears when scrolling up (CSS sticky instead of GSAP pin; page transition leaves no transform) (2026-09-26)
- Footer price contrast, AAPC comparison table clipping at 360px, home meta description length (2026-09-26)

<!-- Next release template
## [0.1.0] - YYYY-MM-DD
### Added
### Changed
### Fixed
-->
