import { ogImage, ogSize } from "@/lib/seo/og-image";
import { getPost } from "@/lib/content/markdown";
import { site } from "@/lib/site";

export const alt = "GlobalMed blog article";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B22). */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ background: "blog", title: getPost(slug)?.title ?? site.name });
}
