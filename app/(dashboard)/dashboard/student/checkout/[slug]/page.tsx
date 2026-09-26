import { Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PayButton } from "@/components/payments/pay-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireArea } from "@/lib/auth/session";
import { startCardCheckout, type CheckoutError } from "@/lib/payments/checkout-actions";
import { getCheckoutCourse, hasActiveEnrollment } from "@/lib/payments/checkout-data";
import { formatMoney } from "@/lib/payments/money";
import { isStripeConfigured } from "@/lib/payments/stripe";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<CheckoutError, string> = {
  unavailable: "This course isn't open for card payment right now.",
  "not-configured": "Card payments aren't switched on yet. Please contact admissions to enroll.",
  "rate-limited": "Too many attempts. Please wait a few minutes and try again.",
  failed: "We couldn't start the payment. You haven't been charged. Please try again.",
};

/** P5-1: order summary for one course, then Stripe Checkout (card, USD). */
export default async function CheckoutPage({ params, searchParams }: Props) {
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) notFound();
  const session = await requireArea("student", `/dashboard/student/checkout/${slug}`);

  const course = await getCheckoutCourse(slug);
  // The marketing catalog can list courses that aren't in the LMS yet (ADR-022).
  if (!course) {
    return (
      <div className="flex max-w-2xl flex-col gap-6">
        <DashboardPageHeader title="Checkout" />
        <Alert variant="info">
          <AlertTitle>Online enrollment isn&apos;t open for this course yet</AlertTitle>
          <AlertDescription>
            <p>
              <Link href="/contact">Contact admissions</Link> and we&apos;ll reserve your place in
              the next batch.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  if (await hasActiveEnrollment(session.user.id, course.id)) redirect(`/learn/${course.slug}`);

  const message = error && error in errors ? errors[error as CheckoutError] : null;
  const cardReady = isStripeConfigured() && course.priceUsd !== null;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <DashboardPageHeader title="Checkout" description="Review your order, then pay securely." />

      {message && (
        <Alert variant="destructive">
          <AlertTitle>Payment not started</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="order-heading" className="rounded-lg border bg-card p-5 sm:p-6">
        <h2 id="order-heading" className="sr-only">
          Your order
        </h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Course</p>
          <p className="font-serif text-xl font-semibold">{course.title}</p>
          {course.summary && <p className="text-muted-foreground">{course.summary}</p>}
        </div>
        <dl className="mt-5 grid gap-3 border-t pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Access</dt>
            <dd>
              {course.access_months
                ? `${course.access_months} month${course.access_months === 1 ? "" : "s"}`
                : "Lifetime"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-base font-semibold">
            <dt>Total</dt>
            <dd>{course.priceUsd !== null ? formatMoney(course.priceUsd, "USD") : "—"}</dd>
          </div>
        </dl>
      </section>

      {cardReady ? (
        <form action={startCardCheckout} className="flex flex-col gap-3">
          <input type="hidden" name="course" value={course.slug} />
          <PayButton>Pay {formatMoney(course.priceUsd ?? 0, "USD")} by card</PayButton>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock aria-hidden="true" className="size-4 shrink-0" />
            You&apos;ll pay on Stripe&apos;s secure page. We never see your card number.
          </p>
        </form>
      ) : (
        <Alert variant="warning">
          <AlertTitle>Card payment isn&apos;t available yet</AlertTitle>
          <AlertDescription>
            <p>
              Please <Link href="/contact">contact admissions</Link> and we&apos;ll enroll you.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-muted-foreground">
        Paying from Pakistan in PKR
        {course.pricePkr ? ` (${formatMoney(course.pricePkr, "PKR")})` : ""}? Bank transfer,
        JazzCash and Easypaisa are handled by{" "}
        <Link href="/contact" className="text-primary underline underline-offset-4">
          our admissions team
        </Link>
        .
      </p>
    </div>
  );
}
