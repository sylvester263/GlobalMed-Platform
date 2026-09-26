/**
 * Money helpers shared by checkout, the webhook and the orders pages. Pure, so they're unit
 * tested (tests/unit/payments.test.ts). Amounts in the database are decimal major units
 * (numeric(12,2)); Stripe works in integer minor units.
 */

export type Currency = "USD" | "PKR";

/** Decimal major units → integer minor units (12.34 → 1234), rounding half-cent noise. */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/** Supabase returns numeric columns as numbers or strings depending on size; normalise. */
export function toAmount(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(amount: number, currency: Currency | string): string {
  const pkr = currency.toUpperCase() === "PKR";
  return new Intl.NumberFormat(pkr ? "en-PK" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: pkr ? 0 : 2,
  }).format(amount);
}

export type PurchasableCourse = {
  status: string;
  price_usd: number | string;
};

/**
 * Whether a course can be bought by card right now: published and priced. Free courses are
 * not sold through Stripe (they'll be enrolled directly when the client adds any).
 */
export function cardPriceFor(course: PurchasableCourse): number | null {
  if (course.status !== "published") return null;
  const price = toAmount(course.price_usd);
  // Stripe's USD minimum charge is $0.50.
  return price >= 0.5 ? price : null;
}
