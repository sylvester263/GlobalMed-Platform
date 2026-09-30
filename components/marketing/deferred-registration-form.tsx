"use client";

import { lazy, Suspense, type ComponentProps } from "react";

import type { AapcRegistrationForm } from "@/components/marketing/aapc-registration-form";

type FormProps = ComponentProps<typeof AapcRegistrationForm>;

const anchorId = "aapc-registration-form";

const loadForm = () =>
  import("@/components/marketing/aapc-registration-form").then((m) => ({
    default: m.AapcRegistrationForm,
  }));

/** Resolves once the form is within 400px of the viewport (at once if it already is). */
function whenNear(id: string): Promise<void> {
  return new Promise((resolve) => {
    const el = document.getElementById(id);
    if (!el || !("IntersectionObserver" in window)) return resolve();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
  });
}

// On the server the form renders straight away (full HTML in the page). In the browser the
// code (react-hook-form, zod, Turnstile: ~38 kB) loads and hydrates only when the form comes
// near the screen; until then React keeps the server HTML as it is (2026-10-01).
const LazyForm = lazy(() =>
  typeof window === "undefined" ? loadForm() : whenNear(anchorId).then(loadForm),
);

/** The AAPC registration form, hydrated on visibility. Same markup and behaviour. */
export function DeferredRegistrationForm(props: FormProps) {
  return (
    <div id={anchorId}>
      <Suspense fallback={null}>
        <LazyForm {...props} />
      </Suspense>
    </div>
  );
}
