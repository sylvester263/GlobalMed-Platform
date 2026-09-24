import type { Transition, Variants } from "motion/react";

/** Motion tokens — docs/15 §2 and design-system/MASTER.md §6. Never use ad-hoc values. */

export const dur = { instant: 0.1, fast: 0.18, base: 0.28, slow: 0.48, story: 1 } as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const spring = {
  soft: { type: "spring", stiffness: 260, damping: 30 },
  snappy: { type: "spring", stiffness: 500, damping: 35 },
} as const satisfies Record<string, Transition>;

export const distance = { sm: 8, md: 24 } as const;

export const staggerStep = 0.06;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.md },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.enter } },
};

export const stagger = (step: number = staggerStep): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step } },
});
