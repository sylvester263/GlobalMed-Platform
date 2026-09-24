import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { UpdatePasswordForm } from "@/components/auth/auth-forms";
import { buttonVariants } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Choose a new password",
  description: "Set a new password for your GlobalMed account.",
  path: "/reset-password/update",
  noindex: true,
});

/** The recovery link signs the user in (via /auth/confirm) before landing here. */
export default async function UpdatePasswordPage() {
  const session = await getSessionUser();
  if (!session) {
    return (
      <AuthCard
        title="This reset link has expired"
        intro="Reset links work once and expire after an hour. Request a new one to continue."
      >
        <Link href="/reset-password" className={buttonVariants({ size: "lg" })}>
          Request a new link
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" intro={`For ${session.user.email}.`}>
      <UpdatePasswordForm />
    </AuthCard>
  );
}
