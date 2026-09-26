import "server-only";

import { createAdminClient } from "@/lib/db/admin";
import type { Tables } from "@/lib/db/types";
import { enrollmentActive } from "@/lib/lms/rules";
import { cardPriceFor, toAmount } from "@/lib/payments/money";

export type CheckoutCourse = Pick<
  Tables<"courses">,
  "id" | "slug" | "title" | "summary" | "access_months"
> & {
  priceUsd: number | null;
  pricePkr: number | null;
};

/** A published course as the checkout page shows it, or null if it isn't on sale. */
export async function getCheckoutCourse(slug: string): Promise<CheckoutCourse | null> {
  const { data: course } = await createAdminClient()
    .from("courses")
    .select("id, slug, title, summary, access_months, status, price_usd, price_pkr")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!course) return null;
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    access_months: course.access_months,
    priceUsd: cardPriceFor(course),
    pricePkr: course.price_pkr === null ? null : toAmount(course.price_pkr),
  };
}

/** True when the user already has live access, so we don't sell them the course twice. */
export async function hasActiveEnrollment(userId: string, courseId: string): Promise<boolean> {
  const { data } = await createAdminClient()
    .from("enrollments")
    .select("status, expires_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data ? enrollmentActive(data) : false;
}

export type OrderView = Pick<
  Tables<"orders">,
  "id" | "status" | "currency" | "provider" | "created_at" | "paid_at"
> & {
  subtotal: number;
  discount: number;
  total: number;
  items: { id: string; title: string; slug: string | null; price: number }[];
};

/** One of the user's orders with its lines. Scoped to the owner; null for anyone else. */
export async function getOrderForUser(orderId: string, userId: string): Promise<OrderView | null> {
  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .select("id, status, currency, provider, created_at, paid_at, subtotal, discount, total")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!order) return null;

  const { data: items } = await db
    .from("order_items")
    .select("id, course_id, bundle_id, price")
    .eq("order_id", order.id);
  const courseIds = (items ?? []).flatMap((i) => (i.course_id ? [i.course_id] : []));
  const bundleIds = (items ?? []).flatMap((i) => (i.bundle_id ? [i.bundle_id] : []));
  const [{ data: courses }, { data: bundles }] = await Promise.all([
    courseIds.length
      ? db.from("courses").select("id, slug, title").in("id", courseIds)
      : Promise.resolve({ data: [] as { id: string; slug: string; title: string }[] }),
    bundleIds.length
      ? db.from("bundles").select("id, title").in("id", bundleIds)
      : Promise.resolve({ data: [] as { id: string; title: string }[] }),
  ]);

  return {
    ...order,
    subtotal: toAmount(order.subtotal),
    discount: toAmount(order.discount),
    total: toAmount(order.total),
    items: (items ?? []).map((item) => {
      const course = courses?.find((c) => c.id === item.course_id);
      const bundle = bundles?.find((b) => b.id === item.bundle_id);
      return {
        id: item.id,
        title: course?.title ?? bundle?.title ?? "Course",
        slug: course?.slug ?? null,
        price: toAmount(item.price),
      };
    }),
  };
}

/** The user's orders, newest first (orders page). */
export async function getMyOrders(userId: string) {
  const { data } = await createAdminClient()
    .from("orders")
    .select("id, status, currency, provider, total, created_at, paid_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []).map((o) => ({ ...o, total: toAmount(o.total) }));
}
