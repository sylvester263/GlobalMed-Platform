"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Turnstile } from "@/components/marketing/turnstile";
import { CheckStamp } from "@/components/motion/check-stamp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PhiNotice } from "@/components/ui/phi-notice";
import { Textarea } from "@/components/ui/textarea";
import {
  aapcCourseFacts,
  aapcCourses,
  courseForRegistration,
  formatUsdPrice,
  registrationCourses,
  type AapcCourseSlug,
  type RegistrationCourse,
} from "@/data/courses";
import { track } from "@/lib/analytics";
import { useUtm } from "@/lib/hooks/use-utm";
import { submitAapcRegistration } from "@/lib/leads/actions";
import { cn } from "@/lib/utils";
import {
  aapcRegistrationSchema,
  contactTimes,
  registrationBackgrounds,
  registrationConsentText,
  type AapcRegistrationInput,
} from "@/lib/validation/leads";

function courseForSlug(slug: string | null): RegistrationCourse | undefined {
  const course = aapcCourses.find((c) => c.slug === (slug as AapcCourseSlug));
  return registrationCourses.find((label) => label === course?.registrationLabel);
}

/**
 * "Register for AAPC Training" (client, 2026-09-26): replaces online checkout. Saved as a
 * lead (source "aapc_registration"); the team contacts the student to complete their AAPC
 * enrollment. The course is preselected from the page, or from ?course=cpc|cpb|cpc-cpb.
 */
export function AapcRegistrationForm({
  defaultCourse,
  title = "Register for AAPC Training",
}: {
  defaultCourse?: AapcCourseSlug;
  /** Form heading; the course pages' band already says "Register for AAPC Training". */
  title?: string;
}) {
  const utm = useUtm();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [pending, startTransition] = useTransition();
  const successRef = useRef<HTMLDivElement>(null);
  const onToken = useCallback((token: string | undefined) => setTurnstileToken(token), []);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AapcRegistrationInput>({
    resolver: zodResolver(aapcRegistrationSchema),
    mode: "onTouched",
    defaultValues: { message: "", course: courseForSlug(defaultCourse ?? null) },
  });

  const selected = courseForRegistration(watch("course") ?? "");

  // "Register Now" on the course cards links to ?course=<slug>#register.
  useEffect(() => {
    const fromUrl = courseForSlug(new URLSearchParams(window.location.search).get("course"));
    if (fromUrl) setValue("course", fromUrl);
  }, [setValue]);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      setServerError(null);
      const result = await submitAapcRegistration({ ...values, utm, turnstileToken });
      if (result.ok) {
        track("lead_submit", { source: "aapc_registration" });
        setSent(true);
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      setServerError(result.message);
      if (result.fieldErrors) {
        const entries = Object.entries(result.fieldErrors) as [
          FieldPath<AapcRegistrationInput>,
          string,
        ][];
        for (const [field, message] of entries) setError(field, { message });
        if (entries[0]) setFocus(entries[0][0]);
      }
    }),
  );

  if (sent) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center text-foreground focus:outline-none"
      >
        <CheckStamp size={72} />
        <h3 className="text-2xl">Thank you, your registration is in</h3>
        <p className="max-w-md text-muted-foreground">
          Our team will contact you to complete your AAPC enrollment. For a faster reply, message us
          on WhatsApp.
        </p>
        <a
          href={aapcCourseFacts.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          <MessageCircle aria-hidden="true" /> Chat on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="register-form-title"
      className="flex flex-col gap-5 rounded-lg border bg-card p-6 text-foreground md:p-8"
    >
      <div className="flex flex-col gap-1">
        <h3 id="register-form-title" className="text-2xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Our team will contact you to complete your AAPC enrollment.
        </p>
      </div>
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Full name" required error={errors.name?.message}>
          {(c) => <Input {...c} autoComplete="name" {...register("name")} />}
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          {(c) => <Input {...c} type="email" autoComplete="email" {...register("email")} />}
        </FormField>
        <FormField label="WhatsApp number" required error={errors.whatsapp?.message}>
          {(c) => (
            <Input
              {...c}
              type="tel"
              autoComplete="tel"
              placeholder="+92 300 1234567"
              {...register("whatsapp")}
            />
          )}
        </FormField>
        <FormField label="City" required error={errors.city?.message}>
          {(c) => <Input {...c} autoComplete="address-level2" {...register("city")} />}
        </FormField>
        <FormField
          label="Course"
          required
          description={
            selected
              ? `Price: ${formatUsdPrice(selected.priceUsd)}${selected.priceSaving ? ` (${selected.priceSaving})` : ""}`
              : undefined
          }
          error={errors.course?.message}
        >
          {(c) => (
            <NativeSelect {...c} {...register("course")}>
              <option value="">Choose a course</option>
              {registrationCourses.map((course) => {
                const info = courseForRegistration(course);
                return (
                  <option key={course} value={course}>
                    {info ? `${course} — ${formatUsdPrice(info.priceUsd)}` : course}
                  </option>
                );
              })}
            </NativeSelect>
          )}
        </FormField>
        <FormField label="Current background" required error={errors.background?.message}>
          {(c) => (
            <NativeSelect {...c} defaultValue="" {...register("background")}>
              <option value="" disabled>
                Choose your background
              </option>
              {registrationBackgrounds.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <FormField
          label="Preferred contact time"
          required
          error={errors.contactTime?.message}
          className="md:col-span-2"
        >
          {(c) => (
            <NativeSelect {...c} defaultValue="" {...register("contactTime")}>
              <option value="" disabled>
                Choose a time
              </option>
              {contactTimes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <FormField
          label="Message"
          description="Optional."
          error={errors.message?.message}
          className="md:col-span-2"
        >
          {(c) => <Textarea {...c} rows={4} {...register("message")} />}
        </FormField>
      </div>
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-primary"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          <span>
            {registrationConsentText} <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="text-sm text-destructive">
            {errors.consent.message}
          </p>
        )}
      </div>
      <Turnstile onToken={onToken} />
      <PhiNotice />
      <Button type="submit" size="lg" loading={pending} className="self-start">
        Register Now
      </Button>
    </form>
  );
}
