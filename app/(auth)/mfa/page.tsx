import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/lib/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";
import { MfaChallengeForm } from "@/components/auth/auth-forms";
import { safeNext } from "@/lib/auth/redirect";
import { getAssurance, requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Two-step verification",
  description: "Enter the code from your authenticator app.",
  path: "/mfa",
  noindex: true,
});

type Props = { searchParams: Promise<{ next?: string }> };

/** P3-6: second step for accounts with a verified TOTP factor (required for admins). */
export default async function MfaPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  await requireUser(`/mfa?next=${encodeURIComponent(next)}`);

  const { current } = await getAssurance();
  if (current === "aal2") redirect(next);

  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp[0];
  if (!factor) redirect("/dashboard/account?mfa=required#security");

  return (
    <AuthCard
      title="Two-step verification"
      intro="Open your authenticator app and enter the 6-digit code for GlobalMed."
      footer={
        <form action={signOut}>
          <button type="submit" className="font-semibold text-primary underline underline-offset-4">
            Sign out instead
          </button>
        </form>
      }
    >
      <MfaChallengeForm factorId={factor.id} next={next} />
    </AuthCard>
  );
}
