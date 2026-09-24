import "server-only";

import { createAdminClient } from "@/lib/db/admin";

export const LESSON_FILES_BUCKET = "lesson-files";
const DOWNLOAD_TTL_SECONDS = 10 * 60;

/** Allowed uploads for PDF lessons and resources (docs/11 §4: type + size checks). */
export const allowedResourceTypes: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "image/png": "png",
  "image/jpeg": "jpg",
  "text/csv": "csv",
};
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** Storage path convention: {courseId}/{lessonId}/{random}.{ext} — never the user's filename. */
export function storagePath(courseId: string, lessonId: string, ext: string): string {
  return `${courseId}/${lessonId}/${crypto.randomUUID()}.${ext}`;
}

/** Short-lived download link — only call after checking the viewer may see the lesson. */
export async function signedDownloadUrl(
  path: string,
  downloadName?: string,
): Promise<string | null> {
  const { data } = await createAdminClient()
    .storage.from(LESSON_FILES_BUCKET)
    .createSignedUrl(
      path,
      DOWNLOAD_TTL_SECONDS,
      downloadName ? { download: downloadName } : undefined,
    );
  return data?.signedUrl ?? null;
}

/** One-time upload URL — only call after checking the caller manages the course. */
export async function signedUploadUrl(
  path: string,
): Promise<{ path: string; token: string } | null> {
  const { data } = await createAdminClient()
    .storage.from(LESSON_FILES_BUCKET)
    .createSignedUploadUrl(path);
  return data ? { path: data.path, token: data.token } : null;
}

export async function removeFile(path: string): Promise<void> {
  await createAdminClient().storage.from(LESSON_FILES_BUCKET).remove([path]);
}
