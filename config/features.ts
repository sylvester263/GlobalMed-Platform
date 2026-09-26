/**
 * Feature flags for GlobalMed's own education and learning platform (client decision,
 * 2026-09-26). GlobalMed is AAPC's Strategic Partner in Pakistan: AAPC faculty teach AAPC's
 * online courses and AAPC awards the certification. GlobalMed's own courses and learning
 * platform are future scope, so they are switched off here, never deleted.
 *
 * When a flag is false, next.config.ts redirects its routes to the AAPC Certification page,
 * and nav, footer, sitemap, llms.txt and the chatbot knowledge leave its links out.
 * Plain values with no imports, so next.config.ts can read this file.
 */
export const features = {
  /** Hidden at client request — GlobalMed education plans are future scope. GlobalMed's own course catalog, course pages and search/filters. */
  globalmedCourses: false,
  /** Hidden at client request — GlobalMed education plans are future scope. The /education landing page for GlobalMed's own school. */
  educationLanding: false,
  /** Hidden at client request — GlobalMed education plans are future scope. GlobalMed certification pathways. */
  pathways: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Upcoming batches page and batch cards. */
  batches: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Corporate training page. */
  corporateTraining: false,
  /** Hidden at client request — GlobalMed education plans are future scope. GlobalMed's own exam-preparation page. */
  examPrep: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Onsite, in-person, classroom and Lahore-class training. */
  onsiteTraining: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Training figures (students trained, batches, instructors). */
  trainingStats: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Course player (/learn), student learning dashboard, quizzes and mock exams, student sign-up. */
  learningPlatform: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Instructor dashboard (course builder, Q&A, students, live batches). */
  instructorDashboard: false,
  /** Hidden at client request — GlobalMed education plans are future scope. GlobalMed certificates and the public Verify a Certificate page. */
  certificates: false,
  /** Hidden at client request — GlobalMed education plans are future scope. Online course checkout/cart (Stripe) and student orders; replaced by the AAPC registration form. */
  onlineCheckout: false,
  /** Hidden at client request — GlobalMed education plans are future scope. The "exam passed" celebration (DM-6, not built yet). */
  examPassedCelebration: false,
  /** Hidden at client request — GlobalMed education plans are future scope. EducationalOrganization and Course-provider JSON-LD. */
  educationSchema: false,
  /**
   * Hidden at client request — GlobalMed education plans are future scope. Public "Log in" /
   * "Member Login" links (header, mobile menu, footer). /login itself stays reachable for
   * Admin and Sales staff.
   */
  publicLogin: false,
} as const;

export type FeatureFlag = keyof typeof features;

/** The page every hidden education route redirects to. */
export const hiddenEducationRedirect = "/education/aapc-certification-pakistan";
