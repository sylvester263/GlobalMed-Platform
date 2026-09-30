# UI/UX report: images placed, spacing and UI pass (2026-09-30)

Scope: the brief "IMAGES UPLOADED — place all, then full UI/UX + spacing pass on all devices". Every visible route (41, from the sitemap plus the Free Billing Audit thank-you page and the 404) was checked at 360, 390, 414, 768, 834, 1024, 1280, 1440, 1920 and 2560px, plus phone landscape (844×390) and tablet landscape (1024×768, 1180×820). Browsers: Chrome (all sizes), WebKit (390, 768, 1280, 844×390, 1180×820) and Firefox (360, 768, 1280, 1920) via Playwright. Tools: `tests/audit/ui-audit.mjs` (layout checks) and `tests/audit/contrast-over-images.mjs` (white text over photos).

Commits: `66a2a6a` step 1 · `caf7924` step 2 · `755b928` step 3 · `27faedf` step 4 · step 5 (this report, ADR-031, screenshots).

## 1. Images placed (by ID)

| ID | Where | File (WebP master) |
|---|---|---|
| B01 | Home slider, slide 3 (replaces the classroom image) | `slider/slide-3.webp` |
| B02 | Default social image (home, About, Contact, FAQ, Free Billing Audit, legal, every page without its own) | `og/og-default-1200.jpg` → `/opengraph-image` |
| B03 | Social image: AAPC page, CPC®, CPB®, CPC® + CPB® | `og/og-education-1200.jpg` |
| B04 | Social image: Services, 6 service pages, Specialties, 6 specialty pages | `og/og-services-1200.jpg` |
| B05 | AAPC Certification page hero | `heroes/aapc-certification.webp` |
| B06 | Free Billing Audit hero | `heroes/free-billing-audit.webp` |
| B07 / B08 / B09 | CPC®, CPB®, CPC® + CPB® heroes | `heroes/course-cpc.webp`, `heroes/course-cpb.webp`, `heroes/course-cpc-cpb.webp` |
| B10 | Services hero | `heroes/services.webp` |
| B11 / B12 / B13 | Medical Billing, Medical Coding, Denial Management heroes | `heroes/{medical-billing,medical-coding,denial-management}.webp` |
| — | Medical Transcription, AI Clinical Documentation, RCM heroes reuse the home card photos C06, C07, C08 | `services/*.webp` |
| B14 | Careers hero | `heroes/careers.webp` |
| B15–B18 | Blog post covers (post hero) and blog index / category cards | `blog/*.webp` |
| B19–B21 | Guide cards | `guides/*.webp` |
| B22 | Social image: Blog index, posts, categories, Guides | `og/og-blog-1200.jpg` |
| B23 | Social image: Careers | `og/og-careers-1200.jpg` |
| B24 | Home "Get Trained by AAPC Instructors": scrolling photo background under a navy overlay (static with reduced motion); the AAPC page keeps the plain band | `backgrounds/home-aapc-band.webp` |
| C08 | Home service card 3 (regenerated RCM photo) | `services/revenue-cycle-management.webp` |
| C04 / C05 / C06 / C07 / C09 | Slides 1–2 and cards 1, 2, 4 now served as WebP (same photos) | `slider/*.webp`, `services/*.webp` |

**Not placed:** C06 / C09 inpainted versions were not uploaded (both files unchanged since 28 Sep); the current photos stay. `backgrounds/course-cpc.jpg` is a byte-identical copy of `heroes/course-cpc.jpg` and isn't used.

**Delivery (ADR-030):** originals kept; `scripts/optimize-images.mjs` writes one WebP master per photo, cropped to the slot (banners 2560 wide, heroes and cards 1600×1200 4:3, covers 1920×1080 16:9). next/image serves AVIF or WebP at 640/750/828/960/1080/1280/1920/2560. All within budget: banners 42–63 KB at 1920 (≤350), heroes/cards 21–91 KB at 1280 (≤180), social images 53–95 KB JPEG (≤250). Every photo has width/height and alt text describing what it shows. Slide 1 and each page's hero photo load with `priority` and `fetchpriority="high"`; everything else is lazy. The hero photos aren't lazy (a deviation from "lazy except slide 1"): each one is its page's largest element, and lazy-loading it would push mobile LCP out further.

