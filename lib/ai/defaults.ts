/**
 * Chat defaults with no imports, so the widget (client) can show them instantly without
 * pulling the server-side knowledge into its bundle. Admin settings override them.
 */
export const handoffReply = "Talk to a person";

export const defaultGreeting =
  "Hi! I'm GlobalMed's assistant. I can help with the AAPC CPC® and CPB® courses and our medical transcription and billing services. Please don't share patient information.";

export const defaultQuickReplies = [
  "CPC® / CPB® courses",
  "Billing & transcription services",
  handoffReply,
];
