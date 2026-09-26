import { ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { CertificationPriceCard } from "@/components/marketing/certification-price-card";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { SocialIcons } from "@/components/marketing/social-icons";
import { Wordmark } from "@/components/marketing/wordmark";
import { ClaimLine } from "@/components/motion/claim-line";
import { aapcCertificationPath, footerNav, legalNav, postalAddress, site } from "@/lib/site";

const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber.replace(/\D/g, "")}`;

/**
 * A footer column: an open list from md up, a native <details> accordion on phones (no JS).
 * The two copies never show together, and display:none keeps the hidden one out of the
 * accessibility tree.
 */
function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <details className="group border-b border-white/15 md:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold text-white [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
          />
        </summary>
        <div className="pb-5">{children}</div>
      </details>
      <div className="hidden md:block">
        <h2 className="mb-4 font-sans text-base font-semibold text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="hover:text-white hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContactList() {
  const { contact } = site;
  const iconClass = "mt-0.5 size-4 shrink-0 text-sky";
  return (
    <ul className="flex flex-col gap-3 text-sm not-italic">
      <li className="flex items-start gap-2">
        <MapPin aria-hidden="true" className={iconClass} />
        <span>
          <span className="sr-only">Address: </span>
          {postalAddress}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Phone aria-hidden="true" className={iconClass} />
        <span>
          Phone:{" "}
          <a href={contact.phoneHref} className="hover:text-white hover:underline">
            {contact.phone}
          </a>
        </span>
      </li>
      <li className="flex items-start gap-2">
        <MessageCircle aria-hidden="true" className={iconClass} />
        <span>
          WhatsApp:{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:underline"
          >
            {contact.whatsappDisplay}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Mail aria-hidden="true" className={iconClass} />
        <a href={`mailto:${contact.email}`} className="break-all hover:text-white hover:underline">
          {contact.email}
        </a>
      </li>
      <li className="flex items-start gap-2">
        <Clock aria-hidden="true" className={iconClass} />
        <span>Hours: {contact.hours}</span>
      </li>
    </ul>
  );
}

/** Footer (client review 2026-09-25): newsletter strip, five columns, legal bar, SylJo Tech credit. */
export function SiteFooter() {
  return (
    <footer className="bg-primary text-white/85">
      {/* Newsletter, full width above the columns */}
      <div className="border-b border-white/15">
        <div className="mx-auto grid max-w-300 gap-6 px-4 py-10 md:grid-cols-[1fr_1.2fr] md:items-center md:px-6">
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">
              Billing and coding insights, monthly
            </h2>
            <p className="mt-1 text-sm">
              Denial trends, coding updates and course news. Unsubscribe any time.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto grid max-w-300 gap-10 px-4 py-14 md:grid-cols-2 md:gap-12 md:px-6 lg:grid-cols-[1.35fr_1fr_1.15fr_1.25fr_1.35fr] lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="GlobalMed home" className="self-start rounded-md">
            <Wordmark size="footer" onDark />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed">{site.tagline}</p>
          <SocialIcons />
        </div>

        {footerNav.map((col) => (
          <nav key={col.title} aria-label={`${col.title} links`}>
            <FooterColumn title={col.title}>
              <LinkList links={col.links} />
            </FooterColumn>
          </nav>
        ))}

        <div className="flex flex-col gap-4 md:order-last lg:order-none">
          <h2 className="font-sans text-base font-semibold text-white">Certification Pricing</h2>
          <CertificationPriceCard href={`${aapcCertificationPath}#reserve-seat`} onDark />
        </div>

        <address className="not-italic">
          <FooterColumn title="Contact Info">
            <ContactList />
          </FooterColumn>
        </address>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-300 flex-col gap-4 px-4 py-6 pr-20 text-sm md:px-6 md:pr-20 lg:flex-row lg:items-center lg:justify-between">
          <p>© GlobalMed Transcriptions. All Rights Reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-1 lg:items-end">
            <p className="text-xs">CPC® and CPB® are registered trademarks of AAPC.</p>
            <p>{site.credit}</p>
          </div>
        </div>
        <ClaimLine trigger="static" ticks={24} filled={1} className="opacity-30" />
      </div>
    </footer>
  );
}
