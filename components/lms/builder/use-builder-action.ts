"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { BuilderResult } from "@/lib/lms/builder-actions";

/** Runs a builder server action, toasts the outcome and keeps field errors for the form. */
export function useBuilderAction() {
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function run(action: () => Promise<BuilderResult>, onSuccess?: () => void) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setFieldErrors({});
        if (result.message) toast.success(result.message);
        onSuccess?.();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
      }
    });
  }

  return { pending, fieldErrors, run };
}
