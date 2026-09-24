import { CalendarCheck, FileSearch, PhoneCall, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { AuditForm } from "@/components/marketing/audit-form";
import { PageHero, Section, StatsStrip } from "@/components/marketing/sections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Free Medical Billing Audit",
  description:
    "Book a free, no-obligation billing audit. We review a sample of your recent claims, denials and AR and show where your practice is losing revenue.",
  path: "/free-billing-audit",
});

const reviewed = [
  "A sample of recent claims and how fast they were paid",
  "Denials by reason and payer",
  "Accounts receivable by age",
  "Coding patterns for your top services",
];

const nextSteps = [
  {
    icon: PhoneCall,
    title: "We call you",
    body: "Within one business day, at the time you chose, to confirm the scope.",
  },
  {
    icon: FileSearch,
    title: "We review",
    body: "Through secure access we arrange together — never through this website.",
  },
  {
    icon: CalendarCheck,
    title: "You get the findings",
    body: "A short report and a call walking through the biggest fixes.",
  },
];

export default function FreeBillingAuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Free billing audit"
        title="Find out where your practice is losing revenue"
        intro="Tell us about your practice. We'll review a sample of your claims, denials and AR, then show you what we'd fix — at no cost and with no obligation."
        crumbs={[{ name: "Free billing audit", path: "/free-billing-audit" }]}
      />
      <Section className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl">What we review</h2>
            <ul className="flex flex-col gap-3">
              {reviewed.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 rounded-lg bg-mint p-5 text-teal-deep">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm">
              This form asks only for business details. We never collect patient information through
              this website; any claim data is reviewed later through secure, HIPAA-compliant access
              under a Business Associate Agreement.
            </p>
          </div>
        </div>
        <AuditForm />
      </Section>
      <Section tone="white" title="What happens next">
        <ol className="grid gap-8 md:grid-cols-3">
          {nextSteps.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-md bg-mint text-teal-deep">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-xl">
                <span className="sr-only">Step {i + 1}: </span>
                {title}
              </h3>
              <p className="text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </Section>
      <StatsStrip />
    </>
  );
}
