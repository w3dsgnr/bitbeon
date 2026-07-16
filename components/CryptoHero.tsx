"use client";

/* BitBeon — Part B, section 1: Crypto hero "Crypto made simple, finally"
   (#crypto, Figma 78:2422). Framed scene like the act-1 finale but with the
   part-B tokens (20px inset / 60px radius via the --frame-b-* CSS vars).

   Mouse parallax is EVENT-DRIVEN (pointermove -> gsap.quickTo), no rAF loop
   of its own — quickTo tweens ride the ONE LOOP's gsap.ticker. Only x/y
   transforms move; each sprite layer owns its transform channel exclusively.
   Disabled on touch via gsap.matchMedia("(hover: hover)").
   Copy is 1:1 from bitbeon-copy.md → Crypto. */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

/* parallax amplitudes, px (spec §2) */
const BACK_X = 12;
const BACK_Y = 8;
const FRONT_X = 28;
const FRONT_Y = 18;
const COPY_X = 6;
const COPY_Y = 4;

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function CryptoHero() {
  const rootRef = useRef<HTMLElement | null>(null);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  useGSAP(
    () => {
      const root = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const frame = root.querySelector<HTMLElement>(".crypto-hero__frame")!;
      const back = root.querySelector<HTMLElement>(".crypto-hero__clouds-back")!;
      const front = root.querySelector<HTMLElement>(".crypto-hero__clouds-front")!;
      const copy = root.querySelector<HTMLElement>(".crypto-hero__copy")!;
      const h2 = root.querySelector<HTMLElement>(".crypto-hero__title")!;
      const subtitle = root.querySelector<HTMLElement>(".crypto-hero__subtitle")!;

      if (reduced) {
        gsap.set([h2, subtitle], { autoAlpha: 1 });
        return; // no parallax, no reveal motion
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      const mm = gsap.matchMedia();

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // standard project reveal (toggle, not scrub); refreshPriority -2 =
        // measured after every act pin above re-applies its spacer
        reveal([h2, subtitle], {
          trigger: frame,
          start: "top 70%",
          stagger: 0.12,
          refreshPriority: -2,
        });

        // pointer parallax — desktop (hover-capable) only
        mm.add("(hover: hover)", () => {
          const q = {
            bx: gsap.quickTo(back, "x", { duration: 0.8, ease: "power2.out" }),
            by: gsap.quickTo(back, "y", { duration: 0.8, ease: "power2.out" }),
            fx: gsap.quickTo(front, "x", { duration: 0.6, ease: "power2.out" }),
            fy: gsap.quickTo(front, "y", { duration: 0.6, ease: "power2.out" }),
            cx: gsap.quickTo(copy, "x", { duration: 1.0, ease: "power2.out" }),
            cy: gsap.quickTo(copy, "y", { duration: 1.0, ease: "power2.out" }),
          };
          const onMove = (e: PointerEvent) => {
            const r = frame.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width) * 2 - 1; // [-1,1]
            const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
            q.bx(nx * BACK_X);
            q.by(ny * BACK_Y);
            q.fx(nx * FRONT_X);
            q.fy(ny * FRONT_Y);
            q.cx(nx * COPY_X);
            q.cy(ny * COPY_Y);
          };
          const onLeave = () => {
            q.bx(0); q.by(0);
            q.fx(0); q.fy(0);
            q.cx(0); q.cy(0);
          };
          root.addEventListener("pointermove", onMove);
          root.addEventListener("pointerleave", onLeave);
          return () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerleave", onLeave);
          };
        });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        timer = setTimeout(start, 0);
      });

      return () => {
        cancelled = true;
        if (timer !== null) clearTimeout(timer);
        mm.revert();
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} id="crypto" className="crypto-hero">
      <div className="crypto-hero__frame">
        {/* sky photo — full-bleed base (Figma "image 531") */}
        <img
          className="crypto-hero__bg"
          src="/crypto/sky.png"
          alt=""
          loading="lazy"
          decoding="async"
        />
        {/* cloud sprite UNDER the copy (Figma "cloud.webp") */}
        <div className="crypto-hero__clouds-back" aria-hidden="true" />
        <div className="crypto-hero__copy">
          <h2 className="crypto-hero__title">
            Crypto made
            <br />
            simple, <span className="crypto-hero__finally">finally</span>
          </h2>
        </div>
        {/* cloud sprite OVER the copy (Figma "cloud-protect-2.webp") */}
        <div className="crypto-hero__clouds-front" aria-hidden="true" />
        <p className="crypto-hero__subtitle">
          Hold, send and receive BTC, ETH, USDC, TRX, SOL, BNB and more — and
          convert any of them to fiat or stablecoins instantly, at high speed.
        </p>
        {/* TODO: live ticker row (bitbeon-copy.md → Crypto [DATA]) is not in
            the part-B spec — add when designed */}
      </div>
    </section>
  );
}
