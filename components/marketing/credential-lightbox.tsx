"use client";

import { Expand } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CredentialLightboxProps = {
  name: string;
  meaning: string;
  certificate: string;
  certificateAlt: string;
  placeholder: string;
  /** False until the certificate file is in public/images/credentials/. */
  hasCertificate: boolean;
};

/**
 * "View certificate": opens the full certificate in a modal dialog (Base UI), which traps
 * focus, closes on Escape and returns focus to this button.
 */
export function CredentialLightbox({
  name,
  meaning,
  certificate,
  certificateAlt,
  placeholder,
  hasCertificate,
}: CredentialLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-md text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
        <Expand aria-hidden="true" className="size-4" />
        View certificate<span className="sr-only">: {name}</span>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] gap-3 overflow-y-auto p-4 sm:max-w-3xl md:p-6">
        <DialogTitle className="pr-10 font-serif text-xl font-semibold">{name}</DialogTitle>
        <DialogDescription>{meaning}</DialogDescription>
        <div className="relative mx-auto aspect-[1/1.414] max-h-[75dvh] w-full max-w-[53dvh] overflow-hidden rounded-md border bg-ledger">
          {hasCertificate ? (
            <Image
              src={certificate}
              alt={certificateAlt}
              fill
              sizes="(min-width: 768px) 560px, 92vw"
              className="object-contain"
            />
          ) : (
            <span className="absolute inset-4 flex items-center justify-center rounded-md border-2 border-dashed border-input p-4 text-center text-sm font-semibold text-muted-foreground">
              {placeholder} · add {certificate}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
