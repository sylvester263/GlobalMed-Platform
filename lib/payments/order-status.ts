import type { Enums } from "@/lib/db/types";

type BadgeVariant = "success" | "warning" | "destructive" | "neutral";

/** How each order status reads to a student, and the badge that goes with it. */
export const orderStatusView: Record<
  Enums<"order_status">,
  { label: string; variant: BadgeVariant }
> = {
  pending: { label: "Awaiting payment", variant: "warning" },
  awaiting_verification: { label: "Checking your payment", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Payment failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "neutral" },
  cancelled: { label: "Cancelled", variant: "neutral" },
};
