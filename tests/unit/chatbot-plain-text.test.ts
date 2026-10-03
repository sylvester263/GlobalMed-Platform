import { describe, expect, it } from "vitest";

import { toPlainText } from "@/lib/ai/engine";

describe("toPlainText (chat replies are shown as plain text)", () => {
  it("strips bold, headings and dash bullets", () => {
    const md =
      "## Our services\n\n**Special pricing** for Pakistan\n- Coding\n* Billing\n\n\n\nUse the **Register Now form**.";
    expect(toPlainText(md)).toBe(
      "Our services\n\nSpecial pricing for Pakistan\n• Coding\n• Billing\n\nUse the Register Now form.",
    );
  });

  it("leaves plain text, • bullets, ® and URLs alone", () => {
    const plain = "CPC® costs USD 1,050.\n• Live online\nRegister: /education/cpc#register";
    expect(toPlainText(plain)).toBe(plain);
  });
});
