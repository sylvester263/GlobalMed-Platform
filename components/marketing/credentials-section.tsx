import { CircleCheck } from "lucide-react";
import Image from "next/image";

import { CredentialLightbox } from "@/components/marketing/credential-lightbox";
import { ClaimLine } from "@/components/motion/claim-line";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { credentials } from "@/data/credentials";
import { publicAssetExists } from "@/lib/public-asset";

/**
 * "Registered, Certified & Compliant" (home and About). Data-driven from data/credentials.ts;
 * the grid holds 4 to 8 tiles (4 columns desktop, 2 tablet, 1 mobile). Tiles reveal in a
 * stagger on scroll and lift 2px on hover (`.credential-tile`); no carousel.
 */
export function CredentialsSection({ id = "credentials" }: { id?: string }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-b bg-card">
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6 lg:py-20">
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 id={headingId} className="text-2xl lg:text-3xl">
            Registered, Certified &amp; Compliant
          </h2>
          <p className="max-w-prose text-muted-foreground">
            GlobalMed Transcriptions Pvt. Ltd. is a registered and compliant company trusted by
            healthcare providers worldwide since 2007.
          </p>
        </div>
        <StaggerGroup as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((credential) => {
            const hasLogo = publicAssetExists(credential.image);
            return (
              <StaggerItem as="li" key={credential.id} className="flex">
                <article className="credential-tile flex w-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md">
                  {/* Navy top rule with the claim-line ticks. */}
                  <div className="bg-primary px-5 pt-3 pb-2">
                    <ClaimLine
                      trigger="static"
                      ticks={8}
                      className="[&_.stroke-tick]:stroke-white/40"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
                    <div className="relative h-20 w-full">
                      {hasLogo ? (
                        <Image
                          src={credential.image}
                          alt={`${credential.name} logo`}
                          fill
                          sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
                          className="object-contain object-left"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-input px-3 text-center text-xs font-semibold text-muted-foreground">
                          {credential.placeholder}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-sky" />
                      <h3 className="text-lg leading-snug">{credential.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{credential.meaning}</p>
                    <dl className="mt-auto grid gap-1 border-t pt-4 text-sm">
                      <dt className="font-semibold">Registration / certificate no.</dt>
                      <dd className="text-muted-foreground">{credential.number}</dd>
                      {credential.validity && (
                        <>
                          <dt className="sr-only">Validity</dt>
                          <dd className="text-muted-foreground">{credential.validity}</dd>
                        </>
                      )}
                      {credential.issuer && (
                        <>
                          <dt className="sr-only">Issued by</dt>
                          <dd className="text-muted-foreground">{credential.issuer}</dd>
                        </>
                      )}
                    </dl>
                    <CredentialLightbox
                      name={credential.name}
                      meaning={credential.meaning}
                      certificate={credential.certificate}
                      certificateAlt={credential.certificateAlt}
                      orientation={credential.orientation}
                      pdf={
                        credential.pdf && publicAssetExists(credential.pdf)
                          ? credential.pdf
                          : undefined
                      }
                      placeholder={credential.placeholder}
                      hasCertificate={publicAssetExists(credential.certificate)}
                    />
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
