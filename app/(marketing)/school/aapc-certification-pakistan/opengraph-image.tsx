import { ogImage, ogSize } from "@/lib/seo/og-image";

export const alt = "AAPC Certification in Pakistan: CPC® and CPB®";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image (B03). */
export default function OpengraphImage() {
  return ogImage({ background: "education", title: alt });
}
