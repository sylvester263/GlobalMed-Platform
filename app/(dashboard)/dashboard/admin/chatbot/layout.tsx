import { CircleCheck, CircleDashed } from "lucide-react";

import { ChatbotTabs } from "@/components/dashboard/chatbot/chatbot-tabs";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { requireArea } from "@/lib/auth/session";
import { chatbotSetup } from "@/lib/ai/status";

/** Admin → Chatbot (docs/09): knowledge base, conversation logs, settings. */
export default async function ChatbotLayout({ children }: { children: React.ReactNode }) {
  await requireArea("admin", "/dashboard/admin/chatbot");
  const setup = chatbotSetup();
  const missing = setup.filter((item) => !item.ok);
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        className="mb-0"
        title="Chatbot"
        description="The website assistant: what it knows, what visitors asked, and how it hands chats to the team."
      />
      {missing.length > 0 && (
        <details className="rounded-lg border bg-card p-4 text-sm">
          <summary className="cursor-pointer font-semibold">
            Setup: {setup.length - missing.length} of {setup.length} services connected
          </summary>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {setup.map((item) => (
              <li key={item.label} className="flex items-start gap-2">
                {item.ok ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-success-ink"
                  />
                ) : (
                  <CircleDashed
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-warning-ink"
                  />
                )}
                <span>
                  <span className="font-semibold">{item.label}</span>
                  <span className="sr-only">{item.ok ? " (connected)" : " (not set)"}</span>:{" "}
                  {item.detail}
                  {!item.ok && (
                    <span className="block text-xs text-muted-foreground">
                      Hosting variables: {item.envVars}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      <ChatbotTabs />
      {children}
    </div>
  );
}
