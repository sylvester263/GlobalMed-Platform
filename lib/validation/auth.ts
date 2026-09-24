import { z } from "zod";

// Trim and lower-case BEFORE validating: zod runs the email check first otherwise, so an
// address pasted or autofilled with a trailing space would be rejected.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "That email address is too long.")
  .pipe(z.email("Enter an email address in the format name@example.com."));

/**
 * docs/11 §2: at least 10 characters. 72 is bcrypt's input limit, which Supabase uses.
 * Breached-password checks are a Supabase project setting (enable on Pro).
 */
export const newPassword = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(72, "Use 72 characters or fewer.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(72),
  next: z.string().optional(),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email,
  password: newPassword,
  next: z.string().optional(),
});

export const resetRequestSchema = z.object({ email });

export const updatePasswordSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "The passwords don't match.",
  });

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app."),
  factorId: z.string().min(1),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  certificateName: z
    .string()
    .trim()
    .min(2, "Enter your name as it should appear on certificates.")
    .max(120),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
});

/** Result returned by auth form actions (used with useActionState). */
export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back so the form keeps what the person typed (never the password). */
  values?: Record<string, string>;
};

export const initialAuthState: AuthFormState = { status: "idle" };
