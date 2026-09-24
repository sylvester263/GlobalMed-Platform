import type { Metadata } from "next";
import Link from "next/link";

import { CheckStamp } from "@/components/motion/check-stamp";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Audit request received",
  description: "Thanks for requesting a free billing audit. Here's what happens next.",
  path: "/free-billing-audit/thank-you",
  noindex: true,
});

export default function AuditThankYouPage() {
  return (
    <section className="bg-ledger">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
        <CheckStamp />
        <h1 className="text-3xl">Your audit request is in</h1>
        <p className="text-lg text-muted-foreground">
          Thank you. Someone from our team will call you within one business day, at the time you
          chose, to agree the scope of your audit.
        </p>
        <p className="text-muted-foreground">
          Questions in the meantime? Email{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-primary underline underline-offset-4"
          >
            {site.contact.email}
          </a>
          .
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/services" className={buttonVariants({ size: "lg" })}>
            Explore our services
          </Link>
          <Link
            href="/blog/why-claims-get-denied"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Read: why claims get denied
          </Link>
        </div>
      </div>
    </section>
  );
}
