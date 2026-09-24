"use client";

import { CircleCheck } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { subscribeToNewsletter } from "@/lib/newsletter/actions";

/**
 * Footer newsletter sign-up, double opt-in (docs/02 W-14). Deliberately free of
 * react-hook-form and zod: it's on every page, so it relies on native email validation
 * and the server action's zod schema instead (~25 kB less JS site-wide).
 */
export function NewsletterForm() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    startTransition(async () => {
      const result = await subscribeToNewsletter({ email });
      if (result.ok) {
        track("newsletter_signup");
        setStatus({ ok: true, message: "Check your inbox and click the link to confirm." });
      } else {
        setStatus({ ok: false, message: result.message });
      }
    });
  }

  if (status?.ok) {
    return (
      <p role="status" className="flex items-center gap-2 font-semibold text-white">
        <CircleCheck aria-hidden="true" className="size-5 text-teal-bright" />
        {status.message}
      </p>
    );
  }

  const error = status && !status.ok ? status.message : undefined;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="text-sm font-semibold text-white">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="sm:flex-1"
        />
        <Button type="submit" size="lg" loading={pending} className="h-10">
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="text-sm font-semibold text-alert-bright">
          {error}
        </p>
      )}
    </form>
  );
}