**Social images:** Next.js `opengraph-image` routes put the logo and the page title (Source Serif 4) over the section photo with a navy gradient on the left, re-encoded as JPEG. The old navy card with the retired claim-line ticks is gone. Checked on 18 pages: one absolute `og:image` each, `og:image:width` 1200 / `height` 630, `image/jpeg`, the same URL in `twitter:image`. **Fixed an existing bug:** pages that set their own Open Graph data (home, About, Contact, FAQ, Free Billing Audit, legal…) had no `og:image` at all, because a page's `openGraph` replaces the root one. `pageMetadata` now adds the default; routes with their own image pass `defaultImage: false`. The site URL in the tags comes from `NEXT_PUBLIC_SITE_URL`, so on Vercel it must be the public domain.

## 2. Images flagged for regeneration (not fixed)

No classroom scenes, patient data or distorted hands or faces. Readable text or brand logos:

| ID | File | Issue |
|---|---|---|
| B01 | slider/slide-3.jpg | Dell logos on both laptops |
| B06 | heroes/free-billing-audit.jpg | Screen title "Practice Revenue Data"; Dell logo |
| B07 | heroes/course-cpc.jpg | Book cover "Medical Coding Reference"; screen text |
| B09 | heroes/course-cpc-cpb.jpg | Book cover "Professional Credentials" |
| B12 | heroes/medical-coding.jpg | Faint book title and screen text (minor) |
| B13 | heroes/denial-management.jpg | Wall poster with a map and "PAKISTAN" |
| B14 | heroes/careers.jpg | Laptop shows lines of code |
| B15 | blog/why-claims-get-denied.jpg | Folder cover "PROJECT ALPHA" |
| B18 | blog/clean-claim-rate.jpg | Dell logo |
| B19 | guides/clean-claim-checklist.jpg | Apple logo on the laptop lid |
| B21 | guides/coding-career-90-day-plan.jpg | Screen text "Session 3: Planning"; face cut at the top edge |
| B23 | og/og-careers.jpg | Dell logo; a shop sign in the background |
| B24 | backgrounds/home-aapc-band.jpg | Book cover title readable |
| C08 | services/revenue-cycle-management.jpg | Dashboard labels "Revenue", "Claims processed" |

To replace one, overwrite the original and run `node scripts/optimize-images.mjs`.

## 3. Spacing and UI fixes

### Spacing system (new tokens, app/globals.css)
- `section-y`: section padding **56px phones / 72px tablets (≥768) / 96px desktop (≥1024)**. `gap-grid`: card and grid gaps **24px, 32px from 1440px**. Container gutters unchanged (20 / 32 / clamp(32px, 5vw, 96px)).
- Heading → paragraph 16px (`gap-4`); paragraph → buttons 32px (`gap-8`, or `gap-4` + `mt-4`).

| Where | Before | After |
|---|---|---|
| PageHero (every inner page) | `py-12 lg:py-16`, text → buttons 24px | `section-y`, text → buttons 32px |
| Section (shared band) | `py-16 lg:py-20`, heading → intro 12px | `section-y`, 16px |
| CTA band (ink) | `py-16`, gaps 24px | `section-y`, heading → text 16px, text → buttons 32px |
| Home partnership strip | `py-14` | `section-y` |
| Home "Our Services" | `py-16 lg:py-20`; card text → buttons 20px | `section-y`; 32px |
| Credentials section | `py-16 lg:py-20`, heading → intro 12px, tile gap 24px fixed | `section-y`, 16px, `gap-grid` (tile widths follow the token) |
| AAPC instructors band | `py-14 lg:py-16`, gaps 20px | `section-y`, heading → text 16px, button 32px |
| About "Our Story" (all parts) | `py-16 lg:py-24`, gaps 20px | `section-y`, 16px |
| How it works | `py-16 lg:py-20` | `section-y` |
| Course page registration | `py-16` | `section-y` |
| Thank-you, newsletter confirm, 404 | `py-20 md:py-28` / `py-24`, `px-4` | `section-y`, gutter token |
| Card grids: home, AAPC page, course pages, About, Team, Services, Specialties, specialty page, blog post, Guides | `gap-6` (or `gap-8 lg:gap-6`) | `gap-grid` |

