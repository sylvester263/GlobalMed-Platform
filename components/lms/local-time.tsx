"use client";

import { useEffect, useState } from "react";

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
};

/**
 * Live sessions serve Pakistan and the US, so times render in the viewer's own time zone.
 * The server renders UTC first; the browser swaps in local time after hydration.
 */
export function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState(() =>
    new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(iso)),
  );
  useEffect(() => {
    setText(new Intl.DateTimeFormat("en-US", options).format(new Date(iso)));
  }, [iso]);
  return <time dateTime={iso}>{text}</time>;
}
