import { ogImage, ogSize } from "@/lib/seo/og-image";

export const alt = "Medical Billing & Coding Services";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B04). */
export default function OpengraphImage() {
  return ogImage({ background: "services", title: alt });
}
