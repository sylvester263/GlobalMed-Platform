# MG-3 — Scroll-scrubbed claim journey ("How we work")

**Job:** explain the revenue cycle GlobalMed runs for a practice.
**Trigger:** scroll position (scrubbed, reversible). **Tech:** GSAP ScrollTrigger, lazy-loaded when the section is near the viewport. Pinned on desktop (≥ 1024px) only.
**Stages (5 ticks on one claim line):** Patient visit → Coding → Claim submitted → Scrubbed → Paid.

| # | Scroll progress | Desktop frame (section pinned, ~250vh of scroll) |
|---|---|---|
| 1 | 0% | Section title "How we work" + intro. Horizontal claim line across the width, 5 grey ticks, stage labels under each tick in muted text. |
| 2 | 0–20% | Line fills to tick 1. Tick 1 turns teal; caption fades up: "Your team sees the patient. We receive the encounter details through your existing secure system." |
| 3 | 20–40% | Line fills to tick 2. Caption: "Certified coders assign ICD-10-CM, CPT and HCPCS codes." Stat: "Coding accuracy 95%+" *(illustrative)*. |
| 4 | 40–60% | Tick 3. Caption: "Claims go out within 24–48 hours." *(client to confirm)* |
| 5 | 60–80% | Tick 4. Caption: "Every claim is scrubbed against payer rules before it leaves." Stat: "Clean-claim rate 98%" *(illustrative)*. |
| 6 | 80–95% | Tick 5 turns gold. Caption: "Payments posted, denials worked, and you see it all in monthly reports." |
| 7 | 95–100% | Pin releases; CTA "Book your free billing audit" is fully visible under the line. |

Captions and stats are real DOM text, not canvas. Only `transform`/`opacity` animate; the line fill uses `scaleX`.

**Mobile (< 1024px) and reduced motion:** no pinning and no scrubbing. The same 5 stages render as a static vertical list with the claim line on the left, all ticks filled and all captions visible. GSAP is not loaded.
**Must not:** hijack scroll speed, trap keyboard users (all content is in normal DOM order), or run on dashboard routes.
