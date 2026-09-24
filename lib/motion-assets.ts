/**
 * Lottie/Rive assets from the motion designer (docs/15 §6, P2-15). Leave a path undefined
 * until its file exists in /public/motion: the poster shows and no runtime is downloaded.
 * When an asset arrives, set its path here — that's the only change needed.
 */
export const motionAssets: Record<"heroClaimForm" | "learningLoop", string | undefined> = {
  heroClaimForm: undefined, // "/motion/hero-claim-form.lottie" (MG-2)
  learningLoop: undefined, // "/motion/learning-loop.lottie" (MG-10)
};
