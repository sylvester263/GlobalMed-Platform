import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OrderStatusPoller } from "@/components/payments/order-status-poller";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireArea } from "@/lib/auth/session";
import { getOrderForUser } from "@/lib/payments/checkout-data";
import { formatMoney } from "@/lib/payments/money";
import { orderStatusView } from "@/lib/payments/order-status";

export const metadata: Metadata = { title: "Order", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ checkout?: string }>;
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const dateTime = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** One order. Stripe returns students here; the page waits for the webhook to confirm. */
export default async function OrderPage({ params, searchParams }: Props) {
  const [{ orderId }, { checkout }] = await Promise.all([params, searchParams]);
  if (!uuid.test(orderId)) notFound();
  const session = await requireArea("student", `/dashboard/student/orders/${orderId}`);
  const order = await getOrderForUser(orderId, session.user.id);
  if (!order) notFound();

  const status = orderStatusView[order.status];
  const confirming = checkout === "success" && order.status === "pending";
  const firstCourse = order.items.find((item) => item.slug);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <DashboardPageHeader
        title="Order"
        description={`Placed ${dateTime.format(new Date(order.created_at))}`}
        actions={
          <Link href="/dashboard/student/orders" className={buttonVariants({ variant: "ghost" })}>
            All orders
          </Link>
        }
      />

      {confirming && (
        <Alert variant="info">
          <OrderStatusPoller />
          <AlertTitle>Confirming your payment…</AlertTitle>
          <AlertDescription>
            This usually takes a few seconds. You can leave this page; your course will appear in My
            courses once the payment is confirmed.
          </AlertDescription>
        </Alert>
      )}
      {order.status === "paid" && (
        <Alert variant="success">
          <AlertTitle>Payment received. You&apos;re enrolled.</AlertTitle>
          <AlertDescription>
            {firstCourse ? (
              <p>
                <Link href={`/learn/${firstCourse.slug}`}>Start {firstCourse.title}</Link>
              </p>
            ) : (
              <p>
                Your course is in <Link href="/dashboard/student/courses">My courses</Link>.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="summary-heading" className="rounded-lg border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="summary-heading" className="text-lg">
            Summary
          </h2>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>{item.title}</span>
              <span>{formatMoney(item.price, order.currency)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-2 border-t pt-4 text-sm">
          {order.discount > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Discount</dt>
              <dd>−{formatMoney(order.discount, order.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatMoney(order.total, order.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Payment</dt>
            <dd>{order.provider === "stripe" ? "Card (Stripe)" : "Bank transfer / wallet"}</dd>
          </div>
          {order.paid_at && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Paid</dt>
              <dd>{dateTime.format(new Date(order.paid_at))}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Order number</dt>
            <dd className="font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
