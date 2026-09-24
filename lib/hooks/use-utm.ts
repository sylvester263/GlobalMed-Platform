"use client";

import { useEffect, useState } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORAGE_KEY = "gm_utm";

export type Utm = Partial<Record<(typeof KEYS)[number], string>>;

/**
 * UTM parameters from the landing URL, kept for the session so a lead submitted a few
 * pages later is still attributed (docs/12 §4). Storage failures are ignored.
 */
export function useUtm(): Utm {
  const [utm, setUtm] = useState<Utm>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Utm = {};
    for (const key of KEYS) {
      const value = params.get(key);
      if (value) fromUrl[key] = value.slice(0, 100);
    }
    try {
      if (Object.keys(fromUrl).length) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
        setUtm(fromUrl);
        return;
      }
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setUtm(JSON.parse(stored) as Utm);
    } catch {
      setUtm(fromUrl);
    }
  }, []);

  return utm;
}
