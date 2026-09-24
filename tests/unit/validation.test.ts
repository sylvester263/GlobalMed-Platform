import { describe, expect, it } from "vitest";

import { certificateCodeSchema } from "@/lib/certificates/verify";
import { auditLeadSchema, contactLeadSchema } from "@/lib/validation/leads";

const validAudit = {
  practiceName: "Riverside Family Medicine",
  specialty: "Family medicine",
  claimVolume: "500–1,500 claims a month",
  billingSetup: "In-house billing team",
  name: "Sam Taylor",
  role: "Office manager",
  email: "office@riverside.example",
  phone: "+1 (555) 010-2000",
  bestTime: "Morning (ET)",
};

describe("auditLeadSchema", () => {
  it("accepts a complete request", () => {
    expect(auditLeadSchema.safeParse(validAudit).success).toBe(true);
  });

  it("allows an empty optional phone", () => {
    expect(auditLeadSchema.safeParse({ ...validAudit, phone: "" }).success).toBe(true);
  });

  it("rejects values outside the fixed option lists", () => {
    const result = auditLeadSchema.safeParse({ ...validAudit, claimVolume: "a lot" });
    expect(result.success).toBe(false);
  });

  it("rejects phone numbers with letters", () => {
    expect(auditLeadSchema.safeParse({ ...validAudit, phone: "call me" }).success).toBe(false);
  });

  it("explains how to fix an invalid email", () => {
    const result = auditLeadSchema.safeParse({ ...validAudit, email: "office@" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/format/i);
  });
});

describe("contactLeadSchema", () => {
  it("requires a meaningful message", () => {
    const result = contactLeadSchema.safeParse({
      name: "Sam Taylor",
      email: "sam@example.com",
      interest: "Something else",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});

describe("certificateCodeSchema", () => {
  it("normalises case, spaces and dashes", () => {
    expect(certificateCodeSchema.parse(" 7f3a-9c21 b04d ")).toBe("7F3A9C21B04D");
  });

  it("rejects codes of the wrong length or alphabet", () => {
    expect(certificateCodeSchema.safeParse("7F3A9C21B04").success).toBe(false);
    expect(certificateCodeSchema.safeParse("ZZZZZZZZZZZZ").success).toBe(false);
  });
});

describe("email fields", () => {
  it("accept addresses with surrounding whitespace (autofill) and trim them", () => {
    const result = contactLeadSchema.safeParse({
      name: "Sam Taylor",
      email: " sam@example.com ",
      interest: "Something else",
      message: "A message long enough to pass.",
    });
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("sam@example.com");
  });
});
