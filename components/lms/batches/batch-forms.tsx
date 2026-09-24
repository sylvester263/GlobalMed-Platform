"use client";

import { Trash2, UserMinus, UserPlus } from "lucide-react";
import { useRef, useState } from "react";

import { useBuilderAction } from "@/components/lms/builder/use-builder-action";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  addBatchMember,
  addBatchSession,
  createBatch,
  deleteBatch,
  deleteBatchSession,
  postAnnouncement,
  removeBatchMember,
} from "@/lib/lms/batch-actions";

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

export function CreateBatchForm({ courses }: { courses: { id: string; title: string }[] }) {
  const { pending, fieldErrors, run } = useBuilderAction();
  return (
    <form
      action={(form) =>
        run(() =>
          createBatch({
            courseId: text(form, "courseId"),
            name: text(form, "name"),
            startsAt: text(form, "startsAt"),
            schedule: text(form, "schedule"),
            seats: text(form, "seats"),
          }),
        )
      }
      className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2"
    >
      <FormField label="Course" required error={fieldErrors.courseId}>
        {(c) => (
          <NativeSelect {...c} name="courseId" defaultValue={courses[0]?.id ?? ""}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </NativeSelect>
        )}
      </FormField>
      <FormField label="Batch name" required error={fieldErrors.name}>
        {(c) => <Input {...c} name="name" placeholder="e.g. CPC — March evening" />}
      </FormField>
      <FormField label="Start date" required error={fieldErrors.startsAt}>
        {(c) => <Input {...c} name="startsAt" type="date" />}
      </FormField>
      <FormField label="Seats" description="Leave empty for no limit." error={fieldErrors.seats}>
        {(c) => <Input {...c} name="seats" type="number" min={1} max={1000} />}
      </FormField>
      <FormField
        label="Schedule"
        description="Shown to students, e.g. “Mon & Wed, 8–10 pm PKT”."
        error={fieldErrors.schedule}
        className="md:col-span-2"
      >
        {(c) => <Input {...c} name="schedule" maxLength={200} />}
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" loading={pending}>
          Create batch
        </Button>
      </div>
    </form>
  );
}

export function SessionForm({ batchId }: { batchId: string }) {
  const { pending, fieldErrors, run } = useBuilderAction();
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={(form) => {
        const local = text(form, "startsAt");
        run(
          () =>
            addBatchSession({
              batchId,
              title: text(form, "title"),
              // datetime-local has no zone: interpret it in the instructor's browser zone.
              startsAt: local ? new Date(local).toISOString() : "",
              durationMin: text(form, "durationMin"),
              joinUrl: text(form, "joinUrl"),
            }),
          () => formRef.current?.reset(),
        );
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <FormField label="Session title" required error={fieldErrors.title}>
        {(c) => <Input {...c} name="title" placeholder="e.g. E/M coding workshop" />}
      </FormField>
      <FormField
        label="Starts at"
        required
        description="In your local time zone."
        error={fieldErrors.startsAt}
      >
        {(c) => <Input {...c} name="startsAt" type="datetime-local" />}
      </FormField>
      <FormField label="Length (minutes)" required error={fieldErrors.durationMin}>
        {(c) => (
          <Input {...c} name="durationMin" type="number" min={15} max={480} defaultValue={60} />
        )}
      </FormField>
      <FormField
        label="Join link"
        description="Zoom or Google Meet. Only batch members see it."
        error={fieldErrors.joinUrl}
      >
        {(c) => <Input {...c} name="joinUrl" type="url" placeholder="https://" />}
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" loading={pending}>
          Schedule session
        </Button>
      </div>
    </form>
  );
}

export function RemoveSessionButton({ sessionId, title }: { sessionId: string; title: string }) {
  const { pending, run } = useBuilderAction();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Remove session ${title}`}
      disabled={pending}
      onClick={() => run(() => deleteBatchSession(sessionId))}
    >
      <Trash2 aria-hidden="true" />
    </Button>
  );
}

export function MemberManager({
  batchId,
  members,
  candidates,
}: {
  batchId: string;
  members: { userId: string; name: string }[];
  candidates: { userId: string; name: string }[];
}) {
  const { pending, run } = useBuilderAction();
  const [selected, setSelected] = useState("");
  return (
    <div className="flex flex-col gap-4">
      {members.length === 0 ? (
        <p className="text-sm">No students in this batch yet.</p>
      ) : (
        <ul className="flex flex-col divide-y rounded-md border">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center justify-between gap-3 px-3 py-2">
              <span>{m.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${m.name} from the batch`}
                disabled={pending}
                onClick={() => run(() => removeBatchMember({ batchId, userId: m.userId }))}
              >
                <UserMinus aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {candidates.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor={`add-member-${batchId}`} className="text-sm font-semibold">
              Add an enrolled student
            </label>
            <NativeSelect
              id={`add-member-${batchId}`}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Choose a student</option>
              {candidates.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </div>
          <Button
            type="button"
            variant="secondary"
            loading={pending}
            disabled={!selected}
            onClick={() =>
              run(
                () => addBatchMember({ batchId, userId: selected }),
                () => setSelected(""),
              )
            }
          >
            <UserPlus aria-hidden="true" /> Add to batch
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Every actively enrolled student is already in this batch.
        </p>
      )}
    </div>
  );
}

export function AnnouncementForm({ batchId }: { batchId: string }) {
  const { pending, fieldErrors, run } = useBuilderAction();
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={(form) =>
        run(
          () => postAnnouncement({ batchId, title: text(form, "title"), body: text(form, "body") }),
          () => formRef.current?.reset(),
        )
      }
      className="flex flex-col gap-4"
    >
      <FormField label="Title" required error={fieldErrors.title}>
        {(c) => <Input {...c} name="title" maxLength={160} />}
      </FormField>
      <FormField
        label="Message"
        required
        description="Members get an in-app notification. No patient information."
        error={fieldErrors.body}
      >
        {(c) => <Textarea {...c} name="body" rows={4} maxLength={4000} />}
      </FormField>
      <Button type="submit" loading={pending} className="self-start">
        Post announcement
      </Button>
    </form>
  );
}

export function DeleteBatchButton({ batchId }: { batchId: string }) {
  const { pending, run } = useBuilderAction();
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="destructive"
        loading={pending}
        onClick={() => run(() => deleteBatch(batchId))}
      >
        <Trash2 aria-hidden="true" /> Yes, delete the batch
      </Button>
      <Button type="button" variant="ghost" onClick={() => setConfirming(false)}>
        Keep it
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="outline"
      onClick={() => setConfirming(true)}
      className="self-start"
    >
      Delete batch…
    </Button>
  );
}
