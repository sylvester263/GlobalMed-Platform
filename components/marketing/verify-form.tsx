import { QrCode } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Certificate lookup. A plain GET form to /verify (which redirects to /verify/[code]),
 * so it works without JavaScript and results can be bookmarked or shared.
 */
export function VerifyForm({ defaultCode, error }: { defaultCode?: string; error?: string }) {
  return (
    <form
      method="get"
      action="/verify"
      className="flex flex-col gap-4 rounded-lg border bg-card p-6"
    >
      <label htmlFor="certificate-code" className="text-sm font-semibold">
        Certificate ID
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="certificate-code"
          name="code"
          defaultValue={defaultCode}
          placeholder="e.g. 7F3A9C21B04D"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? "certificate-code-error certificate-code-help" : "certificate-code-help"
          }
          className="font-mono uppercase sm:flex-1"
        />
        <button type="submit" className={cn(buttonVariants({ size: "lg" }), "h-10")}>
          Verify
        </button>
      </div>
      {error && (
        <p
          id="certificate-code-error"
          role="alert"
          className="text-sm font-semibold text-destructive"
        >
          {error}
        </p>
      )}
      <p
        id="certificate-code-help"
        className="flex items-start gap-2 text-sm text-muted-foreground"
      >
        <QrCode aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        The 12-character ID is printed under the date on the certificate. Scanning the QR code opens
        this check automatically.
      </p>
    </form>
  );
}
