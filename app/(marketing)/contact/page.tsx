import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero, Section } from "@/components/marketing/sections";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact GlobalMed",
  description:
    "Contact GlobalMed about transcription, billing and coding services or courses. Phone +92 42 3594 6342, WhatsApp, email, and our Model Town, Lahore office. Open 24/7.",
  path: "/contact",
});

const linkClass = "text-primary underline underline-offset-4";

export default function ContactPage() {
  const { contact } = site;
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
                <a href={contact.phoneHref} className={linkClass}>
                  {contact.phone}
                </a>
                {contact.usLineConfirmed && (
                  <p>
                    US:{" "}
                    <a href={contact.phoneUsHref} className={linkClass}>
                      {contact.phoneUs}
                    </a>
                  </p>
                )}
              </div>
            </li>
            <li className="flex gap-3">
              <MessageCircle aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a
                  href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {contact.whatsappDisplay}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Email</p>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Hours</p>
                <p>{contact.hours}</p>
                {contact.usLineConfirmed && <p>US line: {contact.hoursUs}</p>}
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal" />
              <div>
                <p className="font-semibold">Office</p>
                <address className="not-italic">
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.poBox}, Pakistan
                </address>
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
