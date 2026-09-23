# 15 — Motion Design & Motion Graphics

Motion is a core part of the GlobalMed experience, not decoration. Every animation must do one of three jobs:
1. **Explain** — show a process (claim journey, certification pathway, how a course works).
2. **Confirm** — show that an action worked (lesson complete, exam passed, form sent).
3. **Guide** — pull attention to the next step (hero CTA, continue learning).

If an animation does none of these, cut it.

## 1. Libraries
| Library | Use | Install |
|---|---|---|
| Motion (formerly Framer Motion) | UI transitions, layout animation, micro-interactions, dashboard | `npm i motion` → `import { motion } from "motion/react"` |
| GSAP + ScrollTrigger | Scroll-driven storytelling sections (claim journey, pathway) | `npm i gsap @gsap/react` |
| dotLottie | Illustrated motion graphics exported from After Effects | `npm i @lottiefiles/dotlottie-react` |
| Rive (optional) | Interactive animated illustrations with states (chatbot mascot/icon, success states) | `npm i @rive-app/react-canvas` |
| View Transitions API | Smooth page-to-page transitions in Next.js | `experimental.viewTransition` / CSS `@view-transition` |
| 21st.dev Magic | Animated component starting points (hero, marquee, number ticker, animated beam) — always restyled to our tokens | `/ui` command |

Rule: Motion is the default. GSAP only for scroll-scrubbed sections. Lottie/Rive only for illustrated graphics. Never load GSAP or Lottie on dashboard routes unless needed (dynamic import).

## 2. Motion tokens (add to design-system/MASTER.md and `lib/motion.ts`)
| Token | Value | Use |
|---|---|---|
| `duration.instant` | 100ms | hover, press |
| `duration.fast` | 180ms | toggles, chips, tooltips |
| `duration.base` | 280ms | dialogs, dropdowns, tabs |
| `duration.slow` | 480ms | section reveals, page transitions |
| `duration.story` | 800–1200ms | hero sequence, certificate reveal |
| `ease.standard` | cubic-bezier(0.2, 0, 0, 1) | most UI |
| `ease.enter` | cubic-bezier(0, 0, 0.2, 1) | things appearing |
| `ease.exit` | cubic-bezier(0.4, 0, 1, 1) | things leaving |
| `spring.soft` | { stiffness: 260, damping: 30 } | cards, drawers |
| `spring.snappy` | { stiffness: 500, damping: 35 } | toggles, checkmarks |
| `distance.sm / md` | 8px / 24px | slide offsets |
| `stagger` | 60ms | list/grid children |

```ts
// lib/motion.ts
export const dur = { instant: 0.1, fast: 0.18, base: 0.28, slow: 0.48, story: 1 };
export const ease = { standard: [0.2, 0, 0, 1], enter: [0, 0, 0.2, 1], exit: [0.4, 0, 1, 1] } as const;
export const spring = { soft: { type: "spring", stiffness: 260, damping: 30 }, snappy: { type: "spring", stiffness: 500, damping: 35 } } as const;
export const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.enter } } };
export const stagger = (s = 0.06) => ({ show: { transition: { staggerChildren: s } } });
```

## 3. Signature motion: the "claim line"
The brand motif from docs/06 (a ledger rule with tick marks) is the main motion thread across the site:
- **Hero:** the line draws left-to-right, ticks light up one by one as the headline settles, ending at the two CTAs.
- **Claim journey section:** the same line becomes a scroll-scrubbed path (GSAP ScrollTrigger) through stages: Patient visit → Coding → Claim submitted → Scrubbed → Paid. Each tick reveals a short caption and a stat.
- **Certification pathway:** line connects Foundations → Billing → Coding → Exam prep → Certified; the student's current position glows.
- **Course progress bars:** ticks fill as lessons complete.
- **Certificate reveal:** the line underlines the student's name, then the gold seal stamps in.

One visual idea, reused everywhere — that's what makes it feel designed rather than templated.

