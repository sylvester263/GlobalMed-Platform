import Link from "next/link";

import { Wordmark } from "@/components/marketing/wordmark";
import { buttonVariants } from "@/components/ui/button";

/**
 * Placeholder until Phase 3 (P3-1) builds sign-up and log-in. Keeps header and enroll
 * links from 404ing on staging; replaced, not extended, in Phase 3.
 */
export function AccountsComingSoon({ heading }: { heading: string }) {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-ledger px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border bg-card p-8 text-center">
        <Link href="/" aria-label="GlobalMed home">
          <Wordmark />
        </Link>
        <h1 className="text-2xl">{heading}</h1>
        <p className="text-muted-foreground">
          Student accounts and online enrollment open soon. In the meantime, browse the courses or
          contact us to reserve a place.
        </p>
        <div className="flex w-full flex-col gap-3">
          <Link href="/school/courses" className={buttonVariants({ size: "lg" })}>
            Browse courses
          </Link>
          <Link href="/contact" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
