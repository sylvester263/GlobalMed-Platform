import { createHash } from "node:crypto";

/**
 * Bunny signing helpers (pure, unit-tested). Kept separate from the API client so the
 * algorithms can be checked without credentials.
 * ⚠ Verify both against a real Bunny library in the first staging session (docs/17 §4).
 */

/**
 * TUS upload authorisation (Bunny Stream): SHA256 hex of
 * library_id + api_key + expiration_time + video_id.
 */
export function tusSignature(input: {
  libraryId: string;
  apiKey: string;
  expiresAt: number;
  videoId: string;
}): string {
  return createHash("sha256")
    .update(`${input.libraryId}${input.apiKey}${input.expiresAt}${input.videoId}`)
    .digest("hex");
}

function base64Url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Bunny CDN "advanced" token authentication with a directory token: one token signs the
 * whole `/{videoId}/` path, so the HLS playlist, every segment, the thumbnail and captions
 * load with it. Token = base64url(sha256_raw(securityKey + signaturePath + expires +
 * sorted "key=value" params)), with `token_path` included in the params. The token goes in
 * the URL path (`/bcdn_token=…&expires=…&token_path=…/`) so relative segment URLs inherit it.
 */
export function signedDirectoryUrl(input: {
  hostname: string;
  securityKey: string;
  directory: string;
  file: string;
  expiresAt: number;
}): string {
  const signaturePath = input.directory.endsWith("/") ? input.directory : `${input.directory}/`;
  const params: Record<string, string> = { token_path: signaturePath };
  const parameterData = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const hashable = `${input.securityKey}${signaturePath}${input.expiresAt}${parameterData}`;
  const token = base64Url(createHash("sha256").update(hashable).digest());
  const encodedPath = encodeURIComponent(signaturePath);
  return `https://${input.hostname}/bcdn_token=${token}&expires=${input.expiresAt}&token_path=${encodedPath}${signaturePath}${input.file}`;
}
