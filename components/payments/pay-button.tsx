"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

/** Submit button for the checkout form: shows progress while we open Stripe Checkout. */
export function PayButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
      {pending ? "Opening secure checkout…" : children}
    </Button>
  );
}
