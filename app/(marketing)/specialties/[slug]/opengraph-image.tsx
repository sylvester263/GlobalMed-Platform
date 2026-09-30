import { ogImage, ogSize } from "@/lib/seo/og-image";
import { getSpecialty } from "@/lib/content";
import { site } from "@/lib/site";

export const alt = "GlobalMed specialty billing and coding";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B04). */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ background: "services", title: getSpecialty(slug)?.metaTitle ?? site.name });
}
