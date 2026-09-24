import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero, Section } from "@/components/marketing/sections";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact GlobalMed",
  description:
    "Contact GlobalMed about billing and coding services or courses. Phone, email, WhatsApp and office hours in US Eastern and Pakistan time.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our team"
        intro="Questions about services for your practice, or about our courses? Send a message and we'll reply within one business day."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />
      <Section className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-5">
            <li className="flex gap-3">
              <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Phone</p>
                <p>
                  US:{" "}
                  <a
                    href={site.contact.phoneUsHref}
                    className="text-primary underline underline-offset-4"
                  >
                    {site.contact.phoneUs}
                  </a>
                </p>
                <p>
                  Pakistan:{" "}
                  <a
                    href={site.contact.phonePkHref}
                    className="text-primary underline underline-offset-4"
                  >
                    {site.contact.phonePk}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Email</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-primary underline underline-offset-4"
                >
                  {site.contact.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Hours</p>
                <p>US: {site.contact.hoursUs}</p>
                <p>Pakistan: {site.contact.hoursPk}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Office</p>
                <p>
                  {site.contact.address.street}
                  <br />
                  {site.contact.address.city}, Pakistan
                </p>
                <p className="text-sm text-muted-foreground">
                  Map added once the address is confirmed.
                </p>
              </div>
            </li>
          </ul>
          <WhatsAppButton placement="contact_page" />
        </div>
        <ContactForm />
      </Section>
    </>
  );
}
