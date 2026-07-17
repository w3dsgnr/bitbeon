"use client";

/* BitBeon — first-load preloader.

   Why: the landing is a scroll-scrubbed narrative over two image sequences
   (hero-logo-seq 122 + coin-seq 169 webp frames, ~21 MB). On a cold load a
   user can outscroll the network and land on half-decoded canvases. This
   overlay holds the scroll until the critical set (fonts + both sequences)
   is in cache, then fades out onto the intro scene.

   Seamlessness: the overlay REUSES the intro's own classes (.hero-intro-
   wordmark / .hero-intro-logo) on the same --bit-scene background, so the
   fade-out is a crossfade between two near-identical dark scenes — the logo
   appears to stay put while the rays fade in around it.

   It does NOT issue competing downloads: Hero.tsx already requests every
   frame on mount (layout effect — before this passive effect), so the
   Image objects here attach to the in-flight loads and only observe them.

   Guards: min display time (brand moment, absorbs cache-hit reloads), hard
   cap (never hangs on a dead connection — the canvases degrade gracefully),
   module flag (SPA re-mounts skip it), reduced-motion (static page — only
   the first frames gate). Scroll is locked from the FIRST PAINT via CSS
   (html:has(.preloader[data-phase="loading"])), not JS, so pre-hydration
   wheel input can't start the story early; the capture-phase swallowers
   below additionally keep Lenis's virtual scroll state clean. */

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HERO_FRAMES = 122;
const COIN_FRAMES = 169;
/* weights ≈ relative kilobytes — keeps the bar honest about real progress */
const HERO_W = 85;
const COIN_W = 61;
const LOGO_W = 150;
const FONTS_W = 250;

const MIN_SHOW_MS = 1100; // brand moment; also covers instant cache-hit loads
const CAP_MS = 15_000; // slow network: reveal anyway, sequences catch up live
const FADE_MS = 700; // must outlast the CSS opacity transition (600ms)

const pad = (n: number) => String(n).padStart(4, "0");

/* the App Router keeps this module alive across client-side navs — a nav
   back from a legal page must not replay the curtain */
let shownThisSession = false;

type Phase = "loading" | "leaving" | "done";

export default function Preloader() {
  /* lazy init: on hydration the flag is still false (fresh module) so the
     state matches the server-rendered overlay; on SPA re-mounts it's true
     and the overlay never renders — no hydration mismatch either way */
  const [phase, setPhase] = useState<Phase>(() =>
    shownThisSession ? "done" : "loading"
  );
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;
    /* set, never read, inside the effect — StrictMode's double run must not
       skip itself (the decision was captured by the state initializer) */
    shownThisSession = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Lenis listens for wheel/touch on window — swallow the intents in the
       capture phase (registered before Lenis's, same target) so its virtual
       scroll can't accumulate a target behind the curtain */
    const swallow = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const evOpts: AddEventListenerOptions = { capture: true, passive: false };
    window.addEventListener("wheel", swallow, evOpts);
    window.addEventListener("touchmove", swallow, evOpts);

    let total = 0;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    const track = (src: string, w: number) => {
      total += w;
      const im = new Image();
      imgs.push(im);
      const done = () => {
        im.onload = im.onerror = null; // errors count too — never hang on a 404
        loaded += w;
      };
      im.onload = done;
      im.onerror = done;
      im.src = src;
      if (im.complete) done(); // synchronous cache hit
    };

    let alive = true;
    total += FONTS_W;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (alive) loaded += FONTS_W;
    });

    track("/meinbit-logo.png", LOGO_W);
    if (reduced) {
      /* static page — only the first frame of each canvas is ever shown */
      track(`/hero-logo-seq/frame_0001.webp`, HERO_W);
      track(`/coin-seq/frame_0001.webp`, COIN_W);
    } else {
      /* last hero frame first — mirrors Hero.tsx: the dissolve shows it */
      track(`/hero-logo-seq/frame_${pad(HERO_FRAMES)}.webp`, HERO_W);
      for (let i = 1; i < HERO_FRAMES; i++)
        track(`/hero-logo-seq/frame_${pad(i)}.webp`, HERO_W);
      for (let i = 1; i <= COIN_FRAMES; i++)
        track(`/coin-seq/frame_${pad(i)}.webp`, COIN_W);
    }

    const t0 = performance.now();
    let shown = 0; // displayed fraction — lerped so the bar always glides
    let raf = 0;
    let left = false;
    let capped = false;
    const capT = window.setTimeout(() => {
      capped = true;
    }, CAP_MS);

    const leave = () => {
      if (left) return;
      left = true;
      window.removeEventListener("wheel", swallow, evOpts);
      window.removeEventListener("touchmove", swallow, evOpts);
      setPhase("leaving"); // CSS unlocks the scroll on this attribute flip
      /* the returning scrollbar narrows the viewport — re-measure the pins */
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const tick = () => {
      const target = capped ? 1 : loaded / total;
      shown += (target - shown) * 0.14;
      if (target === 1 && 1 - shown < 0.005) shown = 1;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${shown})`;
      if (pctRef.current)
        pctRef.current.textContent = `${Math.round(shown * 100)}%`;
      if (
        shown === 1 &&
        (capped || loaded >= total) &&
        performance.now() - t0 >= MIN_SHOW_MS
      ) {
        leave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(capT);
      window.removeEventListener("wheel", swallow, evOpts);
      window.removeEventListener("touchmove", swallow, evOpts);
      imgs.forEach((im) => (im.onload = im.onerror = null));
    };
  }, [phase]);

  /* separate effect: the loading effect's cleanup fires on the phase flip
     and would cancel a timer it owned — this one survives the transition */
  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="preloader"
      data-phase={phase}
      role="status"
      aria-label="Loading BitBeon"
    >
      {/* intro-scene twin — SAME class as Hero's intro logo, so the crossfade
          is pixel-identical by construction */}
      <div className="hero-intro-logo preloader__logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/meinbit-logo.png" alt="" draggable={false} />
      </div>
      <div className="preloader__meter" aria-hidden="true">
        <span className="preloader__track">
          <span ref={fillRef} className="preloader__fill" />
        </span>
        <span ref={pctRef} className="preloader__pct">
          0%
        </span>
      </div>
    </div>
  );
}
