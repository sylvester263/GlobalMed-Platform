import "server-only";

import sharp from "sharp";

import { createAdminClient } from "@/lib/db/admin";
import { UPDATE_IMAGES_BUCKET } from "@/lib/updates/data";

export const UPDATE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const accepted = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Converts an uploaded photo to a 1600 × 900 (16:9) WebP and stores it in the public
 * "update-images" bucket under a random name (never the uploader's filename). Call only after
 * checking the caller's role. Returns the storage path.
 */
export async function storeUpdateImage(file: File): Promise<string> {
  if (!accepted.has(file.type)) throw new Error("Use a JPG, PNG or WebP image.");
  if (file.size > UPDATE_IMAGE_MAX_BYTES) throw new Error("The image must be 5 MB or smaller.");

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate() // respect the phone's orientation
    .resize(1600, 900, { fit: "cover", position: "attention" })
    .webp({ quality: 80 })
    .toBuffer();

  const path = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}.webp`;
  const { error } = await createAdminClient()
    .storage.from(UPDATE_IMAGES_BUCKET)
    .upload(path, webp, { contentType: "image/webp", upsert: false });
  if (error) throw new Error("Could not store the image.");
  return path;
}
