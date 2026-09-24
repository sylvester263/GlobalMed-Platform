"use client";

import { FileUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmFileUpload, deleteResource, requestFileUpload } from "@/lib/lms/builder-actions";

import { useBuilderAction } from "./use-builder-action";

const RESOURCE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg,text/csv";

/**
 * Uploads a PDF lesson file or a downloadable resource to the private lesson-files bucket:
 * the server checks ownership and type and signs a one-time upload URL, then records the file.
 */
function useFileUpload(lessonId: string, purpose: "resource" | "pdf") {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function upload(file: File, label: string) {
    setBusy(true);
    try {
      const signed = await requestFileUpload({
        lessonId,
        mimeType: file.type,
        size: file.size,
        purpose,
      });
      if (!signed.ok) {
        toast.error(signed.message);
        return;
      }
      // Loaded on demand: the Supabase client is only needed once a file is chosen.
      const { createClient } = await import("@/lib/db/client");
      const { error } = await createClient()
        .storage.from("lesson-files")
        .uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type });
      if (error) {
        toast.error("The upload failed. Try again.");
        return;
      }
      const saved = await confirmFileUpload({ lessonId, path: signed.path, label, purpose });
      if (saved.ok) {
        toast.success(saved.message ?? "Uploaded.");
        router.refresh();
      } else {
        toast.error(saved.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return { busy, upload };
}

export function PdfUploader({ lessonId, hasPdf }: { lessonId: string; hasPdf: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, upload } = useFileUpload(lessonId, "pdf");
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <h3 className="font-semibold">Lesson PDF</h3>
      <p className="text-sm text-muted-foreground">
        {hasPdf
          ? "A PDF is attached. Uploading a new one replaces it."
          : "No PDF yet. Up to 50 MB."}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file, file.name);
        }}
      />
      <Button
        type="button"
        loading={busy}
        onClick={() => inputRef.current?.click()}
        className="self-start"
      >
        <FileUp aria-hidden="true" /> {hasPdf ? "Replace PDF" : "Upload PDF"}
      </Button>
    </div>
  );
}

export function ResourceManager({
  lessonId,
  resources,
}: {
  lessonId: string;
  resources: { id: string; label: string; storage_path: string }[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const { busy, upload } = useFileUpload(lessonId, "resource");
  const { pending, run } = useBuilderAction();

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">Downloadable resources</h3>
        <p className="text-sm text-muted-foreground">
          Worksheets, code lists and slides. Students download them through short-lived links.
        </p>
      </div>
      {resources.length > 0 ? (
        <ul className="flex flex-col divide-y rounded-md border">
          {resources.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="min-w-0 truncate">{r.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${r.label}`}
                disabled={pending}
                onClick={() =>
                  run(
                    () => deleteResource(r.id),
                    () => router.refresh(),
                  )
                }
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No resources yet.</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor={`resource-label-${lessonId}`} className="text-sm font-semibold">
            Label shown to students
          </label>
          <Input
            id={`resource-label-${lessonId}`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. ICD-10-CM practice worksheet"
            maxLength={160}
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={RESOURCE_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) {
              void upload(file, label.trim() || file.name).then(() => setLabel(""));
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          loading={busy}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp aria-hidden="true" /> Add file
        </Button>
      </div>
    </div>
  );
}
