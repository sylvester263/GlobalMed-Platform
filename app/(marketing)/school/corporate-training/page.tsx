import { BarChart3, Building2, Settings2, UsersRound } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero, Section } from "@/components/marketing/sections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Corporate Billing and Coding Training",
  description:
    "Train your billing and coding team with GlobalMed: group enrollment, progress reporting for managers and custom content for your specialties.",
  path: "/education/corporate-training",
});

const benefits = [
  {
    icon: UsersRound,
    title: "Group enrollment",
    body: "Enroll your whole team at once with volume pricing.",
  },
  {
    icon: BarChart3,
    title: "Manager reporting",
    body: "See each learner's progress, quiz scores and certificates.",
  },
  {
    icon: Settings2,
    title: "Tailored content",
    body: "Add modules for your specialties, payers and internal workflows. [CLIENT TO CONFIRM]",
  },
  {
    icon: Building2,
    title: "Onboarding for new hires",
    body: "A consistent foundation for every new biller and coder.",
  },
];

export default function CorporateTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate training"
        title="Train your billing team on the workflows that matter"
        intro="Billing companies and practices use GlobalMed courses to onboard new hires and upskill their teams."
        crumbs={[
          { name: "Education", path: "/education" },
          { name: "Corporate training", path: "/education/corporate-training" },
        ]}
      />
      <Section title="What you get">
        <ul className="grid gap-8 md:grid-cols-2">
          {benefits.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-mint text-teal-deep">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-1 text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="white" title="Tell us about your team" className="max-w-3xl">
        <ContactForm defaultInterest="Corporate training" />
      </Section>
    </>
  );
}
