import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cardPriceFor, formatMoney, toAmount, toMinorUnits } from "@/lib/payments/money";
import { orderIdFrom, sessionOutcome } from "@/lib/payments/session-outcome";

const ORDER = "7b0c5d1e-2f3a-4b5c-8d9e-0a1b2c3d4e5f";

// ---------- Fake service-role client: records calls, returns scripted results ----------
type Call = { table?: string; op: string; args: unknown[] };
const db = {
  calls: [] as Call[],
  seenEvent: false,
  rpcResult: { data: "fulfilled" as string | null, error: null as { message: string } | null },
  insertError: null as { code: string; message: string } | null,
};

function query(table: string) {
  const chain = {
    select: (...args: unknown[]) => (db.calls.push({ table, op: "select", args }), chain),
    eq: (...args: unknown[]) => (db.calls.push({ table, op: "eq", args }), chain),
    update: (...args: unknown[]) => (db.calls.push({ table, op: "update", args }), chain),
    maybeSingle: async () => ({ data: db.seenEvent ? { id: "evt" } : null, error: null }),
    insert: async (...args: unknown[]) => {
      db.calls.push({ table, op: "insert", args });
      return { error: db.insertError };
    },
    then: (resolve: (v: { error: null }) => void) => resolve({ error: null }),
  };
  return chain;
}

