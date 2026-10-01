"use client";

import { CircleHelp, Mail, MessageCircle, Phone, Send, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";

import { Turnstile } from "@/components/marketing/turnstile";
import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { defaultGreeting, defaultQuickReplies } from "@/lib/ai/defaults";
import { parseSse } from "@/lib/ai/sse";
import { track } from "@/lib/analytics";
import { spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Website chat (docs/09 §8, Phase 7A). Loaded on the help button's first click, so none of
 * this is in any page's first load. Opens a panel above the button: greeting + quick replies,
 * streamed answers with a typing indicator, the patient-information note, WhatsApp / call /
 * email links (the old help menu), and a close button. Focus is trapped in the panel; Esc
 * closes it and returns focus to the button. Reduced motion: the panel appears instantly.
 */

type Message = {
  key: string;
  role: "user" | "assistant" | "agent" | "notice";
  content: string;
  createdAt?: string;
};

type Saved = {
  visitorId: string;
  conversationId?: string;
  token?: string;
  status?: string;
  messages?: Message[];
  lastAgentAt?: string;
};

const STORAGE_KEY = "gm-chat";
const POLL_MS = 4000;
const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber.replace(/\D/g, "")}`;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Saved;
  } catch {
    // Storage blocked: start fresh.
  }
  return { visitorId: crypto.randomUUID().replace(/-/g, "") };
}

function save(state: Saved) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, messages: state.messages?.slice(-30) }),
    );
  } catch {
    // Storage blocked: the chat still works for this page view.
  }
}

/** Turns URLs and site paths in a reply into links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/((?:https?:\/\/|wa\.me\/)[^\s)]+|(?<=^|[\s(])\/[a-z0-9][\w\-/#]*)/gi);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        const isUrl = /^(https?:\/\/|wa\.me\/)/i.test(part);
        const isPath = /^\/[a-z0-9]/i.test(part);
        if (!isUrl && !isPath) return <Fragment key={i}>{part}</Fragment>;
        const href = part.startsWith("wa.me") ? `https://${part}` : part.replace(/[.,]$/, "");
        const external = isUrl;
        return (
          <a
            key={i}
            href={href}
            className="font-semibold underline underline-offset-2"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {part}
            {external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        );
      })}
    </>
  );
}

