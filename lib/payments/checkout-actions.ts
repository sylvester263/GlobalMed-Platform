"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { features, hiddenEducationRedirect } from "@/config/features";
import { authorize } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";
import { publicEnv } from "@/lib/env";
import { getCheckoutCourse, hasActiveEnrollment } from "@/lib/payments/checkout-data";
import { toMinorUnits } from "@/lib/payments/money";
import { getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import { checkRateLimit } from "@/lib/security/rate-limit";

const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);

export type CheckoutError = "unavailable" | "not-configured" | "rate-limited" | "failed";

function checkoutPath(slug: string, error?: CheckoutError) {
  return `/dashboard/student/checkout/${slug}${error ? `?error=${error}` : ""}`;
}

/**
 * P5-1: card checkout for one course. The price comes from the database, never the form;
 * the order is created first (pending) so the webhook can match the Stripe session to it
 * by `metadata.order_id`. Access is granted only by the webhook (P5-2), not by the redirect.
 */
export async function startCardCheckout(form: FormData): Promise<void> {
  // Online checkout is off; students register through the AAPC form instead.
  // Hidden at client request — GlobalMed education plans are future scope.
  if (!features.onlineCheckout) redirect(hiddenEducationRedirect);
  const slug = slugSchema.safeParse(form.get("course"));
  if (!slug.success) redirect("/education/courses");

  const session = await authorize(["student", "admin"]);
  if (!session) redirect(`/login?next=${encodeURIComponent(checkoutPath(slug.data))}`);
  if (!isStripeConfigured()) redirect(checkoutPath(slug.data, "not-configured"));
  if (!(await checkRateLimit("checkout", session.user.id))) {
    redirect(checkoutPath(slug.data, "rate-limited"));
  }

  const course = await getCheckoutCourse(slug.data);
  if (!course?.priceUsd) redirect(checkoutPath(slug.data, "unavailable"));
  if (await hasActiveEnrollment(session.user.id, course.id)) redirect(`/learn/${course.slug}`);

  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .insert({
      user_id: session.user.id,
      status: "pending",
      currency: "USD",
      subtotal: course.priceUsd,
      discount: 0,
      total: course.priceUsd,
      provider: "stripe",
    })
    .select("id")
    .single();
  if (!order) redirect(checkoutPath(slug.data, "failed"));

  const { error: itemError } = await db
    .from("order_items")
    .insert({ order_id: order.id, course_id: course.id, price: course.priceUsd });
  if (itemError) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    redirect(checkoutPath(slug.data, "failed"));
  }

  const site = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  let url: string | null = null;
  try {
    const checkout = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: order.id,
        customer_email: session.user.email ?? undefined,
        metadata: { order_id: order.id },
        payment_intent_data: { metadata: { order_id: order.id } },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: toMinorUnits(course.priceUsd),
              product_data: {
                name: course.title,
                metadata: { course_id: course.id },
              },
            },
          },
        ],
        success_url: `${site}/dashboard/student/orders/${order.id}?checkout=success`,
        cancel_url: `${site}${checkoutPath(course.slug)}`,
      },
      // A retried submit for the same order can't open a second session.
      { idempotencyKey: `checkout:${order.id}` },
    );
    await db.from("orders").update({ provider_ref: checkout.id }).eq("id", order.id);
    url = checkout.url;
  } catch {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
  }
  if (!url) redirect(checkoutPath(slug.data, "failed"));
  redirect(url);
}
