"use client";

import { CircleHelp } from "lucide-react";
import { useState, type ComponentType } from "react";

import { features } from "@/config/features";

type HelpMenuComponent = ComponentType<{ defaultOpen?: boolean; triggerClassName: string }>;

// The chat widget (Phase 7A) replaces the menu; the menu stays behind `features.chatbotWidget`.
const loadMenu = (): Promise<HelpMenuComponent> =>
  features.chatbotWidget
    ? import("@/components/marketing/chat/chat-widget").then((m) => m.ChatWidget)
    : import("@/components/marketing/help-menu").then((m) => m.HelpMenu);

const triggerClassName =
  "fixed right-4 bottom-4 z-40 flex size-[60px] items-center justify-center rounded-full bg-mid-blue text-white shadow-[0_8px_24px_rgb(23_38_92/0.35)] transition-[background-color,transform] duration-(--duration-fast) hover:scale-105 hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky data-[popup-open]:bg-navy motion-reduce:hover:scale-100 md:right-6 md:bottom-6 md:size-[72px]";

/**
 * Floating help button (client, 2026-09-27): 72px circle, bottom-right; 60px under 768px
 * (2026-09-30). The footer keeps button height + 24px clear below the last links. Until the
 * chatbot (P7-4) replaced it (2026-10-01), it opened a small menu: WhatsApp, call, email. Now
 * it opens the chat panel (components/marketing/chat/chat-widget.tsx), which keeps those
 * three links; `features.chatbotWidget: false` brings the menu back.
 *
 * Performance (2026-10-01): the page ships only this plain button. Hover or focus prefetches
 * the chat code; the first click swaps in the real widget, already open, with focus in it.
 * Looks the same until clicked.
 */
export function HelpButton() {
  const [Menu, setMenu] = useState<HelpMenuComponent | null>(null);

  if (Menu) return <Menu defaultOpen triggerClassName={triggerClassName} />;

  return (
    <button
      type="button"
      aria-label="Help and support"
      aria-haspopup={features.chatbotWidget ? "dialog" : "menu"}
      aria-expanded={false}
      className={triggerClassName}
      onPointerEnter={() => void loadMenu()}
      onFocus={() => void loadMenu()}
      onClick={() => void loadMenu().then((component) => setMenu(() => component))}
    >
      <CircleHelp aria-hidden="true" className="size-7 md:size-8" strokeWidth={2.25} />
    </button>
  );
}
