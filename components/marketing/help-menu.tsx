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
 * The help button's menu (WhatsApp, call, email). Loaded by HelpButton on first click, so
 * Base UI's menu code isn't part of any page's first load (2026-10-01). Base UI gives the
 * keyboard behaviour: arrows move between items, Esc closes it and returns focus to the button.
 */
export function HelpMenu({
  defaultOpen = false,
  triggerClassName,
}: {
  defaultOpen?: boolean;
  triggerClassName: string;
}) {
  const { contact } = site;
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`;
  const itemClass = "min-h-11 gap-3 px-3 text-base";

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger aria-label="Help and support" className={triggerClassName}>
        <CircleHelp aria-hidden="true" className="size-7 md:size-8" strokeWidth={2.25} />
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
