import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/** Required on every public form and the chat widget (docs/11 §1, CLAUDE.md §6). */
export function PhiNotice({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-sm text-muted-foreground", className)}>
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal" />
      <span>
        <strong className="font-semibold text-foreground">
          Do not include patient information.
        </strong>{" "}
        This form is for business enquiries only.
      </span>
    </p>
  );
}
