"use client";

import { MessageCircle } from "lucide-react";

import { track } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const DEFAULT_MESSAGE = "Hello GlobalMed, I'd like to know more about your services.";

type WhatsAppButtonProps = {
  message?: string;
  /** Where the click came from, for the whatsapp_click event. */
  placement: string;
  variant?: "floating" | "inline";
  className?: string;
};

/** Click-to-chat (docs/02 W-13). Renders nothing until the business number is configured. */
export function WhatsAppButton({
  message = DEFAULT_MESSAGE,
  placement,
  variant = "inline",
  className,
}: WhatsAppButtonProps) {
  const href = whatsappHref(message);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { placement })}
      aria-label={
        variant === "floating" ? "Chat with us on WhatsApp (opens in a new tab)" : undefined
      }
      className={cn(
        variant === "floating"
          ? "whatsapp-float fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform duration-(--duration-fast) hover:scale-105"
          : "inline-flex h-12 items-center gap-2 rounded-md border border-input bg-card px-5 font-semibold hover:bg-mint",
        className,
      )}
    >
      <MessageCircle
        aria-hidden="true"
        className={variant === "floating" ? "size-7" : "size-5 text-success"}
      />
      {variant === "inline" && (
        <span>
          Chat on WhatsApp <span className="sr-only">(opens in a new tab)</span>
        </span>
      )}
    </a>
  );
}
