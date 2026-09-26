import { SearchX, ServerCrash } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, Section } from "@/components/marketing/sections";
import { VerifyForm } from "@/components/marketing/verify-form";
import { ClaimLine } from "@/components/motion/claim-line";
import { SealStamp } from "@/components/motion/seal-stamp";
import { buttonVariants } from "@/components/ui/button";
import { verifyCertificate, type VerifyResult } from "@/lib/certificates/verify";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  // Result pages carry a person's name, so they're never indexed.
  return pageMetadata({
    title: "Certificate verification",
    description: "Verification result for a GlobalMed Education certificate.",
    path: `/verify/${encodeURIComponent(code)}`,
    noindex: true,
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

async function lookup(code: string): Promise<VerifyResult | { kind: "rate-limited" }> {
  if (!(await checkRateLimit("verify", await clientIp()))) return { kind: "rate-limited" };
  return verifyCertificate(decodeURIComponent(code));
}

/** W-11 / MG-15: result card with the seal stamp (valid / revoked) or a clear failure state. */
export default async function VerifyResultPage({ params }: Props) {
  const { code } = await params;
  const result = await lookup(code);

  return (
    <>
      <PageHero
        eyebrow="Verify a certificate"
        title="Certificate verification"
        crumbs={[
          { name: "Verify a certificate", path: "/verify" },
          { name: "Result", path: `/verify/${code}` },
        ]}
      />
      <Section className="max-w-3xl">
        <div aria-live="polite">
          {(result.kind === "valid" || result.kind === "revoked") && (
            <article className="flex flex-col items-center gap-6 rounded-lg border bg-card p-8 text-center">
              <SealStamp status={result.kind} size={104} />
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {result.kind === "valid"
                    ? `This certificate was issued by ${site.schoolName} and is valid.`
                    : "This certificate was issued but has been revoked and is no longer valid."}
                </p>
                <h2 className="text-3xl">{result.name}</h2>
                <ClaimLine
                  ticks={9}
                  goldEnd={result.kind === "valid"}
                  trigger="mount"
                  className="w-64"
                />
              </div>
              <dl className="grid w-full gap-4 text-left sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Course</dt>
                  <dd className="font-semibold">{result.course}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Issued</dt>
                  <dd className="font-semibold">{dateFormat.format(new Date(result.issuedAt))}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Certificate ID</dt>
                  <dd className="font-mono font-semibold">
                    {decodeURIComponent(code).toUpperCase()}
                  </dd>
                </div>
              </dl>
            </article>
          )}

          {result.kind === "not-found" && (
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center">
              <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
              <h2 className="text-2xl">We couldn&apos;t find that certificate</h2>
              <p className="max-w-md text-muted-foreground">
                Check the ID for typos. If it still isn&apos;t found, the certificate may not have
                been issued by GlobalMed. Contact us and we&apos;ll check for you.
              </p>
            </div>
          )}

          {(result.kind === "invalid-code" ||
            result.kind === "unavailable" ||
            result.kind === "rate-limited") && (
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center">
              <ServerCrash aria-hidden="true" className="size-10 text-muted-foreground" />
              <h2 className="text-2xl">
                {result.kind === "invalid-code"
                  ? "That doesn't look like a certificate ID"
                  : "Verification is temporarily unavailable"}
              </h2>
              <p className="max-w-md text-muted-foreground">
                {result.kind === "invalid-code"
                  ? "Certificate IDs are 12 letters and numbers, like 7F3A9C21B04D."
                  : result.kind === "rate-limited"
                    ? "Too many checks from your connection. Please wait a minute and try again."
                    : "Please try again in a few minutes, or contact us to verify a certificate by email."}
              </p>
            </div>
          )}
        </div>

        <h2 className="text-xl">Check another certificate</h2>
        <VerifyForm />
        <Link
          href="/contact"
          className={buttonVariants({ variant: "link", className: "self-start" })}
        >
          Need help verifying? Contact us
        </Link>
      </Section>
    </>
  );
}
