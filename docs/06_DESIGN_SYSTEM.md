# 06 — Design System (starting brief)

The final locked version is written by Claude Code to `design-system/MASTER.md` in Phase 1 using the **UI UX Pro Max** skill. This file is the brief it must reconcile with.

## 1. Brand position
Two audiences, one brand: the precision a practice owner trusts with revenue, and the encouragement a student needs to start a career. The look should feel clinical-accurate and calm, not hospital-sterile and not generic SaaS.

## 2. Direction to explore (UI UX Pro Max query)
- Product type: healthcare revenue-cycle services + professional education platform
- Style keywords: trustworthy, precise, calm, credential-grade, warm-human
- Avoid: generic blue-gradient SaaS hero, stock "doctor with stethoscope" imagery, identical card grids, the SylJo/Claude clay-orange accent, dark-mode-neon

## 3. Proposed tokens (to validate)
| Token | Hex | Use |
|---|---|---|
| `ink` | #0F2A3D | Primary text, headers, footer (deep clinical navy) |
| `teal` | #0E7C7B | Primary actions, links (medical teal, AA on white) |
| `mint` | #E6F4F1 | Section backgrounds, soft highlights |
| `ledger` | #F7F8F6 | Page background (paper-white, very slightly green) |
| `gold` | #C8962E | Certificates, achievement moments only |
| `alert` | #B42318 | Errors, denied states |

Signature idea (spend boldness here only): a **"claim line" motif** — a thin horizontal rule with small tick marks, borrowed from billing ledgers and progress bars, reused as section dividers, course progress bars and the certification pathway line.

## 4. Type
- Headings: a humanist serif with strong numerals (candidates: *Source Serif 4*, *Newsreader*) — credentials feel.
- Body/UI: a clear grotesk (candidates: *Inter Tight*, *Public Sans*).
- Scale (1.25): 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49
- Line length ≤ 75ch; body line-height 1.6

## 5. Layout
- 12-column grid, max width 1200px, left-aligned text blocks.
- Marketing: alternating full-bleed bands; avoid chopping everything into cards.
- Dashboards: left sidebar, top bar with search + notifications, content max 1440px.
- Radius: 6px inputs/buttons, 12px panels, 999px pills only for status chips.

## 6. Base components to build in Phase 1
Button (primary/secondary/ghost/destructive, sizes, loading) · Input, Select, Textarea, Checkbox, Radio, Switch · Form field with error · Badge/status chip · Alert · Toast · Dialog · Sheet (mobile nav) · Dropdown · Tabs · Accordion · Tooltip · Table (TanStack) · Pagination · Stat block · Chart wrappers · Empty state · Skeleton · Avatar · Breadcrumbs · Stepper / pathway line · Progress (claim-line style) · Video player shell · Quiz question block · Certificate preview · Pricing block · Testimonial · Nav bar + mega menu · Footer · Chat widget shell

## 7. Motion
Full specification in **docs/15_MOTION_DESIGN.md**: motion tokens, the claim-line signature animation, 18 website motion graphics, 10 dashboard animations, asset list, performance budget and reduced-motion rules. Every motion serves one of three jobs: explain, confirm or guide.

## 8. Imagery
Real GlobalMed team/office photos preferred. Otherwise: illustrated documents, claim forms, code books (ICD-10/CPT) abstractions. Never show real patient data.

## 9. Copy voice
Plain, specific, active voice. "Book your free billing audit", not "Submit". Errors say what happened and how to fix it.

## 10. Tool workflow
1. `ui-ux-pro-max` → generate design system → reconcile with this file → write `design-system/MASTER.md`
2. `/ui <component>` (21st.dev Magic) with MASTER.md tokens injected
3. `/motion <request>` for animations (docs/15)
4. `frontend-design` skill for page-level composition review
5. Playwright MCP screenshots at 360/768/1280 → self-critique → fix
