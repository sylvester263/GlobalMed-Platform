"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { AuthFormState } from "@/lib/validation/auth";

type TextFieldProps = {
  name: string;
  label: string;
  state: AuthFormState;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoFocus?: boolean;
};

/** Labelled input whose error comes from the server action's state. */
export function AuthTextField({
  name,
  label,
  state,
  type = "text",
  autoComplete,
  description,
  required = true,
  defaultValue,
  inputMode,
  maxLength,
  autoFocus,
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={state.fieldErrors?.[name]}
    >
      {(control) => (
        <Input
          {...control}
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          autoFocus={autoFocus}
          defaultValue={state.values?.[name] ?? defaultValue}
        />
      )}
    </FormField>
  );
}

/** Password input with a show/hide toggle. Never pre-filled from state. */
export function PasswordField({
  name = "password",
  label = "Password",
  state,
  autoComplete,
  description,
}: {
  name?: string;
  label?: string;
  state: AuthFormState;
  autoComplete: "current-password" | "new-password";
  description?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField label={label} required description={description} error={state.fieldErrors?.[name]}>
      {(control) => (
        <div className="relative">
          <Input
            {...control}
            name={name}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            maxLength={72}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute top-0 right-0 flex h-10 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      )}
    </FormField>
  );
}

/** Form-level message (error or success) from the action state. */
export function FormMessage({ state }: { state: AuthFormState }) {
  if (!state.message) return null;
  return (
    <Alert variant={state.status === "success" ? "success" : "destructive"}>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}
