# design-system/MASTER.md

> **Locked source of truth** for all GlobalMed UI. Generated in Phase 1 (P1-1, P1-2) from ui-ux-pro-max output
> (`design-system/ui-ux-pro-max-output.md`) reconciled with `docs/06_DESIGN_SYSTEM.md` and `docs/15_MOTION_DESIGN.md`.
> Implemented in `app/globals.css` (tokens) and `lib/motion.ts` (motion). Changing a token here requires changing it there.
> Status: **locked pending client design sign-off (P1-7)** · Version 1.0 · 2026-09-24

## 0. Reconciliation log (ui-ux-pro-max vs docs/06)

| Topic | ui-ux-pro-max suggested | Decision | Why |
|---|---|---|---|
| Style | Run 1: Neumorphism · Run 2: Minimalism & Swiss | **Swiss / editorial minimalism** | Neumorphism flagged `accessibility risk:high` (soft shadows fail 3:1 for boundaries). Swiss matches "calm, precise, credential-grade". |
| Palette | Cyan `#0891B2` + `#22D3EE`, or trust blue `#0369A1` | **docs/06 palette** (ink navy, teal, mint, ledger, gold, alert) | Cyan/sky-blue reads as generic SaaS, which docs/06 §2 rules out. The docs/06 palette passes AA once tuned (§1.3). |
| Gold | Accent adjusted `#CA8A04 → #A16207` for text contrast | **Adopted the idea:** `gold` `#C8962E` is decorative only; `gold-ink` `#8A6414` for gold text | `#C8962E` on white is 2.67:1. |
| On-primary | Black on cyan | White on teal (5.01:1) | Teal is dark enough for white text. |
| Fonts | Figtree + Noto Sans / Inter only | **Source Serif 4** (headings) + **Public Sans** (UI/body) + **JetBrains Mono** (codes) | docs/06 §4 asks for a humanist serif with strong numerals. ui-ux-pro-max's "Magazine Style" (serif + Public Sans) confirms the pairing. Mono is for ICD-10/CPT codes and certificate IDs. |
| Pattern | Hero → Problem → Solution → Testimonials → CTA | Adopted for service pages (docs/02 W-2: problem → how we work → outcomes → FAQ → CTA) | Consistent with the PRD. |
| Motion | GSAP `back.out(1.4)` stagger | **Rejected overshoot.** docs/15 easing tokens only | The tool itself warns against overshoot on informational UI. |
| Anti-patterns | Neon, heavy motion, AI purple/pink gradients | Merged into §7 | |

## 1. Colors

### 1.1 Brand tokens (logo palette, ADR-023)
The palette comes from the official logo (`public/logo.png`). Older token names are kept as aliases in `app/globals.css`, so existing classes still work: `teal` = navy, `teal-bright` = sky, `gold` = sky, `gold-ink` = navy, `mint` = sky-soft, `ledger` = surface-soft.

| Token | Hex | Use |
|---|---|---|
| `navy` (`teal`, `primary`) | `#283F93` | Headings, primary buttons, header links, footer background, active states, focus ring |
| `navy-hover` (`teal-hover`, `teal-deep`) | `#1F3278` | Hover/pressed navy; navy text on tinted surfaces |
| `sky` (`teal-bright`, `gold`) | `#51ACE3` | Highlights, icons, claim-line ticks, progress fills, seal ring, links on `ink`. **Never white text on sky**: use ink text (5.43:1) |
| `mid-blue` (`secondary`) | `#3A73C2` | Secondary buttons, charts, hover accents |
| `ink` | `#1B2A5E` | Body text; dark bands (CTA band) |
| `surface-soft` (`ledger`) | `#EEF6FC` | Light section backgrounds |
| `sky-soft` (`mint`, `gold-soft`, `accent`) | sky 20% on white | Icon chips, hover states, soft badges |
| `white` (`background`) | `#FFFFFF` | Page background, cards, inputs |
| `alert` (`destructive`) | `#C0392B` | Errors, denied states |
| `alert-bright` | `#FFB4AB` | Error text on dark bands |

Gradients: only where one already exists, `#283F93 → #3A73C2`. Don't add new ones.

