import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AppBadge, appBadges } from "@/components/marketing/footer-compact";
import { siteLinks } from "@/data/site";

// Footer app badges (client, 2026-09-28): always shown; a link only once the URL is set.

const [appStore, googlePlay] = appBadges;

describe("footer app badges", () => {
  it("has both store links in data/site.ts, App Store first", () => {
    expect(Object.keys(siteLinks.appLinks)).toEqual(["appStore", "googlePlay"]);
    expect(appBadges.map((b) => b.key)).toEqual(["appStore", "googlePlay"]);
  });

  it("renders an empty link as a disabled, non-link badge with a Coming soon tooltip", () => {
    const html = renderToStaticMarkup(createElement(AppBadge, { badge: appStore!, href: "" }));
    expect(html).not.toContain("<a");
    expect(html).not.toContain('href="#"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('role="tooltip"');
    expect(html).toContain("Coming soon");
  });

  it("renders a set link as a new-tab link with the store's aria-label", () => {
    const html = renderToStaticMarkup(
      createElement(AppBadge, {
        badge: googlePlay!,
        href: "https://play.google.com/store/apps/details?id=com.globalmed",
      }),
    );
    expect(html).toContain('href="https://play.google.com/store/apps/details?id=com.globalmed"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('aria-label="Download the GlobalMed app on Google Play"');
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain("Coming soon");
  });
});
