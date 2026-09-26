import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHero, Section } from "@/components/marketing/sections";
import { VerifyForm } from "@/components/marketing/verify-form";
import { certificateCodeSchema } from "@/lib/certificates/verify";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Verify a Certificate",
  description:
    "Check that a GlobalMed Education certificate is genuine. Enter the certificate ID or scan its QR code.",
  path: "/verify",
});

type Props = { searchParams: Promise<{ code?: string | string[] }> };

/** W-11: enter an ID (or arrive from the QR code) → /verify/[code]. */
export default async function VerifyPage({ searchParams }: Props) {
  const raw = (await searchParams).code;
  const code = Array.isArray(raw) ? raw[0] : raw;
  let error: string | undefined;
  if (code !== undefined) {
    const parsed = certificateCodeSchema.safeParse(code);
    if (parsed.success) redirect(`/verify/${parsed.data}`);
    error =
      "Certificate IDs are 12 letters and numbers, like 7F3A9C21B04D. Check the ID and try again.";
  }

  return (
    <>
      <PageHero
        eyebrow="Verify a certificate"
        title="Check a GlobalMed certificate"
        intro="Employers and institutions can confirm that a certificate was issued by GlobalMed Education and is still valid."
        crumbs={[{ name: "Verify a certificate", path: "/verify" }]}
      />
      <Section className="max-w-2xl">
        <VerifyForm defaultCode={code} error={error} />
      </Section>
    </>
  );
}
