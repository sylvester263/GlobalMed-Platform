import { z } from "zod";

import { addAgentMessageForTest, updateConversation } from "@/lib/ai/store";
import { formsDryRun } from "@/lib/server-env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ conversationId: z.uuid(), message: z.string().min(1).max(1000) });

/**
 * Local dry run only (FORMS_DRY_RUN=true, never production): stands in for an agent reply
 * from the Sales inbox so the E2E test can check the widget shows it without Supabase.
 */
export async function POST(request: Request) {
  if (!formsDryRun()) return new Response(null, { status: 404 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  await addAgentMessageForTest(parsed.data.conversationId, parsed.data.message);
  await updateConversation(parsed.data.conversationId, { leadFlow: null });
  return Response.json({ ok: true });
}
