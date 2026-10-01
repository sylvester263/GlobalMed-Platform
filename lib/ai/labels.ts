/** Conversation status labels (admin logs and Sales inbox). */
export const conversationStatusLabels: Record<
  string,
  { label: string; variant: "secondary" | "warning" | "neutral" }
> = {
  bot: { label: "Bot", variant: "secondary" },
  handoff: { label: "With a person", variant: "warning" },
  closed: { label: "Closed", variant: "neutral" },
};

export const handoffReasonLabels: Record<string, string> = {
  requested: "Asked for a person",
  low_confidence: "Bot wasn't sure twice",
  complaint: "Complaint",
  payment: "Payment issue",
};

export const messageRoleLabels: Record<string, string> = {
  user: "Visitor",
  assistant: "Bot",
  agent: "Team",
  system: "System",
};