## 4. Motion graphics inventory (public website)
| ID | Where | What | Tech | Trigger |
|---|---|---|---|---|
| MG-1 | Home hero | Claim line draw + headline reveal + CTA settle (one orchestrated sequence, ≤ 1.4s) | Motion | page load |
| MG-2 | Home hero (right side) | Illustrated claim form that "fills itself": codes appear, a red denial flag turns green, status changes to Paid | Lottie (After Effects) or Motion SVG | page load, loops calmly every 8s |
| MG-3 | Home "How we work" | Scroll-scrubbed claim journey (see §3) | GSAP ScrollTrigger | scroll |
| MG-4 | Trust strip | Numbers count up once when visible (claims processed, clean-claim %, students trained) | Motion `useInView` + number ticker | in view, once |
| MG-5 | Services overview | Icon micro-animations on hover (document stamp, code brackets, waveform for transcription, spark for AI) | Lottie/Rive small icons | hover/focus |
| MG-6 | AI Clinical Documentation page | Voice waveform → text lines typing into a structured clinical note (demo only, fake data) | Motion SVG | in view |
| MG-7 | Medical Coding page | ICD-10 / CPT code chips snapping into a claim form | Motion layout animation | in view |
| MG-8 | Denial management page | Before/after bar chart morph (denial rate down, collections up) — illustrative values marked as such | Motion | in view |
| MG-9 | School landing | Pathway line animation (see §3) | GSAP or Motion | scroll |
| MG-10 | School landing | "How learning works" 4-step loop: watch → practice → mock exam → certificate | Lottie | in view |
| MG-11 | Course detail | Curriculum accordion smooth height + preview-lesson play button pulse (once) | Motion | click / load |
| MG-12 | Testimonials | Gentle horizontal marquee of practice logos (pauses on hover, stops for reduced motion) | CSS/Motion | always |
| MG-13 | AAPC partnership page | Two marks drawing a connecting line (only with permission) | Motion SVG | in view |
| MG-14 | Free billing audit | Multi-step form progress on the claim line; success = checkmark draw + confetti-free "stamp" | Motion | submit |
| MG-15 | Verify certificate | Scan → seal stamp → "Valid" / "Revoked" state | Rive or Motion | result |
| MG-16 | Page transitions | Cross-fade + 8px slide between marketing pages | View Transitions API | navigation |
| MG-17 | Mega menu | Staggered reveal of columns | Motion | open |
| MG-18 | Chat widget | Launcher breathe once after 6s (not looping), panel spring open, typing indicator, streamed text | Motion | load / click |

## 5. Motion in the dashboards (calm, functional)
| ID | Where | What |
|---|---|---|
| DM-1 | All dashboards | Sidebar collapse with layout animation; route content fade (180ms) |
| DM-2 | Student overview | Progress rings/lines animate from 0 to value on first load only |
| DM-3 | Course player | Lesson complete: checkmark draw + next-lesson card slides in |
| DM-4 | Quiz | Correct answer: green tick spring; wrong: subtle 4px shake (disabled for reduced motion) |
| DM-5 | Mock exam | Timer turns amber at 10 min, red + slow pulse at 2 min |
| DM-6 | Exam passed | Full-screen moment: score counts up, claim line draws, gold seal stamps, "Download certificate" button appears (≤ 2s, skippable) |
| DM-7 | Admin KPIs | Stat numbers tick up; charts animate in once (Recharts `isAnimationActive` first render only) |
| DM-8 | Leads kanban | Drag with spring, card drops into column with layout animation |
| DM-9 | Toasts, dialogs, sheets | Standard enter/exit using tokens |
| DM-10 | Skeleton loaders | Shimmer at 1.4s cycle; replaced with fade |

No auto-looping animations inside dashboards except loaders.

## 6. Motion graphics assets to produce (After Effects / Lottie)
| Asset | Length | Format | Owner |
|---|---|---|---|
| Hero claim-form animation (MG-2) | 6–8s loop | .lottie (≤ 150KB) + poster PNG | SylJo motion designer |
| "How learning works" loop (MG-10) | 8s loop | .lottie | SylJo |
| Service icon set ×6 (MG-5) | 1s each | .lottie or .riv | SylJo |
| Certificate seal stamp (MG-15, DM-6) | 1.2s | .riv (states: idle/valid/revoked) | SylJo |
| Brand intro sting (for socials / course intros) | 5s | MP4 1080p + 9:16 | SylJo (optional add-on) |

Asset rules: GlobalMed colors from tokens only, no real patient data or real names on any form, illustrative stats labelled, source .aep/.riv files handed to client.

## 7. Performance budget
- Home page JS for motion ≤ 60KB gzipped on first load (GSAP and Lottie lazy-loaded when section is near viewport).
- Animate only `transform` and `opacity` (and SVG `pathLength`). Never animate width/height/top/left on large elements.
- Lottie files ≤ 150KB each; show static poster until loaded.
- No animation may delay LCP: hero headline text is server-rendered and visible immediately; animation enhances after hydration.
- CLS stays 0 — reserve space for every animated element.
- Pause off-screen loops (IntersectionObserver).

## 8. Accessibility
- Respect `prefers-reduced-motion`: replace movement with instant state or simple fade; stop marquee and loops; scroll-scrubbed sections become static stacked steps.
- `MotionConfig reducedMotion="user"` at the root layout.
- Nothing flashes more than 3 times per second.
- Any auto-playing animation longer than 5s has a pause control (hero loop, marquee).
- Motion never carries meaning alone — status also shown in text/icon/color.

## 9. Implementation rules for Claude Code
- Import tokens from `lib/motion.ts`; no ad-hoc durations.
- Motion components live in `components/motion/` (ClaimLine, CountUp, Reveal, StaggerGroup, PathwayLine, SealStamp, PageTransition, LottiePlayer).
- Animated sections are Client Components wrapping Server-rendered content.
- Use the `/motion` command for any new animation (reads this file + MASTER.md first).
- Before marking a motion task done: record a Playwright video or screenshot sequence, check at 360px and 1280px, check with reduced motion on, check Lighthouse didn't drop.

## 10. Acceptance checklist
- [ ] Every item in §4/§5 implemented or explicitly deferred in pm/DECISIONS.md
- [ ] Reduced-motion version reviewed for every animation
- [ ] Home Lighthouse performance still ≥ 90 on mobile
- [ ] Client approved hero + claim journey + exam-passed moment
