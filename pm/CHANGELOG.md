# Changelog

Format: Keep a Changelog · Semantic Versioning

## [Unreleased]
### Added
- "Doctor Login" link to the external doctor file-upload app: a white pill with a lock icon in the top bar, plus a link in the footer and the mobile menu. Opens in a new tab. One URL in `data/site.ts` (2026-10-07)
- Updates (news / announcements): dashboard (Admin → Content → Updates, Sales → Updates) to create, publish, schedule, pin, expire and unpublish, with image upload (1600×900 WebP); home "Latest Updates" (3 latest, pinned first, hidden when none); /updates with category filter and pagination; /updates/[slug]; NewsArticle JSON-LD; Resources menu, footer, sitemap; the chatbot answers from live updates (2026-10-02)
- Social links (Facebook, LinkedIn, Instagram) in the top bar, the footer and the Organization JSON-LD sameAs; one source in `data/site.ts`, same order and hover everywhere (2026-10-02)
- Top contact bar above the main nav on every public page: email and mobile from `data/site.ts`, social icons when linked; scrolls away while the nav stays sticky; icons only on phones (2026-10-02)
- Phase 7A website chatbot: AI provider adapter (OpenAI / Anthropic / Gemini), RAG knowledge base synced from the live site, guardrails with exact scripted answers, streaming `/api/chat`, chat widget behind the help button, lead capture (source "chatbot"), human handoff to a live Sales inbox, Admin → Chatbot (knowledge base, conversations, settings); answers from the model start once the client's LLM key and Supabase are set (2026-10-01)
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
- Photos placed site-wide: page hero photos (AAPC, courses, services, audit, careers), blog covers and cards, guide cards, new slide 3, RCM card, home AAPC band scroll background; WebP/AVIF delivery; Open Graph images per section (2026-09-30)
- Course "Package Includes" for CPC®, CPB® and CPC® + CPB® on cards and course heroes; new home "Why register through GlobalMed Transcriptions?" (2026-09-30)
- Hosting documented as own hosting (Hostinger); live site URL in `.env.production`; `/api/health` shows the build commit (2026-10-01)

### Changed
- "Client Login" in the main nav after Contact, with a lock icon (desktop and mobile menu), linking to the client file-upload portal in a new tab. The footer link is renamed "Client Login"; the top-bar "Doctor Login" pill is hidden (`features.topbarDoctorLogin`). Between 1024 and 1279px the header logo, item padding and gaps are slightly smaller so the nav stays on one line (2026-10-07)
- Turnstile is opt-in (ADR-036): without keys, chats and lead forms are no longer refused; rate limits plus a 500-a-day cap on chatbot model replies protect the site (2026-10-04)
- "®" now renders as a small raised mark (half size, superscript, line height unchanged) everywhere it is visible: course cards, course heroes, comparison table, nav menu, footer, FAQ, forms, update cards, blog/legal Markdown, chat widget and the lead email. One helper, `withReg` / `<Reg>` in components/ui/reg.tsx (+ a rehype step in Prose); titles, meta, JSON-LD, alt text and plain-text emails keep the plain character (2026-10-03)
- About hero subtitle: "The leading medical transcription and billing company in Pakistan, since 2007." (also in docs/09 chatbot knowledge) (2026-10-03)
- Fixed: count-up padding no longer widens figures with commas, and stats-strip numbers are 24px on phones, so /services and /free-billing-audit no longer scroll sideways at 360px; update category chip text is navy for AA contrast (2026-10-02)
- Heading font (Source Serif 4) loads with font-display: optional so a late font can no longer re-wrap the hero headline and move the page (ADR-035) (2026-10-02)
- Company facts (home card + About strip): count-up once (1.2s ease-out) with the "+" fixed; hover lifts the item onto #EEF6FC, number #3A73C2 with a growing sky underline, stronger card shadow; reduced motion shows final numbers and colour only (2026-10-02)
- Home hero: one controls row below the slide buttons and 16px above the stats card (dots left / controls right; phones: dots centred, pause only); slides share one grid cell so the hero grows instead of overlapping on short screens (2026-10-02)
- Home: company facts card (same facts and component as About) overlaps the bottom of the hero; slider controls raised above it; slide text block kept together (headline → 20px → text → 32px → buttons); Years in Healthcare 25+ everywhere from one data source (2026-10-01)
- Office address stored once in `data/site.ts` (4-line and one-line versions, JSON-LD parts): footer, Contact page, Privacy and Terms, llms.txt, JSON-LD and the chatbot all read it; footer contact items share one baseline (2026-10-01)
- Footer: fine print "© 2026 GlobalMed Transcriptions. All rights reserved. · Designed & developed by SylJo Tech"; Google Play badge links to the GlobalMed app (new tab), App Store stays "Coming soon" (2026-10-01)
- Header and mobile menu: "Careers" replaces "Specialties" (About Us · Education · Services · Resources · Careers · Contact); Specialties link hidden by `navSpecialties`, pages stay live; the current page's menu item is underlined (2026-10-01)
- Course cards: delivery note "Training is delivered online by AAPC. GlobalMed Transcriptions is AAPC's Strategic Partner in Pakistan." restored at client request (`courseCardPriceNote: true`); it lines up across the three cards (2026-10-01)
- Official horizontal GlobalMed logo used everywhere the stacked logo was (header, footer at 44px on its plate, About lockup, auth/staff pages, dashboards, OG images, JSON-LD, certificate template); stacked files kept, favicons unchanged (2026-10-01)
- Course cards: delivery note hidden on the cards (`courseCardPriceNote`, still on course pages); all sections aligned across the three cards with CSS subgrid, buttons on one line, highlighted card without vertical offset (2026-10-01)
- Footer fine print "© 2026 GlobalMed Transcriptions · Designed & developed by SylJo Tech"; trademark line hidden (`footerTrademarkNote`) (2026-10-01)
- LCCI credential: "Corporate Member, The Lahore Chamber of Commerce & Industry" (2026-10-01)
- Home slider: the GlobalMed + AAPC lockup shows on all three slides in a fixed position (it no longer moves with slide changes), now with the official horizontal GlobalMed logo; headline, text and buttons start at the same height on every slide (2026-10-01)
- Performance: first-load JS cut 40–50% on Home, About, AAPC and course pages (deferred hydration, no animation library on these pages, lazy menus/dialogs, lean providers, prefetch off for footer/lists, content-visibility); GSAP removed (2026-10-01)
- UI/UX pass: spacing tokens (56/72/96 section padding, 24/32 grid gaps), 44px touch targets, 16px text on phones, anchor offsets, slider/band contrast, sticky comparison-table column; CSS no longer inlined (ADR-031) (2026-09-30)
- Fixed: pages with their own Open Graph data had no og:image (2026-09-30)
- Layout: one split grid for text + image, form and FAQ sections; 48px buttons; 16px card radius; founder photo aligned with the Our Story heading; 60px help button on phones; old course package lists, comparison rows and the previous Why register cards hidden by flags (2026-09-30)
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
- Migration 0001 calls `extensions.gen_random_bytes`, so it applies on Supabase, where pgcrypto lives in the `extensions` schema; all migrations applied to the client project (2026-10-03)
- "How it works" no longer disappears when scrolling up (CSS sticky instead of GSAP pin; page transition leaves no transform) (2026-09-26)
- Footer price contrast, AAPC comparison table clipping at 360px, home meta description length (2026-09-26)

<!-- Next release template
## [0.1.0] - YYYY-MM-DD
### Added
### Changed
### Fixed
-->
