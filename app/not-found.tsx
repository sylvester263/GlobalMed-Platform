import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ClaimLine } from "@/components/motion/claim-line";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1 bg-ledger">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
          <p className="font-mono text-sm font-semibold text-teal-deep">404</p>
          <h1 className="text-3xl">We couldn&apos;t find that page</h1>
          <ClaimLine ticks={9} filled={4} trigger="static" className="w-56" />
          <p className="text-lg text-muted-foreground">
            It may have moved, or the link may be mistyped. These are good places to start:
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonVariants({ size: "lg" })}>
              Go to the home page
            </Link>
            <Link href="/services" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              Services
            </Link>
            <Link
              href="/school/courses"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              Courses
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
