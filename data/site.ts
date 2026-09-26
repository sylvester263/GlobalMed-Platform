/**
 * Footer links the client fills in later (client, 2026-09-27). An icon or badge only shows
 * once its link is set; empty ones leave no gap.
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
  /** [CLIENT TO CONFIRM] Mobile app store listings, if GlobalMed publishes an app. */
  appLinks: {
    googlePlay: "",
    appStore: "",
  },
};

export type SocialKey = keyof typeof siteLinks.social;
