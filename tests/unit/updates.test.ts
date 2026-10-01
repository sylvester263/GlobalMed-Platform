import { describe, expect, it } from "vitest";

import {
  formatUpdateDate,
  liveUpdates,
  orderUpdates,
  paginate,
  slugify,
  updateState,
  updatesKnowledge,
  type Update,
} from "@/lib/updates/logic";
import { updateFormSchema } from "@/lib/validation/updates";

const now = new Date("2026-10-02T10:00:00Z");

function update(over: Partial<Update>): Update {
  return {
    id: crypto.randomUUID(),
    slug: "u",
    title: "Title",
    summary: "Short text",
    bodyMd: null,
    category: "company",
    imagePath: null,
    linkUrl: null,
    linkLabel: null,
    publishAt: "2026-10-01T10:00:00Z",
    expiresAt: null,
    pinned: false,
    status: "published",
    ...over,
  };
}

describe("publish and expiry", () => {
  it("drafts are never live", () => {
    expect(updateState(update({ status: "draft" }), now)).toBe("draft");
  });

  it("a future publish date schedules the update", () => {
    expect(updateState(update({ publishAt: "2026-10-03T00:00:00Z" }), now)).toBe("scheduled");
  });

  it("is live between its publish date and its expiry", () => {
    expect(updateState(update({ expiresAt: "2026-10-05T00:00:00Z" }), now)).toBe("live");
  });

  it("expires at the expiry moment", () => {
    expect(updateState(update({ expiresAt: "2026-10-02T10:00:00Z" }), now)).toBe("expired");
    expect(updateState(update({ expiresAt: "2026-10-02T09:59:59Z" }), now)).toBe("expired");
  });

  it("the home page gets live updates only, pinned first, then newest", () => {
    const list = [
      update({ id: "old", publishAt: "2026-09-01T00:00:00Z" }),
      update({ id: "new", publishAt: "2026-10-01T00:00:00Z" }),
      update({ id: "pinned-old", publishAt: "2026-08-01T00:00:00Z", pinned: true }),
      update({ id: "draft", status: "draft", publishAt: "2026-10-02T00:00:00Z" }),
      update({ id: "expired", expiresAt: "2026-10-01T12:00:00Z" }),
      update({ id: "scheduled", publishAt: "2026-12-01T00:00:00Z" }),
    ];
    expect(liveUpdates(list, now).map((u) => u.id)).toEqual(["pinned-old", "new", "old"]);
  });

  it("orders several pinned updates by date too", () => {
    const list = [
      update({ id: "a", pinned: true, publishAt: "2026-09-01T00:00:00Z" }),
      update({ id: "b", pinned: true, publishAt: "2026-09-20T00:00:00Z" }),
      update({ id: "c", publishAt: "2026-10-01T00:00:00Z" }),
    ];
    expect(orderUpdates(list).map((u) => u.id)).toEqual(["b", "a", "c"]);
  });
});

describe("helpers", () => {
  it("formats dates as 2 Oct 2026 in Pakistan time", () => {
    expect(formatUpdateDate("2026-10-02T10:00:00Z")).toBe("2 Oct 2026");
    // 21:00 UTC on 1 Oct is already 2 Oct in Lahore.
    expect(formatUpdateDate("2026-10-01T21:00:00Z")).toBe("2 Oct 2026");
  });

  it("paginates 12 per page and clamps the page", () => {
    const list = Array.from({ length: 30 }, (_, i) => i);
    expect(paginate(list, 1).items).toHaveLength(12);
    expect(paginate(list, 3)).toMatchObject({ page: 3, pages: 3 });
    expect(paginate(list, 3).items).toHaveLength(6);
    expect(paginate(list, 99).page).toBe(3);
    expect(paginate([], 1)).toMatchObject({ page: 1, pages: 1, items: [] });
  });

  it("makes unique slugs", () => {
    expect(slugify("Registrations open for the next CPC® and CPB® batch!")).toBe(
      "registrations-open-for-the-next-cpc-and-cpb-batch",
    );
    expect(slugify("News", ["news", "news-2"])).toBe("news-3");
  });

  it("gives the chatbot live updates only", () => {
    const text = updatesKnowledge(
      [
        update({ title: "Next batch starts 15 November", category: "batch" }),
        update({ title: "Hidden draft", status: "draft" }),
      ],
      now,
    );
    expect(text).toContain("Batch & Enrollment: Next batch starts 15 November");
    expect(text).not.toContain("Hidden draft");
  });
});

describe("dashboard form validation", () => {
  const valid = {
    title: "Registrations open",
    summary: "Short text",
    category: "batch",
    publishAt: "2026-10-02T10:00:00+05:00",
    pinned: false,
    status: "published",
  };

  it("accepts a valid update", () => {
    expect(updateFormSchema.safeParse(valid).success).toBe(true);
  });

  it("limits the short text to 280 characters", () => {
    expect(updateFormSchema.safeParse({ ...valid, summary: "x".repeat(281) }).success).toBe(false);
  });

  it("needs the expiry after the publish date", () => {
    const r = updateFormSchema.safeParse({ ...valid, expiresAt: "2026-10-01T10:00:00+05:00" });
    expect(r.success).toBe(false);
  });

  it("needs both link and label, and only safe links", () => {
    expect(updateFormSchema.safeParse({ ...valid, linkUrl: "/contact" }).success).toBe(false);
    expect(
      updateFormSchema.safeParse({ ...valid, linkUrl: "javascript:alert(1)", linkLabel: "Go" })
        .success,
    ).toBe(false);
    expect(
      updateFormSchema.safeParse({ ...valid, linkUrl: "//evil.example", linkLabel: "Go" }).success,
    ).toBe(false);
    expect(
      updateFormSchema.safeParse({ ...valid, linkUrl: "/contact", linkLabel: "Contact us" })
        .success,
    ).toBe(true);
  });

  it("rejects unknown categories", () => {
    expect(updateFormSchema.safeParse({ ...valid, category: "sale" }).success).toBe(false);
  });
});
