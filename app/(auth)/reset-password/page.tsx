import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetRequestForm } from "@/components/auth/auth-forms";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Reset your password",
  description: "Request a link to reset your GlobalMed password.",
  path: "/reset-password",
  noindex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      intro="Enter the email you signed up with and we'll send you a reset link."
      footer={
        <Link href="/login" className="font-semibold text-primary underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <ResetRequestForm />
    </AuthCard>
  );
}
