"use client";

import { Expand } from "lucide-react";
import { useState, type ComponentType } from "react";

import type { CredentialLightboxProps } from "@/components/marketing/credential-dialog";

type DialogComponent = ComponentType<CredentialLightboxProps & { defaultOpen?: boolean }>;

const loadDialog = () =>
  import("@/components/marketing/credential-dialog").then((m) => m.CredentialDialog);

// Same classes as the dialog's trigger (credential-dialog.tsx), so the swap is invisible.
const triggerClassName =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-md text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover";

/**
 * "View certificate". The page ships only this button; hover or focus prefetches the dialog,
 * and the first click swaps in the real dialog (credential-dialog.tsx), already open
 * (2026-10-01 performance work). Looks and behaves the same.
 */
export function CredentialLightbox(props: CredentialLightboxProps) {
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);

  if (Dialog) return <Dialog {...props} defaultOpen />;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={triggerClassName}
      onPointerEnter={() => void loadDialog()}
      onFocus={() => void loadDialog()}
      onClick={() => void loadDialog().then((component) => setDialog(() => component))}
    >
      <Expand aria-hidden="true" className="size-4" />
      View certificate<span className="sr-only">: {props.name}</span>
    </button>
  );
}
