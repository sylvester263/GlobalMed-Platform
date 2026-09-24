import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaBand, FaqList, PageHero, Section } from "@/components/marketing/sections";
import { buttonVariants } from "@/components/ui/button";
import { getServices, getSpecialties, getSpecialty } from "@/lib/content";
import { JsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSpecialties().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const specialty = getSpecialty((await params).slug);
  if (!specialty) return {};
  return pageMetadata({
    title: specialty.metaTitle,
    description: specialty.metaDescription,
    path: `/specialties/${specialty.slug}`,
  });
}

export default async function SpecialtyPage({ params }: Props) {
  const specialty = getSpecialty((await params).slug);
  if (!specialty) notFound();
  const path = `/specialties/${specialty.slug}`;
  const relatedServices = getServices().filter((s) => s.specialties.includes(specialty.slug));

  return (
    <>
      <PageHero
        eyebrow={`${specialty.name} billing and coding`}
        title={specialty.headline}
        intro={specialty.intro}
        crumbs={[
          { name: "Specialties", path: "/specialties" },
          { name: specialty.name, path },
        ]}
      >
        <Link href="/free-billing-audit" className={buttonVariants({ size: "lg" })}>
          Book your free billing audit
        </Link>
      </PageHero>

      <Section title={`What makes ${specialty.name.toLowerCase()} billing hard`}>
        <ul className="grid gap-6 md:grid-cols-3">
          {specialty.challenges.map((c) => (
            <li key={c.title} className="flex flex-col gap-2 rounded-lg border bg-card p-6">
              <h3 className="text-xl">{c.title}</h3>
              <p className="text-muted-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="white"
        title="Codes we see every day"
        intro="Examples of the codes and modifiers our coders handle for this specialty."
      >
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <caption className="sr-only">Common {specialty.name.toLowerCase()} codes</caption>
            <thead className="bg-ledger">
              <tr>
                <th scope="col" className="px-4 py-3 text-sm font-semibold">
                  Code
                </th>
                <th scope="col" className="px-4 py-3 text-sm font-semibold">
                  What it describes
                </th>
              </tr>
            </thead>
            <tbody>
              {specialty.codes.map((c) => (
                <tr key={c.code} className="border-t">
                  <td className="px-4 py-3 font-mono text-sm font-semibold whitespace-nowrap">
                    {c.code}
                  </td>
                  <td className="px-4 py-3">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          CPT codes and descriptions are summarised for readability. Always code from the current
          code set and payer policy.
        </p>
      </Section>

      <Section tone="mint" title="How we help">
        <ul className="grid gap-4 md:grid-cols-2">
          {specialty.howWeHelp.map((item) => (
            <li key={item} className="flex items-start gap-3 text-lg">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal-deep" />
              {item}
            </li>
          ))}
        </ul>
        {relatedServices.length > 0 && (
          <p>
            Related services:{" "}
            {relatedServices.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && ", "}
                <Link
                  href={`/services/${s.slug}`}
                  className="font-semibold text-teal-deep underline underline-offset-4"
                >
                  {s.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </Section>

      <Section title={`${specialty.name} billing questions`}>
        <FaqList faqs={specialty.faqs} />
      </Section>

      <CtaBand title={`Find out what your ${specialty.name.toLowerCase()} claims are missing`} />
      <JsonLd
        data={serviceJsonLd({
          name: `${specialty.name} billing and coding`,
          description: specialty.metaDescription,
          path,
        })}
      />
    </>
  );
}
