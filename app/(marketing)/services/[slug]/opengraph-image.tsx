import { ogImage, ogSize } from "@/lib/seo/og-image";
import { getService } from "@/lib/content";
import { site } from "@/lib/site";

export const alt = "GlobalMed medical billing and coding services";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B04). */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ background: "services", title: getService(slug)?.metaTitle ?? site.name });
}
