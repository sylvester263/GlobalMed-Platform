/**
 * GA4 events via the GTM dataLayer (docs/12 §4). Consent and the GTM container are
 * wired in P8-6; until then events queue harmlessly in `window.dataLayer`.
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
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
