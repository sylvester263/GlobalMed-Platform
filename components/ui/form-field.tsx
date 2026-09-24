"use client";

import { CircleAlert } from "lucide-react";
import { useId } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type FormControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
};

type FormFieldProps = {
  label: string;
  /** Helper text shown under the control. */
  description?: string;
  /** Error message: what happened and how to fix it (docs/06 §9). */
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  /** Render the control with the wiring props spread onto it. */
  children: (control: FormControlProps) => React.ReactNode;
};

/**
 * Label above, helper text and error below, all linked to the control (MASTER.md §5).
 * Required fields say "(required)" in text, not only with an asterisk.
 */
export function FormField({
  label,
  description,
  error,
  required,
  className,
  id: idProp,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <Field data-invalid={error ? true : undefined} className={cn("gap-1.5", className)}>
      <FieldLabel htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span className="font-normal text-muted-foreground">(required)</span>}
      </FieldLabel>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {description && (
        <FieldDescription id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </FieldDescription>
      )}
      {error && (
        <FieldError id={errorId} className="flex items-start gap-1.5">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </FieldError>
      )}
    </Field>
  );
}
