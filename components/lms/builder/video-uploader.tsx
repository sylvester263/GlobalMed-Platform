"use client";

import { RefreshCw, Upload as UploadIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Upload } from "tus-js-client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { markVideoUploaded, refreshVideoStatus } from "@/lib/lms/builder-actions";

import { useBuilderAction } from "./use-builder-action";

const MAX_VIDEO_BYTES = 5 * 1024 * 1024 * 1024;

const statusText: Record<
  string,
  { label: string; variant: "neutral" | "warning" | "success" | "destructive" }
> = {
  none: { label: "No video yet", variant: "neutral" },
  uploading: { label: "Upload not finished", variant: "warning" },
  processing: { label: "Processing at Bunny", variant: "warning" },
  ready: { label: "Ready to watch", variant: "success" },
  failed: { label: "Processing failed — upload again", variant: "destructive" },
};

type UploadCredentials = {
  videoId: string;
  endpoint: string;
  headers: Record<string, string>;
};

/**
 * P4-2: resumable TUS upload straight from the browser to Bunny Stream. Our server only
 * issues short-lived signed headers (app/api/video/upload), so the API key never leaves it.
 */
export function VideoUploader({
  lessonId,
  status,
  durationSec,
}: {
  lessonId: string;
  status: string;
  durationSec: number | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<Upload | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const { pending, run } = useBuilderAction();
  const badge = statusText[status] ?? statusText.none;

  async function start(file: File) {
    if (!file.type.startsWith("video/")) {
      toast.error("Choose a video file (MP4, MOV or WebM).");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error("Videos can be up to 5 GB.");
      return;
    }
    setProgress(0);
    const response = await fetch("/api/video/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    const body = (await response.json().catch(() => ({}))) as Partial<UploadCredentials> & {
      error?: string;
    };
    if (!response.ok || !body.endpoint || !body.headers || !body.videoId) {
      setProgress(null);
      toast.error(body.error ?? "Couldn't start the upload.");
      return;
    }

    const { Upload: TusUpload } = await import("tus-js-client");
    const upload = new TusUpload(file, {
      endpoint: body.endpoint,
      headers: body.headers,
      retryDelays: [0, 3000, 10000, 30000],
      chunkSize: 50 * 1024 * 1024,
      metadata: { filetype: file.type, title: file.name },
      onProgress: (sent, total) => setProgress(Math.round((sent / total) * 100)),
      onError: () => {
        setProgress(null);
        toast.error("The upload stopped. Check your connection and try again.");
      },
      onSuccess: () => {
        setProgress(null);
        uploadRef.current = null;
        run(
          () => markVideoUploaded(lessonId),
          () => router.refresh(),
        );
      },
    });
    uploadRef.current = upload;
    upload.start();
  }

  function cancel() {
    void uploadRef.current?.abort(true);
    uploadRef.current = null;
    setProgress(null);
    toast("Upload cancelled.");
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">Lesson video</h3>
          <p className="text-sm text-muted-foreground">
            MP4, MOV or WebM up to 5 GB. Large files upload in chunks and resume after a dropped
            connection.
          </p>
        </div>
        <Badge variant={badge?.variant}>{badge?.label}</Badge>
      </div>
      {status === "ready" && durationSec ? (
        <p className="text-sm">
          Length: {Math.floor(durationSec / 60)} min {durationSec % 60} s
        </p>
      ) : null}

      {progress !== null ? (
        <div className="flex flex-col gap-2" aria-live="polite">
          <Progress value={progress} aria-label="Upload progress">
            <span className="text-sm font-semibold">Uploading… {progress}%</span>
          </Progress>
          <p className="text-sm text-muted-foreground">
            Keep this tab open until the upload finishes.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={cancel} className="self-start">
            <X aria-hidden="true" /> Cancel upload
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void start(file);
            }}
          />
          <Button type="button" onClick={() => inputRef.current?.click()}>
            <UploadIcon aria-hidden="true" /> {status === "none" ? "Upload video" : "Replace video"}
          </Button>
          {(status === "processing" || status === "uploading") && (
            <Button
              type="button"
              variant="outline"
              loading={pending}
              onClick={() =>
                run(
                  () => refreshVideoStatus(lessonId),
                  () => router.refresh(),
                )
              }
            >
              <RefreshCw aria-hidden="true" /> Check status
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