### 1.2 Semantic tokens (CSS variables in `app/globals.css`, shadcn names)
| Variable | Value | Notes |
|---|---|---|
| `--background` | `#FFFFFF` | |
| `--foreground` | ink | |
| `--primary` | navy | `--primary-foreground`: white |
| `--secondary` | mid-blue | `--secondary-foreground`: white. Secondary buttons are mid-blue outline, filled on hover |
| `--muted` | `#EDF2F8` | `--muted-foreground`: `#5B6785` |
| `--accent` | sky-soft | `--accent-foreground`: ink |
| `--success` | `#1E8E5A` | Fills and icons. Text uses `--success-ink` `#17734A`; soft `#E8F5EE` |
| `--warning` | `#D98A0B` | Fills only. Text and icons use `--warning-ink` `#8A5A06`; soft `#FDF3E1` |
| `--border` | `#D9E3F0` | Dividers, card outlines, unfilled ticks (`--tick`) |
| `--input` | `#6E7B99` | Form control borders, ≥ 3:1 on white (4.24) |
| `--ring` | navy | 2px ring + 2px offset |

**Dark mode:** not in launch scope.

### 1.3 Verified contrast (WCAG 2.1, computed)
| Pair | Ratio | Allowed use |
|---|---|---|
| white on navy / navy-hover / mid-blue | 9.45 / 11.76 / 4.76 | button labels, text on bands |
| navy on white / surface-soft / sky-soft | 9.45 / 8.65 / 7.94 | text, links |
| ink on surface-soft | 12.49 | all text |
| muted-fg on white / surface-soft / sky-soft | 5.64 / 5.16 / 4.74 | secondary text |
| mid-blue on white | 4.76 | secondary button text (not on surface-soft: 4.36 ❌) |
| sky on white | 2.51 ❌ | decorative only |
| sky on navy | 3.76 | icons and large text only (≥ 24px) |
| sky on ink / ink on sky | 5.43 | text, buttons on dark bands |
| navy on sky | 3.76 ❌ | not for text: use ink on sky |
| success on white | 4.14 ❌ | icons only; text uses success-ink (5.85) |
| warning on white | 2.77 ❌ | fills only; text and icons use warning-ink (5.92) |
| alert on white / destructive-soft | 5.44 / 4.76 | error text |
| alert-bright on navy | 5.57 | error text on the footer |

## 2. Typography

| Role | Font | Weights | Loaded via |
|---|---|---|---|
| Headings, big numbers, certificate names | **Source Serif 4** (variable, optical size) | 500–700 | `next/font/google`, `--font-serif` |
| Body, UI, forms, tables | **Public Sans** (variable) | 400–700 | `next/font/google`, `--font-sans` |
| Codes (ICD-10, CPT), certificate IDs, figures in tables | **JetBrains Mono** | 400–500 | `next/font/google`, `--font-mono` |

Scale (ratio 1.25, base 16px). The Tailwind utilities are the standard names, remapped in `@theme`:

| Token | Size / line-height | Use |
|---|---|---|
| `text-xs` | 12 / 16 | Legal, captions (never body) |
| `text-sm` | 14 / 20 | UI labels, table cells, helper text |
| `text-base` | 16 / 26 (1.6) | Body |
| `text-lg` | 20 / 30 | Lead paragraphs |
| `text-xl` | 25 / 32 | H4 |
| `text-2xl` | 31 / 38 | H3 |
| `text-3xl` | 39 / 46 | H2 |
| `text-4xl` | 49 / 56 | H1 (desktop). Mobile H1 uses `text-3xl` |

Rules: headings use `font-serif`, weight 600, `tracking-tight`, `text-balance`. Body ≤ 75ch (`max-w-prose`). Numbers in stats use `font-serif` with `tabular-nums`. Uppercase eyebrow labels use `font-sans text-xs font-semibold tracking-[0.12em]`. Minimum body text is 16px on mobile.

## 3. Spacing, layout, radius, elevation

