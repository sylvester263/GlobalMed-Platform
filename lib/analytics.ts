/**
 * GA4 events via the GTM dataLayer (docs/12 §4). Consent and the GTM container are
 * wired in P8-6; until then events queue harmlessly in `window.dataLayer`.
 * The same events are also sent to the Meta Pixel as standard events (ADR-040).
 * Never put personal data in event parameters.
 */
export type AnalyticsEvent =
  | "lead_submit"
  | "audit_request"
  | "chat_open"
  | "chat_lead"
  | "whatsapp_click"
  | "course_view"
  | "begin_checkout"
  | "purchase"
  | "lesson_complete"
  | "certificate_issued"
  | "newsletter_signup";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (command: "track" | "trackCustom", event: string, params?: EventParams) => void;
  }
}

/** Our event → Meta standard event. Events not listed are not sent to Meta. */
const META_EVENTS: Partial<Record<AnalyticsEvent, string>> = {
  lead_submit: "Lead",
  chat_lead: "Lead",
  whatsapp_click: "Contact",
  newsletter_signup: "Subscribe",
  course_view: "ViewContent",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
};

/** Only these non-personal parameters are passed on to Meta. */
const META_PARAMS = ["source", "placement", "course", "value", "currency"] as const;

export function metaEventFor(
  event: AnalyticsEvent,
  params: EventParams = {},
): { name: string; params: EventParams } | undefined {
  const name = META_EVENTS[event];
  if (!name) return undefined;
  const safe: EventParams = {};
  for (const key of META_PARAMS) {
    if (params[key] !== undefined) safe[key] = params[key];
  }
  return { name, params: safe };
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
  const meta = metaEventFor(event, params);
  if (meta) window.fbq?.("track", meta.name, meta.params);
}
