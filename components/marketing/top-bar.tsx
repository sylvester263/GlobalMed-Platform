import { Lock, Mail, Phone } from "lucide-react";

import { glyphs, socialHoverClass } from "@/components/marketing/social-icons";
import { features } from "@/config/features";
import {
  contactLinks,
  doctorPortalAriaLabel,
  doctorPortalUrl,
  siteLinks,
  socialOrder,
} from "@/data/site";
import { cn } from "@/lib/utils";

// 44px tap areas; navy on sky (#17265C on #51ACE3, 5.9:1).
const itemClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy-deep md:min-w-0";

/**
 * Top contact bar (client, 2026-10-02), above the main nav on every public page. It scrolls
 * away; the nav below stays sticky. Email and mobile on the left; social icons on the right
 * (only those with a link in data/site.ts). The Doctor Login pill (client, 2026-10-07) is
 * hidden by `features.topbarDoctorLogin` now that "Client Login" is in the main nav.
 * Phones: icons centred in one row.
 */
export function TopBar() {
  const socials = socialOrder.filter((s) => siteLinks.social[s.key]);
  return (
    <div className="bg-sky text-[15px] text-navy-deep">
      <div className="container-fluid flex h-11 items-center justify-center gap-2 md:justify-between">
        <ul aria-label="Contact GlobalMed" className="flex items-center gap-2 md:gap-0">
          <li>
            <a href={`mailto:${contactLinks.email}`} className={itemClass}>
              <Mail aria-hidden="true" className="size-[18px] shrink-0" />
              <span className="sr-only md:not-sr-only">{contactLinks.email}</span>
            </a>
          </li>
          <li
            aria-hidden="true"
            className="mx-3 hidden h-5 w-px bg-[rgb(23_38_92/0.25)] md:block"
          />
          <li>
            <a href={contactLinks.mobile.href} className={itemClass}>
              <Phone aria-hidden="true" className="size-[18px] shrink-0" />
              <span className="sr-only md:not-sr-only">{contactLinks.mobile.display}</span>
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          {/* 32px white pill inside a 44px tap area; opens the doctor upload app in a new tab. */}
          {features.topbarDoctorLogin && (
            <a
              href={doctorPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={doctorPortalAriaLabel}
              className="group inline-flex min-h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-navy-deep"
            >
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold whitespace-nowrap text-navy-deep shadow-sm transition-colors group-hover:bg-navy-deep group-hover:text-white">
                <Lock aria-hidden="true" className="size-4 shrink-0" />
                Doctor Login
              </span>
            </a>
          )}
          {socials.length > 0 && (
            <ul aria-label="GlobalMed on social media" className="flex items-center">
              {socials.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={siteLinks.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GlobalMed on ${label}`}
                    className={cn(
                      itemClass,
                      "min-w-11 hover:no-underline md:min-w-11",
                      socialHoverClass,
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-[18px]"
                    >
                      {glyphs[key]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
