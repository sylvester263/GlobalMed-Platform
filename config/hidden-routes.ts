/**
 * Redirects for hidden features (config/features.ts). Every hidden public route goes to the
 * AAPC Certification page; the two old GlobalMed CPC/CPB course URLs go to their AAPC course
 * pages instead. Temporary (307) redirects, because these are future scope, not removed.
 * Both the /education and the old /school prefix are covered (ADR-024).
 * Plain values with no imports beyond ./features, so next.config.ts can load it.
 */
import { hiddenEducationRedirect, type FeatureFlag } from "./features";

export type HiddenRedirect = { source: string; destination: string; permanent: false };

const prefixes = ["/education", "/school"] as const;

function each(sources: string[], destination = hiddenEducationRedirect): HiddenRedirect[] {
  return sources.map((source) => ({ source, destination, permanent: false }));
}

function education(paths: string[], destination?: string): HiddenRedirect[] {
  return each(
    prefixes.flatMap((prefix) => paths.map((p) => `${prefix}${p}`)),
    destination,
  );
}

export function hiddenRedirects(flags: Record<FeatureFlag, boolean>): HiddenRedirect[] {
  const out: HiddenRedirect[] = [];
  if (!flags.educationLanding) out.push(...each(["/education", "/school"]));
  if (!flags.globalmedCourses) {
    out.push(
      ...education(["/courses/cpc-certified-professional-coder"], "/education/cpc"),
      ...education(["/courses/cpb-certified-professional-biller"], "/education/cpb"),
      ...education(["/courses", "/courses/:slug*"]),
    );
  }
  if (!flags.pathways) out.push(...education(["/pathways", "/pathways/:slug*"]));
  if (!flags.batches) out.push(...education(["/batches"]));
  if (!flags.corporateTraining) out.push(...education(["/corporate-training"]));
  if (!flags.examPrep) out.push(...education(["/exam-prep"]));
  if (!flags.certificates) out.push(...each(["/verify", "/verify/:path*"]));
  if (!flags.onlineCheckout) {
    out.push(
      ...each([
        "/dashboard/student/checkout/:path*",
        "/dashboard/student/orders",
        "/dashboard/student/orders/:path*",
        "/legal/refund-policy",
      ]),
    );
  }
  if (!flags.learningPlatform) {
    out.push(
      ...each([
        "/learn",
        "/learn/:path*",
        "/dashboard/student",
        "/dashboard/student/:path*",
        "/signup",
      ]),
      // Admin's LMS course manager: back to the admin overview, not the public site.
      ...each(["/dashboard/admin/courses"], "/dashboard/admin"),
    );
  }
  if (!flags.instructorDashboard) {
    out.push(...each(["/dashboard/instructor", "/dashboard/instructor/:path*"]));
  }
  return out;
}
