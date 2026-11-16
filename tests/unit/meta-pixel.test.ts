import { describe, expect, it } from "vitest";

import { metaEventFor } from "@/lib/analytics";

describe("Meta Pixel event mapping (ADR-040)", () => {
  it("maps leads and WhatsApp clicks to Meta standard events", () => {
    expect(metaEventFor("lead_submit", { source: "aapc_registration" })).toEqual({
      name: "Lead",
      params: { source: "aapc_registration" },
    });
    expect(metaEventFor("whatsapp_click", { placement: "help_button" })?.name).toBe("Contact");
  });

  it("drops parameters that are not on the allow-list", () => {
    expect(metaEventFor("lead_submit", { source: "contact", email: "x@y.z" })?.params).toEqual({
      source: "contact",
    });
  });

  it("does not send internal LMS events to Meta", () => {
    expect(metaEventFor("lesson_complete")).toBeUndefined();
    expect(metaEventFor("chat_open")).toBeUndefined();
  });
});
