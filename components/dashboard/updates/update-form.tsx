"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveUpdate, uploadUpdateImage, type UpdateResult } from "@/lib/updates/actions";
import { updateCategories, type Update } from "@/lib/updates/logic";

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const fromLocalInput = (value: string): string | undefined =>
  value ? new Date(value).toISOString() : undefined;

/**
 * Create or edit an update. One column, large targets, so staff can post from a phone.
 * "Save draft" keeps it off the site; "Publish" puts it live at the publish date (a future
 * date schedules it). Images are resized to 1600 × 900 WebP on upload.
 */
export function UpdateForm({
  update,
  imageUrl,
  basePath,
}: {
  update?: Update;
  imageUrl?: string | null;
  basePath: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<UpdateResult | null>(null);
  const [summary, setSummary] = useState(update?.summary ?? "");
  const [pinned, setPinned] = useState(update?.pinned ?? false);
  const [imagePath, setImagePath] = useState<string | null | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const [uploading, startUpload] = useTransition();
  const [saving, startSave] = useTransition();
  const errors = result?.fieldErrors ?? {};

  const submit = (status: "draft" | "published") => {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim() || undefined;
    startSave(async () => {
      const saved = await saveUpdate(
        {
          id: update?.id,
          title: text("title"),
          summary: text("summary"),
          bodyMd: text("bodyMd"),
          category: text("category"),
          linkUrl: text("linkUrl"),
          linkLabel: text("linkLabel"),
          publishAt:
            fromLocalInput(String(data.get("publishAt") ?? "")) ?? new Date().toISOString(),
          expiresAt: fromLocalInput(String(data.get("expiresAt") ?? "")),
          pinned,
          status,
        },
        imagePath,
      );
      setResult(saved);
      if (saved.ok && !update?.id && saved.id) router.replace(`${basePath}/${saved.id}`);
      else if (saved.ok) router.refresh();
    });
  };

  const fieldError = (name: string) =>
    errors[name] ? (
      <p id={`${name}-error`} className="text-sm text-destructive">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      className="flex max-w-2xl flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        submit("published");
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={update?.title}
          maxLength={120}
          required
          aria-invalid={Boolean(errors.title) || undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {fieldError("title")}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="summary">Short text</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={3}
          maxLength={280}
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          aria-describedby="summary-count"
          aria-invalid={Boolean(errors.summary) || undefined}
        />
        <p id="summary-count" className="text-xs text-muted-foreground">
          {summary.length}/280 characters. Shown on the home page and the updates list.
        </p>
        {fieldError("summary")}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <NativeSelect
          id="category"
          name="category"
          defaultValue={update?.category ?? "announcements"}
        >
          {updateCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Image (optional)</span>
        {preview ? (
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- dashboard preview of an uploaded image */}
            <img
              src={preview}
              alt=""
              className="aspect-video w-full max-w-md rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => {
                setPreview(null);
                setImagePath(null);
              }}
            >
              <Trash2 aria-hidden="true" /> Remove image
            </Button>
          </div>
        ) : (
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground focus-within:outline-2 focus-within:outline-ring hover:border-primary">
            <ImagePlus aria-hidden="true" className="size-6" />
            {uploading
              ? "Uploading…"
              : "Choose a JPG, PNG or WebP (max 5 MB). It is cropped to 16:9."}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const data = new FormData();
                data.set("image", file);
                startUpload(async () => {
                  const uploaded = await uploadUpdateImage(data);
                  setResult(uploaded);
                  if (uploaded.ok && uploaded.imagePath) {
                    setImagePath(uploaded.imagePath);
                    setPreview(URL.createObjectURL(file));
                  }
                });
              }}
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bodyMd">Full text (optional, markdown)</Label>
        <Textarea id="bodyMd" name="bodyMd" rows={8} defaultValue={update?.bodyMd ?? ""} />
        <p className="text-xs text-muted-foreground">
          With full text, the update gets its own page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkUrl">Button link (optional)</Label>
          <Input
            id="linkUrl"
            name="linkUrl"
            defaultValue={update?.linkUrl ?? ""}
            placeholder="/contact or https://…"
          />
          {fieldError("linkUrl")}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkLabel">Button label</Label>
          <Input
            id="linkLabel"
            name="linkLabel"
            defaultValue={update?.linkLabel ?? ""}
            maxLength={40}
          />
          {fieldError("linkLabel")}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="publishAt">Publish date</Label>
          <Input
            id="publishAt"
            name="publishAt"
            type="datetime-local"
            defaultValue={toLocalInput(update?.publishAt ?? new Date().toISOString())}
          />
          <p className="text-xs text-muted-foreground">A future date schedules it.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="expiresAt">Expiry (optional)</Label>
          <Input
            id="expiresAt"
            name="expiresAt"
            type="datetime-local"
            defaultValue={toLocalInput(update?.expiresAt)}
          />
          {fieldError("expiresAt")}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="pinned" checked={pinned} onCheckedChange={setPinned} />
        <Label htmlFor="pinned">Pin: always shown first</Label>
      </div>

      {result && (
        <Alert variant={result.ok ? "default" : "destructive"} aria-live="polite">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" loading={saving}>
          Publish
        </Button>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          disabled={saving}
          onClick={() => submit("draft")}
        >
          Save as draft
        </Button>
      </div>
    </form>
  );
}
