import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard, Divider } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/auth-forms";
import { GoogleButton } from "@/components/auth/google-button";
import { getCourse, getPathway } from "@/lib/content";
import { nextFromEnrollParams, safeNext } from "@/lib/auth/redirect";
import { getSessionUser } from "@/lib/auth/session";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Create an account",
  description: "Create your GlobalMed student account.",
  path: "/signup",
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNext(params.next ?? nextFromEnrollParams(params));
  // Already signed in (e.g. an Enroll button while logged in): carry straight on.
  if (await getSessionUser()) redirect(next);
  // When they came from an Enroll button, say which course they'll return to.
  const course = params.course ? getCourse(params.course) : undefined;
  const pathway = params.pathway ? getPathway(params.pathway) : undefined;
  const target = course?.title ?? pathway?.title;
  const loginHref = `/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <AuthCard
      title="Create your account"
      intro={
        target
          ? `You'll come back to ${target} to finish enrolling once your account is ready.`
          : "One account for courses, certificates and your orders."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-primary underline underline-offset-4"
          >
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton next={next} label="Sign up with Google" />
      <Divider label="or sign up with email" />
      <SignupForm next={next} />
    </AuthCard>
  );
}
