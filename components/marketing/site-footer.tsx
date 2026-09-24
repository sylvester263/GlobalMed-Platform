import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Wordmark } from "@/components/marketing/wordmark";
import { ClaimLine } from "@/components/motion/claim-line";
import { footerNav, legalNav, site } from "@/lib/site";

/** Footer (docs/05): links, contact, newsletter, legal, SylJo Tech credit. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-300 gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-6">
          <Wordmark inverted className="text-white" />
          <p className="max-w-sm">{site.description}</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-bright" />
              <span>
                US:{" "}
                <a href={site.contact.phoneUsHref} className="hover:text-white">
                  {site.contact.phoneUs}
                </a>
                <br />
                Pakistan:{" "}
                <a href={site.contact.phonePkHref} className="hover:text-white">
                  {site.contact.phonePk}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-teal-bright" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-bright" />
              <span>
                {site.contact.address.city}, Pakistan · serving practices across the United States
              </span>
            </li>
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <h2 className="mb-4 font-sans text-base font-semibold text-white">{col.title}</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-300 px-4 md:px-6">
        <div className="grid gap-6 border-t border-white/10 py-10 md:grid-cols-[1fr_1.2fr] md:items-center">
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

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-300 flex-col gap-4 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:px-6">
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
          <div className="flex flex-col gap-1 md:items-end">
            <p>
              © {year} {site.name}
            </p>
            <p>{site.credit}</p>
          </div>
        </div>
        <ClaimLine trigger="static" ticks={24} filled={1} className="opacity-30" />
      </div>
    </footer>
  );
}
