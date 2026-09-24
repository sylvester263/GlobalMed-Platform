# ui-ux-pro-max raw output (P1-1)

Generated 2026-09-24 with ui-ux-pro-max 2.13.0. Raw, unedited. Reconciliation lives in MASTER.md §0.

## Run 1 — `"healthcare medical billing education trustworthy" --design-system --variance 4 --motion 5 --density 5`

## Design System: GlobalMed

### Design Dials
- **Variance:** 4/10 — Balanced / Modern
- **Motion:** 5/10 — Standard
- **Density:** 5/10 — Standard

### Pattern
- **Name:** Hero + Testimonials + CTA
- **Conversion Focus:** Social proof before CTA. Use a concise set of verified testimonials with photo, name, and role. CTA after social proof. Provide previous/next and pause controls; stop rotation on focus, hover, and reduced motion; announce slide position. Previous/next buttons and keyboard controls must expose every slide without dragging.
- **CTA Placement:** Hero (sticky) + Post-testimonials
- **Color Strategy:** Hero: Brand color. Testimonials: Light bg #F5F5F5. Quotes: Italic, muted color #666. CTA: Vibrant
- **Sections:** Hero > Problem statement > Solution overview > Testimonials carousel > CTA

### Style
- **Name:** Neumorphism
- **Mode Support:** Light supported | Dark conditional
- **Keywords:** Soft UI, embossed, debossed, convex, concave, light source, subtle depth, rounded (12-16px), monochromatic
- **Best For:** Health/wellness apps, meditation platforms, fitness trackers, minimal interaction UIs
- **Performance:** cost:low|drivers:none | **Accessibility:** risk:high|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0891B2` | `--color-primary` |
| On Primary | `#000000` | `--color-on-primary` |
| Secondary | `#22D3EE` | `--color-secondary` |
| On Secondary | `#0F172A` | `--color-on-secondary` |
| Accent/CTA | `#059669` | `--color-accent` |
| On Accent/CTA | `#000000` | `--color-on-accent` |
| Background | `#ECFEFF` | `--color-background` |
| Foreground | `#164E63` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#164E63` | `--color-card-foreground` |
| Muted | `#E8F1F6` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#A5F3FC` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#0891B2` | `--color-ring` |

*Notes: Calm cyan + health green*

### Typography
- **Heading:** Figtree
- **Body:** Noto Sans
- **Mood:** medical, clean, accessible, professional, healthcare, trustworthy
- **Best For:** Healthcare, medical clinics, pharma, health apps, accessibility
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;700&display=swap
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;700&display=swap');
```

### Key Effects
Soft box-shadow (multiple: -5px -5px 15px, 5px 5px 15px), smooth press (150ms), inner subtle shadow

### Motion
**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`
```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```
*Framework notes: grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately*
- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI

### Avoid (Anti-patterns)
- Bright neon colors
- Motion-heavy animations
- AI purple/pink gradients

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px


## Run 2 — `"professional certification course platform credential" --design-system --variance 4 --density 5`

## Design System: GlobalMed School

### Design Dials
- **Variance:** 4/10 — Balanced / Modern
- **Density:** 5/10 — Standard

### Pattern
- **Name:** Trust & Authority + Conversion
- **Conversion Focus:** Security badges. Case studies. Transparent pricing. Low-friction form. Provide pause/stop and stop the logo carousel on focus, hover, and reduced motion. Previous/next controls provide the keyboard equivalent; pause offscreen/hidden and render a static logo set under reduced motion.
- **CTA Placement:** Contact Sales / Get Quote (primary) + Nav
- **Color Strategy:** Navy/Grey corporate. Trust blue. Accent for CTA only.
- **Sections:** Hero (mission/credibility) > Proof (logos, certs, stats) > Solution overview > Clear CTA path

### Style
- **Name:** Minimalism & Swiss Style
- **Mode Support:** Light supported | Dark supported
- **Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential
- **Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools
- **Performance:** cost:low|drivers:none | **Accessibility:** risk:low|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0369A1` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#0EA5E9` | `--color-secondary` |
| On Secondary | `#0F172A` | `--color-on-secondary` |
| Accent/CTA | `#A16207` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#F0F9FF` | `--color-background` |
| Foreground | `#0C4A6E` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0C4A6E` | `--color-card-foreground` |
| Muted | `#E7EFF5` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#BAE6FD` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#0369A1` | `--color-ring` |

