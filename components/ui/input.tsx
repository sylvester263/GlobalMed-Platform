import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";

/** MASTER.md §5 — 40px tall, 16px text (prevents iOS zoom), border ≥ 3:1. */
const inputClasses =
  "w-full min-w-0 rounded-md border border-input bg-card px-3 text-base text-foreground transition-colors duration-(--duration-fast) placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputClasses,
        "h-10 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input, inputClasses };
