import { TrendingDown, TrendingUp } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";

type StatBlockProps = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Change vs previous period, e.g. +4.2 (percentage points or %). */
  delta?: { value: number; label: string; goodWhen?: "up" | "down" };
  /** Mark figures that are examples, not real client data. */
  illustrative?: boolean;
  animate?: boolean;
  className?: string;
};

/** KPI / trust-strip number (MG-4, DM-7). Serif tabular figures, counts up once. */
export function StatBlock({
  label,
  value,
  decimals,
  prefix,
  suffix,
  delta,
  illustrative = false,
  animate = true,
  className,
}: StatBlockProps) {
  const formatted = `${prefix ?? ""}${value.toLocaleString("en-US", { maximumFractionDigits: decimals ?? 0 })}${suffix ?? ""}`;
  const up = delta ? delta.value >= 0 : false;
  const good = delta ? (delta.goodWhen === "down" ? !up : up) : false;
  const Trend = up ? TrendingUp : TrendingDown;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="font-serif text-3xl font-semibold tracking-tight">
        {animate ? (
          <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        ) : (
          <span className="tabular-nums">{formatted}</span>
        )}
      </p>
      {delta && (
        <p
          className={cn(
            "flex items-center gap-1 text-sm font-semibold",
            good ? "text-success-ink" : "text-destructive",
          )}
        >
          <Trend aria-hidden="true" className="size-4" />
          <span>
            {up ? "+" : ""}
            {delta.value} <span className="font-normal text-muted-foreground">{delta.label}</span>
          </span>
        </p>
      )}
      {illustrative && <p className="text-xs text-muted-foreground">Illustrative figure</p>}
    </div>
  );
}
