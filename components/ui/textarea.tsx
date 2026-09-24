import * as React from "react";

import { inputClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputClasses, "field-sizing-content min-h-24 py-2", className)}
      {...props}
    />
  );
}

export { Textarea };