- **Spacing:** 4px base (Tailwind default). Section padding: `py-16` mobile, `py-24` desktop. Component gaps: 8 / 12 / 16 / 24.
- **Container:** max 1200px marketing (`max-w-300`), 1440px dashboards, 16px gutters on mobile, 24px from `md`.
- **Grid:** 12 columns desktop, 4 mobile. Text blocks left-aligned. Alternate full-bleed bands (`ledger` / `white` / `mint` / `ink`) instead of chopping everything into cards.
- **Breakpoints tested:** 360, 768, 1280 (CLAUDE.md §5). Tailwind defaults `sm 640 · md 768 · lg 1024 · xl 1280`.
- **Radius:** `--radius-sm` 4px (chips inside inputs) · `--radius-md` 6px (buttons, inputs) · `--radius-lg` 12px (cards, panels, dialogs) · `rounded-full` only for status pills and avatars.
- **Elevation:** flat by default, with borders doing the separation. `shadow-sm` for cards on hover; `shadow-lg` only for popovers, dialogs and the chat panel. No neumorphic or coloured shadows.
- **Touch targets:** ≥ 44×44px for primary controls on mobile (buttons `default` = 40px tall + padding hit area, `lg` = 48px).

## 4. The signature: claim line

A thin horizontal rule with evenly spaced tick marks, borrowed from billing ledgers. **Spend boldness here only.**

- Anatomy: 1px (`--border`) or 2px (`teal`, when active) rule; ticks 6px tall, 1px wide, every 24px or at step positions; the fill rule is navy (`teal`), filled ticks are sky; the final tick is a heavier sky mark (`gold` alias) for achievement.
- Used as: section dividers (static), course progress bars (ticks = lessons), certification pathway (ticks = stages), multi-step form progress, certificate name underline, hero draw-in (MG-1).
- Components: `components/ui/claim-progress.tsx` (static, accessible `role="progressbar"`) and `components/motion/claim-line.tsx` (animated).

## 5. Component rules

- Build on shadcn/ui (Base UI primitives) in `components/ui/`. Restyle with tokens only: **no hex values in components**.
- **Buttons:** variants `primary` (navy), `secondary` (mid-blue outline, filled on hover), `ghost`, `destructive`, `link`. Sizes `sm` 32px · `default` 40px · `lg` 48px. Labels are verbs that describe the outcome ("Book your free billing audit"). `loading` shows a spinner, keeps the width and sets `aria-busy`.
- **Links** in body copy are navy and underlined (`underline-offset-4`). Never colour-only.
- **Forms:** visible label above every field; helper text below; error text in `alert` below the field with an icon, linked with `aria-describedby`; required fields marked "(required)" in text, not only `*`. Every public form shows the notice: *"Do not include patient information."*
- **Status chips:** pill, soft background + strong text (`success-soft`/`success`, etc.), always with a text label.
- **Cards:** white, `border`, `radius-lg`, 24px padding. Only for genuinely repeated items (courses, posts, testimonials).
- **Tables:** `text-sm`, zebra off, row hover `mint/50`, mono for codes and IDs, right-aligned numbers.
- **Focus:** `outline-2 outline-offset-2 outline-ring` on every interactive element. Never remove it.
- **Icons:** lucide-react, 16/20/24px, `stroke-width 1.75`, `aria-hidden` when decorative; icon-only buttons need `aria-label`. No emoji as icons.
- **Imagery:** real GlobalMed photos when supplied; otherwise abstract illustrations of claim forms, code books and ledgers in brand colours. No stock "doctor with stethoscope". No real patient data, ever.

### 5.1 Component inventory (docs/06 §6)

| Component | File | Notes |
|---|---|---|
| Button (variants, sizes, loading) | `components/ui/button.tsx` | Links styled as buttons use `buttonVariants` on `<Link>` |
| Input, Textarea, Select, Checkbox, Radio, Switch | `components/ui/*` | Restyled shadcn (Base UI) |
| Form field with error | `components/ui/form-field.tsx` | Wires label, helper, error, `aria-describedby`, `aria-invalid` |
| Patient-data notice | `components/ui/phi-notice.tsx` | Required on public forms and chat |
| Badge / status chip | `components/ui/badge.tsx` | `success`, `warning`, `destructive`, `gold`, `neutral`, `secondary` |
| Alert, Toast | `components/ui/alert.tsx`, `components/ui/sonner.tsx` | Toaster mounted in root layout |
| Dialog, Sheet, Dropdown, Tabs, Accordion, Tooltip | `components/ui/*` | TooltipProvider in root layout |
| Primary navigation | `components/marketing/mega-menu.tsx` | WAI-ARIA disclosure pattern (buttons + panels), no positioning engine |
| Table (TanStack v9) | `components/dashboard/data-table.tsx` | Use `dataTableColumns<T>()` for typed columns |
| Pagination | `components/ui/pagination.tsx` (links), built into DataTable | |
| Stat block | `components/ui/stat-block.tsx` | `illustrative` flag for unconfirmed figures |
| Chart wrappers | `components/dashboard/charts.tsx` | Recharts; sr-only data table per chart |
| Empty state, Skeleton, Avatar, Breadcrumbs | `components/ui/*` | Skeleton = DM-10 shimmer |
| Stepper / pathway line | `components/motion/pathway-line.tsx` | |
| Progress (claim-line style) | `components/ui/claim-progress.tsx` | Real `role="progressbar"` |
| Video player shell | `components/lms/video-player-shell.tsx` | Bunny player mounts inside in P4-3 |
| Quiz question block | `components/lms/quiz-question.tsx` | DM-4 feedback; grading is server-side |
| Certificate preview | `components/lms/certificate-preview.tsx` | QR code added in P6-5 |
| Pricing block, Testimonial | `components/marketing/*` | |
| Nav bar + mega menu, Footer | — | **Built in P2-1** against the docs/05 sitemap |
| Chat widget shell | — | **Built in P2-20 (MG-18) / P7-4** |

