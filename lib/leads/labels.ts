import type { Enums } from "@/lib/db/types";

/** How each lead source reads in the sales and admin dashboards. */
export const leadSourceLabels: Record<string, string> = {
  aapc_registration: "AAPC registration",
  audit_form: "Audit form",
  contact: "Contact form",
  chatbot: "Chatbot",
  whatsapp: "WhatsApp",
  course_enquiry: "Course enquiry",
};

export const leadStatuses: Enums<"lead_status">[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];
