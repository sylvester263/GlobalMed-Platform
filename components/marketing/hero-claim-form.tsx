import { PauseOffscreen } from "@/components/motion/pause-offscreen";
import { cn } from "@/lib/utils";

const chips = [
  { x: 120, w: 72, code: "99213" },
  { x: 200, w: 72, code: "E11.9" },
  { x: 280, w: 80, code: "I10" },
] as const;

const ticks = [120, 168, 216, 264, 312] as const;

/**
 * MG-2 home hero (docs/15 §2): a claim form that fills itself in. Codes appear, a denial
 * flag turns green, the status changes to Paid, and the claim line completes. A calm
 * 8s loop in CSS (ADR-015), transform and opacity only. The resting markup is the final
 * "Paid" state, which is what reduced-motion visitors and no-JS renders see. Illustrative
 * only: no patient data.
 */
export function HeroClaimForm({ className }: { className?: string }) {
  return (
    <PauseOffscreen className={cn("hero-claim", className)}>
      <svg
        viewBox="0 0 480 320"
        role="img"
        aria-label="A claim form fills itself in: codes appear, a denial flag turns green, and the status changes to Paid."
        className="block h-auto w-full"
      >
        <g className="hc-stage">
          <rect
            x="96"
            y="28"
            width="288"
            height="264"
            rx="12"
            fill="var(--card)"
            stroke="var(--border)"
          />

          {/* Header */}
          <rect
            className="hc-grow hc-header"
            x="120"
            y="52"
            width="120"
            height="10"
            rx="3"
            fill="var(--ink)"
          />
          <rect
            className="hc-grow hc-header"
            x="120"
            y="70"
            width="80"
            height="6"
            rx="3"
            fill="var(--border)"
          />
          <line x1="120" y1="96" x2="360" y2="96" stroke="var(--border)" />

          {/* Status: Denied, then Paid */}
          <g className="hc-denied">
            <rect x="290" y="50" width="70" height="24" rx="12" fill="var(--destructive-soft)" />
            <text
              x="325"
              y="66"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--destructive)"
              className="font-sans"
            >
              DENIED
            </text>
          </g>
          <g className="hc-paid hc-pop">
            <rect x="296" y="50" width="64" height="24" rx="12" fill="var(--success-soft)" />
            <text
              x="328"
              y="66"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--success-ink)"
              className="font-sans"
            >
              PAID
            </text>
          </g>

          {/* Code chips */}
          {chips.map((chip, i) => (
            <g key={chip.code} className={`hc-chip hc-chip-${i}`}>
              <rect x={chip.x} y="112" width={chip.w} height="24" rx="6" fill="var(--mint)" />
              <text
                x={chip.x + chip.w / 2}
                y="128"
                textAnchor="middle"
                fontSize="12"
                fill="var(--teal-deep)"
                className="font-mono"
              >
                {chip.code}
              </text>
            </g>
          ))}

          {/* Denial flag on the diagnosis code turns into a green check */}
          <g className="hc-denied">
            <circle cx="270" cy="113" r="8" fill="var(--destructive)" />
            <path
              d="M270 109v4.5M270 116.5v.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <g className="hc-paid hc-pop">
            <circle cx="270" cy="113" r="8" fill="var(--success)" />
            <path
              d="M266.5 113l2.5 2.5 4.5-4.5"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Note lines */}
          <rect
            className="hc-grow hc-lines"
            x="120"
            y="152"
            width="240"
            height="6"
            rx="3"
            fill="var(--muted)"
          />
          <rect
            className="hc-grow hc-lines"
            x="120"
            y="166"
            width="200"
            height="6"
            rx="3"
            fill="var(--muted)"
          />
          <rect
            className="hc-grow hc-lines"
            x="120"
            y="180"
            width="220"
            height="6"
            rx="3"
            fill="var(--muted)"
          />

          {/* Claim line: track, then the navy fill, sky ticks and the sky end mark */}
          <g strokeLinecap="round">
            <line x1="120" y1="232" x2="360" y2="232" stroke="var(--border)" strokeWidth="2" />
            <line
              className="hc-grow hc-claim"
              x1="120"
              y1="232"
              x2="360"
              y2="232"
              stroke="var(--teal)"
              strokeWidth="2"
            />
            {ticks.map((x, i) => (
              <line
                key={x}
                className={`hc-tick hc-tick-${i}`}
                x1={x}
                y1="224"
                x2={x}
                y2="240"
                stroke="var(--sky)"
                strokeWidth="2"
              />
            ))}
            <line
              className="hc-gold"
              x1="360"
              y1="222"
              x2="360"
              y2="242"
              stroke="var(--gold)"
              strokeWidth="3"
            />
          </g>

          {/* Completion stamp */}
          <g className="hc-stamp">
            <circle cx="336" cy="268" r="10" fill="var(--success)" />
            <path
              d="M331 268l3.5 3.5L341 264"
              stroke="#fff"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </PauseOffscreen>
  );
}
