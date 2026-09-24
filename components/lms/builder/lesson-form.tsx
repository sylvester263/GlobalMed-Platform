"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { deleteLesson, moveLesson, updateLesson } from "@/lib/lms/builder-actions";
import type { UnlockRule } from "@/lib/lms/rules";

import { useBuilderAction } from "./use-builder-action";

type LessonType = "video" | "text" | "pdf" | "quiz" | "assignment" | "live";

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  type: LessonType;
  is_preview: boolean;
  required: boolean;
  content_md: string | null;
  live_url: string | null;
  duration_sec: number | null;
};

const typeLabels: Record<LessonType, string> = {
  video: "Video",
  text: "Text / reading",
  pdf: "PDF",
  quiz: "Quiz (built in Phase 6)",
  assignment: "Assignment",
  live: "Live session",
};

type UnlockKind = "none" | "after_lesson" | "days_after_enroll" | "date";

function kindOf(rule: UnlockRule): UnlockKind {
  if ("after_lesson" in rule) return "after_lesson";
  if ("days_after_enroll" in rule) return "days_after_enroll";
  if ("date" in rule) return "date";
  return "none";
}

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

/** P4-1 lesson settings plus P4-7 drip rules (docs/08 §4). */
export function LessonForm({
  lesson,
  unlockRule,
  otherLessons,
  modules,
}: {
  lesson: Lesson;
  unlockRule: UnlockRule;
  otherLessons: { id: string; title: string; moduleTitle: string }[];
  modules: { id: string; title: string }[];
}) {
  const { pending, fieldErrors, run } = useBuilderAction();
  const del = useBuilderAction();
  const move = useBuilderAction();
  const [type, setType] = useState<LessonType>(lesson.type);
  const [unlock, setUnlock] = useState<UnlockKind>(kindOf(unlockRule));
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <form
        action={(form) =>
          run(() =>
            updateLesson({
              lessonId: lesson.id,
              title: text(form, "title"),
              type,
              isPreview: form.get("isPreview") === "on",
              required: form.get("required") === "on",
              contentMd: text(form, "contentMd"),
              liveUrl: text(form, "liveUrl"),
              durationMin: text(form, "durationMin") === "" ? undefined : text(form, "durationMin"),
              unlock,
              unlockLessonId: text(form, "unlockLessonId"),
              unlockDays: text(form, "unlockDays") === "" ? undefined : text(form, "unlockDays"),
              unlockDate: text(form, "unlockDate"),
            }),
          )
        }
        className="grid gap-5 md:grid-cols-2"
      >
        <FormField
          label="Lesson title"
          required
          error={fieldErrors.title}
          className="md:col-span-2"
        >
          {(c) => <Input {...c} name="title" defaultValue={lesson.title} />}
        </FormField>
        <FormField label="Lesson type" required error={fieldErrors.type}>
          {(c) => (
            <NativeSelect
              {...c}
              value={type}
              onChange={(e) => setType(e.target.value as LessonType)}
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        {type !== "video" && (
          <FormField label="Estimated length (minutes)" error={fieldErrors.durationMin}>
            {(c) => (
              <Input
                {...c}
                name="durationMin"
                type="number"
                min={0}
                max={600}
                defaultValue={lesson.duration_sec ? Math.round(lesson.duration_sec / 60) : ""}
              />
            )}
          </FormField>
        )}

        <fieldset className="flex flex-col gap-3 md:col-span-2">
          <legend className="mb-2 text-sm font-semibold">Access</legend>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="isPreview"
              defaultChecked={lesson.is_preview}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              <span className="font-semibold">Free preview</span>
              <span className="block text-sm text-muted-foreground">
                Anyone signed in can watch this lesson before enrolling.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="required"
              defaultChecked={lesson.required}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              <span className="font-semibold">Required for the certificate</span>
              <span className="block text-sm text-muted-foreground">
                Students must complete it before the final exam unlocks.
              </span>
            </span>
          </label>
        </fieldset>

        {(type === "text" || type === "assignment" || type === "live" || type === "pdf") && (
          <FormField
            label={type === "assignment" ? "Assignment brief" : "Lesson text"}
            description="Markdown supported: headings, lists, links and tables."
            error={fieldErrors.contentMd}
            className="md:col-span-2"
          >
            {(c) => (
              <Textarea
                {...c}
                name="contentMd"
                rows={12}
                defaultValue={lesson.content_md ?? ""}
                className="font-mono text-sm"
              />
            )}
          </FormField>
        )}
        {type === "live" && (
          <FormField
            label="Live class link"
            description="Zoom or Google Meet link. Only enrolled students see it."
            error={fieldErrors.liveUrl}
            className="md:col-span-2"
          >
            {(c) => (
              <Input
                {...c}
                name="liveUrl"
                type="url"
                defaultValue={lesson.live_url ?? ""}
                placeholder="https://"
              />
            )}
          </FormField>
        )}

        <fieldset className="grid gap-4 rounded-lg border p-4 md:col-span-2 md:grid-cols-2">
          <legend className="px-1 text-sm font-semibold">Drip schedule</legend>
          <FormField label="Unlock this lesson" error={fieldErrors.unlock}>
            {(c) => (
              <NativeSelect
                {...c}
                value={unlock}
                onChange={(e) => setUnlock(e.target.value as UnlockKind)}
              >
                <option value="none">Straight away</option>
                <option value="after_lesson">After another lesson is completed</option>
                <option value="days_after_enroll">A number of days after enrolling</option>
                <option value="date">On a date</option>
              </NativeSelect>
            )}
          </FormField>
          {unlock === "after_lesson" && (
            <FormField label="Lesson to complete first" required error={fieldErrors.unlockLessonId}>
              {(c) => (
                <NativeSelect
                  {...c}
                  name="unlockLessonId"
                  defaultValue={"after_lesson" in unlockRule ? unlockRule.after_lesson : ""}
                >
                  <option value="">Choose a lesson</option>
                  {otherLessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.moduleTitle} — {l.title}
                    </option>
                  ))}
                </NativeSelect>
              )}
            </FormField>
          )}
          {unlock === "days_after_enroll" && (
            <FormField label="Days after enrolling" required error={fieldErrors.unlockDays}>
              {(c) => (
                <Input
                  {...c}
                  name="unlockDays"
                  type="number"
                  min={1}
                  max={365}
                  defaultValue={
                    "days_after_enroll" in unlockRule ? unlockRule.days_after_enroll : 7
                  }
                />
              )}
            </FormField>
          )}
          {unlock === "date" && (
            <FormField
              label="Unlock date"
              required
              description="Unlocks at midnight UTC."
              error={fieldErrors.unlockDate}
            >
              {(c) => (
                <Input
                  {...c}
                  name="unlockDate"
                  type="date"
                  defaultValue={"date" in unlockRule ? unlockRule.date.slice(0, 10) : ""}
                />
              )}
            </FormField>
          )}
        </fieldset>

        <div className="md:col-span-2">
          <Button type="submit" loading={pending}>
            Save lesson
          </Button>
        </div>
      </form>

      {modules.length > 1 && (
        <form
          action={(form) => move.run(() => moveLesson(lesson.id, text(form, "moduleId")))}
          className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-end"
        >
          <FormField label="Move to module" className="flex-1">
            {(c) => (
              <NativeSelect {...c} name="moduleId" defaultValue={lesson.module_id}>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </NativeSelect>
            )}
          </FormField>
          <Button type="submit" variant="secondary" loading={move.pending}>
            Move lesson
          </Button>
        </form>
      )}

      <section
        aria-labelledby="danger-zone"
        className="flex flex-col gap-3 rounded-lg border border-destructive/40 p-4"
      >
        <h3 id="danger-zone" className="font-semibold">
          Delete lesson
        </h3>
        <p className="text-sm text-muted-foreground">
          Removes the lesson, its files and every student&apos;s progress on it. This can&apos;t be
          undone.
        </p>
        {confirmDelete ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              loading={del.pending}
              onClick={() => del.run(() => deleteLesson(lesson.id))}
            >
              <Trash2 aria-hidden="true" /> Yes, delete it
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
              Keep lesson
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmDelete(true)}
            className="self-start"
          >
            Delete lesson…
          </Button>
        )}
      </section>
    </div>
  );
}
