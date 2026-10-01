import { CircleCheck } from "lucide-react";
import Image from "next/image";

import { CredentialLightbox } from "@/components/marketing/credential-lightbox";
import { ClaimLine } from "@/components/motion/claim-line";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { visibleCredentials } from "@/data/credentials";
import { publicAssetExists } from "@/lib/public-asset";

/**
 * "Registered, Certified & Compliant" (home and About). Data-driven from data/credentials.ts;
 * tiles keep 4-column (desktop), 2-column (tablet) and 1-column (mobile) widths, and any short
 * row is centred, so 2 to 8 tiles all look balanced. Tiles reveal in a
 * stagger on scroll and lift 2px on hover (`.credential-tile`); no carousel.
 */
export function CredentialsSection({ id = "credentials" }: { id?: string }) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      data-tone="white"
      aria-labelledby={headingId}
      className="border-b bg-card cv-auto"
    >
      <div className="container-fluid flex flex-col gap-10 section-y">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 id={headingId} className="text-2xl lg:text-3xl">
            Registered, Certified &amp; Compliant
          </h2>
          <p className="max-w-prose text-muted-foreground">
            GlobalMed Transcriptions Pvt. Ltd. is a registered and compliant company trusted by
            healthcare providers worldwide since 2007.
          </p>
        </div>
        <StaggerGroup as="ul" className="flex flex-wrap justify-center gap-grid">
          {visibleCredentials().map((credential) => {
            const hasLogo = publicAssetExists(credential.image);
            return (
              <StaggerItem
                as="li"
                key={credential.id}
                className="flex w-full sm:w-[calc((100%-var(--grid-gap))/2)] lg:w-[calc((100%-2*var(--grid-gap))/3)] wide:w-[calc((100%-3*var(--grid-gap))/4)]"
              >
                <article className="credential-tile flex w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md">
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
