import { NextResponse, type NextRequest } from "next/server";

import { serverEnv } from "@/lib/server-env";
import { getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import { handleStripeEvent } from "@/lib/payments/webhook";

/**
 * Stripe webhook (P5-2). The raw body is verified against STRIPE_WEBHOOK_SECRET before
 * anything is read from it; only then is the event applied. Excluded from middleware.
 * Subscribe the endpoint to: checkout.session.completed, checkout.session.expired,
 * checkout.session.async_payment_succeeded, checkout.session.async_payment_failed.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !isStripeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
  }
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await request.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Errors propagate: Next answers 500, Sentry records it and Stripe retries the delivery.
  const outcome = await handleStripeEvent(event);
  return NextResponse.json({ received: true, outcome });
}