export function ChatWidget({ triggerClassName }: { triggerClassName: string }) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<Saved | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [greeting, setGreeting] = useState(defaultGreeting);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const titleId = useId();
  const noteId = useId();

  // Restore the conversation and fetch the greeting set in admin.
  useEffect(() => {
    const saved = load();
    setState(saved);
    setMessages(saved.messages ?? []);
    if (!saved.messages?.length) setQuickReplies(defaultQuickReplies);
    track("chat_open", { placement: "help_button" });
    // The defaults show at once; the admin's greeting and quick replies replace them.
    fetch("/api/chat/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((config: { greeting: string; quickReplies: string[] } | null) => {
        if (!config) return;
        setGreeting(config.greeting);
        if (!saved.messages?.length) setQuickReplies(config.quickReplies);
      })
      .catch(() => undefined);
  }, []);

  const persist = useCallback((next: Saved, nextMessages: Message[]) => {
    setState(next);
    save({ ...next, messages: nextMessages.filter((msg) => msg.role !== "notice") });
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    logRef.current?.lastElementChild?.scrollIntoView({ block: "end" });
  }, [messages, typing]);

  // Focus the input when the panel opens; return focus to the button when it closes.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Esc closes; Tab stays inside the panel.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((el) => el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // While a person has the chat, poll for their replies.
  const conversationId = state?.conversationId;
  const token = state?.token;
  const handoff = state?.status === "handoff";
  useEffect(() => {
    if (!handoff || !conversationId || !token || !open) return;
    const timer = window.setInterval(async () => {
      const params = new URLSearchParams({ conversationId, token });
      if (state?.lastAgentAt) params.set("after", state.lastAgentAt);
      const res = await fetch(`/api/chat/messages?${params}`).catch(() => null);
      if (!res?.ok) return;
      const data = (await res.json()) as {
        status: string;
        messages: { id: string; role: string; content: string; createdAt: string }[];
      };
      const agentMessages = data.messages.filter((msg) => msg.role === "agent");
      if (!agentMessages.length && data.status === state?.status) return;
      setMessages((current) => {
        const seen = new Set(current.map((msg) => msg.key));
        const added = agentMessages
          .filter((msg) => !seen.has(msg.id))
          .map((msg) => ({
            key: msg.id,
            role: "agent" as const,
            content: msg.content,
            createdAt: msg.createdAt,
          }));
        const next = [...current, ...added];
        persist(
          {
            ...state!,
            status: data.status,
            lastAgentAt: agentMessages.at(-1)?.createdAt ?? state?.lastAgentAt,
          },
          next,
        );
        return next;
      });
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [handoff, conversationId, token, open, state, persist]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy || !state) return;
    setInput("");
    setQuickReplies([]);
    setBusy(true);
    setTyping(true);

    const userMessage: Message = { key: crypto.randomUUID(), role: "user", content: message };
    const replyKey = crypto.randomUUID();
    let reply = "";
    let current = [...messages, userMessage];
    setMessages(current);

    const showReply = (content: string) => {
      reply = content;
      setTyping(false);
      setMessages(() => {
        const withoutReply = current.filter((msg) => msg.key !== replyKey);
        current = content
          ? [...withoutReply, { key: replyKey, role: "assistant", content }]
          : withoutReply;
        return current;
      });
    };
    const notice = (content: string) => {
      setTyping(false);
      current = [...current, { key: crypto.randomUUID(), role: "notice", content }];
      setMessages(current);
    };

    let next: Saved = { ...state };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          visitorId: state.visitorId,
          conversationId: state.conversationId,
          token: state.token,
          turnstileToken: state.conversationId ? undefined : turnstileToken,
        }),
      });
      if (!res.ok || !res.body) {
        const error = ((await res.json().catch(() => ({}))) as { error?: string }).error;
        if (error === "not_found" || error === "closed") {
          next = { visitorId: state.visitorId };
          notice("This chat has ended. Send your message again to start a new one.");
        } else if (error === "rate_limited") {
          notice(
            "You've sent a lot of messages. Please wait a few minutes, or message us on WhatsApp.",
          );
        } else if (error === "verification_failed") {
          notice(
            "We couldn't confirm you're not a robot. Please complete the check and try again.",
          );
        } else {
          notice(
            "The chat isn't available right now. Please message us on WhatsApp, call or email.",
          );
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const parsed = parseSse(buffer + decoder.decode(value, { stream: true }));
        buffer = parsed.rest;
        for (const { event, data } of parsed.events) {
          const payload = data as Record<string, unknown>;
          if (event === "meta") {
            next = {
              ...next,
              conversationId: String(payload.conversationId),
              token: (payload.token as string | undefined) ?? next.token,
              status: String(payload.status),
            };
          } else if (event === "delta") {
            showReply(reply + String(payload.text ?? ""));
          } else if (event === "replace") {
            showReply(String(payload.text ?? ""));
          } else if (event === "done") {
            next = { ...next, status: String(payload.status) };
            const replies = payload.quickReplies as string[] | undefined;
            if (replies?.length) setQuickReplies(replies);
          } else if (event === "error") {
            notice(String(payload.message ?? "Something went wrong."));
          }
        }
      }
    } catch {
      notice("The connection dropped. Please try again, or message us on WhatsApp.");
    } finally {
      setTyping(false);
      setBusy(false);
      persist(next, current);
      inputRef.current?.focus();
    }
  }

  const needsCheck = Boolean(siteKey) && !state?.conversationId && !turnstileToken;

  return (
    <MotionFeatures>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close chat" : "Help and support"}
        aria-expanded={open}
        aria-controls={open ? `${titleId}-panel` : undefined}
        data-popup-open={open || undefined}
        className={triggerClassName}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? (
          <X aria-hidden="true" className="size-7 md:size-8" strokeWidth={2.25} />
        ) : (
          <CircleHelp aria-hidden="true" className="size-7 md:size-8" strokeWidth={2.25} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id={`${titleId}-panel`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={noteId}
            onKeyDown={onKeyDown}
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 12, scale: 0.97 }
            }
            transition={reduced ? { duration: 0 } : spring.soft}
            style={{ transformOrigin: "bottom right" }}
            className="fixed right-4 bottom-[88px] left-4 z-50 flex h-[min(600px,calc(100dvh-104px))] flex-col overflow-hidden rounded-2xl border bg-card text-foreground shadow-[0_16px_48px_rgb(23_38_92/0.28)] sm:left-auto sm:w-[380px] md:right-6 md:bottom-[112px] md:h-[min(620px,calc(100dvh-136px))]"
          >
            <header className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex flex-col">
                <h2 id={titleId} className="font-sans text-base font-semibold text-white">
                  GlobalMed assistant
                </h2>
                <p className="text-xs text-white/85">
                  {handoff
                    ? "A member of our team will reply here"
                    : "Answers about courses and services"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="flex size-11 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <p
              id={noteId}
              className="flex items-center gap-2 border-b bg-warning-soft px-4 py-2 text-xs font-semibold text-warning-ink"
            >
              <ShieldAlert aria-hidden="true" className="size-4 shrink-0" />
              Please don&apos;t share patient information.
            </p>

            <ol
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              <li className="max-w-[88%] self-start rounded-2xl rounded-bl-sm bg-mint px-4 py-2 text-sm text-ink">
                {greeting}
              </li>
              {messages.map((msg) => (
                <li
                  key={msg.key}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-4 py-2 text-sm break-words whitespace-pre-line",
                    msg.role === "user" &&
                      "self-end rounded-br-sm bg-primary text-primary-foreground",
                    msg.role === "assistant" && "self-start rounded-bl-sm bg-mint text-ink",
                    msg.role === "agent" &&
                      "self-start rounded-bl-sm border-2 border-primary bg-card",
                    msg.role === "notice" &&
                      "self-center bg-muted text-center text-xs text-muted-foreground",
                  )}
                >
                  {msg.role === "agent" && (
                    <span className="mb-0.5 block text-xs font-semibold text-primary">
                      GlobalMed team
                    </span>
                  )}
                  <span className="sr-only">
                    {msg.role === "user" ? "You: " : msg.role === "notice" ? "" : "GlobalMed: "}
                  </span>
                  <Linkified text={msg.content} />
                </li>
              ))}
              {typing && (
                <li
                  className="self-start rounded-2xl rounded-bl-sm bg-mint px-4 py-3"
                  aria-label="GlobalMed is typing"
                >
                  <span className="chat-typing flex gap-1" aria-hidden="true">
                    <span className="size-2 rounded-full bg-teal-deep/60" />
                    <span className="size-2 rounded-full bg-teal-deep/60" />
                    <span className="size-2 rounded-full bg-teal-deep/60" />
                  </span>
                </li>
              )}
            </ol>

            {quickReplies.length > 0 && !busy && (
              <div
                className="flex flex-wrap gap-2 px-4 pb-3"
                role="group"
                aria-label="Suggested replies"
              >
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => void send(reply)}
                    className="min-h-11 rounded-full border border-primary px-3 text-sm font-semibold text-primary hover:bg-mint"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {needsCheck && (
              <div className="px-4 pb-2">
                <Turnstile onToken={setTurnstileToken} />
              </div>
            )}

            <form
              className="flex items-end gap-2 border-t px-3 py-3"
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
            >
              <label htmlFor={`${titleId}-input`} className="sr-only">
                Your message
              </label>
              <textarea
                ref={inputRef}
                id={`${titleId}-input`}
                rows={1}
                maxLength={1000}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Type your question…"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring md:text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim() || needsCheck}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
              >
                <Send aria-hidden="true" className="size-5" />
              </button>
            </form>

            <nav aria-label="Other ways to reach us" className="border-t bg-muted/40 px-3 py-2">
              <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold">
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click", { placement: "chat_widget" })}
                    className="inline-flex min-h-11 items-center gap-1.5 text-success-ink hover:underline"
                  >
                    <MessageCircle aria-hidden="true" className="size-4" /> Continue on WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={site.contact.phoneHref}
                    className="inline-flex min-h-11 items-center gap-1.5 text-primary hover:underline"
                  >
                    <Phone aria-hidden="true" className="size-4" /> Call
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-primary hover:underline"
                  >
                    <Mail aria-hidden="true" className="size-4" /> Email
                  </a>
                </li>
              </ul>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </MotionFeatures>
  );
}
