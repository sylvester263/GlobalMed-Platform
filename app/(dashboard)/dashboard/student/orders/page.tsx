import { Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireArea } from "@/lib/auth/session";
import { getMyOrders } from "@/lib/payments/checkout-data";
import { formatMoney } from "@/lib/payments/money";
import { orderStatusView } from "@/lib/payments/order-status";

export const metadata: Metadata = { title: "Orders & invoices" };

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** Student orders (P5-1). Receipts and manual-payment proof arrive with P5-3 and P5-6. */
export default async function OrdersPage() {
  const session = await requireArea("student", "/dashboard/student/orders");
  const orders = await getMyOrders(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Orders & invoices"
        description="Your purchases and the status of each payment."
      />
      {orders.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          description="When you enroll in a course, the order appears here."
          action={
            <Link href="/education/courses" className={buttonVariants({ size: "lg" })}>
              Browse courses
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Order</TableHead>
                <TableHead scope="col">Date</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col" className="text-right">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = orderStatusView[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/student/orders/${order.id}`}
                        className="font-mono text-sm text-primary underline underline-offset-4"
                      >
                        {order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell>{date.format(new Date(order.created_at))}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMoney(order.total, order.currency)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
