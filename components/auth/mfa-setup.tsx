"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

import { AuthTextField, FormMessage } from "@/components/auth/auth-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { confirmMfaEnrollment, startMfaEnrollment } from "@/lib/auth/actions";
import { initialAuthState } from "@/lib/validation/auth";

type Enrollment = { factorId: string; qrCode: string; secret: string };

/** P3-6: TOTP enrollment — QR code + manual key, confirmed with the first code. */
export function MfaSetup() {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, startTransition] = useTransition();
  const [state, action, pending] = useActionState(confirmMfaEnrollment, initialAuthState);

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  if (state.status === "success") {
    return (
      <Alert variant="success">
        <ShieldCheck aria-hidden="true" />
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex flex-col gap-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          className="self-start"
          loading={starting}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const result = await startMfaEnrollment();
              if (result.ok) setEnrollment(result);
              else setError(result.message);
            })
          }
        >
          Set up two-step verification
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      {/* Supabase returns the QR code as an SVG data URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- data URL; next/image adds nothing here */}
      <img
        src={enrollment.qrCode}
        alt="QR code to add GlobalMed to your authenticator app"
        width={200}
        height={200}
        className="rounded-md border bg-white p-2"
      />
      <div className="flex flex-col gap-4">
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
          <li>
            Open an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).
          </li>
          <li>Scan the QR code, or enter this key manually:</li>
        </ol>
        <code className="rounded-md border bg-ledger px-3 py-2 font-mono text-sm break-all select-all">
          {enrollment.secret}
        </code>
        <form action={action} noValidate className="flex flex-col gap-4">
          <FormMessage state={state} />
          <input type="hidden" name="factorId" value={enrollment.factorId} />
          <AuthTextField
            name="code"
            label="Enter the 6-digit code it shows"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            state={state}
          />
          <Button type="submit" loading={pending} className="self-start">
            Turn on two-step verification
          </Button>
        </form>
      </div>
    </div>
  );
}
