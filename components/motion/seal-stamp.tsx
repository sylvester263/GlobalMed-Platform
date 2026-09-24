"use client";

import { Check, X } from "lucide-react";
import { m } from "motion/react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SealStampProps = {
  status: "valid" | "revoked";
  /** Rendered size in px. */
  size?: number;
  /** Visible label under the seal. Defaults to "Valid" / "Revoked". */
  label?: string;
  /** Play the stamp-in animation on mount. */
  animateIn?: boolean;
  className?: string;
};

// 24-point notched seal edge, generated once.
const SEAL_POINTS = Array.from({ length: 48 }, (_, i) => {
  const r = i % 2 === 0 ? 50 : 45;
  const a = (Math.PI * 2 * i) / 48 - Math.PI / 2;
  return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

/**
 * Certificate seal (MG-15, DM-6). Stamps in with a short press, then settles.
 * Status is always shown as text as well as colour and icon.
 */
export function SealStamp({
  status,
  size = 96,
  label,
  animateIn = true,
  className,
}: SealStampProps) {
  const reduced = usePrefersReducedMotion();
  const valid = status === "valid";
  const text = label ?? (valid ? "Valid" : "Revoked");
  const Icon = valid ? Check : X;

  return (
    <MotionFeatures>
      <div className={cn("inline-flex flex-col items-center gap-2", className)}>
        <m.svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          aria-hidden="true"
          focusable="false"
          initial={animateIn && !reduced ? { scale: 1.35, opacity: 0, rotate: -12 } : false}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { ...spring.snappy, opacity: { duration: dur.fast, ease: ease.enter } }
          }
        >
          <polygon points={SEAL_POINTS} className={valid ? "fill-gold" : "fill-alert"} />
          <circle
            cx="50"
            cy="50"
            r="36"
            className="fill-none stroke-white/70"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          <circle cx="50" cy="50" r="30" className={valid ? "fill-gold-ink" : "fill-alert"} />
          <Icon x={32} y={32} width={36} height={36} className="text-white" strokeWidth={2.5} />
        </m.svg>
        <span
          className={cn(
            "text-sm font-semibold tracking-[0.12em] uppercase",
            valid ? "text-gold-ink" : "text-destructive",
          )}
        >
          {text}
        </span>
      </div>
    </MotionFeatures>
  );
}
