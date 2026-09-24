import { beforeAll, describe, expect, it, vi } from "vitest";

describe("newsletter confirmation token", () => {
  let createConfirmToken: typeof import("@/lib/newsletter/token").createConfirmToken;
  let readConfirmToken: typeof import("@/lib/newsletter/token").readConfirmToken;

  beforeAll(async () => {
    vi.stubEnv("NEWSLETTER_SECRET", "test-secret-with-enough-entropy-123456");
    ({ createConfirmToken, readConfirmToken } = await import("@/lib/newsletter/token"));
  });

  it("round-trips a lower-cased email", () => {
    const token = createConfirmToken("Person@Example.com", 1_000);
    expect(token).not.toBeNull();
    expect(readConfirmToken(token!, 2_000)).toBe("person@example.com");
  });

  it("rejects an expired token", () => {
    const token = createConfirmToken("a@example.com", 0)!;
    const fortyNineHours = 49 * 60 * 60 * 1000;
    expect(readConfirmToken(token, fortyNineHours)).toBeNull();
  });

  it("rejects a tampered email", () => {
    const token = createConfirmToken("a@example.com", 0)!;
    const [, expiry, signature] = token.split(".");
    const forged = `${Buffer.from("b@example.com").toString("base64url")}.${expiry}.${signature}`;
    expect(readConfirmToken(forged, 1)).toBeNull();
  });

  it("rejects an extended expiry", () => {
    const token = createConfirmToken("a@example.com", 0)!;
    const [email, , signature] = token.split(".");
    expect(readConfirmToken(`${email}.${Number.MAX_SAFE_INTEGER}.${signature}`, 1)).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(readConfirmToken("not-a-token")).toBeNull();
    expect(readConfirmToken("a.b")).toBeNull();
  });
});
