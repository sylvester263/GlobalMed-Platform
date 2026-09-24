"use client";

import { useActionState } from "react";

import { AuthTextField, FormMessage } from "@/components/auth/auth-fields";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/auth/actions";
import { initialAuthState } from "@/lib/validation/auth";

type ProfileFormProps = {
  defaults: { fullName: string; certificateName: string; country: string; phone: string };
};

/** A-4: name, certificate name, country and phone. */
export function ProfileForm({ defaults }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfile, initialAuthState);
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormMessage state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <AuthTextField
          name="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={defaults.fullName}
          state={state}
        />
        <AuthTextField
          name="certificateName"
          label="Name on certificates"
          autoComplete="name"
          description="Exactly as it should be printed, including capitals."
          defaultValue={defaults.certificateName}
          state={state}
        />
        <AuthTextField
          name="country"
          label="Country"
          autoComplete="country-name"
          required={false}
          defaultValue={defaults.country}
          state={state}
        />
        <AuthTextField
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          required={false}
          defaultValue={defaults.phone}
          state={state}
        />
      </div>
      <Button type="submit" loading={pending} className="self-start">
        Save profile
      </Button>
    </form>
  );
}
