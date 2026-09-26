"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * After Stripe redirects back, the webhook may land a few seconds later. Re-render the
 * server page every 3 s for up to a minute so "Confirming…" turns into "Paid" on its own.
 */
export function OrderStatusPoller({ intervalMs = 3000, maxTries = 20 }) {
  const router = useRouter();
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (tries > maxTries) window.clearInterval(id);
      else router.refresh();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [router, intervalMs, maxTries]);
  return null;
}
