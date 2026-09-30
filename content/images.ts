/**
 * Photos placed on the site (pm/IMAGE_PLAN.md). Each `src` is the WebP master made by
 * scripts/optimize-images.mjs from the client's original next to it; width/height are the
 * master's, so next/image reserves the right space before it loads.
 */
export type SiteImage = { src: string; alt: string; width: number; height: number };

const hero = (src: string, alt: string): SiteImage => ({ src, alt, width: 1600, height: 1200 });
const cover = (src: string, alt: string): SiteImage => ({ src, alt, width: 1920, height: 1080 });

/** Right-hand photo in the page heading band (PageHero). */
export const heroImages = {
  aapcCertification: hero(
    "/images/heroes/aapc-certification.webp",
    "Young man studying for a medical coding exam at a laptop at home, with reference books beside him",
  ),
  courseCpc: hero(
    "/images/heroes/course-cpc.webp",
    "Woman in a white dupatta following an online medical coding lesson on her laptop at home",
  ),
  courseCpb: hero(
    "/images/heroes/course-cpb.webp",
    "Man in a light blue shirt learning medical billing on a video call, with a calculator and notebook",
  ),
  courseCpcCpb: hero(
    "/images/heroes/course-cpc-cpb.webp",
    "Woman in a navy hijab following an online lesson at her home desk by the window",
  ),
  freeBillingAudit: hero(
    "/images/heroes/free-billing-audit.webp",
    "Billing specialist and practice manager reviewing a revenue chart together on a laptop",
  ),
  services: hero(
    "/images/heroes/services.webp",
    "GlobalMed team members with headsets working together in a bright open-plan office",
  ),
  careers: hero(
    "/images/heroes/careers.webp",
    "Team lead welcoming two new colleagues beside a desk in a modern Lahore office",
  ),
} satisfies Record<string, SiteImage>;

/** Hero photo per service page. Three reuse the home "Our Services" card photos. */
export const serviceHeroImages: Record<string, SiteImage> = {
  "medical-billing": hero(
    "/images/heroes/medical-billing.webp",
    "Medical biller in a light blue dupatta working on claims at a laptop in the office",
  ),
  "medical-coding": hero(
    "/images/heroes/medical-coding.webp",
    "Medical coder with glasses working at a dual-monitor desk, a reference book beside the keyboard",
  ),
  "denial-management": hero(
    "/images/heroes/denial-management.webp",
    "Accounts receivable specialist in a navy hijab on a follow-up call with a headset",
  ),
  "medical-transcription": hero(
    "/images/services/medical-transcription.webp",
    "Medical transcriptionist in a hijab with a headset typing at her workstation",
  ),
  "ai-clinical-documentation": hero(
    "/images/services/ai-clinical-documentation.webp",
    "Laptop showing a voice waveform beside a tablet, as an editor reviews an AI-generated draft",
  ),
  "revenue-cycle-management": hero(
    "/images/services/revenue-cycle-management.webp",
    "Revenue cycle specialist checking a claim against a dashboard of charts on his laptop",
  ),
};

/** Blog post covers, by post slug (post page and blog cards). */
export const blogCovers: Record<string, SiteImage> = {
  "why-claims-get-denied": cover(
    "/images/blog/why-claims-get-denied.webp",
    "Hands sorting claim folders beside a laptop on an office desk",
  ),
  "modifier-25-explained": cover(
    "/images/blog/modifier-25-explained.webp",
    "Medical coder in a white dupatta checking a same-day visit on her laptop",
  ),
  "start-medical-coding-career-pakistan": cover(
    "/images/blog/start-medical-coding-career-pakistan.webp",
    "Young man at a home desk with an online lesson on his laptop, looking out of the window",
  ),
  "clean-claim-rate": cover(
    "/images/blog/clean-claim-rate.webp",
    "Laptop showing a rising bar and line chart on a clean office desk",
  ),
};

/** Guide card photos, by guide id (content/company.ts `guides`). */
export const guideImages: Record<string, SiteImage> = {
  "clean-claim-checklist": hero(
    "/images/guides/clean-claim-checklist.webp",
    "Tidy desk from above with a closed laptop, blank folders and a clipboard",
  ),
  "denial-reason-codes": hero(
    "/images/guides/denial-reason-codes.webp",
    "Revenue cycle analyst sorting colour-coded folders at his desk",
  ),
  "coding-career-90-day-plan": hero(
    "/images/guides/coding-career-90-day-plan.webp",
    "Laptop with an online lesson and an open planner on a home desk by the window",
  ),
};

/** Home "Get Trained by AAPC Instructors" band background (behind a navy overlay). */
export const aapcBandBackground: SiteImage = {
  src: "/images/backgrounds/home-aapc-band.webp",
  alt: "",
  width: 2560,
  height: 1086,
};
