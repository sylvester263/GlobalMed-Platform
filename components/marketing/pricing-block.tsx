import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PricingBlockProps = {
  title: string;
  priceUsd: number;
  /** Local price for manual payment (docs/02 C-2). */
  pricePkr?: number;
  /** null = lifetime access. */
  accessMonths: number | null;
  includes: string[];
  /** The enroll CTA (a Link or Button). */
  action: React.ReactNode;
  highlight?: string;
  className?: string;
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

/** Course or bundle price with access period and inclusions (docs/02 W-6, C-1/C-2). */
export function PricingBlock({
  title,
  priceUsd,
  pricePkr,
  accessMonths,
  includes,
  action,
  highlight,
  className,
}: PricingBlockProps) {
  return (
    <section
      aria-label={`${title} pricing`}
      className={cn("flex flex-col gap-5 rounded-lg border bg-card p-6", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl">{title}</h3>
        {highlight && <Badge variant="gold">{highlight}</Badge>}
      </div>
      <div>
        <p className="font-serif text-4xl font-semibold tabular-nums">{usd.format(priceUsd)}</p>
        {pricePkr !== undefined && (
          <p className="text-sm text-muted-foreground tabular-nums">
            or {pkr.format(pricePkr)} by bank transfer, JazzCash or Easypaisa
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {accessMonths === null ? "Lifetime access" : `${accessMonths} months of access`}
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {action}
    </section>
  );
}
