import { getChatSettings, isStoreAvailable } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/chat/config — greeting and quick replies set in admin → Chatbot → Settings. */
export async function GET() {
  const settings = await getChatSettings();
  return Response.json(
    {
      greeting: settings.greeting,
      quickReplies: settings.quickReplies,
      available: isStoreAvailable(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
