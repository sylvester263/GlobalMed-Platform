import { cn } from "@/lib/utils";

/** Placeholder brand mark until the client's logo SVG arrives (pm/CLIENT_INPUTS_NEEDED.md). */
export function Wordmark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2 font-serif text-xl font-semibold", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 items-center justify-center rounded-md font-sans text-sm font-bold",
          inverted ? "bg-white text-ink" : "bg-teal text-white",
        )}
      >
        GM
      </span>
      GlobalMed
    </span>
  );
}
