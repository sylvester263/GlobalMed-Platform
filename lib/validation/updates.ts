import { z } from "zod";

import { updateCategories } from "@/lib/updates/logic";

const categoryIds = updateCategories.map((c) => c.id) as [string, ...string[]];

/** A site path ("/contact") or an https:// URL. */
const link = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/[^\s]+$/.test(v),
    "Use a site path (/…) or an https:// link.",
  );

/** Dashboard form for an update (Admin → Content → Updates). Checked again on the server. */
export const updateFormSchema = z
  .object({
    id: z.uuid().optional(),
    title: z.string().trim().min(3, "Add a title.").max(120),
    summary: z
      .string()
      .trim()
      .min(1, "Add the short text.")
      .max(280, "Keep the short text within 280 characters."),
    bodyMd: z.string().trim().max(20_000).optional(),
    category: z.enum(categoryIds),
    linkUrl: link.optional(),
    linkLabel: z.string().trim().max(40).optional(),
    publishAt: z.iso.datetime({ offset: true }),
    expiresAt: z.iso.datetime({ offset: true }).optional(),
    pinned: z.boolean(),
    status: z.enum(["draft", "published"]),
  })
  .refine((v) => !v.expiresAt || new Date(v.expiresAt) > new Date(v.publishAt), {
    path: ["expiresAt"],
    message: "The expiry must be after the publish date.",
  })
  .refine((v) => Boolean(v.linkUrl) === Boolean(v.linkLabel), {
    path: ["linkLabel"],
    message: "Add both the link and its button label, or neither.",
  });

export type UpdateForm = z.infer<typeof updateFormSchema>;
