"use client";

/* BitBeon — home-page scroll restoration for history (back/forward) navs.

   Why: the landing's document height is built asynchronously — each act's
   GSAP engine boots after document.fonts.ready and adds pin-spacer height
   via ScrollTrigger.refresh(). On popstate the browser restores the saved
   pixel offset immediately, while the page is still ~12k px tall instead
   of ~27k — the scroll gets clamped to the not-yet-grown document and is
   never re-applied once the pins arrive, so "back" from a legal page used
   to land mid-page (wherever the clamp happened).

   Fix: while the home page lives, remember {scrollY, scrollHeight} in
   sessionStorage; on popstate, snapshot that value into a module variable
   (the App Router keeps this module alive across client-side navs, and a
   snapshot taken *before* the remount can't be clobbered by the mount
   effect's own baseline save — which StrictMode's double effect run would
   otherwise read back). On a history-nav mount, re-clamp the scroll toward
   the snapshot each frame until the document regains its saved height (or
   a timeout passes), so the restore converges no matter how many engines
   have booted. Any real user input (wheel/touch/key) aborts the loop.
   Push navigations (e.g. the legal pages' "Back to home" link) are
   untouched — they keep the App Router's scroll-to-top. */

import { useEffect, useRef } from "react";

const POS_KEY = "bb-home-scroll";
const NAV_FRESH_MS = 10_000;
const RESTORE_TIMEOUT_MS = 4_000;

let pendingRestore: { y: number; h: number; at: number } | null = null;

declare global {
  interface Window {
    __bbPopstateHooked?: boolean;
  }
}

if (typeof window !== "undefined" && !window.__bbPopstateHooked) {
  window.__bbPopstateHooked = true;
  window.addEventListener("popstate", () => {
    try {
      const saved = sessionStorage.getItem(POS_KEY);
      if (saved) {
        pendingRestore = { ...JSON.parse(saved), at: Date.now() };
      }
    } catch {
      pendingRestore = null;
    }
  });
}

export default function ScrollMemory() {
  const markerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const abortEvents = ["wheel", "touchstart", "keydown"] as const;
    const abort = () => {
      cancelAnimationFrame(raf);
      pendingRestore = null;
    };

    // ---- restore (history navs only) ----
    // don't null pendingRestore here: StrictMode runs effect → cleanup →
    // effect, and the second run must still see it; settle()/abort clear it
    const intent = pendingRestore;
    if (intent && Date.now() - intent.at < NAV_FRESH_MS) {
      const deadline = performance.now() + RESTORE_TIMEOUT_MS;
      const settle = () => {
        const doc = document.documentElement;
        const target = Math.min(
          intent.y,
          doc.scrollHeight - window.innerHeight
        );
        if (Math.abs(window.scrollY - target) > 1) {
          window.scrollTo(0, target);
        }
        // done once the pre-nav height is back (all pins mounted)
        if (doc.scrollHeight >= intent.h - 2 || performance.now() > deadline) {
          pendingRestore = null;
          return;
        }
        raf = requestAnimationFrame(settle);
      };
      raf = requestAnimationFrame(settle);
      abortEvents.forEach((e) =>
        window.addEventListener(e, abort, { passive: true, once: true })
      );
    }

    // ---- remember (throttled to one write per frame) ----
    let pending = 0;
    const save = () => {
      pending = 0;
      // passive-effect cleanup lags the router's DOM swap: without this
      // guard the listener catches the nav-away scroll-to-top and records
      // y=0 against the *legal* page's height, clobbering the position
      if (!markerRef.current?.isConnected) return;
      try {
        sessionStorage.setItem(
          POS_KEY,
          JSON.stringify({
            y: Math.round(window.scrollY),
            h: document.documentElement.scrollHeight,
          })
        );
      } catch {
        /* storage disabled — nothing to remember */
      }
    };
    const onScroll = () => {
      if (!pending) pending = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    save();

    return () => {
      cancelAnimationFrame(raf);
      if (pending) cancelAnimationFrame(pending);
      window.removeEventListener("scroll", onScroll);
      abortEvents.forEach((e) => window.removeEventListener(e, abort));
    };
  }, []);

  /* invisible marker — its isConnected tells save() the home DOM is live */
  return <span ref={markerRef} hidden />;
}
