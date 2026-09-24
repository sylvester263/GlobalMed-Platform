import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Check your email",
  description: "Confirm your email address to finish creating your GlobalMed account.",
  path: "/verify-email",
  noindex: true,
});

type Props = { searchParams: Promise<{ email?: string }> };

/** Shown after sign-up. The email is only echoed back from the URL, never looked up. */
export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const shown = email && email.length <= 254 && email.includes("@") ? email : undefined;
  return (
    <AuthCard
      title="Check your email"
      footer={
        <Link href="/login" className="font-semibold text-primary underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <MailCheck aria-hidden="true" className="size-12 text-teal" />
        <p>
          We&apos;ve sent a confirmation link to{" "}
          {shown ? <strong className="break-all">{shown}</strong> : "your email address"}. Open it
          to activate your account.
        </p>
        <p className="text-sm text-muted-foreground">
          Nothing after a few minutes? Check your spam folder, or sign up again with the same email
          to get a new link.
        </p>
      </div>
    </AuthCard>
  );
}
