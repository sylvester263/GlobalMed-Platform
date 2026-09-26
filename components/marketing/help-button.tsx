"use client";

import { CircleHelp, Mail, MessageCircle, Phone } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

/**
 * Floating help button (client, 2026-09-27): 72px circle, bottom-right. Until the chatbot
 * (P7-4) replaces it, it opens a small menu: WhatsApp, call, email. Base UI's menu gives the
 * keyboard behaviour: Enter/Space/arrow keys open it, arrows move between items, Esc
 * closes it and returns focus to the button.
 */
export function HelpButton() {
  const { contact } = site;
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`;
  const itemClass = "min-h-11 gap-3 px-3 text-base";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Help and support"
        className="fixed right-6 bottom-6 z-40 flex size-[72px] items-center justify-center rounded-full bg-mid-blue text-white shadow-[0_8px_24px_rgb(23_38_92/0.35)] transition-[background-color,transform] duration-(--duration-fast) hover:scale-105 hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky data-[popup-open]:bg-navy motion-reduce:hover:scale-100"
      >
        <CircleHelp aria-hidden="true" className="size-8" strokeWidth={2.25} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" sideOffset={12} className="w-60 p-1.5">
        <DropdownMenuItem
          className={itemClass}
          render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
          onClick={() => track("whatsapp_click", { placement: "help_button" })}
        >
          <MessageCircle aria-hidden="true" className="size-5 text-success-ink" />
          Chat on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} render={<a href={contact.phoneHref} />}>
          <Phone aria-hidden="true" className="size-5 text-primary" />
          Call {contact.phone}
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} render={<a href={`mailto:${contact.email}`} />}>
          <Mail aria-hidden="true" className="size-5 text-primary" />
          Email us
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
