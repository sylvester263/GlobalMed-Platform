# DM-6 — Exam passed moment

**Job:** confirm. The most emotional moment in the product: the student passed the final exam.
**Trigger:** the server confirms `passed = true` after submission. **Total:** ≤ 2.0s. **Skippable** with Esc, click or tap anywhere (jumps to the final frame). **Tech:** Motion (`CountUp`, `ClaimLine`, `SealStamp`).

| # | Time | Frame |
|---|---|---|
| 1 | 0ms | Full-screen overlay on `ledger` (dialog, focus moved to it). Heading "You passed" is present immediately; the score reads the final value for screen readers. |
| 2 | 0–700ms | Score counts up from 0 to the result, e.g. "86%" (serif, `text-4xl`). Pass mark shown below in muted text: "Pass mark 70%". |
| 3 | 500–1300ms | The claim line draws beneath the score; ticks light in sequence; the last tick turns gold. |
| 4 | 1300ms | The gold seal stamps in: scale 1.35→1, rotate −12°→0°, `spring.snappy`. Label under it: "Certified". |
| 5 | 1500ms | Course name + "Certificate issued" fade up 8px. |
| 6 | 1700ms | Buttons appear: primary "Download certificate", secondary "Share on LinkedIn", link "Back to dashboard". Focus lands on "Download certificate". |
| 7 | 2000ms+ | Static. Nothing loops. |

No confetti. Gold is used here and nowhere else in the dashboard.

**Reduced motion / skipped:** frame 7 immediately — heading, final score, drawn line, seal, buttons. `aria-live="polite"` announces "You passed with 86 percent. Your certificate is ready."
**Failed exam (not this storyboard):** no celebration; calm result card with score, pass mark, attempts left and "Review answers".
