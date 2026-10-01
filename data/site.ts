/**
 * The office address (client, 2026-10-01): the only copy on the site. The footer, Contact page,
 * llms.txt, legal pages ({{address}} in content/legal), JSON-LD and the chatbot knowledge all
 * read it from here.
 */
export const address = {
  lines: ["44 Dilkusha Garden", "Near S Block Ext.", "Model Town, Lahore", "PO Box 54700"],
  oneLine: "44 Dilkusha Garden, Near S Block Ext., Model Town, Lahore, PO Box 54700",
  /** Structured parts for schema.org PostalAddress. */
  postal: {
    streetAddress: "44 Dilkusha Garden, Near S Block Ext., Model Town",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54700",
    addressCountry: "PK",
  },
} as const;

/**
 * Email and mobile shown in the top contact bar, the footer and the contact page
 * (2026-10-02). lib/site.ts reads them from here, so there is one copy.
 */
export const contactLinks = {
  email: "info@globalmedtranscriptions.com",
  /** Mobile / WhatsApp number. */
  mobile: { display: "+92 300 419 8760", href: "tel:+923004198760" },
} as const;

/**
 * Links the client supplies (client, 2026-09-27). A social icon only shows once its link is
 * set; empty ones leave no gap. The top bar, the footer and the Organization JSON-LD
 * (sameAs) all read these.
 */
export const siteLinks = {
  /** Social profile URLs (client, 2026-10-02). YouTube and X: none yet. */
  social: {
    facebook: "https://www.facebook.com/GlobalMedPakistan/",
    linkedin: "https://www.linkedin.com/in/globalmed-transcriptions/",
    instagram: "https://www.instagram.com/globalmedtranscriptions/",
    youtube: "",
    x: "",
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

/** Order of the social icons everywhere (client, 2026-10-02). */
export const socialOrder: { key: SocialKey; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "x", label: "X" },
];
