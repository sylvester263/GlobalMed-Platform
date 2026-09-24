# MG-1 — Home hero sequence

**Job:** guide. Draw the eye from the headline to the two paths ("Get billing help", "Start a course").
**Trigger:** first paint after hydration, once per visit. **Total:** 1.3s. **Tech:** Motion (`ClaimLine` + `stagger()` variants from `lib/motion.ts`).

| # | Time | What the visitor sees | Motion detail |
|---|---|---|---|
| 1 | 0ms (SSR) | Complete hero: eyebrow, serif headline, subline, both CTAs, faint claim line under the headline. Everything readable. | None. This frame is the LCP and must never wait for JS. |
| 2 | 0–100ms | Hydration. Nothing moves. | — |
| 3 | 100ms | The teal claim line starts drawing from the left edge of the headline. | `scaleX 0→1` from the left edge, `dur.story` (1000ms), `ease.standard` |
| 4 | 250–950ms | Ticks light up one by one as the line passes (8 ticks, ~90ms apart). | Tick `opacity 0→1`, `dur.fast`, delay tied to line position |
| 5 | 700ms | The subline rises 8px into place. | `y 8→0`, `opacity 0.001→1`, `dur.slow`, `ease.enter` |
| 6 | 950ms | The line reaches its end right above the CTAs. The last tick is teal (not gold: gold is reserved for achievement). | — |
| 7 | 1000–1300ms | The CTAs settle: primary button lifts 4px and back, secondary follows 60ms later. | `y 0→-4→0`, `spring.soft`, `stagger 60ms` |
| 8 | 1300ms+ | Static. The claim-form illustration (MG-2) keeps looping on the right. | — |

**Reduced motion:** frame 1 only. The claim line renders fully drawn, and nothing moves.
**Mobile (< 768px):** same sequence; the line spans the text column width.
**Must not:** hide the headline before hydration, animate font size, or delay the CTAs' clickability (they are interactive from frame 1).
