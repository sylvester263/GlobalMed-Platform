import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

// Phase 0 placeholder. The real home page is built in Phase 2 (docs/05) on the Phase 1 design system.
export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          GlobalMed Transcriptions and Billing Solutions
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Cleaner claims for US practices. Job-ready skills for coders.
        </h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Medical billing, coding and transcription services, plus the GlobalMed School of Billing
          and Coding. The full site is under construction.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Get billing help
          </Link>
          <Link href="/school" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Start a course
          </Link>
        </div>
      </main>
      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        Designed &amp; developed by SylJo Tech
      </footer>
    </div>
  );
}
