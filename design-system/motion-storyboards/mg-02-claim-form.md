# MG-2 — Hero claim form that "fills itself"

**Job:** explain. What GlobalMed does to a claim, in 8 seconds.
**Trigger:** loads when the hero is near the viewport; loops calmly; pauses off-screen; has a pause button.
**Tech:** dotLottie from After Effects (≤ 150 KB) via `LottiePlayer`. Poster: `public/motion/posters/hero-claim-form.svg` (frame 8 below).
**Canvas:** 480×320, brand tokens only. All codes are generic examples; no names, dates of birth or member IDs.

| # | Time | Frame |
|---|---|---|
| 1 | 0.0s | Blank claim form (white card, `border`), grey placeholder lines, status chip reads "Draft" (muted). |
| 2 | 0.6s | Code chips snap in one by one: `99213`, `E11.9`, `I10` (mint chips, mono text), 150ms apart, small scale 0.9→1. |
| 3 | 1.6s | A red flag appears on the right edge with the label "Missing modifier" (`alert` on `destructive-soft`). |
| 4 | 2.6s | A teal cursor highlight sweeps across the first chip; a `-25` modifier chip attaches to `99213`. |
| 5 | 3.4s | The red flag flips to a green check ("Scrubbed", `success`). |
| 6 | 4.2s | The claim line at the bottom of the form draws left→right; ticks light up. The final tick turns gold. |
| 7 | 5.2s | The status chip changes "Submitted" → "Paid" (`success-soft`/`success`). |
| 8 | 5.6–7.4s | Hold on the completed form (this is the poster frame). |
| — | 7.4–8.0s | Cross-fade back to frame 1. |

**Reduced motion:** static poster only (no Lottie download).
**Accessibility:** the player has `role="img"` and the label "A claim form fills itself in: codes appear, a denial flag turns green, and the status changes to Paid." Pause control ≥ 44px.
**Asset owner:** SylJo motion designer (P2-15).
