import { Info } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/marketing/wordmark";
import { ClaimLine } from "@/components/motion/claim-line";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/env";

/** Centred card used by every auth page. */
export function AuthCard({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ledger px-4 py-12"
    >
      <Link href="/" aria-label="GlobalMed home" className="rounded-md">
        <Wordmark />
      </Link>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl">{title}</h1>
          <ClaimLine ticks={6} trigger="mount" className="w-32" />
          {intro && <p className="text-muted-foreground">{intro}</p>}
        </div>
        {!isSupabaseConfigured() && (
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertDescription>
              Student accounts open soon. Until then you can browse the courses or contact us to
              reserve a place.
            </AlertDescription>
          </Alert>
        )}
        {children}
      </div>
      {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
    </main>
  );
}

export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
