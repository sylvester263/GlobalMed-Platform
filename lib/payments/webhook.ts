import "server-only";

import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

import { createAdminClient } from "@/lib/db/admin";
import { orderIdFrom, type SessionOutcome, sessionOutcome } from "@/lib/payments/session-outcome";

/**
 * P5-2: applies one verified Stripe event. Safe to call more than once for the same event:
 * events already recorded are skipped, and `fulfil_order` itself refuses to pay an order twice.
 * Throws on database errors so the route answers 500 and Stripe retries.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<string> {
  const db = createAdminClient();
  const { data: seen } = await db
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();
  if (seen) return "duplicate";

  let orderId: string | null = null;
  let outcome: string;

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      orderId = orderIdFrom(session);
      outcome = orderId
        ? await applySession(orderId, session, sessionOutcome(event.type, session))
        : "no_order";
      break;
    }
    default:
      outcome = "ignored";
  }

  const { error } = await db
    .from("stripe_events")
    .insert({ id: event.id, type: event.type, order_id: orderId, outcome });
  // A concurrent delivery of the same event may have recorded it first; that's fine.
  if (error && error.code !== "23505") throw new Error(`stripe_events insert: ${error.message}`);
  return outcome;
}

async function applySession(
  orderId: string,
  session: Stripe.Checkout.Session,
  action: SessionOutcome,
): Promise<string> {
  const db = createAdminClient();
  if (action === "fulfil") {
    const { data, error } = await db.rpc("fulfil_order", {
      p_order: orderId,
      p_provider_ref: session.id,
      p_amount_minor: session.amount_total ?? undefined,
      p_currency: session.currency ?? undefined,
    });
    if (error) throw new Error(`fulfil_order: ${error.message}`);
    if (data === "fulfilled") {
      revalidatePath("/dashboard/student", "layout");
      revalidatePath("/learn", "layout");
    }
    return data;
  }
  if (action === "fail" || action === "cancel") {
    const { error } = await db
      .from("orders")
      .update({ status: action === "fail" ? "failed" : "cancelled" })
      .eq("id", orderId)
      .eq("status", "pending");
    if (error) throw new Error(`order update: ${error.message}`);
    return action === "fail" ? "failed" : "cancelled";
  }
  // Completed but not yet paid (a delayed method): the async_payment_* event will follow.
  return "awaiting_payment";
}
