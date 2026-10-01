import type { Metadata } from "next";

import { ChatSettingsForm } from "@/components/dashboard/chatbot/settings-form";
import { modelInUse } from "@/lib/ai/provider";
import { parseChatSettings } from "@/lib/ai/settings";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Chatbot settings" };

/** Greeting, quick replies, handoff, business hours; the model in use (read-only, from env). */
export default async function ChatbotSettingsPage() {
  await requireArea("admin", "/dashboard/admin/chatbot/settings");
  let stored: unknown = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "chatbot")
      .maybeSingle();
    stored = data?.value;
  }
  const settings = parseChatSettings(stored ?? {});
  const model = modelInUse();

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="model-title"
        className="max-w-2xl rounded-lg border bg-card p-4 text-sm"
      >
        <h2 id="model-title" className="font-sans text-base font-semibold">
          Model in use
        </h2>
        <dl className="mt-2 grid grid-cols-[10rem_1fr] gap-y-1">
          <dt className="font-semibold">Chat</dt>
          <dd>{model.chat ?? "Not set (LLM_PROVIDER, LLM_API_KEY)"}</dd>
          <dt className="font-semibold">Embeddings</dt>
          <dd>{model.embedding ?? "Not set (EMBEDDING_MODEL)"}</dd>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          Set on the hosting as environment variables; keys are never shown here.
        </p>
      </section>
      <ChatSettingsForm settings={settings} />
    </div>
  );
}
