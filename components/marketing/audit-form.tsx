"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Turnstile } from "@/components/marketing/turnstile";
import { ClaimLine } from "@/components/motion/claim-line";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PhiNotice } from "@/components/ui/phi-notice";
import { track } from "@/lib/analytics";
import { useUtm } from "@/lib/hooks/use-utm";
import { submitAuditRequest } from "@/lib/leads/actions";
import {
  auditLeadSchema,
  bestTimes,
  billingSetups,
  claimVolumes,
  type AuditLeadInput,
} from "@/lib/validation/leads";

const steps: { title: string; fields: FieldPath<AuditLeadInput>[] }[] = [
  {
    title: "About your practice",
    fields: ["practiceName", "specialty", "claimVolume", "billingSetup"],
  },
  { title: "How we reach you", fields: ["name", "role", "email", "phone", "bestTime"] },
];

/**
 * Free billing audit form (docs/02 W-4, P2-5). Two steps with progress on the claim line
 * (MG-14). Business details only; the server re-validates everything.
 */
export function AuditForm() {
  const router = useRouter();
  const utm = useUtm();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<AuditLeadInput>({
    resolver: zodResolver(auditLeadSchema),
    mode: "onTouched",
    defaultValues: { phone: "" },
  });

  const onToken = useCallback((token: string | undefined) => setTurnstileToken(token), []);

  async function next() {
    // Focus is handled here, not with trigger's shouldFocus: that option re-focused a field
    // after we had moved focus to the next step's heading.
    const fields = steps[0]!.fields;
    const valid = await trigger(fields);
    if (!valid) {
      const firstInvalid = fields.find((field) => getFieldState(field).invalid);
      if (firstInvalid) setFocus(firstInvalid);
      return;
    }
    setStep(1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function back() {
    setStep(0);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      setServerError(null);
      const result = await submitAuditRequest({ ...values, utm, turnstileToken });
      if (result.ok) {
        track("audit_request");
        track("lead_submit", { source: "audit_form" });
        router.push("/free-billing-audit/thank-you");
        return;
      }
      setServerError(result.message);
      if (result.fieldErrors) {
        const entries = Object.entries(result.fieldErrors) as [FieldPath<AuditLeadInput>, string][];
        for (const [field, message] of entries) setError(field, { message });
        const first = entries[0]?.[0];
        if (first) {
          if (steps[0]!.fields.includes(first)) setStep(0);
          setFocus(first);
        }
      }
    }),
  );

  const current = steps[step]!;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
          Step {step + 1} of {steps.length}
        </p>
        {/* MG-14: progress on the claim line; the gold tick is the finished request. */}
        <ClaimLine ticks={3} filled={step + 1} goldEnd trigger="static" />
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl focus:outline-none">
          {current.title}
        </h2>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className={step === 0 ? "grid gap-5 md:grid-cols-2" : "hidden"}>
        <FormField
          label="Practice name"
          required
          error={errors.practiceName?.message}
          className="md:col-span-2"
        >
          {(c) => <Input {...c} autoComplete="organization" {...register("practiceName")} />}
        </FormField>
        <FormField
          label="Main specialty"
          required
          description="For example: family medicine, cardiology."
          error={errors.specialty?.message}
        >
          {(c) => <Input {...c} {...register("specialty")} />}
        </FormField>
        <FormField label="Monthly claim volume" required error={errors.claimVolume?.message}>
          {(c) => (
            <NativeSelect {...c} defaultValue="" {...register("claimVolume")}>
              <option value="" disabled>
                Choose a range
              </option>
              {claimVolumes.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <FormField
          label="How do you bill today?"
          required
          error={errors.billingSetup?.message}
          className="md:col-span-2"
        >
          {(c) => (
            <NativeSelect {...c} defaultValue="" {...register("billingSetup")}>
              <option value="" disabled>
                Choose one
              </option>
              {billingSetups.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
      </div>

      <div className={step === 1 ? "grid gap-5 md:grid-cols-2" : "hidden"}>
        <FormField label="Your name" required error={errors.name?.message}>
          {(c) => <Input {...c} autoComplete="name" {...register("name")} />}
        </FormField>
        <FormField
          label="Your role"
          required
          description="For example: office manager."
          error={errors.role?.message}
        >
          {(c) => <Input {...c} autoComplete="organization-title" {...register("role")} />}
        </FormField>
        <FormField label="Work email" required error={errors.email?.message}>
          {(c) => <Input {...c} type="email" autoComplete="email" {...register("email")} />}
        </FormField>
        <FormField label="Phone" description="Optional." error={errors.phone?.message}>
          {(c) => <Input {...c} type="tel" autoComplete="tel" {...register("phone")} />}
        </FormField>
        <FormField
          label="Best time to call"
          required
          error={errors.bestTime?.message}
          className="md:col-span-2"
        >
          {(c) => (
            <NativeSelect {...c} defaultValue="" {...register("bestTime")}>
              <option value="" disabled>
                Choose a time
              </option>
              {bestTimes.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <div className="md:col-span-2">
          <Turnstile onToken={onToken} />
        </div>
      </div>

      <PhiNotice />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step === 1 ? (
          <Button type="button" variant="ghost" size="lg" onClick={back}>
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
        ) : (
          <span />
        )}
        {/* Distinct keys: reusing one <button> let the step-1 click submit the form once it
            had re-rendered as type="submit" mid-event. */}
        {step === 0 ? (
          <Button key="continue" type="button" size="lg" onClick={next}>
            Continue <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button key="submit" type="submit" size="lg" loading={pending}>
            Book my free audit
          </Button>
        )}
      </div>
    </form>
  );
}