*Notes: Trust blue + achievement gold [Accent adjusted from #CA8A04]*

### Typography
- **Heading:** Inter
- **Body:** Inter
- **Mood:** flat, clean, system, bold, geometric, cross-platform, icon, poster, minimal, functional, responsive
- **Best For:** Cross-platform apps, dashboards, system UI, onboarding, marketing pages, informational apps, icon-heavy interfaces
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
```

### Key Effects
Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Avoid (Anti-patterns)
- No verification
- Hidden progress

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px


## Run 3 — `"serif heading grotesk body credible editorial" --domain typography -n 4`

## UI Pro Max Search Results
**Domain:** typography | **Query:** serif heading grotesk body credible editorial
**Source:** typography.csv | **Found:** 4 results

### Result 1
- **Font Pairing Name:** Minimalist Monochrome Editorial
- **Category:** Serif + Serif + Mono (Triple Stack)
- **Heading Font:** Playfair Display
- **Body Font:** Source Serif 4
- **Mood/Style Keywords:** monochrome, editorial, austere, typographic, pocket manifesto, luxury, high contrast, brutalist mobile
- **Best For:** Luxury fashion mobile apps, editorial publications, digital exhibitions, portfolio apps, high-contrast e-reader aesthetics
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&display=swap');
- **Tailwind Config:** fontFamily: { display: ['Playfair Display', 'serif'], body: ['Source Serif 4', 'serif'], mono: ['JetBrains Mono', 'monospace'] }
- **Notes:** Triple stack: Playfair Display 900 tracking-tighter leading-[0.9] for heroes (text-5xl–text-6xl breaks words graphically). Source Serif 4 300–600 for body legibility. JetBrains Mono 400–500 uppercase tracking-widest for tags/dates/labels. NO UI sans-serif — 100% serif/mono.

### Result 2
- **Font Pairing Name:** Editorial Classic
- **Category:** Serif + Serif
- **Heading Font:** Cormorant Garamond
- **Body Font:** Libre Baskerville
- **Mood/Style Keywords:** editorial, classic, literary, traditional, refined, bookish
- **Best For:** Publishing, blogs, news sites, literary magazines, book covers
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap');
- **Tailwind Config:** fontFamily: { heading: ['Cormorant Garamond', 'serif'], body: ['Libre Baskerville', 'serif'] }
- **Notes:** All-serif pairing for traditional editorial feel.

### Result 3
- **Font Pairing Name:** News Editorial
- **Category:** Serif + Sans
- **Heading Font:** Newsreader
- **Body Font:** Roboto
- **Mood/Style Keywords:** news, editorial, journalism, trustworthy, readable, informative
- **Best For:** News sites, blogs, magazines, journalism, content-heavy sites
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
- **Tailwind Config:** fontFamily: { serif: ['Newsreader', 'serif'], sans: ['Roboto', 'sans-serif'] }
- **Notes:** Newsreader designed for long-form reading. Roboto for UI.

### Result 4
- **Font Pairing Name:** Magazine Style
- **Category:** Serif + Sans
- **Heading Font:** Libre Bodoni
- **Body Font:** Public Sans
- **Mood/Style Keywords:** magazine, editorial, publishing, refined, journalism, print
- **Best For:** Magazines, online publications, editorial content, journalism
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');
- **Tailwind Config:** fontFamily: { serif: ['Libre Bodoni', 'serif'], sans: ['Public Sans', 'sans-serif'] }
- **Notes:** Bodoni's editorial elegance. Public Sans for clean UI.


## Run 4 — `"trust navy teal healthcare finance" --domain color -n 4`

## UI Pro Max Search Results
**Domain:** color | **Query:** trust navy teal healthcare finance
**Source:** colors.csv | **Found:** 4 results

### Result 1
- **Product Type:** Banking/Traditional Finance
- **Primary:** #0F172A
- **On Primary:** #FFFFFF
- **Secondary:** #1E3A8A
- **On Secondary:** #FFFFFF
- **Accent:** #A16207
- **On Accent:** #FFFFFF
- **Background:** #F8FAFC
- **Foreground:** #020617
- **Card:** #FFFFFF
- **Card Foreground:** #020617
- **Muted:** #E8ECF1
- **Muted Foreground:** #475569
- **Border:** #E2E8F0
- **Destructive:** #DC2626
- **On Destructive:** #FFFFFF
- **Ring:** #0F172A
- **Notes:** Trust navy + premium gold [Accent adjusted from #CA8A04]

### Result 2
- **Product Type:** Personal Finance Tracker
- **Primary:** #1E40AF
- **On Primary:** #FFFFFF
- **Secondary:** #3B82F6
- **On Secondary:** #000000
- **Accent:** #059669
- **On Accent:** #000000
- **Background:** #0F172A
- **Foreground:** #FFFFFF
- **Card:** #192134
- **Card Foreground:** #FFFFFF
- **Muted:** #101A34
- **Muted Foreground:** #94A3B8
- **Border:** rgba(255,255,255,0.08)
- **Destructive:** #DC2626
- **On Destructive:** #FFFFFF
- **Ring:** #FFFFFF
- **Notes:** Trust blue + profit green on dark

### Result 3
- **Product Type:** Legal Services
- **Primary:** #1E3A8A
- **On Primary:** #FFFFFF
- **Secondary:** #1E40AF
- **On Secondary:** #FFFFFF
- **Accent:** #B45309
- **On Accent:** #FFFFFF
- **Background:** #F8FAFC
- **Foreground:** #0F172A
- **Card:** #FFFFFF
- **Card Foreground:** #0F172A
- **Muted:** #E9EEF5
- **Muted Foreground:** #475569
- **Border:** #CBD5E1
- **Destructive:** #DC2626
- **On Destructive:** #FFFFFF
- **Ring:** #1E3A8A
- **Notes:** Authority navy + trust gold

### Result 4
- **Product Type:** Real Estate/Property
- **Primary:** #0F766E
- **On Primary:** #FFFFFF
- **Secondary:** #14B8A6
- **On Secondary:** #0F172A
- **Accent:** #0369A1
- **On Accent:** #FFFFFF
- **Background:** #F0FDFA
- **Foreground:** #134E4A
- **Card:** #FFFFFF
- **Card Foreground:** #134E4A
- **Muted:** #E8F0F3
- **Muted Foreground:** #475569
- **Border:** #99F6E4
- **Destructive:** #DC2626
- **On Destructive:** #FFFFFF
- **Ring:** #0F766E
- **Notes:** Trust teal + professional blue

