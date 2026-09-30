import { ogImage, ogSize } from "@/lib/seo/og-image";

export const alt = "Medical Billing and Coding Blog";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B22). */
export default function OpengraphImage() {
  return ogImage({ background: "blog", title: alt });
}
