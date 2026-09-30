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
  /** Hidden at client request — AAPC-style compact footer. Set true to restore. Newsletter strip + 5-column footer. */
  footerExtended: false,
  /**
   * Hidden at client request — the floating help button (components/marketing/help-button.tsx)
   * replaces the floating WhatsApp button. Set true to restore.
   */
  floatingWhatsApp: false,
  /**
   * Hidden at client request — replaced by the "Our Services" sticky cards directly after the
   * hero (2026-09-28), so services don't appear twice. The older, shorter "Medical billing
   * services for US practices" list lower on the home page. Set true to restore.
   */
  homeServicesOverviewOld: false,
  /**
   * Hidden at client request — "Address" replaces "City" on the "Register for AAPC Training"
   * form (2026-09-28). The City field and its schema rule stay in the code. Set true to
   * show City again (it is then required, as before).
   */
  registrationCityField: false,
  /**
   * Hidden at client request (2026-09-28) — ticked progress line removed site-wide. Set true
   * to restore. Off: ClaimLine, ClaimProgress's line and PathwayLine render nothing; the hero
   * slider keeps its dots, "How it works" shows numbered steps, forms show "Step x of y" with
   * a plain bar (ADR-028).
   */
  claimLine: false,
  /**
   * Hidden at client request (2026-09-29) — replaced by the new four-part "Our Story" section
   * (content/about-story.ts). The previous About "Our Story" and "What We Do" paragraphs.
   * Set true to restore.
   */
  aboutStoryOld: false,
  /**
   * Hidden at client request (2026-09-29) — the founder already appears in the new "Our Story"
   * (photo, name and role). The standalone About Leadership card (Riaz Naveed photo, role and
   * bio) shown below "Our Story". Set true to restore.
   */
  aboutLeaderCard: false,
  /**
   * Hidden at client request (2026-09-29) — the three "Instructor photo" slots in the "Get
   * Trained by AAPC Instructors" band (home, AAPC Certification page). The band's text, points
   * and button stay and span the full width. Set true to restore.
   */
  instructorPhotos: false,
  /**
   * Hidden at client request (2026-09-29) — replaced by "Investing in Pakistan's Healthcare
   * Workforce" in the new "Our Story". The previous "Strategic Partnership" block on the About
   * page. Set true to restore.
   */
  aboutPartnershipBlockOld: false,
  /**
   * Hidden at client request (2026-09-30) — the previous "What's included" lists on the CPC®,
   * CPB® and CPC® + CPB® pages (Practicode, Codify, practice tests, 1/2 off prerequisite…),
   * replaced by "Package Includes" under the price. Set true to restore a course's old list.
   */
  cpcIncludedLegacy: false,
  cpbIncludedLegacy: false,
  dualIncludedLegacy: false,
  /**
   * Hidden (2026-09-30) — the old comparison rows (practice tests, Practicode, Codify, Denials
   * guide, 1/2 off prerequisite) and the old membership/exam values on the AAPC page. The
   * table now has one row per "Package Includes" item. Set true to restore.
   */
  comparisonLegacyRows: false,
  /**
   * Hidden (2026-09-30) — the previous four-card "Why register through GlobalMed" on the home
   * page, replaced by the client's new text. Set true to restore it.
   */
  whyRegisterLegacy: false,
  /**
   * Hidden (2026-09-30) — "practice tests" mentions outside the package lists: the band point
   * "Official AAPC exams and practice tests" and the "How it works" exam-step caption. The
   * client's packages no longer include practice tests; replacement text pending
   * (pm/CLIENT_INPUTS_NEEDED.md). Set true to restore.
   */
  practiceTestsMentions: false,
} as const;

export type FeatureFlag = keyof typeof features;

/** The page every hidden education route redirects to. */
export const hiddenEducationRedirect = "/education/aapc-certification-pakistan";
