"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthTextField, FormMessage, PasswordField } from "@/components/auth/auth-fields";
import { Button } from "@/components/ui/button";
import {
  requestPasswordReset,
  signIn,
  signUp,
  updatePassword,
  verifyMfaChallenge,
} from "@/lib/auth/actions";
import { initialAuthState } from "@/lib/validation/auth";

const passwordHelp = "At least 10 characters. A short phrase is easier to remember.";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initialAuthState);
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next} />
      <AuthTextField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <PasswordField state={state} autoComplete="current-password" />
      <div className="-mt-2 flex justify-end">
        <Link href="/reset-password" className="text-sm text-primary underline underline-offset-4">
          Forgot your password?
        </Link>
      </div>
      <Button type="submit" size="lg" loading={pending}>
        Log in
      </Button>
    </form>
  );
}

export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signUp, initialAuthState);
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next} />
      <AuthTextField
        name="fullName"
        label="Full name"
        autoComplete="name"
        description="As it should appear on your certificates. You can change it later."
        state={state}
      />
      <AuthTextField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <PasswordField state={state} autoComplete="new-password" description={passwordHelp} />
      <Button type="submit" size="lg" loading={pending}>
        Create account
      </Button>
      <p className="text-xs text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline underline-offset-4">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialAuthState);
  if (state.status === "success") return <FormMessage state={state} />;
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <AuthTextField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <Button type="submit" size="lg" loading={pending}>
        Send reset link
      </Button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialAuthState);
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <PasswordField
        label="New password"
        state={state}
        autoComplete="new-password"
        description={passwordHelp}
      />
      <PasswordField
        name="confirm"
        label="Confirm new password"
        state={state}
        autoComplete="new-password"
      />
      <Button type="submit" size="lg" loading={pending}>
        Save new password
      </Button>
    </form>
  );
}

export function MfaChallengeForm({ factorId, next }: { factorId: string; next: string }) {
  const [state, action, pending] = useActionState(verifyMfaChallenge, initialAuthState);
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <input type="hidden" name="factorId" value={factorId} />
      <input type="hidden" name="next" value={next} />
      <AuthTextField
        name="code"
        label="6-digit code"
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        autoFocus
        state={state}
      />
      <Button type="submit" size="lg" loading={pending}>
        Verify
      </Button>
    </form>
  );
}
