import { cn } from "@/lib/utils";

/** Heading row for dashboard pages. */
export function DashboardPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
