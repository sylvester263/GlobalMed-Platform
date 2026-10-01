import Image from "next/image";
import Link from "next/link";

import { glyphs } from "@/components/marketing/social-icons";
import { features } from "@/config/features";
import { siteLinks, type SocialKey } from "@/data/site";
import { aapcCertificationPath, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const focusRing =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Education", href: aapcCertificationPath },
  { label: "Services", href: "/services" },
  { label: "Terms and Policies", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
  // No consent manager yet (P8-6): the cookie policy explains the cookies and how to opt out.
  { label: "Cookie Settings", href: "/legal/cookie-policy" },
];

/** Reference order: YouTube, Instagram, Facebook, X, LinkedIn. */
const socialOrder: { key: SocialKey; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "x", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
];

/** Filled Instagram glyph for the compact footer (the extended footer's is outlined). */
const instagramFilled = (
  <path
    fillRule="evenodd"
    d="M7 0h10a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7Zm0 2.2A4.8 4.8 0 0 0 2.2 7v10A4.8 4.8 0 0 0 7 21.8h10a4.8 4.8 0 0 0 4.8-4.8V7A4.8 4.8 0 0 0 17 2.2H7Zm5 3.64a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6.4-3.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88Z"
  />
);

/**
 * Inline list with thin vertical separators. From 768px up the separators are the items'
 * left borders; the list is shifted left by one separator inside a clipping box, so the
 * separator before the first item of every line is hidden. On phones the items wrap
 * centred with no separators.
 */
function SeparatedList({
  items,
  className,
  itemClassName,
}: {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className="md:overflow-hidden">
      <ul
        className={cn(
          "flex flex-wrap justify-center gap-x-4 gap-y-2 md:-ml-[13px] md:justify-start md:gap-x-0",
          className,
        )}
      >
        {items.map((item, i) => (
          <li key={i} className={cn("md:border-l md:border-white/35 md:px-3", itemClassName)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Official badge artwork (Apple, Google): black, unaltered, 50px tall and at most 160px wide. */
export const appBadges = [
  {
    key: "appStore",
    src: "/images/badges/app-store-badge.svg",
    width: 120,
    height: 40,
    alt: "Download on the App Store",
    label: "Download the GlobalMed app on the App Store",
  },
  {
    key: "googlePlay",
    src: "/images/badges/google-play-badge.png",
    width: 564,
    height: 168,
    alt: "Get it on Google Play",
    label: "Download the GlobalMed app on Google Play",
  },
] as const;

/**
 * An app store badge (client, 2026-09-28). With a link it opens the store in a new tab.
 * Without one it still shows, but as a non-link with aria-disabled and a "Coming soon"
 * tooltip (on hover and keyboard focus) — never an empty or "#" link.
 */
export function AppBadge({ badge, href }: { badge: (typeof appBadges)[number]; href: string }) {
  const art = (
    // Unoptimised: the artwork is tiny, and Apple's vector badge must stay exact.
    <Image
      src={badge.src}
      alt=""
      width={badge.width}
      height={badge.height}
      unoptimized
      className="h-full w-auto max-w-full object-contain"
    />
  );
  const box = cn(
    // 50px tall and at most 160px wide; on very narrow phones both shrink to stay side by side.
    "relative flex h-[50px] max-w-[160px] shrink-0 items-center max-md:min-w-0 max-md:shrink",
    focusRing,
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={badge.label}
        className={cn(box, "transition-opacity hover:opacity-85")}
      >
        {art}
      </a>
    );
  }

  const tipId = `app-badge-${badge.key}-soon`;
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-label={badge.alt}
      aria-describedby={tipId}
      tabIndex={0}
      className={cn(box, "group cursor-default")}
    >
      {art}
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-white px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Coming soon
      </span>
    </span>
  );
}

/**
 * AAPC-style compact footer (client, 2026-09-27): one deep-navy band with the logo, links,
 * contact line and fine print on the left, social icons and app badges on the right.
 * Uses the shared fluid container (client, 2026-09-28), so it lines up with the header and
 * page content. ≥1280px one row; 768–1279px two rows, left-aligned; phones stacked and centred in the
 * order logo → social → badges → links → contact → fine print (CSS `order` with
 * `display: contents` on the two blocks). Below 1280px the bottom padding reserves the
 * 72px floating help button's height, so it never covers links, icons or badges.
 */
export function CompactFooter() {
  const { contact } = site;
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`;
  const socials = socialOrder.filter((s) => siteLinks.social[s.key]);
  // 44px tap targets on phones and tablets; compact rows from 1024px (mouse).
  const linkClass = cn(
    "inline-flex min-h-11 min-w-11 items-center justify-center hover:text-white hover:underline lg:min-h-6 lg:min-w-0 lg:pointer-coarse:min-h-11 lg:pointer-coarse:min-w-11",
    focusRing,
  );

  return (
    <footer className="bg-navy-deep text-footer-link cv-auto">
      <div className="container-fluid flex flex-col items-center gap-5 pt-9 pb-[108px] text-center md:items-start md:gap-6 md:text-left xl:flex-row xl:items-center xl:justify-between xl:pb-9">
        {/* Left block */}
        <div className="contents md:flex md:flex-col md:items-start md:gap-3.5">
          <Link
            prefetch={false}
            href="/"
            aria-label="GlobalMed home"
            className={cn(
              "order-1 inline-flex rounded-[10px] bg-white px-[14px] py-2 md:order-none",
              focusRing,
            )}
          >
            <Image
              src="/images/brand/globalmed-logo-horizontal.png"
              alt="GlobalMed Transcriptions logo"
              width={800}
              height={174}
              sizes="203px"
              className="h-11 w-auto"
            />
          </Link>

          <nav aria-label="Footer" className="order-4 md:order-none">
            <SeparatedList
              className="text-[15px]"
              items={[
                // The copyright moved to the fine print (2026-10-01), so it appears once.
                ...(features.footerTrademarkNote
                  ? [<span key="copy">© 2026 GlobalMed Transcriptions</span>]
                  : []),
                ...footerLinks.map((link) => (
                  <Link prefetch={false} key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )),
              ]}
            />
          </nav>

          <div className="order-5 text-footer-muted md:order-none">
            <SeparatedList
              className="text-[13px]"
              items={[
                <a key="phone" href={contact.phoneHref} className={linkClass}>
                  {contact.phone}
                </a>,
                <a
                  key="wa"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp {contact.whatsappDisplay}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>,
                <a
                  key="mail"
                  href={`mailto:${contact.email}`}
                  className={cn(linkClass, "break-all")}
                >
                  {contact.email}
                </a>,
                <span key="addr">44 Dilkusha Garden, Model Town, Lahore</span>,
              ]}
            />
          </div>

          <p className="order-6 text-xs text-footer-fine md:order-none">
            {features.footerTrademarkNote
              ? "CPC® and CPB® are registered trademarks of AAPC."
              : "© 2026 GlobalMed Transcriptions"}{" "}
            · {site.credit}
          </p>
        </div>

        {/* Right block: social icons (once linked), then the app badges (always shown). */}
        <div className="contents md:flex md:flex-wrap md:items-center md:gap-8">
          {socials.length > 0 && (
            <ul
              className="order-2 flex items-center gap-4 md:order-none"
              aria-label="GlobalMed on social media"
            >
              {socials.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={siteLinks.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GlobalMed on ${label} (opens in a new tab)`}
                    className={cn(
                      "flex p-[5px] text-white transition-colors hover:text-sky",
                      focusRing,
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-[34px]"
                    >
                      {key === "instagram" ? instagramFilled : glyphs[key]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="order-3 flex w-full justify-center gap-5 md:order-none md:w-auto">
            {appBadges.map((badge) => (
              <AppBadge key={badge.key} badge={badge} href={siteLinks.appLinks[badge.key]} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
