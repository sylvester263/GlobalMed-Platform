import "server-only";

import { timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { signedDirectoryUrl, tusSignature } from "@/lib/video/bunny-signing";

const API = "https://video.bunnycdn.com";
/** docs/08 §2: playback URLs expire after two hours. */
export const PLAYBACK_TTL_SECONDS = 2 * 60 * 60;
const UPLOAD_TTL_SECONDS = 6 * 60 * 60;

function config() {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  const tokenKey = process.env.BUNNY_STREAM_TOKEN_AUTH_KEY;
  const hostname = process.env.BUNNY_CDN_HOSTNAME;
  if (!libraryId || !apiKey || !tokenKey || !hostname) return null;
  return { libraryId, apiKey, tokenKey, hostname };
}

export function bunnyConfigured(): boolean {
  return config() !== null;
}

/** Bunny Stream video status codes. */
const STATUS = {
  created: 0,
  uploaded: 1,
  processing: 2,
  transcoding: 3,
  finished: 4,
  error: 5,
  uploadFailed: 6,
} as const;

const videoSchema = z.object({
  guid: z.string(),
  videoLibraryId: z.number(),
  status: z.number(),
  length: z.number().default(0),
  width: z.number().optional(),
  height: z.number().optional(),
  captions: z.array(z.object({ srclang: z.string(), label: z.string() })).default([]),
});
export type BunnyVideo = z.infer<typeof videoSchema>;

export function lessonStatusFor(video: BunnyVideo): "processing" | "ready" | "failed" {
  if (video.status === STATUS.finished) return "ready";
  if (video.status === STATUS.error || video.status === STATUS.uploadFailed) return "failed";
  return "processing";
}

async function api<T>(
  path: string,
  init: RequestInit & { schema: z.ZodType<T> },
): Promise<T | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        AccessKey: cfg.apiKey,
        accept: "application/json",
        "content-type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return init.schema.parse(await res.json());
  } catch {
    return null;
  }
}

/** Creates an empty video in the library and returns TUS credentials for the browser. */
export async function createUpload(title: string): Promise<{
  videoId: string;
  endpoint: string;
  headers: Record<string, string>;
} | null> {
  const cfg = config();
  if (!cfg) return null;
  const video = await api(`/library/${cfg.libraryId}/videos`, {
    method: "POST",
    body: JSON.stringify({ title: title.slice(0, 200) }),
    schema: videoSchema.pick({ guid: true }),
  });
  if (!video) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + UPLOAD_TTL_SECONDS;
  return {
    videoId: video.guid,
    endpoint: `${API}/tusupload`,
    // The API key never leaves the server; the browser only gets a scoped, expiring signature.
    headers: {
      AuthorizationSignature: tusSignature({
        libraryId: cfg.libraryId,
        apiKey: cfg.apiKey,
        expiresAt,
        videoId: video.guid,
      }),
      AuthorizationExpire: String(expiresAt),
      VideoId: video.guid,
      LibraryId: cfg.libraryId,
    },
  };
}

export async function getVideo(videoId: string): Promise<BunnyVideo | null> {
  const cfg = config();
  if (!cfg || !/^[0-9a-f-]{36}$/i.test(videoId)) return null;
  return api(`/library/${cfg.libraryId}/videos/${videoId}`, { method: "GET", schema: videoSchema });
}

export async function deleteVideo(videoId: string): Promise<void> {
  const cfg = config();
  if (!cfg || !/^[0-9a-f-]{36}$/i.test(videoId)) return;
  await api(`/library/${cfg.libraryId}/videos/${videoId}`, {
    method: "DELETE",
    schema: z.unknown(),
  });
}

export function isOurLibrary(libraryId: number | string): boolean {
  const cfg = config();
  return cfg !== null && String(libraryId) === cfg.libraryId;
}

/** Signed HLS playlist, poster and caption URLs for one video (docs/08 §2). */
export function playbackUrls(
  videoId: string,
  captions: { srclang: string; label: string }[],
): {
  src: string;
  poster: string;
  captions: { src: string; srclang: string; label: string }[];
  expiresAt: number;
} | null {
  const cfg = config();
  if (!cfg || !/^[0-9a-f-]{36}$/i.test(videoId)) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + PLAYBACK_TTL_SECONDS;
  const sign = (file: string) =>
    signedDirectoryUrl({
      hostname: cfg.hostname,
      securityKey: cfg.tokenKey,
      directory: `/${videoId}/`,
      file,
      expiresAt,
    });
  return {
    src: sign("playlist.m3u8"),
    poster: sign("thumbnail.jpg"),
    captions: captions.map((c) => ({ ...c, src: sign(`captions/${c.srclang}.vtt`) })),
    expiresAt,
  };
}

/** Webhook calls carry ?token=BUNNY_WEBHOOK_SECRET; compared in constant time. */
export function webhookTokenValid(token: string | null): boolean {
  const secret = process.env.BUNNY_WEBHOOK_SECRET;
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
