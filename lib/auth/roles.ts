import { features, type FeatureFlag } from "@/config/features";
import type { Enums } from "@/lib/db/types";

export type Role = Enums<"user_role">;

export const roles: Role[] = ["student", "instructor", "sales", "admin"];

export const roleLabels: Record<Role, string> = {
  student: "Student",
  instructor: "Instructor",
  sales: "Sales",
  admin: "Admin",
};

/** Dashboard areas (docs/07). Each area lists the roles allowed in; admin can see all. */
export type DashboardArea = "student" | "instructor" | "admin" | "sales";

export const areaAccess: Record<DashboardArea, Role[]> = {
  student: ["student", "admin"],
  instructor: ["instructor", "admin"],
  sales: ["sales", "admin"],
  admin: ["admin"],
};

/** Where each role lands after sign-in. */
export function roleHome(role: Role): string {
  return `/dashboard/${role === "admin" ? "admin" : role}`;
}

export function canAccess(role: Role, area: DashboardArea): boolean {
  return areaAccess[area].includes(role);
}

/** Icons are named, not imported, so this config stays serialisable for client components. */
export type NavIcon =
  | "overview"
  | "courses"
  | "quiz"
  | "certificate"
  | "orders"
  | "settings"
  | "builder"
  | "students"
  | "qa"
  | "users"
  | "enrollments"
  | "coupons"
  | "content"
  | "chatbot"
  | "audit"
  | "leads"
  | "inbox"
  | "reports"
  | "live";

export type DashboardSection = {
  slug: string;
  label: string;
  icon: NavIcon;
  /** Phase that builds the real page (pm/PROJECT_PLAN.md). */
  phase: number;
  description: string;
  /** Only shown while this feature flag is on (config/features.ts). */
  flag?: FeatureFlag;
};

export const dashboardSections: Record<DashboardArea, DashboardSection[]> = {
  student: [
    {
      slug: "",
      label: "Overview",
      icon: "overview",
      phase: 3,
      description: "Continue learning and see your progress.",
    },
    {
      slug: "courses",
      label: "My courses",
      icon: "courses",
      phase: 4,
      description: "Every course you're enrolled in, with progress and access dates.",
    },
    {
      slug: "live",
      label: "Live classes",
      icon: "live",
      phase: 4,
      description: "Upcoming live sessions and announcements from your batch.",
    },
    {
      slug: "quizzes",
      label: "Quizzes & exams",
      icon: "quiz",
      phase: 6,
      description: "Available quizzes, attempts left and your score history.",
    },
    {
      slug: "certificates",
      label: "Certificates",
      icon: "certificate",
      phase: 6,
      description: "Download certificates and copy verification links.",
    },
    {
      slug: "orders",
      label: "Orders & invoices",
      icon: "orders",
      phase: 5,
      description: "Receipts and the status of manual payments.",
    },
  ],
  instructor: [
    {
      slug: "",
      label: "Overview",
      icon: "overview",
      phase: 3,
      description: "Your courses, students and questions waiting for you.",
    },
    {
      slug: "courses",
      label: "Course builder",
      icon: "builder",
      phase: 4,
      description: "Create courses, modules and lessons and upload videos.",
    },
    {
      slug: "quizzes",
      label: "Quiz & exam builder",
      icon: "quiz",
      phase: 6,
      description: "Question banks, imports, time limits and pass marks.",
    },
    {
      slug: "students",
      label: "Students",
      icon: "students",
      phase: 4,
      description: "Progress, last activity and scores per course.",
    },
    {
      slug: "questions",
      label: "Q&A",
      icon: "qa",
      phase: 4,
      description: "Student questions, unanswered first.",
    },
    {
      slug: "batches",
      label: "Live batches",
      icon: "live",
      phase: 4,
      description: "Cohorts with a start date, live sessions and announcements.",
    },
  ],
  admin: [
    {
      slug: "",
      label: "Overview",
      icon: "overview",
      phase: 3,
      description: "Revenue, enrollments, leads and what needs attention.",
    },
    {
      slug: "users",
      label: "Users",
      icon: "users",
      phase: 8,
      description: "Search users and change roles.",
    },
    {
      slug: "courses",
      label: "Courses",
      icon: "courses",
      phase: 4,
      description: "Publish, archive, assign instructors and set prices.",
      flag: "learningPlatform",
    },
    {
      slug: "orders",
      label: "Orders",
      icon: "orders",
      phase: 5,
      description: "Approve manual payments and handle refunds.",
      flag: "onlineCheckout",
    },
    {
      slug: "enrollments",
      label: "Enrollments",
      icon: "enrollments",
      phase: 5,
      description: "Grant, revoke or extend access.",
      flag: "learningPlatform",
    },
    {
      slug: "certificates",
      label: "Certificates",
      icon: "certificate",
      phase: 6,
      description: "Issued certificates, revoke and reissue.",
      flag: "certificates",
    },
    {
      slug: "coupons",
      label: "Coupons",
      icon: "coupons",
      phase: 5,
      description: "Create discount codes and track usage.",
      flag: "onlineCheckout",
    },
    {
      slug: "content",
      label: "Content",
      icon: "content",
      phase: 8,
      description: "Pages, blog posts, testimonials and FAQs.",
    },
    {
      slug: "chatbot",
      label: "Chatbot",
      icon: "chatbot",
      phase: 7,
      description: "Knowledge base, conversations and handoff settings.",
    },
    {
      slug: "audit-log",
      label: "Audit log",
      icon: "audit",
      phase: 8,
      description: "Who changed what, and when.",
    },
  ],
  sales: [
    {
      slug: "",
      label: "Overview",
      icon: "overview",
      phase: 3,
      description: "New leads and conversations waiting for a reply.",
    },
    {
      slug: "leads",
      label: "Leads pipeline",
      icon: "leads",
      phase: 8,
      description: "Website leads and AAPC registrations, by status.",
    },
    {
      slug: "inbox",
      label: "Inbox",
      icon: "inbox",
      phase: 7,
      description: "Web and WhatsApp conversations handed to a person.",
    },
    {
      slug: "reports",
      label: "Reports",
      icon: "reports",
      phase: 8,
      description: "Leads by source, conversion and response time.",
    },
  ],
};

export function sectionHref(area: DashboardArea, slug: string): string {
  return slug ? `/dashboard/${area}/${slug}` : `/dashboard/${area}`;
}

/**
 * Areas switched off with GlobalMed's learning platform. Hidden at client request — GlobalMed education plans are future scope.
 * Their routes redirect (config/hidden-routes.ts); here they leave the area switcher.
 */
const areaFlags: Partial<Record<DashboardArea, FeatureFlag>> = {
  student: "learningPlatform",
  instructor: "instructorDashboard",
};

export function areaEnabled(area: DashboardArea): boolean {
  const flag = areaFlags[area];
  return !flag || features[flag];
}

/** Areas a role can switch between (admins see every enabled area). */
export function areasFor(role: Role): DashboardArea[] {
  return (Object.keys(areaAccess) as DashboardArea[]).filter(
    (area) => canAccess(role, area) && areaEnabled(area),
  );
}

/** An area's sidebar sections, without those whose feature flag is off. */
export function visibleSections(area: DashboardArea): DashboardSection[] {
  return dashboardSections[area].filter((s) => !s.flag || features[s.flag]);
}
