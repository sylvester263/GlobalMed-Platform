import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClaimLine } from "@/components/motion/claim-line";
import { PathwayLine } from "@/components/motion/pathway-line";
import { ClaimProgress } from "@/components/ui/claim-progress";
import { features } from "@/config/features";

// Claim line retired site-wide at client request (2026-09-28, ADR-028).

describe("claim line flag", () => {
  it("is off", () => {
    expect(features.claimLine).toBe(false);
  });

  it("ClaimLine and PathwayLine render nothing and reserve no space", () => {
    expect(renderToStaticMarkup(createElement(ClaimLine, { ticks: 8 }))).toBe("");
    expect(
      renderToStaticMarkup(
        createElement(PathwayLine, { stages: [{ label: "Learn" }, { label: "Pass" }] }),
      ),
    ).toBe("");
  });

  it("ClaimProgress keeps its accessible value and text but draws no ticked line", () => {
    const html = renderToStaticMarkup(
      createElement(ClaimProgress, { label: "Course progress", value: 3, max: 10 }),
    );
    expect(html).not.toContain("<svg");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain("3 of 10 lessons");
  });
});
