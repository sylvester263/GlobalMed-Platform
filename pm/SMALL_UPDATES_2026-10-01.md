# Small updates — 2026-10-01

LCCI title, footer line, course card note, horizontal logo site-wide, card alignment. Nothing deleted; hidden items sit behind flags.

## 1. Changes made

| # | Change | Where |
|---|---|---|
| 1 | LCCI tile line now reads "Corporate Member, The Lahore Chamber of Commerce & Industry". Kept: Membership No. 94721 C · Member since 04/06/2018 · valid until 31 Mar 2027 · Issued by The Lahore Chamber of Commerce & Industry. | `data/credentials.ts` (home and About use the same data); `docs/09` §3.1 (new credentials bullet for the chatbot) |
| 2 | Footer: trademark line hidden; fine print is "© 2026 GlobalMed Transcriptions · Designed & developed by SylJo Tech"; the "© 2026 GlobalMed Transcriptions" item at the start of the links row is removed, so it appears once. | `components/marketing/footer-compact.tsx`, `site-footer.tsx` (extended footer, hidden) |
| 3 | Course cards (home, AAPC page): delivery note under the price hidden; still on each course page. Price (and the dual saving) → 24px → "Package Includes". | `components/marketing/aapc-course-card.tsx` |
| 4 | Course cards aligned from 1024px: CSS subgrid over 8 shared rows (title, summary, facts, "Who it's for", divider + price, "Package Includes", buttons, "Course details"); equal height; the dual saving's space is reserved in the other two cards (invisible, aria-hidden copy, so it matches at every width); buttons and "Course details" on one line at the bottom; the highlighted card keeps its border and badge with the same padding and top (1px ring instead of the 2px border and vertical offset). Below 1024px the cards stack. | `aapc-course-card.tsx`, `app/(marketing)/page.tsx`, `app/(marketing)/school/aapc-certification-pakistan/page.tsx` |
| 5 | Horizontal GlobalMed logo everywhere the stacked logo was used (list below). Footer: on its white rounded plate, 44px. Height-based sizing only, original artwork. Stacked files kept in `public/images/brand/`; favicon and app icons unchanged (circle icon). | see list |

## 2. Flags added (`config/features.ts`)
- `footerTrademarkNote: false`: hides "CPC® and CPB® are registered trademarks of AAPC." (true restores it and the copyright at the start of the links row).
- `courseCardPriceNote`: hid the delivery note on the course cards only; **restored the same day at client request (now `true`)**.

## 3. Logo replacement list
Searched for `globalmed-logo-stacked`, `globalmed-logo-stacked-on-white` and the `Wordmark` component.

| Place | Before | Now |
|---|---|---|
| Wordmark component (one source for the header, auth/staff pages, dashboards, mobile menu, About lockup, extended footer, course player, certificate) | `globalmed-logo-stacked.png` | `globalmed-logo-horizontal.png`; heights: header 40px phones / 44px from 768px, compact 36px, footer 44px |
| Site header (every public page, incl. the 404 page) | stacked, 56px | horizontal, 40/44px |
| Compact footer | stacked, 88px, white plate | horizontal, 44px, white rounded plate |
| Extended footer (hidden) | stacked via Wordmark | horizontal via Wordmark |
| Mobile menu sheet | stacked via Wordmark | horizontal via Wordmark |
| About "Investing in Pakistan's Healthcare Workforce" partner lockup | stacked via Wordmark | horizontal, 36px, same height as the AAPC logo |
| Home hero slider lockup (all 3 slides) | already horizontal (2026-10-01) | unchanged |
| Login / staff pages (auth card) | stacked via Wordmark | horizontal via Wordmark |
| Dashboard sidebar and sheets | stacked via Wordmark (collapsed: icon) | horizontal (collapsed: icon, unchanged) |
| Course player bar | stacked via Wordmark | horizontal via Wordmark |
| Certificate template (hidden by flag) | stacked, `max(56px,12cqw)` | horizontal, `max(32px,6cqw)` |
| Social share (OG) images, all sections | stacked 100×120 on a white plate | horizontal 258×56 on a white plate |
| Organization JSON-LD `logo` and `image` | stacked-on-white, stacked | horizontal |
| Registration success screen | no logo | nothing to replace |
| Email templates (lead notification, newsletter confirm) | no logo | nothing to replace |
| Favicons, app icons | circle icon | unchanged |

## 4. Checks
- Course cards: `tests/audit/course-cards.mjs` at 360, 768, 1024, 1280, 1440, 1920 on home and the AAPC page: equal height, every section aligned across the three cards from 1024px, price → "Package Includes" 24px, no delivery note on the cards. 0 problems.
- Header logo 40px at 360, 44px at 768/1280/1920, no horizontal overflow. Slider lockup check still 0 problems.
- Unit 121 passed; E2E 252 passed, 53 skipped by flag (footer test updated: no trademark line, copyright once, horizontal logo).
- Screenshots in `pm/screenshots/2026-10-01/small-updates/`: course-cards-home-1440, course-cards-aapc-1440, footer-1920, footer-390, header-360/768/1280/1920, about-lockup-1280, og-home.
