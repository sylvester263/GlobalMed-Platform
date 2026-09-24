import { cn } from "@/lib/utils";

type ClaimLineProps = {
  /** Number of tick marks (at least 2). */
  ticks?: number;
  /** How many ticks are reached, counted from the left. Defaults to all. */
  filled?: number;
  /** Mark the last tick gold when it is reached (achievement). */
  goldEnd?: boolean;
  /**
   * `mount`: draws on page load. `inView`: draws as it scrolls into view (CSS scroll-driven
   * timeline; final state where unsupported). `static`: final state, no animation.
   */
  trigger?: "mount" | "inView" | "static";
  /** Extra delay before a `mount` draw, in seconds. */
  delay?: number;
  className?: string;
};

/**
 * The brand signature (MASTER.md §4): a ledger rule with tick marks that draws
 * left-to-right while ticks light up in sequence. Pure SVG + CSS (ADR-015): no client JS,
 * the line uses scaleX (pathLength breaks on a stretched SVG), and reduced motion shows the
 * final state. Decorative — pair it with text, or use ClaimProgress when it conveys progress.
 * Styles: `.claim-line` in app/globals.css.
 */
export function ClaimLine({
  ticks = 8,
  filled,
  goldEnd = false,
  trigger = "inView",
  delay = 0,
  className,
}: ClaimLineProps) {
  const count = Math.max(2, ticks);
  const reached = Math.min(count, Math.max(0, filled ?? count));
  const positions = Array.from({ length: count }, (_, i) => (i / (count - 1)) * 100);
  const fraction = reached <= 1 ? 0 : (positions[reached - 1] ?? 0) / 100;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      data-trigger={trigger}
      style={{ "--delay": `${delay}s`, "--fraction": fraction } as React.CSSProperties}
      className={cn("claim-line block h-3 w-full overflow-visible", className)}
    >
      <line
        x1="0"
        y1="6"
        x2="100"
        y2="6"
        className="stroke-tick"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {positions.map((x) => (
        <line
          key={`base-${x}`}
          x1={x}
          y1="2"
          x2={x}
          y2="10"
          className="stroke-tick"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {fraction > 0 && (
        <line
          x1="0"
          y1="6"
          x2={fraction * 100}
          y2="6"
          className="claim-fill stroke-teal"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {positions.slice(0, reached).map((x, i) => {
        const isGold = goldEnd && i === count - 1;
        return (
          <line
            key={`on-${x}`}
            x1={x}
            y1="1"
            x2={x}
            y2="11"
            style={{ "--pos": x / 100 } as React.CSSProperties}
            className={cn("claim-tick", isGold ? "stroke-gold" : "stroke-sky")}
            strokeWidth={isGold ? 3 : 2}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
