"use client";

import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveChatSettings, type ActionResult } from "@/lib/ai/admin-actions";
import type { ChatSettings } from "@/lib/ai/settings";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Admin → Chatbot → Settings. Validated again on the server (chatSettingsSchema). */
export function ChatSettingsForm({ settings }: { settings: ChatSettings }) {
  const [handoff, setHandoff] = useState(settings.handoffEnabled);
  const [mode, setMode] = useState(settings.hours.mode);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const schedule =
    settings.hours.mode === "schedule"
      ? settings.hours
      : { timezone: "Asia/Karachi", days: [1, 2, 3, 4, 5], open: "09:00", close: "18:00" };

  return (
    <form
      className="flex max-w-2xl flex-col gap-6"
      action={(form) =>
        startTransition(async () => {
          const quickReplies = [0, 1, 2, 3]
            .map((i) => String(form.get(`quick-${i}`) ?? "").trim())
            .filter(Boolean);
          setResult(
            await saveChatSettings({
              greeting: form.get("greeting"),
              quickReplies,
              handoffEnabled: handoff,
              hours:
                mode === "always"
                  ? { mode: "always" }
                  : {
                      mode: "schedule",
                      timezone: form.get("timezone"),
                      days: form.getAll("days").map(Number),
                      open: form.get("open"),
                      close: form.get("close"),
                    },
            }),
          );
        })
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="greeting">Greeting</Label>
        <Textarea
          id="greeting"
          name="greeting"
          rows={3}
          maxLength={400}
          defaultValue={settings.greeting}
          required
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Quick replies (up to 4)</legend>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <Label htmlFor={`quick-${i}`} className="sr-only">
              Quick reply {i + 1}
            </Label>
            <Input
              id={`quick-${i}`}
              name={`quick-${i}`}
              maxLength={60}
              defaultValue={settings.quickReplies[i] ?? ""}
            />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          The second quick reply opens the services overview; &quot;Talk to a person&quot; hands the
          chat to the team.
        </p>
      </fieldset>

      <div className="flex items-center gap-3">
        <Switch id="handoff" checked={handoff} onCheckedChange={setHandoff} />
        <Label htmlFor="handoff">Hand chats to a person (Sales inbox)</Label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold">
          Business hours for replies from the team
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            value="always"
            checked={mode === "always"}
            onChange={() => setMode("always")}
          />
          Always (24/7)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            value="schedule"
            checked={mode === "schedule"}
            onChange={() => setMode("schedule")}
          />
          Set hours
        </label>
        {mode === "schedule" && (
          <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1 sm:col-span-3">
              <Label htmlFor="timezone">Time zone</Label>
              <Input id="timezone" name="timezone" defaultValue={schedule.timezone} required />
            </div>
            <fieldset className="flex flex-wrap gap-3 sm:col-span-3">
              <legend className="mb-1 text-sm">Days</legend>
              {days.map((day, i) => (
                <label key={day} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="days"
                    value={i}
                    defaultChecked={schedule.days.includes(i)}
                  />
                  {day}
                </label>
              ))}
            </fieldset>
            <div className="flex flex-col gap-1">
              <Label htmlFor="open">Opens</Label>
              <Input id="open" name="open" type="time" defaultValue={schedule.open} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="close">Closes</Label>
              <Input id="close" name="close" type="time" defaultValue={schedule.close} required />
            </div>
          </div>
        )}
      </fieldset>

      {result && (
        <Alert variant={result.ok ? "default" : "destructive"} aria-live="polite">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" loading={pending} className="self-start">
        Save settings
      </Button>
    </form>
  );
}