vi.mock("@/lib/db/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => query(table),
    rpc: async (...args: unknown[]) => {
      db.calls.push({ op: "rpc", args });
      return db.rpcResult;
    },
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function sessionEvent(
  type: string,
  session: Partial<Stripe.Checkout.Session>,
  id = "evt_1",
): Stripe.Event {
  return {
    id,
    type,
    object: "event",
    data: {
      object: {
        id: "cs_test_1",
        object: "checkout.session",
        payment_status: "paid",
        amount_total: 14900,
        currency: "usd",
        client_reference_id: ORDER,
        metadata: { order_id: ORDER },
        ...session,
      },
    },
  } as unknown as Stripe.Event;
}

beforeEach(() => {
  db.calls = [];
  db.seenEvent = false;
  db.rpcResult = { data: "fulfilled", error: null };
  db.insertError = null;
});

describe("money", () => {
  it("converts to minor units without float drift", () => {
    expect(toMinorUnits(19.99)).toBe(1999);
    expect(toMinorUnits(0.1 + 0.2)).toBe(30);
    expect(toMinorUnits(149)).toBe(14900);
  });

  it("normalises numeric columns that arrive as strings", () => {
    expect(toAmount("149.50")).toBe(149.5);
    expect(toAmount(null)).toBe(0);
    expect(toAmount("abc")).toBe(0);
  });

  it("sells only published courses priced at Stripe's minimum or more", () => {
    expect(cardPriceFor({ status: "published", price_usd: "149.00" })).toBe(149);
    expect(cardPriceFor({ status: "draft", price_usd: 149 })).toBeNull();
    expect(cardPriceFor({ status: "published", price_usd: 0 })).toBeNull();
    expect(cardPriceFor({ status: "published", price_usd: 0.49 })).toBeNull();
  });

  it("formats USD with cents and PKR without", () => {
    expect(formatMoney(149, "USD")).toBe("$149.00");
    expect(formatMoney(45000, "PKR")).toMatch(/45,000/);
    expect(formatMoney(45000, "PKR")).not.toMatch(/\.00/);
  });
});

describe("session outcome", () => {
  const paid = { payment_status: "paid", client_reference_id: ORDER, metadata: null };

  it("finds the order id in metadata, then client_reference_id, and rejects non-uuids", () => {
    expect(orderIdFrom({ ...paid, metadata: { order_id: ORDER } })).toBe(ORDER);
    expect(orderIdFrom(paid)).toBe(ORDER);
    expect(orderIdFrom({ ...paid, client_reference_id: "1 or 1=1", metadata: null })).toBeNull();
  });

  it("fulfils only when the money is in", () => {
    expect(sessionOutcome("checkout.session.completed", paid)).toBe("fulfil");
    expect(
      sessionOutcome("checkout.session.completed", { ...paid, payment_status: "unpaid" }),
    ).toBe("wait");
    expect(sessionOutcome("checkout.session.async_payment_succeeded", paid)).toBe("fulfil");
    expect(sessionOutcome("checkout.session.async_payment_failed", paid)).toBe("fail");
    expect(sessionOutcome("checkout.session.expired", paid)).toBe("cancel");
  });
});

describe("handleStripeEvent", () => {
  it("fulfils a paid session with the amount Stripe charged, then records the event", async () => {
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    const outcome = await handleStripeEvent(sessionEvent("checkout.session.completed", {}));
    expect(outcome).toBe("fulfilled");
    const rpc = db.calls.find((c) => c.op === "rpc");
    expect(rpc?.args).toEqual([
      "fulfil_order",
      { p_order: ORDER, p_provider_ref: "cs_test_1", p_amount_minor: 14900, p_currency: "usd" },
    ]);
    const recorded = db.calls.find((c) => c.table === "stripe_events" && c.op === "insert");
    expect(recorded?.args[0]).toMatchObject({ id: "evt_1", order_id: ORDER, outcome: "fulfilled" });
  });

  it("skips an event it has already processed", async () => {
    db.seenEvent = true;
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    expect(await handleStripeEvent(sessionEvent("checkout.session.completed", {}))).toBe(
      "duplicate",
    );
    expect(db.calls.some((c) => c.op === "rpc")).toBe(false);
  });

  it("does not enroll while a delayed payment is still unpaid", async () => {
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    const outcome = await handleStripeEvent(
      sessionEvent("checkout.session.completed", { payment_status: "unpaid" }),
    );
    expect(outcome).toBe("awaiting_payment");
    expect(db.calls.some((c) => c.op === "rpc")).toBe(false);
  });

  it("cancels a pending order when its session expires", async () => {
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    expect(await handleStripeEvent(sessionEvent("checkout.session.expired", {}))).toBe("cancelled");
    const update = db.calls.find((c) => c.table === "orders" && c.op === "update");
    expect(update?.args[0]).toEqual({ status: "cancelled" });
    expect(db.calls).toContainEqual({ table: "orders", op: "eq", args: ["status", "pending"] });
  });

  it("reports an amount mismatch from the database without throwing", async () => {
    db.rpcResult = { data: "amount_mismatch", error: null };
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    expect(await handleStripeEvent(sessionEvent("checkout.session.completed", {}))).toBe(
      "amount_mismatch",
    );
  });

  it("throws on a database error so Stripe retries", async () => {
    db.rpcResult = { data: null, error: { message: "connection reset" } };
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    await expect(handleStripeEvent(sessionEvent("checkout.session.completed", {}))).rejects.toThrow(
      /fulfil_order/,
    );
    expect(db.calls.some((c) => c.table === "stripe_events" && c.op === "insert")).toBe(false);
  });

  it("ignores event types it doesn't handle", async () => {
    const { handleStripeEvent } = await import("@/lib/payments/webhook");
    expect(await handleStripeEvent(sessionEvent("customer.created", {}))).toBe("ignored");
  });
});

describe("POST /api/stripe/webhook", () => {
  const secret = "whsec_test_secret";

  async function loadRoute() {
    vi.resetModules();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    process.env.STRIPE_WEBHOOK_SECRET = secret;
    return import("@/app/api/stripe/webhook/route");
  }

  function request(body: string, signature?: string) {
    return new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body,
      headers: signature ? { "stripe-signature": signature } : {},
    }) as unknown as import("next/server").NextRequest;
  }

  it("rejects a missing or forged signature", async () => {
    const { POST } = await loadRoute();
    const body = JSON.stringify(sessionEvent("checkout.session.completed", {}));
    expect((await POST(request(body))).status).toBe(400);
    const forged = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: "whsec_x" });
    expect((await POST(request(body, forged))).status).toBe(400);
    expect(db.calls.some((c) => c.op === "rpc")).toBe(false);
  });

  it("applies a correctly signed event", async () => {
    const { POST } = await loadRoute();
    const body = JSON.stringify(sessionEvent("checkout.session.completed", {}));
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret });
    const response = await POST(request(body, signature));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, outcome: "fulfilled" });
  });
});
