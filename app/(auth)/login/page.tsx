import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard, Divider } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/auth-forms";
import { GoogleButton } from "@/components/auth/google-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { nextFromEnrollParams, safeNext } from "@/lib/auth/redirect";
import { getSessionUser } from "@/lib/auth/session";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your GlobalMed account.",
  path: "/login",
  noindex: true,
});

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

const notices: Record<string, { variant: "info" | "success" | "destructive"; text: string }> = {
  oauth: { variant: "destructive", text: "Google sign-in didn't complete. Please try again." },
  link: {
    variant: "destructive",
    text: "That link has expired or was already used. Log in, or request a new link.",
  },
  unavailable: { variant: "info", text: "Sign-in isn't available yet. Please try again later." },
  signed_out: { variant: "success", text: "You've been signed out." },
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNext(params.next ?? nextFromEnrollParams(params));
  // Already signed in (e.g. an Enroll button while logged in): carry straight on.
  if (await getSessionUser()) redirect(next);
  const notice = params.error
    ? notices[params.error]
    : params.signed_out
      ? notices.signed_out
      : undefined;
  const signupHref = `/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <AuthCard
      title="Log in to GlobalMed"
      footer={
        <>
          New here?{" "}
          <Link
            href={signupHref}
            className="font-semibold text-primary underline underline-offset-4"
          >
            Create an account
          </Link>
        </>
      }
    >
      {notice && (
        <Alert variant={notice.variant}>
          <AlertDescription>{notice.text}</AlertDescription>
        </Alert>
      )}
      <GoogleButton next={next} />
      <Divider label="or log in with email" />
      <LoginForm next={next} />
    </AuthCard>
  );
}
