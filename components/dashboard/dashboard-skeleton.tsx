import { Skeleton } from "@/components/ui/skeleton";

/** DM-10: shimmer placeholders while a dashboard page loads; the page then fades in. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