### Page checks

| # | Page(s) | Issue found | Fix |
|---|---|---|---|
| 1 | All | Horizontal scroll | **None found** at any size, in any browser |
| 2 | All phones | ~12 paragraphs under 16px (price notes 12px, PHI notice, card summaries, CPT note, form notes) | Paragraphs are at least 16px below 768px (one unlayered rule for `main p.text-sm/.text-xs`) |
| 2 | Course pages, service pages | List items ran to ~110ch at 1920px | Lists capped at 75ch |
| 2 | Home slider at 768–1023px | White text over photos 1.97–3.45:1 (the gradient faded out before the text ended) | Solid navy 75% overlay until 1024px; **4.89:1 or better on all 3 slides at 360–2560** (measured) |
| 2 | Home AAPC band | Overlay hid the photo entirely at first; at 1920px a lamp in the photo gave the heading 3.54:1 | Overlay tuned: photo visible, text ≥ 4.5:1 at every width (measured) |
| 2 | Home "Our Services" | Decorative "01–04" sky on white 2.51:1 flagged by Lighthouse/axe (aria-hidden decoration, exempt under WCAG) | Digits drawn by CSS (`::before`), same look, not text for checkers |
| 3 | Header | Nav buttons 40px tall; "Free billing audit" 32px | 44px |
| 3 | All inner pages | Breadcrumb links 20px tall | 44px tap targets |
| 3 | Footer | Links 17px tall; social icons 34px | 44px on phones/tablets and any touch screen (`pointer: coarse`); 24px rows with a mouse (WCAG 2.5.8) |
| 3 | Forms (registration, audit, contact) | Inputs and selects 40px; consent checkbox 20px with a 14px label | 44px fields; the whole consent label is the target (≥44px), 24px box and 16px text on phones |
| 3 | Buttons site-wide | Default size 40px | 44px |
| 3 | Blog categories, FAQ jump links, "All FAQs", Contact details links | 40px / 22px / 19px | 44px |
| 4 | Home, AAPC page, course pages, FAQ | In-page links (#register, #compare, #courses…) landed under the 65px sticky header | `scroll-padding-top: 88px` |
| 5 | All images | Stretching / bad crops | None stretched; heroes cropped to 4:3 around the subject (careers re-cropped so nobody is cut off) |
| 8 | AAPC page | Comparison table scrolled but the row labels scrolled away; not keyboard-scrollable | Sticky first column, focusable labelled scroll region, 16px text. Same region treatment for the specialty code table and blog tables |
| 8 | Course pages | Beside the new hero photo, facts + price block were squeezed into two columns | They stack until 1440px |
| 9 | Forms | Keyboard types | Already correct: email / tel types and autocomplete on all three forms |
| 11 | All | Help button over controls when scrolled | `scroll-padding-bottom: 104px`, so keyboard focus never scrolls a control under it; nothing is under it at the bottom of any page (footer padding) |
| 12 | All | Reduced motion, focus, Esc | Covered by the E2E suite (axe on every page, reduced-motion runs, lightbox/menu Esc); the new band background is static with reduced motion |
| 13 | All | Empty image boxes | None. The only dashed boxes are the Medical Coding code-chip graphic (design), not placeholders |

### Verified, no change needed
- Slider controls sit below the buttons and don't overlap them at any width.
- The service stacking cards stick under the header, and nothing is hidden when scrolling back up. On phones they stack cleanly.
- No cookie banner exists on the site, so there was nothing for the help button to cover.

### Audit numbers (issues across all routes × sizes)
- Chrome, 10 widths: 805 hits before, then 95, then 6 (the FAQ jump links, since fixed).
- The rest are expected, not defects:
  - The help button passes over content while scrolling, and sits over whatever is at the bottom-right of the first screen on some pages.
  - The dashed code chips on Medical Coding are the design, not placeholders.
  - One card link measured as "long text".
- WebKit and Firefox give the same picture.

## 4. Lighthouse

Local production build (`next start`), Lighthouse 13.5, default mobile (simulated 4× CPU, slow 4G) and desktop presets. Scores are Performance / Accessibility / Best Practices / SEO.

| Page | Mobile | LCP | CLS | TBT | Desktop | LCP | CLS |
|---|---|---|---|---|---|---|---|
| Home | **44** / 100 / 100 / 100 | 5.53 s | 0.000 | 1598 ms | 94 / 97* / 100 / 100 | 1.05 s | 0.000 |
| About | **52** / 100 / 100 / 100 | 5.11 s | 0.000 | 1056 ms | 99 / 100 / 100 / 100 | 0.89 s | 0.000 |
| AAPC Certification | **55** / 100 / 100 / 100 | 4.84 s | 0.000 | 1196 ms | 96 / 100 / 100 / 100 | 0.96 s | 0.000 |
| CPC® course | **60** / 100 / 100 / 100 | 4.89 s | 0.000 | 938 ms | 97 / 100 / 100 / 100 | 0.93 s | 0.000 |
| Medical Billing | **52** / 100 / 100 / 100 | 5.20 s | 0.000 | 1448 ms | 98 / 100 / 100 / 100 | 0.97 s | 0.000 |
| Blog | **65** / 100 / 100 / 100 | 4.17 s | 0.000 | 864 ms | 97 / 100 / 100 / 100 | 1.00 s | 0.000 |
| Contact | **65** / 100 / 100 / 100 | 4.37 s | 0.000 | 812 ms | 100 / 100 / 100 / 100 | 0.80 s | 0.000 |

\* Home desktop 97 was the decorative-ordinal contrast flag, fixed after this run.

- **Passes:**
  - Accessibility, Best Practices and SEO are 100 on mobile (desktop home 97 before the ordinal fix).
  - Desktop Performance is 94–100.
  - CLS is 0.000 everywhere.
- **Fails:**
  - Mobile Performance is 44–65, against a target of ≥ 90.
  - Mobile LCP is 4.2–5.5s, against a target of ≤ 2.5s.
- **Not caused by the images:**
  - The LCP photo downloads in under 0.2s. The delay is "element render delay", which is main-thread JavaScript (React hydration) in Lighthouse's simulated throttling.
  - Yesterday's code, measured on a live deployment from the same machine, scores home 50 / CPC 62.
- **Improved today (ADR-031):**
  - `experimental.inlineCss` was inlining the 125 kB stylesheet into every page twice. With it off, home HTML drops from 545 kB to 279 kB.
  - Main-thread script evaluation on home drops from 6.6s to 2.7s, and style/layout from 3.0s to 1.6s.
  - Desktop moved from 87–97 to 94–100.
- **Still to do for mobile ≥ 90** (next task, not started):
  - Cut client-side JavaScript: fewer `"use client"` components on the home page (slider, stack and motion wrappers), and a smaller RSC payload.
  - Defer below-the-fold interactive sections.
  - Re-measure on the live hosting. Local Windows runs are noisy; the benchmark index was ~1000–1180.

## 5. Tests
- Unit: 121 passed.
- E2E (Chrome): 241 passed, 53 skipped by feature flags.
- New `tests/e2e/images.spec.ts` (19 tests):
  - hero photo position at 1280 and 360;
  - slide priority and lazy loading;
  - band, blog and guide photos;
  - social images on 7 page types.
- Screenshots: `pm/screenshots/2026-09-30/`, 164 full-page JPEGs (41 routes × 360/768/1280/1920). Full-page capture stitches the home "Our Services" sticky cards oddly: a blank stretch, and the hero repeated at the bottom on phones. That's a screenshot artifact; scroll-by-scroll captures show the real layout.

## 6. Open items
1. **Mobile Performance ≥ 90 and LCP ≤ 2.5s are not met** (see §4); the brief blocks the push until this passes.
2. Regenerate the 14 flagged images (§2), and upload the inpainted C06 / C09.
3. Floating help button: it stays at the client's 72px. On phones it sits over content at the bottom-right of the first screen on a few pages (FAQ questions, some CTAs) until the visitor scrolls. A 56px button on phones would remove most of this; client decision.
4. Social image URLs use `NEXT_PUBLIC_SITE_URL`. It has to be the live domain in the hosting environment for share previews to work (set in `.env.production`, ADR-032).

---

# Part 2: fixes brief (image placement, founder photo, packages, Why register, alignment)

Commits: `1b5df33` step 1 · `e8d0011` + `9e507a0` step 2 · `772fe4e` step 3 · `d985829` step 4 · step 5 (this update).

## 7. Image placement audit (step 1)

Every image rendered on the site was listed by page and section in the browser (1280px), then compared with pm/IMAGE_PLAN.md and with the photo's content.

| ID | File | Planned page + section | Where it actually shows | Correct? | Fix |
|---|---|---|---|---|---|
| B01 | slider/slide-3.webp | Home slider, slide 3 | Home slider, slide 3 | ✅ | — |
| C06 | services/medical-transcription.webp | Home card 1, Medical Transcription | Card 1 **and** the /services/medical-transcription hero | ❌ used twice | Hero removed (no planned hero photo) |
| C07 | services/ai-clinical-documentation.webp | Home card 2, AI Documentation | Card 2 **and** the /services/ai-clinical-documentation hero | ❌ used twice | Hero removed |
| C08 | services/revenue-cycle-management.webp | Home card 3, RCM | Card 3 **and** the /services/revenue-cycle-management hero | ❌ used twice | Hero removed |
| C09 | services/aapc-certification.webp | Home card 4, AAPC | Card 4 | ✅ | — |
| B05 | heroes/aapc-certification.webp | AAPC Certification hero | Same | ✅ | — |
| B07 | heroes/course-cpc.webp | CPC® hero | Same | ✅ | — |
| B08 | heroes/course-cpb.webp | CPB® hero | Same | ✅ | — |
| B09 | heroes/course-cpc-cpb.webp | CPC® + CPB® hero | Same | ✅ | — |
| B06 | heroes/free-billing-audit.webp | Free Billing Audit hero | Same | ✅ | — |
| B10 | heroes/services.webp | Services hero | Same | ✅ | — |
| B11 | heroes/medical-billing.webp | Medical Billing hero | Same | ✅ | — |
| B12 | heroes/medical-coding.webp | Medical Coding hero | Same | ✅ | — |
| B13 | heroes/denial-management.webp | Denial Management hero | Same | ✅ | — |
| B14 | heroes/careers.webp | Careers hero | Same | ✅ | — |
| B15 | blog/why-claims-get-denied.webp | "Why claims get denied" cover + card | Same (matching article) | ✅ | — |
| B16 | blog/modifier-25-explained.webp | "Modifier 25 explained" cover + card | Same (matching article) | ✅ | — |
| B17 | blog/start-medical-coding-career-pakistan.webp | "How to start a medical coding career" cover + card | Same (matching article) | ✅ | — |
| B18 | blog/clean-claim-rate.webp | "Clean claim rate" cover + card | Same (matching article) | ✅ | — |
| B19–B21 | guides/*.webp | Guide cards | Same, each on its guide | ✅ | — |
| B24 | backgrounds/home-aapc-band.webp | Home "Get Trained by AAPC Instructors" background | Same | ⚠️ photo barely visible on phones (80% navy overlay) | Phone overlay 65% |
| — | about/riaz-naveed-800.webp | About › Our Story | Same | ✅ | Layout fixed in step 2 |

- Order of the home cards confirmed: 1 Transcription, 2 AI Documentation, 3 RCM, 4 AAPC.
- Crops were checked at 1280px and 360px. The blog covers now use the 4:3 hero crop in the post hero (step 4); the blog cards keep 16:9.
- The earlier "cut off" look of the home cards in screenshots was the sticky header overlapping them; captured without it, all four are complete.
- Screenshots of every slot: `pm/screenshots/2026-09-30-alignment/slots/` (1280 and 360).

## 8. About › Our Story (step 2)

- New shared **split grid**: one column below 1024px, 60/40 at 1024–1279px, 7/5 of 12 columns from 1280px, column gap clamp(40px, 5vw, 80px).
- The photo's top is level with the "Our Story" heading. Photo size: 4:5, max 460px (380px at 1024–1279px, 360px centred on phones), 16px radius, 16px #EEF6FC frame.
- The whole photo is visible (`object-contain`, nothing cropped). The caption "Riaz Naveed, Founder & CEO" is small and muted, with the existing "Est. 2007" badge.
- On phones the order is heading, then the photo 32px below it, then the text.
- The story text runs directly under the heading (the heading row no longer stretches), at 18px from 1024px.
- **Still open:** the text column is 25–40% shorter than the photo at 1280–1920px, because the brief fixes both the photo size and its top alignment. Choosing between them is the client's call.
- **Help button:** 60px on screens under 768px (72px above). The footer keeps button height + 24px clear under its last links, so nothing sits under the button at the end of any page.

## 9. Course packages and "Why register" (step 3)

- **Package Includes:** bold 16px heading, sky-blue checks, 8px apart, client text exactly. It sits under the price note:
  - on every course card (AAPC page and home);
  - on each course page, in the price card beside the hero.
- **Old lists hidden, nothing deleted:** "What's included" is hidden by flags (`cpcIncludedLegacy`, `cpbIncludedLegacy`, `dualIncludedLegacy` = false).
- **Comparison table:**
  - Duration and Format stay.
  - Then one row per package item: Training · Blackboard access (6 months) · Certification exam(s) (CPC exam with two attempts / CPB exam with two attempts / CPC and CPB exams with two attempts each) · AAPC membership (1 year) · Books (Latest edition included).
  - Then Price.
  - The old rows (practice tests, Practicode, Codify, Denials guide, 1/2 off prerequisite) are hidden by `comparisonLegacyRows`.
- **Old package mentions elsewhere:**
  - Hidden by `practiceTestsMentions`: the band point "Official AAPC exams and practice tests" and the "How it works" exam-step caption. Replacement text is requested in CLIENT_INPUTS_NEEDED.
  - The only wording change: I removed the clause "(1/2 off with this course)" from the CPC® and CPB® "Experience requirements" and "at 1/2 off with your course" from the FAQ answer. The rest of those sentences is unchanged.
  - A new e2e test checks that the home, AAPC, course and FAQ pages mention none of Practicode, Codify, "practice tests", "Denials Management", "1/2 off" or "two-year".
- **"Why register through GlobalMed Transcriptions?"** (home, client text exactly):
  - Intro, then five cards: bold lead word, then the rest, with sky checks instead of ✅.
  - Layout: 3 + 2 on desktop (the 2 centred), 2 columns on tablet, 1 on phones; all cards the same height.
  - Then the tagline (large, navy, centred), the closing line, and "Register Now" (registration form) with "Ask on WhatsApp".
  - The previous four cards are hidden (`whyRegisterLegacy`).
- **Chatbot (docs/09):**
  - The three package lists replace the old package details.
  - It now knows the "Why register" points (special pricing, installments, upcoming batch).
  - "Upcoming batch" is allowed alongside "batch schedules".
- **CLIENT_INPUTS_NEEDED:** the dual course's membership length (previously two-year), whether each exam has two attempts, and replacement text for the two practice-test mentions.

## 10. Alignment and symmetry (step 4)

| Area | Change |
|---|---|
| Container | One `container-fluid` for every section, header and footer (ADR-029); the alignment audit confirms section headings share the container's left edge on every page |
| Two-column grid | One split grid everywhere: heroes, About sections (Our Story, Documentation, Revenue Cycle, Workforce), text + form (Free Billing Audit, Contact, Register for AAPC Training) and heading + FAQ sections (5/7 variant). It replaces nine different ad-hoc column ratios |
| Heroes | Photo always the 4:3 hero crop, aligned to the top; the text column centres against it (when the text is taller it starts level with the photo's top). Course pages: the price + Package Includes card moved under the photo, so the columns balance |
| Long forms and FAQ lists | The intro column stays in view (sticky) beside the long form or question list, instead of leaving an empty column |
| Alternating sides | Home service cards: photo right on 1 and 3, left on 2 and 4 (from 768px) |
| Section spacing | Tokens from part 1 (96/72/56; 16px heading → text, 32px text → buttons, 24/32px grid gaps). Course hero: facts → buttons now 32px |
| Cards | 16px radius on all cards and panels (was 12px), 24px padding (a few had 16–20px), 24px radius on the large stacking cards; buttons pinned to the card bottom |
| Headings | h2 is 24/30px everywhere; "What we review" was 24px on desktop and now matches |
| Buttons | All buttons 48px tall (were 44px default / 48px large), header CTA included |
| Images | 4:3 heroes and cards, 16:9 blog cards, 4:5 portrait; none stretched (UI audit) |

**Alignment audit** (`tests/audit/alignment.mjs`, 41 routes × 1024/1280/1440/1920):
- 125 findings before, 4 after.
- Three are Our Story (see §8).
- One is a home service card at 1920px, where the full-height photo panel is taller than the card text by design.

## 11. Checks (step 5)

- **UI audit** at 360, 390, 768, 1024, 1280, 1440 and 1920 on all 41 routes, in Chrome, WebKit and Firefox:
  - no horizontal scroll, no touch targets under 44px, no paragraphs under 16px on phones, no stretched or cut-off images, in any browser;
  - remaining hits: the help button passing over content while the page scrolls, the Medical Coding code-chip graphic (design, not a placeholder), and one card link counted as long text.
- **Tests:**
  - unit 121 passed;
  - E2E 248 passed, 53 skipped by flag, including the new `packages.spec.ts`;
  - two tests failed once while the three browser audits were loading the machine, and pass when re-run.
- **Screenshots:** `pm/screenshots/2026-09-30-alignment/`:
  - Our Story, the AAPC course cards, the CPC® hero and full page, and "Why register" at 1920 and 360;
  - every page at 360 and 1920 in `pages/`;
  - every image slot in `slots/`.

### Lighthouse (local production build)

| Page | Mobile P / A / BP / SEO | Mobile LCP · CLS · TBT | Desktop P / A / BP / SEO |
|---|---|---|---|
| Home | **42** / 100 / 100 / 100 | 5.08 s · 0.000 · 3757 ms | 97 / 100 / 100 / 100 |
| About | **49** / 100 / 100 / 100 | 4.97 s · 0.000 · 2679 ms | 92 / 100 / 100 / 100 (first run 81: TBT noise) |
| AAPC Certification | **70** / 100 / 100 / 100 | 4.67 s · 0.000 · 487 ms | 99 / 100 / 100 / 100 |
| CPC® | **50** / 100 / 100 / 100 | 5.04 s · 0.000 · 1260 ms | 99 / 100 / 100 / 100 |

**Desktop passes (92–99). Accessibility, Best Practices and SEO are 100 everywhere. Mobile Performance fails (42–70).**

What the measurements show:
- The cost isn't the images or today's changes. The LCP photo loads in under 0.2s.
- In Lighthouse the time goes to style/layout of the first render and to React hydration and link prefetching.
- A CPU-throttled trace shows no continuous animation cost after load (style ≤ 40ms, layout ≤ 26ms over 6s idle).
- Run-to-run noise on this machine is large: home TBT has measured anywhere from 1.6s to 3.8s.

Getting mobile to 90 needs a dedicated performance task:
- fewer client components and less hydration on the home and course pages;
- defer below-the-fold interactive sections;
- review Next's link prefetching;
- measure on the live hosting.
