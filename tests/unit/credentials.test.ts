import { describe, expect, it } from "vitest";

import { visibleCredentials } from "@/data/credentials";

// "Registered, Certified & Compliant": hidden entries and expired certificates are not shown.

describe("visible credentials", () => {
  it("shows PSEB, LCCI and HIPAA in that order today", () => {
    expect(visibleCredentials("2026-09-30").map((c) => c.id)).toEqual(["pseb", "lcci", "hipaa"]);
  });

  it("keeps LCCI on its last valid day and drops it the day after", () => {
    expect(visibleCredentials("2027-03-31").map((c) => c.id)).toContain("lcci");
    expect(visibleCredentials("2027-04-01").map((c) => c.id)).not.toContain("lcci");
  });
});
