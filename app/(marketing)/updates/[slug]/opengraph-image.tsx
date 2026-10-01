import sharp from "sharp";

import { ogImage, ogSize } from "@/lib/seo/og-image";
import { getLiveUpdate, updateImageUrl } from "@/lib/updates/data";

export const alt = "GlobalMed update";
export const size = ogSize;
export const contentType = "image/jpeg";

type Props = { params: Promise<{ slug: string }> };

/**
 * Share image: the update's own photo (cropped to 1200 × 630 JPEG, since WebP isn't safe for
 * every social network), or the default card with the update's title.
 */
export default async function OpengraphImage({ params }: Props) {
  const update = await getLiveUpdate((await params).slug);
  const imageUrl = updateImageUrl(update?.imagePath ?? null);
  if (imageUrl) {
    const res = await fetch(imageUrl).catch(() => null);
    if (res?.ok) {
      const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
        .resize(ogSize.width, ogSize.height, { fit: "cover" })
        .jpeg({ quality: 82 })
        .toBuffer();
      return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
    }
  }
  return ogImage({ background: "default", title: update?.title ?? "GlobalMed Updates" });
}
