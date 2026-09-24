import { Captions, Loader2, Lock, Play, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VideoPlayerShellProps = {
  title: string;
  state: "ready" | "processing" | "locked";
  /** Seconds to resume from (docs/02 L-3). */
  resumeAt?: number;
  completed?: boolean;
  className?: string;
};

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Frame of the course player (P4-3 mounts the signed Bunny HLS player inside).
 * Reserves 16:9 so nothing shifts when the stream loads.
 */
export function VideoPlayerShell({
  title,
  state,
  resumeAt,
  completed = false,
  className,
}: VideoPlayerShellProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-ink", className)}>
      <div className="relative flex aspect-video items-center justify-center text-white">
        {state === "ready" && (
          <button
            type="button"
            aria-label={`Play lesson: ${title}`}
            className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-teal shadow-lg transition-colors hover:bg-teal-hover"
          >
            <Play aria-hidden="true" className="ml-1 size-7 fill-current" />
          </button>
        )}
        {state === "processing" && (
          <p className="flex items-center gap-2 text-sm" role="status">
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            Video is processing. It will be ready in a few minutes.
          </p>
        )}
        {state === "locked" && (
          <p className="flex flex-col items-center gap-2 px-6 text-center text-sm">
            <Lock aria-hidden="true" className="size-6" />
            Enroll in this course to watch this lesson.
          </p>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {completed && (
            <Badge variant="success" className="gap-1">
              <RotateCcw aria-hidden="true" />
              Watch again
            </Badge>
          )}
          {!completed && resumeAt !== undefined && resumeAt > 0 && (
            <Badge variant="secondary">Resume from {formatTime(resumeAt)}</Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 text-sm text-white">
        <p className="truncate font-semibold">{title}</p>
        <div className="flex items-center gap-3 text-white/80">
          <span className="tabular-nums">1×</span>
          <Captions aria-hidden="true" className="size-4" />
        </div>
      </div>
    </div>
  );
}
