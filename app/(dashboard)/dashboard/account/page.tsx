import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { UpdatePasswordForm } from "@/components/auth/auth-forms";
import { MfaSetup } from "@/components/auth/mfa-setup";
import { ProfileForm } from "@/components/auth/profile-form";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Account settings" };

type Props = { searchParams: Promise<{ mfa?: string }> };

function Panel({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-24 flex-col gap-5 rounded-lg border bg-card p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="text-xl">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default async function AccountPage({ searchParams }: Props) {
  const session = await requireUser("/dashboard/account");
  const { mfa } = await searchParams;
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp ?? [];
  const isAdmin = session.profile.role === "admin";
  const usesPassword = session.user.app_metadata.provider === "email";

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <DashboardPageHeader title="Account settings" description={session.user.email ?? undefined} />

      {mfa === "required" && verified.length === 0 && (
        <Alert variant="warning">
          <ShieldAlert aria-hidden="true" />
          <AlertTitle>Turn on two-step verification to continue</AlertTitle>
          <AlertDescription>
            Admin accounts must use two-step verification before opening the admin dashboard.
          </AlertDescription>
        </Alert>
      )}

      <Panel
        id="profile"
        title="Profile"
        description="Your certificate name is printed exactly as you enter it."
      >
        <ProfileForm
          defaults={{
            fullName: session.profile.full_name ?? "",
            certificateName: session.profile.certificate_name ?? session.profile.full_name ?? "",
            country: session.profile.country ?? "",
            phone: session.profile.phone ?? "",
          }}
        />
      </Panel>

      {usesPassword && (
        <Panel id="password" title="Password" description="At least 10 characters.">
          <UpdatePasswordForm />
        </Panel>
      )}

      <Panel
        id="security"
        title="Two-step verification"
        description={
          isAdmin
            ? "Required for admin accounts. You'll enter a code from your authenticator app when you sign in."
            : "Optional. Adds a code from your authenticator app when you sign in."
        }
      >
        {verified.length > 0 ? (
          <p className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-5 text-success" />
            <span>Two-step verification is on.</span>
            <Badge variant="success">
              {verified.length} {verified.length === 1 ? "device" : "devices"}
            </Badge>
          </p>
        ) : (
          <MfaSetup />
        )}
      </Panel>
    </div>
  );
}
