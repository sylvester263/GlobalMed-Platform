import type { LucideIcon } from "lucide-react";

import { ClaimLine } from "@/components/motion/claim-line";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Usually one Button or Link that fixes the empty state. */
  action?: React.ReactNode;
  className?: string;
};

/** Says why nothing is here and what to do next. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-dashed bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-mint text-teal-deep">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <h3 className="text-xl">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ClaimLine ticks={5} filled={1} trigger="static" className="w-24" />
      {action}
    </div>
  );
}
