/**
 * Footer links the client fills in later (client, 2026-09-27). A social icon only shows once
 * its link is set; empty ones leave no gap.
 */
export const siteLinks = {
  /** [CLIENT TO CONFIRM] Social profile URLs. */
  social: {
    youtube: "",
    instagram: "",
    facebook: "",
    x: "",
    linkedin: "",
  },
  /**
   * GlobalMed mobile app store listings (client, 2026-09-28; Google Play supplied 2026-10-01).
   * Both badges always show in the footer; while a link is empty its badge is a non-clickable
   * "Coming soon" badge, and it becomes a normal link once the URL is added here.
   */
  appLinks: {
    googlePlay: "https://play.google.com/store/apps/details?id=com.globalmed_transcriptions.org",
    // [CLIENT TO CONFIRM] App Store listing.
    appStore: "",
  },
};

export type SocialKey = keyof typeof siteLinks.social;