## 6. Motion

Source: docs/15. Implemented in `lib/motion.ts`; primitives in `components/motion/`.

| Token | Value | Use |
|---|---|---|
| `dur.instant` | 100ms | hover, press |
| `dur.fast` | 180ms | toggles, chips, tooltips, dashboard route fade |
| `dur.base` | 280ms | dialogs, dropdowns, tabs |
| `dur.slow` | 480ms | section reveals, page transitions |
| `dur.story` | 1000ms (800–1200) | hero sequence, certificate reveal |
| `ease.standard` | `cubic-bezier(0.2, 0, 0, 1)` | most UI |
| `ease.enter` | `cubic-bezier(0, 0, 0.2, 1)` | appearing |
| `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | leaving (exit faster than enter) |
| `spring.soft` | stiffness 260, damping 30 | cards, drawers |
| `spring.snappy` | stiffness 500, damping 35 | toggles, checkmarks |
| `distance.sm / md` | 8px / 24px | slide offsets |
| `stagger` | 60ms | list/grid children |

The same values exist as CSS variables (`--duration-*`, `--ease-*`) for CSS transitions.

Rules: animate only `transform` and `opacity` (the claim line draws with `scaleX`; SVG `pathLength` is only for paths without `non-scaling-stroke`); every animation explains, confirms or guides; `MotionConfig reducedMotion="user"` at the root; each primitive has an explicit reduced-motion branch (instant final state or plain fade); no overshoot easing on informational UI; no looping animation in dashboards except loaders; loops > 5s have a pause control; reserve layout space (CLS 0); hero text is server-rendered and visible before any animation.

## 7. Anti-patterns (never do)

- Generic blue/purple gradient SaaS hero; AI purple/pink gradients; neon; glassmorphism; neumorphism
- Stock "doctor with stethoscope" photos; any real or realistic patient data in UI or illustrations
- The SylJo/Claude clay-orange accent
- Identical card grids for every section; everything centred
- Hex colours or ad-hoc durations inside components
- Sky text on light backgrounds, white text on sky, or navy text on sky (use ink); mid-blue text on surface-soft
- Placeholder-only labels; errors only at the top of a form; colour as the only signal
- Removing focus outlines; icon-only buttons without labels; emoji icons
- Animating width/height/top/left; bouncy overshoot; auto-playing carousels without pause
- AAPC logo, colours or copy without written permission (CLAUDE.md §5)

## 8. Accessibility checks (every component and page)

- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px or 19px bold); control boundaries ≥ 3:1. Use the §1.3 table.
- [ ] Keyboard: every action reachable with Tab/Enter/Space/Esc; logical order; no traps (dialogs trap intentionally and restore focus)
- [ ] Visible focus ring on every interactive element
- [ ] Labels: form fields labelled; icon buttons have `aria-label`; decorative icons `aria-hidden`
- [ ] Errors announced (`aria-live` / `aria-describedby`), describe the fix
- [ ] Touch targets ≥ 44px on mobile for primary actions
- [ ] Reduced motion: verified with the /styleguide toggle and OS setting
- [ ] Zoom to 200% and 360px width without horizontal scroll
- [ ] axe: 0 serious/critical
