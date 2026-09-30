import { ogImage, ogSize } from "@/lib/seo/og-image";

export const alt = "Careers at GlobalMed";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B23). */
export default function OpengraphImage() {
  return ogImage({ background: "careers", title: alt });
}
