import { ogImage, ogSize } from "@/lib/seo/og-image";
import { getAapcCourse } from "@/data/courses";
import { site } from "@/lib/site";

export const alt = getAapcCourse("cpb")?.title ?? site.name;
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B03). */
export default function OpengraphImage() {
  return ogImage({ background: "education", title: alt });
}
