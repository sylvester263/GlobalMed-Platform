import type { Metadata } from "next";

import { CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { team } from "@/content/company";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Our Team",
  description:
    "Meet the GlobalMed leadership team running revenue-cycle services and GlobalMed Education.",
  path: "/about/team",
});

function initialsFromRole(role: string): string {
  return role
    .split(/[\s,&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people your practice and your career depend on"
        intro="Photos, names and bios will be added once confirmed by GlobalMed. [CLIENT TO CONFIRM]"
        crumbs={[
          { name: "About", path: "/about" },
          { name: "Team", path: "/about/team" },
        ]}
      />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.role} className="flex flex-col gap-4 rounded-lg border bg-card p-6">
              <Avatar className="size-16">
                <AvatarFallback className="bg-mint text-lg font-semibold text-teal-deep">
                  {initialsFromRole(member.role)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl">{member.role}</h2>
                <p className="text-sm text-muted-foreground">{member.name}</p>
              </div>
              <p>{member.bio}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Want to join us?" href="/careers" label="See open roles" />
    </>
  );
}
