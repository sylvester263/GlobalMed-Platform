"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState, useTransition } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Turnstile } from "@/components/marketing/turnstile";
import { CheckStamp } from "@/components/motion/check-stamp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PhiNotice } from "@/components/ui/phi-notice";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import { useUtm } from "@/lib/hooks/use-utm";
import { features } from "@/config/features";
import { submitContactEnquiry } from "@/lib/leads/actions";
import { contactInterests, contactLeadSchema, type ContactLeadInput } from "@/lib/validation/leads";

// "Corporate training" is offered only while that page is on. Hidden at client request — GlobalMed education plans are future scope.
const visibleContactInterests = contactInterests.filter(
  (i) => i !== "Corporate training" || features.corporateTraining,
);

type ContactFormProps = {
  defaultInterest?: (typeof contactInterests)[number];
};

/** General enquiry form → leads (source: contact). Business information only. */
export function ContactForm({ defaultInterest }: ContactFormProps) {
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
    formState: { errors },
  } = useForm<ContactLeadInput>({
    resolver: zodResolver(contactLeadSchema),
    mode: "onTouched",
    defaultValues: { phone: "", organisation: "", interest: defaultInterest },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      setServerError(null);
      const result = await submitContactEnquiry({ ...values, utm, turnstileToken });
      if (result.ok) {
        track("lead_submit", { source: "contact" });
        setSent(true);
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      setServerError(result.message);
      if (result.fieldErrors) {
        const entries = Object.entries(result.fieldErrors) as [
          FieldPath<ContactLeadInput>,
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
        className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center focus:outline-none"
      >
        <CheckStamp size={72} />
        <h3 className="text-2xl">Thanks, your message is on its way</h3>
        <p className="max-w-md text-muted-foreground">
          We reply within one business day. If it&apos;s urgent, call us or use WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-lg border bg-card p-6 md:p-8"
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Your name" required error={errors.name?.message}>
          {(c) => <Input {...c} autoComplete="name" {...register("name")} />}
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          {(c) => <Input {...c} type="email" autoComplete="email" {...register("email")} />}
        </FormField>
        <FormField label="Phone" description="Optional." error={errors.phone?.message}>
          {(c) => <Input {...c} type="tel" autoComplete="tel" {...register("phone")} />}
        </FormField>
        <FormField
          label="Practice or organisation"
          description="Optional."
          error={errors.organisation?.message}
        >
          {(c) => <Input {...c} autoComplete="organization" {...register("organisation")} />}
        </FormField>
        <FormField
          label="What would you like to talk about?"
          required
          error={errors.interest?.message}
          className="md:col-span-2"
        >
          {(c) => (
            <NativeSelect {...c} defaultValue={defaultInterest ?? ""} {...register("interest")}>
              <option value="" disabled>
                Choose a topic
              </option>
              {visibleContactInterests.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <FormField
          label="Message"
          required
          error={errors.message?.message}
          className="md:col-span-2"
        >
          {(c) => <Textarea {...c} rows={5} {...register("message")} />}
        </FormField>
      </div>
      <Turnstile onToken={onToken} />
      <PhiNotice />
      <Button type="submit" size="lg" loading={pending} className="self-start">
        Send message
      </Button>
    </form>
  );
}
