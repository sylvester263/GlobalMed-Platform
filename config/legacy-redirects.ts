/**
 * 301s from the old WordPress site (launch, 2026-11-04). The URL list comes from the old site's
 * own sitemaps (page, post, landing-page, teams, portfolios, testimonials, categories), read
 * from its copy on the doctor-portal host. Old URLs had a trailing slash; Next strips it with a
 * 308 first, so each source here is the bare path.
 * Theme demo pages that shipped with the WordPress theme (portfolios, one-pages, sample
 * services) go to the closest real page so stray links and old index entries don't 404.
 * Plain values with no imports, so next.config.ts can load it.
 */
export type LegacyRedirect = { source: string; destination: string; statusCode: 301 };

const map: Record<string, string> = {
  "/about-us": "/about",
  "/our-team": "/about/team",
  "/teams/:slug*": "/about/team",
  "/team-category/:slug*": "/about/team",
  "/team-slider": "/about/team",
  "/partners": "/about",
  "/contact-us": "/contact",
  "/help": "/contact",
  "/transcriptionists": "/careers",
  "/medical-transcription-services": "/services/medical-transcription",
  "/legal-medical-transcription": "/services/medical-transcription",
  "/insurance-media-and-business-transcription": "/services/medical-transcription",
  "/types-of-transcription-services": "/services/medical-transcription",
  "/category/medical-transcription": "/services/medical-transcription",
  "/gmt-blog": "/blog",
  "/feed": "/blog",
  "/portal": "/app/doctor-login",
  // WordPress theme demo content.
  "/services/cryptocurrency": "/services",
  "/services/cloud-computing": "/services",
  "/services/security-enhanced": "/services",
  "/services/estate-planning": "/services",
  "/services/project-reporting": "/services",
  "/services/profit-planning": "/services",
  "/services/reports-analysis": "/services",
  "/services/business-analysis": "/services",
  "/portfolios": "/services",
  "/portfolios/:slug*": "/services",
  "/portfolios-:n": "/services",
  "/portfolio": "/services",
  "/portfolio-category/:slug*": "/services",
  "/onepage-:n": "/",
  "/backup-home": "/",
  "/faq-elements": "/faq",
  "/elements__trashed/:slug*": "/",
  "/rs-table": "/",
  "/testimonials/:slug*": "/about",
  "/testimonial-category/:slug*": "/about",
  // WordPress admin and login: gone with the old site.
  "/wp-login.php": "/",
  "/wp-admin": "/",
  "/wp-admin/:path*": "/",
};

export const legacyRedirects: LegacyRedirect[] = Object.entries(map).map(
  ([source, destination]) => ({ source, destination, statusCode: 301 }),
);

/**
 * The doctor file-upload app (PHP) runs on its own Hostinger site, not on this Node app, so
 * /app/... on the main domain forwards to it. Temporary (307): it moves to a subdomain of the
 * main domain once one is set up in hPanel, and only this constant changes then.
 */
export const doctorPortalOrigin = "https://peachpuff-crow-921478.hostingersite.com";

export const doctorPortalRedirects = [
  { source: "/app", destination: `${doctorPortalOrigin}/app/`, permanent: false },
  { source: "/app/:path*", destination: `${doctorPortalOrigin}/app/:path*`, permanent: false },
] as const;
