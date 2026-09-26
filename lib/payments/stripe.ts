import "server-only";

import Stripe from "stripe";

import { serverEnv } from "@/lib/server-env";

let client: Stripe | null = null;

/** True once STRIPE_SECRET_KEY is set. Checkout fails closed without it (ADR-017). */
export function isStripeConfigured(): boolean {
  return Boolean(serverEnv.STRIPE_SECRET_KEY);
}

/** Server-only Stripe client, pinned to the SDK's API version. */
export function getStripe(): Stripe {
  if (!serverEnv.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set.");
  client ??= new Stripe(serverEnv.STRIPE_SECRET_KEY, {
    appInfo: { name: "GlobalMed Platform" },
    maxNetworkRetries: 2,
  });
  return client;
}
