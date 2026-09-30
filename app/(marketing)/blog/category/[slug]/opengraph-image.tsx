import { ogImage, ogSize } from "@/lib/seo/og-image";
import { postCategories } from "@/lib/content/markdown";
import { site } from "@/lib/site";

export const alt = "GlobalMed blog articles";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B22). */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({
    background: "blog",
    title: postCategories[slug] ? `${postCategories[slug]} articles` : site.name,
  });
}
