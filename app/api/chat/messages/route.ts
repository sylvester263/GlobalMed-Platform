import { z } from "zod";

import { getConversation, listMessages, tokenMatches } from "@/lib/ai/store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  conversationId: z.uuid(),
  token: z.string().min(16).max(128),
  after: z.iso.datetime({ offset: true }).optional(),
});

/**
 * GET /api/chat/messages — the widget polls this while a chat is with a person, to show
 * agent replies (visitors can't read the chat tables directly; staff get realtime).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  const noStore = { "Cache-Control": "no-store" };
  if (!parsed.success)
    return Response.json({ error: "invalid" }, { status: 400, headers: noStore });
  if (!(await checkRateLimit("chatPoll", await clientIp()))) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: noStore });
  }

  const { conversationId, token, after } = parsed.data;
  const conversation = await getConversation(conversationId);
  if (!conversation || !tokenMatches(token, conversation.tokenHash)) {
    return Response.json({ error: "not_found" }, { status: 404, headers: noStore });
  }
  const messages = (await listMessages(conversationId, { after }))
    .filter((m) => m.role === "agent" || m.role === "assistant")
    .map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt }));
  return Response.json({ status: conversation.status, messages }, { headers: noStore });
}
