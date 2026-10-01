import { ogImage, ogSize } from "@/lib/seo/og-image";

export const alt = "GlobalMed Updates";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Social share image for /updates: the default card with the page title. */
export default function OpengraphImage() {
  return ogImage({ background: "default", title: alt });
}
