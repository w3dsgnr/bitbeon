"use client";

/* BitBeon legal pages — live PixelBlast backdrop (owner request 2026-07-16:
   "same background as the footer"). A fixed full-viewport layer behind the
   frosted document card; identical PixelBlast recipe to Footer.tsx so the
   two surfaces read as one system.

   Client island inside the otherwise server-rendered LegalPage. The WebGL
   bundle stays out of the initial payload (dynamic, ssr:false) and is not
   mounted at all under prefers-reduced-motion — the static dark page bg
   (LegalPage.css) is the designed rest state. PixelBlast's internal rAF is
   the documented ONE-LOOP exception (see PixelBlast.tsx header); its canvas
   captures its own pointer events for the ripple — LegalPage.css lets them
   through outside the card (pointer-events dance on .lp__main). */
import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
/* SSR snapshot TRUE: the server (and the hydration pass) renders no canvas,
   so mounting is always a client-side upgrade, never a hydration mismatch */
const getReducedServer = () => true;

export default function LegalBackdrop() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  if (reduced) return null;

  return (
    <div className="lp__blast" aria-hidden="true">
      <PixelBlast
        variant="square"
        pixelSize={4}
        color="#2E5CFF"
        patternScale={2}
        patternDensity={1}
        enableRipples
        rippleSpeed={0.3}
        rippleThickness={0.1}
        rippleIntensityScale={1}
        speed={0.5}
        transparent
        edgeFade={0.25}
      />
    </div>
  );
}
