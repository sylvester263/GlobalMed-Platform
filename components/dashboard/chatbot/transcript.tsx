import { messageRoleLabels } from "@/lib/ai/labels";
import { cn } from "@/lib/utils";

export type TranscriptMessage = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

const timeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** A chat thread for staff (admin logs, Sales inbox). Visitor on the left, bot/team on the right. */
export function Transcript({ messages }: { messages: TranscriptMessage[] }) {
  return (
    <ol className="flex flex-col gap-3" aria-label="Messages">
      {messages.map((m) => {
        const visitor = m.role === "user";
        return (
          <li
            key={m.id}
            className={cn("flex flex-col gap-1", visitor ? "items-start" : "items-end")}
          >
            <span className="text-xs text-muted-foreground">
              {messageRoleLabels[m.role] ?? m.role} · {timeFormat.format(new Date(m.created_at))}
            </span>
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm break-words whitespace-pre-line",
                visitor && "bg-muted",
                m.role === "assistant" && "bg-mint text-ink",
                m.role === "agent" && "bg-primary text-primary-foreground",
              )}
            >
              {m.content}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
