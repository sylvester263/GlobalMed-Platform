import { ClaimLine } from "@/components/motion/claim-line";
import { cn } from "@/lib/utils";

type ClaimProgressProps = {
  /** Completed units, e.g. lessons done. */
  value: number;
  /** Total units, e.g. lessons in the course. Each unit is one tick. */
  max: number;
  /** Accessible name, e.g. "Course progress". */
  label: string;
  /** Show "3 of 12 lessons · 25%" under the line. */
  showValue?: boolean;
  unit?: string;
  animate?: boolean;
  className?: string;
};

/**
 * Progress bar in the claim-line style (MASTER.md §4, DM-2). Ticks = units; the
 * final tick turns gold at 100%. Exposes a real progressbar to assistive tech.
 */
export function ClaimProgress({
  value,
  max,
  label,
  showValue = true,
  unit = "lessons",
  animate = true,
  className,
}: ClaimProgressProps) {
  const safeMax = Math.max(1, max);
  const clamped = Math.min(Math.max(0, value), safeMax);
  const pct = Math.round((clamped / safeMax) * 100);
  // More than ~24 ticks becomes noise; fall back to 10% steps for long courses.
  const ticks = safeMax + 1 <= 25 ? safeMax + 1 : 11;
  const filled = ticks === safeMax + 1 ? clamped + 1 : Math.floor(pct / 10) + 1;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        aria-valuetext={`${clamped} of ${safeMax} ${unit}, ${pct}%`}
      >
        <ClaimLine
          ticks={ticks}
          filled={filled}
          goldEnd={pct === 100}
          trigger={animate ? "inView" : "static"}
        />
      </div>
      {showValue && (
        <p className="flex justify-between text-sm text-muted-foreground tabular-nums">
          <span>
            {clamped} of {safeMax} {unit}
          </span>
          <span className="font-semibold text-foreground">{pct}%</span>
        </p>
      )}
    </div>
  );
}
