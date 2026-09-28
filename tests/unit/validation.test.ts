import { describe, expect, it } from "vitest";

import { certificateCodeSchema } from "@/lib/certificates/verify";
import { features } from "@/config/features";
import { csvCell, leadsToCsv, type ExportLead } from "@/lib/leads/csv";
import { aapcRegistrationSchema, auditLeadSchema, contactLeadSchema } from "@/lib/validation/leads";

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

describe("aapcRegistrationSchema (Address replaces City, 2026-09-28)", () => {
  const valid = {
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    whatsapp: "+92 300 1234567",
    address: "House 12, Street 4, Model Town, Lahore",
    course: "CPC®",
    background: "Graduate",
    contactTime: "Morning (PKT)",
    consent: true,
    message: "",
  };

  it("accepts a registration with an address and no city while City is hidden", () => {
    expect(features.registrationCityField).toBe(false);
    const parsed = aapcRegistrationSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("requires the address and trims it", () => {
    const { address: _omit, ...withoutAddress } = valid;
    expect(aapcRegistrationSchema.safeParse(withoutAddress).success).toBe(false);
    const parsed = aapcRegistrationSchema.parse({ ...valid, address: "  12 Mall Road, Lahore  " });
    expect(parsed.address).toBe("12 Mall Road, Lahore");
  });

  it("rejects addresses under 10 or over 250 characters with a message that says what to fix", () => {
    const short = aapcRegistrationSchema.safeParse({ ...valid, address: "  Lahore   " });
    expect(short.success).toBe(false);
    expect(short.error?.issues[0]?.message).toMatch(/house or street, area and city/);
    const long = aapcRegistrationSchema.safeParse({ ...valid, address: "a".repeat(251) });
    expect(long.error?.issues[0]?.message).toMatch(/250 characters or fewer/);
    expect(aapcRegistrationSchema.safeParse({ ...valid, address: "a".repeat(250) }).success).toBe(
      true,
    );
  });
});

describe("leads CSV export", () => {
  const lead: ExportLead = {
    created_at: "2026-09-28T10:00:00Z",
    source: "aapc_registration",
    status: "new",
    name: '=HYPERLINK("x")',
    email: "a@example.com",
    phone: "+92 300 1234567",
    interest: "CPC®",
    address: 'House 12, "Gulberg", Lahore',
    practice_name: null,
    specialty: null,
    message: null,
    details: { background: "Graduate", contactTime: "Any time" },
  };

  it("quotes cells and neutralises spreadsheet formulas", () => {
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("=1+1")).toBe(`"'=1+1"`);
    expect(csvCell("+92 300")).toBe(`"'+92 300"`);
    expect(csvCell(null)).toBe('""');
  });

  it("includes the Address column and each lead's address", () => {
    const csv = leadsToCsv([lead]);
    expect(csv.startsWith("﻿")).toBe(true);
    const [header, row] = csv.slice(1).split("\r\n");
    const headers = header!.split(",");
    expect(headers).toContain('"Address"');
    expect(row).toContain('"House 12, ""Gulberg"", Lahore"');
    expect(row).toContain(`"'=HYPERLINK(""x"")"`);
  });
});
