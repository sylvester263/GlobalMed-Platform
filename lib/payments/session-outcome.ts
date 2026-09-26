/**
 * Pure decisions for Checkout Session events (unit tested in tests/unit/payments.test.ts).
 * Kept free of server-only imports so tests can load it directly.
 */

type SessionLike = {
  payment_status: string;
  client_reference_id: string | null;
  metadata: Record<string, string> | null;
};

export type SessionOutcome = "fulfil" | "wait" | "fail" | "cancel";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Our order id, from metadata first, then client_reference_id. Null if neither is a uuid. */
export function orderIdFrom(session: SessionLike): string | null {
  const candidate = session.metadata?.order_id ?? session.client_reference_id ?? "";
  return uuid.test(candidate) ? candidate : null;
}

/**
 * What an event means for its order. `checkout.session.completed` only fulfils when Stripe
 * says the money is in (`paid`); delayed methods complete as `unpaid` and are fulfilled by
 * `async_payment_succeeded` later. A 100%-discounted session reports `no_payment_required`.
 */
export function sessionOutcome(type: string, session: SessionLike): SessionOutcome {
  switch (type) {
    case "checkout.session.completed":
      return session.payment_status === "paid" || session.payment_status === "no_payment_required"
        ? "fulfil"
        : "wait";
    case "checkout.session.async_payment_succeeded":
      return "fulfil";
    case "checkout.session.async_payment_failed":
      return "fail";
    case "checkout.session.expired":
      return "cancel";
    default:
      return "wait";
  }
}
