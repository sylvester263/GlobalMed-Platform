import { describe, expect, it } from "vitest";

import { nextFromEnrollParams, safeNext } from "@/lib/auth/redirect";
import {
  areaAccess,
  areasFor,
  canAccess,
  dashboardSections,
  roleHome,
  roles,
  sectionHref,
} from "@/lib/auth/roles";
import { isProtectedPath } from "@/lib/db/middleware";
import {
  loginSchema,
  profileSchema,
  signupSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth";

describe("safeNext (open-redirect protection)", () => {
  it.each([
    ["/dashboard/student", "/dashboard/student"],
    [
      "/school/courses/cpc-exam-preparation?x=1#top",
      "/school/courses/cpc-exam-preparation?x=1#top",
    ],
  ])("keeps same-site path %s", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each([
    "https://evil.example/phish",
    "//evil.example",
    "/\\evil.example",
    "\\\\evil.example",
    "javascript:alert(1)",
    "/%0d%0aSet-Cookie:x=1".replace("%0d%0a", "\r\n"),
    "dashboard",
    "",
    undefined,
    42,
    `/${"a".repeat(600)}`,
  ])("falls back for %s", (input) => {
    expect(safeNext(input)).toBe("/dashboard");
  });

  it("uses the given fallback", () => {
    expect(safeNext("https://evil.example", "/login")).toBe("/login");
  });
});

describe("nextFromEnrollParams", () => {
  it("sends a course to checkout and a pathway to its page", () => {
    expect(nextFromEnrollParams({ course: "cpc-exam-preparation" })).toBe(
      "/dashboard/student/checkout/cpc-exam-preparation",
    );
    expect(nextFromEnrollParams({ pathway: "coding-specialist" })).toBe(
      "/education/pathways/coding-specialist",
    );
  });

  it("ignores slugs with unexpected characters", () => {
    expect(nextFromEnrollParams({ course: "../../admin" })).toBeUndefined();
  });
});

describe("roles and dashboard areas", () => {
  it("sends each role to its own home", () => {
    expect(roleHome("student")).toBe("/dashboard/student");
    expect(roleHome("admin")).toBe("/dashboard/admin");
  });

  it("lets admins into every area and nobody else into admin", () => {
    for (const area of Object.keys(areaAccess) as (keyof typeof areaAccess)[]) {
      expect(canAccess("admin", area)).toBe(true);
    }
    for (const role of roles.filter((r) => r !== "admin")) {
      expect(canAccess(role, "admin")).toBe(false);
    }
  });

  it("keeps students out of staff areas", () => {
    expect(areasFor("student")).toEqual(["student"]);
    expect(canAccess("student", "sales")).toBe(false);
    expect(canAccess("student", "instructor")).toBe(false);
  });

  it("gives every area exactly one overview and unique section slugs", () => {
    for (const sections of Object.values(dashboardSections)) {
      expect(sections.filter((s) => s.slug === "")).toHaveLength(1);
      const slugs = sections.map((s) => s.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    expect(sectionHref("sales", "")).toBe("/dashboard/sales");
    expect(sectionHref("sales", "leads")).toBe("/dashboard/sales/leads");
  });
});

describe("isProtectedPath", () => {
  it.each(["/dashboard", "/dashboard/admin/users", "/learn/course/lesson"])("protects %s", (p) => {
    expect(isProtectedPath(p)).toBe(true);
  });
  it.each(["/", "/login", "/dashboards-info", "/school/courses", "/learning"])(
    "leaves %s public",
    (p) => {
      expect(isProtectedPath(p)).toBe(false);
    },
  );
});

describe("auth schemas", () => {
  it("normalises email case and whitespace", () => {
    const parsed = loginSchema.parse({ email: "  Person@Example.COM ", password: "x" });
    expect(parsed.email).toBe("person@example.com");
  });

  it("requires passwords of 10 to 72 characters", () => {
    const base = { fullName: "Sam Taylor", email: "sam@example.com" };
    expect(signupSchema.safeParse({ ...base, password: "short" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "a".repeat(73) }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "correct horse battery" }).success).toBe(
      true,
    );
  });

  it("flags mismatched confirmation on the confirm field", () => {
    const result = updatePasswordSchema.safeParse({
      password: "long enough pw",
      confirm: "different pw",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirm"]);
  });

  it("requires a certificate name", () => {
    expect(profileSchema.safeParse({ fullName: "Sam Taylor", certificateName: "" }).success).toBe(
      false,
    );
  });
});
