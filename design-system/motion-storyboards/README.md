# Motion storyboards (P1-10)

Frame-by-frame storyboards for the five signature animations in docs/15. They are for **client approval before any animation is produced** (pm/CLIENT_INPUTS_NEEDED.md). Times are from the trigger. Every storyboard ends with the reduced-motion version, which ships at the same time.

| ID | File | Where | Tech | Length |
|---|---|---|---|---|
| MG-1 | [mg-01-hero-sequence.md](mg-01-hero-sequence.md) | Home hero | Motion | ≤ 1.4s, once |
| MG-2 | [mg-02-claim-form.md](mg-02-claim-form.md) | Home hero, right | dotLottie (poster in `public/motion/posters/hero-claim-form.svg`) | 8s loop, pausable |
| MG-3 | [mg-03-claim-journey.md](mg-03-claim-journey.md) | Home "How we work" | GSAP ScrollTrigger | scroll-scrubbed |
| MG-9 | [mg-09-pathway.md](mg-09-pathway.md) | School landing | Motion (`PathwayLine`) | ≈ 1.2s, once in view |
| DM-6 | [dm-06-exam-passed.md](dm-06-exam-passed.md) | After a passed final exam | Motion | ≤ 2s, skippable |

Shared rules (docs/15 §7–8, MASTER.md §6):
- Tokens only: `dur.*`, `ease.*`, `spring.*` from `lib/motion.ts`.
- Only `transform` and `opacity` animate (the claim line draws with `scaleX`). Space is reserved, so CLS stays 0.
- Text is server-rendered and readable before any animation starts.
- All figures in animations are marked illustrative until the client confirms real numbers.
- No real patient names or data appear in any frame.

**Client approval:** ☐ MG-1 ☐ MG-2 ☐ MG-3 ☐ MG-9 ☐ DM-6 — approver: ____ · date: ____
