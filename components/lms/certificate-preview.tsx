import { QrCode } from "lucide-react";

import { Wordmark } from "@/components/marketing/wordmark";
import { ClaimLine } from "@/components/motion/claim-line";
import { SealStamp } from "@/components/motion/seal-stamp";
import { cn } from "@/lib/utils";

type CertificatePreviewProps = {
  nameOnCertificate: string;
  courseTitle: string;
  issuedAt: Date;
  code: string;
  /** Signatory name and title are a client input (pm/CLIENT_INPUTS_NEEDED.md). */
  signatory?: { name: string; title: string };
  animate?: boolean;
  className?: string;
};

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

/**
 * On-screen certificate (docs/08, X-2). The PDF (P6-5) mirrors this layout.
 * Reveal: the claim line underlines the name, then the seal stamps in (docs/15 §3).
 * Palette: navy border, sky-blue seal ring.
 * The QR code is generated in P6-5; a placeholder marks its position.
 */
export function CertificatePreview({
  nameOnCertificate,
  courseTitle,
  issuedAt,
  code,
  signatory,
  animate = true,
  className,
}: CertificatePreviewProps) {
  return (
    <article
      aria-label={`Certificate of completion for ${nameOnCertificate}`}
      className={cn(
        "@container relative w-full overflow-hidden rounded-lg border bg-card p-[5%] shadow-sm sm:aspect-[1.414/1]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-[2.5%] rounded-md border-2 border-primary" />
      <div className="relative flex h-full flex-col items-center justify-between gap-6 py-4 text-center sm:gap-0 sm:py-0">
        <div className="flex flex-col items-center gap-[0.5cqw]">
          <Wordmark size="compact" className="mb-[1cqw] h-[max(28px,6cqw)]" />
          <p className="text-[max(10px,1.6cqw)] font-semibold tracking-[0.2em] text-teal-deep uppercase">
            GlobalMed School of Billing and Coding
          </p>
          <p className="font-serif text-[max(16px,4cqw)] font-semibold">
            Certificate of Completion
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-[1cqw]">
          <p className="text-[max(10px,1.6cqw)] text-muted-foreground">This certifies that</p>
          <p className="font-serif text-[max(20px,5.5cqw)] leading-tight font-semibold">
            {nameOnCertificate}
          </p>
          <ClaimLine ticks={9} goldEnd trigger={animate ? "inView" : "static"} className="w-3/5" />
          <p className="text-[max(10px,1.6cqw)] text-muted-foreground">
            has successfully completed
          </p>
          <p className="font-serif text-[max(14px,2.8cqw)] font-semibold">{courseTitle}</p>
        </div>

        <div className="grid w-full grid-cols-3 items-end gap-4 text-[max(9px,1.3cqw)]">
          <div className="text-left">
            <p className="font-semibold">{dateFormat.format(issuedAt)}</p>
            <p className="text-muted-foreground">Date issued</p>
            <p className="mt-[1cqw] font-mono">{code}</p>
            <p className="text-muted-foreground">Certificate ID</p>
          </div>
          <div className="flex justify-center">
            <SealStamp
              status="valid"
              size={64}
              label="Verified"
              animateIn={animate}
              className="[&_svg]:size-[max(40px,9cqw)]"
            />
          </div>
          <div className="flex flex-col items-end gap-[0.5cqw] text-right">
            <QrCode aria-hidden="true" className="size-[max(28px,7cqw)] text-muted-foreground" />
            <p className="font-semibold">{signatory?.name ?? "[CLIENT TO CONFIRM]"}</p>
            <p className="text-muted-foreground">{signatory?.title ?? "Signatory title"}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
