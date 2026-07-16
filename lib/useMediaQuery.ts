"use client";

/* media query as an external store (SSR snapshot: false) — the same pattern
   the acts already use for prefers-reduced-motion */
import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/* acts 2/3/4 + part-B breakpoints share this cut-off (globals.css ≤768) */
export const MOBILE_MQ = "(max-width: 768px)";
