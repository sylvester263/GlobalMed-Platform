/**
 * Validates a post-auth redirect target. Only same-site paths are allowed, so a crafted
 * link like /login?next=https://evil.example can't bounce users off-site (open redirect).
 */
export function safeNext(next: unknown, fallback = "/dashboard"): string {
  if (typeof next !== "string" || next.length === 0 || next.length > 512) return fallback;
  // Must be a single-slash absolute path: blocks "//evil", "/\evil" and "https://…".
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  // Reject control characters and backslashes anywhere (browsers normalise "\" to "/").
  if (/[\u0000-\u001f\\]/.test(next)) return fallback;
  try {
    const url = new URL(next, "https://placeholder.invalid");
    if (url.origin !== "https://placeholder.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

/** Where the course/pathway "Enroll" CTAs send people after they sign up or sign in: a course goes
 * straight to checkout (P5-1); a pathway to its page to pick a course. */
export function nextFromEnrollParams(params: {
  course?: string;
  pathway?: string;
}): string | undefined {
  const slug = /^[a-z0-9-]{1,80}$/;
  if (params.course && slug.test(params.course))
    return `/dashboard/student/checkout/${params.course}`;
  if (params.pathway && slug.test(params.pathway)) return `/education/pathways/${params.pathway}`;
  return undefined;
}
