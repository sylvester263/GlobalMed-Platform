"use client";

import type Hls from "hls.js";
import { Loader2, Lock, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

type Playback = {
  src: string;
  poster: string;
  captions: { src: string; srclang: string; label: string }[];
  resumeAt: number;
  completed: boolean;
};

type PlayerState =
  | { kind: "loading" }
  | { kind: "ready"; playback: Playback }
  | { kind: "error"; message: string; retry: boolean };

const SAVE_EVERY_MS = 15_000;
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

type VideoPlayerProps = {
  lessonId: string;
  title: string;
  /** Shown as a light, moving watermark (docs/08 §2 anti-sharing). */
  watermark: string;
  /** Called once when the server reports the lesson became complete. */
  onComplete?: () => void;
};

/**
 * Course video player (P4-3/P4-4): signed HLS from Bunny, resume from the saved
 * position, progress saved every 15s, on pause and when the page is hidden, 0.75–2x
 * speed, captions, and an expired-token refresh. Native controls keep keyboard and
 * screen-reader support; hls.js is loaded only where HLS isn't native (not Safari).
 */
export function VideoPlayer({ lessonId, title, watermark, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastSavedRef = useRef(0);
  const completedRef = useRef(false);
  const [state, setState] = useState<PlayerState>({ kind: "loading" });
  const [speed, setSpeed] = useState(1);
  const reduced = usePrefersReducedMotion();

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    const res = await fetch(`/api/video/token?lessonId=${lessonId}`, { cache: "no-store" });
    const body = (await res.json().catch(() => ({}))) as Partial<Playback> & { error?: string };
    if (!res.ok || !body.src) {
      setState({
        kind: "error",
        message: body.error ?? "This video couldn't load.",
        retry: res.status !== 403,
      });
      return;
    }
    completedRef.current = Boolean(body.completed);
    setState({ kind: "ready", playback: body as Playback });
  }, [lessonId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    (beacon = false) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.currentTime)) return;
      const position = Math.floor(video.currentTime);
      if (position === lastSavedRef.current && !beacon) return;
      lastSavedRef.current = position;
      const payload = JSON.stringify({ lessonId, position });
      if (beacon && "sendBeacon" in navigator) {
        navigator.sendBeacon("/api/progress", payload);
        return;
      }
      void fetch("/api/progress", { method: "POST", body: payload, keepalive: true })
        .then((r) => (r.ok ? (r.json() as Promise<{ justCompleted?: boolean }>) : null))
        .then((result) => {
          if (result?.justCompleted && !completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
        })
        .catch(() => undefined);
    },
    [lessonId, onComplete],
  );

  // Attach the stream once playback URLs arrive.
  useEffect(() => {
    if (state.kind !== "ready") return;
    const video = videoRef.current;
    if (!video) return;
    const { src, resumeAt } = state.playback;
    let cancelled = false;

    const resume = () => {
      if (resumeAt > 0 && resumeAt < (video.duration || Infinity) - 5) video.currentTime = resumeAt;
      lastSavedRef.current = Math.floor(resumeAt);
    };
    video.addEventListener("loadedmetadata", resume, { once: true });

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      void import("hls.js").then(({ default: HlsClass }) => {
        if (cancelled) return;
        if (!HlsClass.isSupported()) {
          setState({
            kind: "error",
            message: "Your browser can't play this video. Try Chrome, Edge, Firefox or Safari.",
            retry: false,
          });
          return;
        }
        const hls = new HlsClass({ maxBufferLength: 30 });
        hlsRef.current = hls;
        hls.on(HlsClass.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          // 403s after the 2h token expiry: fetch fresh URLs and carry on from here.
          if (data.type === HlsClass.ErrorTypes.NETWORK_ERROR) void load();
          else hls.recoverMediaError();
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", resume);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [state, load]);

  // Periodic + lifecycle saves.
  useEffect(() => {
    if (state.kind !== "ready") return;
    const video = videoRef.current;
    if (!video) return;
    const interval = window.setInterval(() => {
      if (!video.paused) save();
    }, SAVE_EVERY_MS);
    const onPause = () => save();
    const onEnded = () => save();
    const onHide = () => {
      if (document.visibilityState === "hidden") save(true);
    };
    const onPageHide = () => save(true);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.clearInterval(interval);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [state.kind, save]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed, state.kind]);

  return (
    <div className="overflow-hidden rounded-lg border bg-ink">
      <div className="@container relative aspect-video">
        {state.kind === "ready" && (
          <>
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={state.playback.poster}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              aria-label={`Video: ${title}`}
              className="absolute inset-0 size-full bg-ink"
              crossOrigin="anonymous"
            >
              {state.playback.captions.map((c, i) => (
                <track
                  key={c.srclang}
                  kind="captions"
                  src={c.src}
                  srcLang={c.srclang}
                  label={c.label}
                  default={i === 0}
                />
              ))}
            </video>
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-4 left-4 font-mono text-xs text-white/35 select-none",
                !reduced && "video-watermark",
              )}
            >
              {watermark}
            </span>
          </>
        )}
        {state.kind === "loading" && (
          <p
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-white"
          >
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            Loading video…
          </p>
        )}
        {state.kind === "error" && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white"
          >
            <Lock aria-hidden="true" className="size-6" />
            <p>{state.message}</p>
            {state.retry && (
              <button
                type="button"
                onClick={() => void load()}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/30 px-4 font-semibold hover:bg-white/10"
              >
                <RotateCcw aria-hidden="true" className="size-4" /> Try again
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-2 text-sm text-white">
        <p className="truncate font-semibold">{title}</p>
        <label className="flex items-center gap-2">
          <span className="text-white/80">Speed</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-9 cursor-pointer rounded-md border border-white/30 bg-ink px-2 text-white"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
