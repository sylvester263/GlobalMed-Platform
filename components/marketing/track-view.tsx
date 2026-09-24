"use client";

import { useEffect } from "react";

import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires one analytics event when a page mounts, e.g. `course_view` (docs/12 §4). */
export function TrackView({
  event,
  params,
}: {
  event: AnalyticsEvent;
  params?: Record<string, string | number>;
}) {
  const key = JSON.stringify(params ?? {});
  useEffect(() => {
    track(event, JSON.parse(key) as Record<string, string | number>);
  }, [event, key]);
  return null;
}
