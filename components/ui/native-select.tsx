import { ChevronDown } from "lucide-react";
import * as React from "react";

import { inputClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Native <select> styled like our inputs. Preferred for public forms: best on mobile,
 * works with react-hook-form's register, and fully accessible without extra wiring.
 */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select
        data-slot="native-select"
        className={cn(inputClasses, "h-10 cursor-pointer appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  );
}

export { NativeSelect };
