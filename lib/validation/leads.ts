import { z } from "zod";

/**
 * Lead form schemas, shared by the client forms and the Server Actions.
 * Business information only: no field asks for patient data (docs/11 §1).
 */

const name = z
  .string()
  .trim()
  .min(2, "Enter your full name.")
  .max(120, "Keep your name under 120 characters.");
const email = z
  .email("Enter an email address in the format name@practice.com.")
  .trim()
  .max(254, "That email address is too long.");
const phone = z
  .string()
  .trim()
  .max(30, "Keep the phone number under 30 characters.")
  .regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + ( ) - only.")
  .optional()
  .or(z.literal(""));

export const claimVolumes = [
  "Under 500 claims a month",
  "500–1,500 claims a month",
  "1,500–5,000 claims a month",
  "Over 5,000 claims a month",
  "Not sure",
] as const;

export const billingSetups = [
  "In-house billing team",
  "Another billing company",
  "The physician or office manager does it",
  "New practice, not billing yet",
] as const;

export const bestTimes = ["Morning (ET)", "Afternoon (ET)", "Evening (ET)", "Any time"] as const;

export const utmSchema = z
  .object({
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(100).optional(),
    utm_term: z.string().max(100).optional(),
    utm_content: z.string().max(100).optional(),
  })
  .partial();

/** Step 1 of the free billing audit. */
export const auditPracticeSchema = z.object({
  practiceName: z.string().trim().min(2, "Enter your practice name.").max(160),
  specialty: z.string().trim().min(2, "Tell us your main specialty.").max(120),
  claimVolume: z.enum(claimVolumes, "Choose your approximate monthly claim volume."),
  billingSetup: z.enum(billingSetups, "Choose how you bill today."),
});

/** Step 2 of the free billing audit. */
export const auditContactSchema = z.object({
  name,
  role: z.string().trim().min(2, "Tell us your role, e.g. Office manager.").max(120),
  email,
  phone,
  bestTime: z.enum(bestTimes, "Choose a good time to call."),
});

export const auditLeadSchema = auditPracticeSchema.extend(auditContactSchema.shape).extend({
  utm: utmSchema.optional(),
  turnstileToken: z.string().optional(),
});
export type AuditLeadInput = z.infer<typeof auditLeadSchema>;

export const contactInterests = [
  "Billing and coding services",
  "Transcription or AI documentation",
  "Courses and certification",
  "Corporate training",
  "Something else",
] as const;

export const contactLeadSchema = z.object({
  name,
  email,
  phone,
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  interest: z.enum(contactInterests, "Choose what you'd like to talk about."),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(2000, "Keep your message under 2,000 characters."),
  utm: utmSchema.optional(),
  turnstileToken: z.string().optional(),
});
export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

export const newsletterSchema = z.object({
  email,
  turnstileToken: z.string().optional(),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Result shape returned by every public form action. */
export type FormResult =
  { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };
