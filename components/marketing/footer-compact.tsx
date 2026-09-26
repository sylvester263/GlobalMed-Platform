import Image from "next/image";
import Link from "next/link";

import { glyphs } from "@/components/marketing/social-icons";
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

const googlePlayIcon = (
  <path d="M22 13.3 18.1 15.5l-3.5-3.5 3.5-3.5L22 10.7a1.5 1.5 0 0 1 0 2.6ZM1.3.9a1.5 1.5 0 0 0-.1.6v21a1.5 1.5 0 0 0 .1.6L12.5 12 1.3.9Zm12.2 10.1 3.3-3.2L3.5.2A1.5 1.5 0 0 0 2.5 0l11 11Zm0 2L2.5 24a1.5 1.5 0 0 0 1-.2l13.3-7.5-3.3-3.3Z" />
);

const appleIcon = (
  <path d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.21 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09Zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.71-.69 3.55-1.7Z" />
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

function AppBadge({
  href,
  icon,
  small,
  big,
}: {
  href: string;
  icon: React.ReactNode;
  small: string;
  big: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-[50px] w-[160px] items-center gap-2.5 rounded-lg bg-black px-3 text-white ring-1 ring-white/30 hover:ring-white",
        focusRing,
      )}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7 shrink-0">
        {icon}
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px]">{small}</span>
        <span className="text-base font-semibold">{big}</span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * AAPC-style compact footer (client, 2026-09-27): one deep-navy band with the logo, links,
 * contact line and fine print on the left, social icons and app badges on the right.
 * ≥1280px one row; 768–1279px two rows, left-aligned; phones stacked and centred in the
 * order logo → social → badges → links → contact → fine print (CSS `order` with
 * `display: contents` on the two blocks). Below 1280px the bottom padding reserves the
 * 72px floating help button's height, so it never covers links, icons or badges.
 */
export function CompactFooter() {
  const { contact } = site;
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`;
  const socials = socialOrder.filter((s) => siteLinks.social[s.key]);
  const { googlePlay, appStore } = siteLinks.appLinks;
  const hasBadges = Boolean(googlePlay || appStore);
  const linkClass = cn("hover:text-white hover:underline", focusRing);

  return (
    <footer className="bg-navy-deep text-footer-link">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-5 px-5 pt-9 pb-[108px] text-center md:items-start md:gap-6 md:px-12 md:text-left xl:flex-row xl:items-center xl:justify-between xl:px-[150px] xl:pb-9">
        {/* Left block */}
        <div className="contents md:flex md:flex-col md:items-start md:gap-3.5">
          <Link
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
              className="h-[52px] w-auto"
            />
          </Link>

          <nav aria-label="Footer" className="order-4 md:order-none">
            <SeparatedList
              className="text-[15px]"
              items={[
                <span key="copy">© 2026 GlobalMed Transcriptions</span>,
                ...footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClass}>
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
            CPC® and CPB® are registered trademarks of AAPC. · {site.credit}
          </p>
        </div>

        {/* Right block: shown only when there is at least one icon or badge */}
        {(socials.length > 0 || hasBadges) && (
          <div className="contents md:flex md:flex-wrap md:items-center md:gap-8">
            {socials.length > 0 && (
              <ul
                className="order-2 flex items-center gap-[26px] md:order-none"
                aria-label="GlobalMed on social media"
              >
                {socials.map(({ key, label }) => (
                  <li key={key}>
                    <a
                      href={siteLinks.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GlobalMed on ${label} (opens in a new tab)`}
                      className={cn("flex text-white transition-colors hover:text-sky", focusRing)}
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
            {hasBadges && (
              <div className="order-3 flex flex-wrap justify-center gap-5 md:order-none">
                {googlePlay && (
                  <AppBadge
                    href={googlePlay}
                    icon={googlePlayIcon}
                    small="Available on the"
                    big="Google Play"
                  />
                )}
                {appStore && (
                  <AppBadge
                    href={appStore}
                    icon={appleIcon}
                    small="Download on the"
                    big="App Store"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
