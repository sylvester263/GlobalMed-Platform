import { CircleX, MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CheckStamp } from "@/components/motion/check-stamp";
import { buttonVariants } from "@/components/ui/button";
import { confirmNewsletter } from "@/lib/newsletter/actions";
import { readConfirmToken } from "@/lib/newsletter/token";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Newsletter confirmation",
  description: "Confirm your subscription to the GlobalMed newsletter.",
  path: "/newsletter/confirm",
  noindex: true,
});

type Props = { searchParams: Promise<{ token?: string; status?: string }> };

/**
 * Double opt-in (W-14). Opening the emailed link only shows a Confirm button; the
 * subscription happens when the person presses it (see confirmNewsletter).
 */
export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const { token, status } = await searchParams;
  const tokenValid = token ? readConfirmToken(token) !== null : false;

  let body: React.ReactNode;
  if (status === "confirmed") {
    body = (
      <>
        <CheckStamp />
        <h1 className="text-3xl">You&apos;re subscribed</h1>
        <p className="text-lg text-muted-foreground">
          Thanks for confirming. Our next issue will arrive in your inbox soon.
        </p>
        <Link href="/blog" className={buttonVariants({ size: "lg" })}>
          Read the latest articles
        </Link>
      </>
    );
  } else if (tokenValid && status !== "failed") {
    body = (
      <>
        <MailCheck aria-hidden="true" className="size-16 text-teal" />
        <h1 className="text-3xl">Confirm your subscription</h1>
        <p className="text-lg text-muted-foreground">
          Press the button to start receiving GlobalMed&apos;s monthly billing and coding insights.
        </p>
        <form action={confirmNewsletter}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={buttonVariants({ size: "lg" })}>
            Confirm my subscription
          </button>
        </form>
      </>
    );
  } else {
    body = (
      <>
        <CircleX aria-hidden="true" className="size-16 text-destructive" />
        <h1 className="text-3xl">This link didn&apos;t work</h1>
        <p className="text-lg text-muted-foreground">
          Confirmation links expire after 48 hours. Sign up again from the form at the bottom of any
          page and we&apos;ll send a new one.
        </p>
      </>
    );
  }

  return (
    <section className="bg-ledger">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
        {body}
      </div>
    </section>
  );
}
