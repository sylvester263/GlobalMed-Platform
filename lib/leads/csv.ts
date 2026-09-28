import type { Tables } from "@/lib/db/types";
import { leadDetail, leadSourceLabels } from "@/lib/leads/labels";

export type ExportLead = Pick<
  Tables<"leads">,
  | "created_at"
  | "source"
  | "status"
  | "name"
  | "email"
  | "phone"
  | "interest"
  | "address"
  | "practice_name"
  | "specialty"
  | "message"
  | "details"
>;

const columns: { header: string; value: (lead: ExportLead) => string | null }[] = [
  { header: "Received (UTC)", value: (l) => l.created_at },
  { header: "Source", value: (l) => leadSourceLabels[l.source] ?? l.source },
  { header: "Status", value: (l) => l.status },
  { header: "Name", value: (l) => l.name },
  { header: "Email", value: (l) => l.email },
  { header: "Phone / WhatsApp", value: (l) => l.phone },
  { header: "Course / interest", value: (l) => l.interest },
  { header: "Address", value: (l) => l.address },
  // Registrations before Address replaced City (2026-09-28) kept a city in `details`.
  { header: "City (older registrations)", value: (l) => leadDetail(l.details, "city") },
  { header: "Background", value: (l) => leadDetail(l.details, "background") },
  { header: "Preferred contact time", value: (l) => leadDetail(l.details, "contactTime") },
  { header: "Practice / organisation", value: (l) => l.practice_name },
  { header: "Specialty", value: (l) => l.specialty },
  { header: "Consent at", value: (l) => leadDetail(l.details, "consentAt") },
  { header: "Message", value: (l) => l.message },
];

/**
 * One CSV cell. Quotes every value, doubles inner quotes, and prefixes values a spreadsheet
 * would run as a formula (= + - @, tab, carriage return) with an apostrophe (OWASP CSV
 * injection), since names, addresses and messages come from a public form.
 */
export function csvCell(value: string | null | undefined): string {
  const text = value ?? "";
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Leads as CSV (CRLF line endings, UTF-8 BOM so Excel reads ® and Urdu names correctly). */
export function leadsToCsv(leads: ExportLead[]): string {
  const lines = [
    columns.map((c) => csvCell(c.header)).join(","),
    ...leads.map((lead) => columns.map((c) => csvCell(c.value(lead))).join(",")),
  ];
  return `﻿${lines.join("\r\n")}\r\n`;
}
