"use client";

/* BitBeon — ACT 2 "Everything in one balance" -> bento.
   Pinned section right after act 1. Same invariants: rides the ONE LOOP from
   the hero (Lenis -> gsap.ticker -> ScrollTrigger), ONE timeline on ONE pin,
   scrub 0.5, ease none, composite-only props (+ cheap paint-only `color`).
   The phone shot FLIPs (uniform scale, aspect kept) into the center bento
   cell and STAYS there. The headline is two riding lines: they enter from
   opposite edges at different heights (both BEHIND the phone — text never
   crosses the iPhone frame outline), meet during the hero hold, then cross
   on and exit to the opposite edges while the shot FLIPs — no shrink, no
   fade.
   Geometry is measured with offset* metrics (transform-free), so the pin's
   transform context and mid-scene resizes can't skew the math. */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhoneFrame from "./PhoneFrame";
import { useMediaQuery, MOBILE_MQ } from "@/lib/useMediaQuery";

const ACT2_PIN_LENGTH = 2500; // pin scroll budget (tuning)

/* progress map */
const IN_END = 0.15; // phase 1: hero content + riding lines enter
const MOVE_START = 0.25; // phase 2: hero -> bento FLIP; lines ride out
const MOVE_END = 0.7;
const CARDS_START = 0.6; // phase 3: side cards pop, stagger 0.05
const CARD_STAGGER = 0.05;
const CARD_DUR = 0.15;

/* prefers-reduced-motion as an external store (SSR snapshot: false) */
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function Act2() {
  const rootRef = useRef<HTMLElement | null>(null);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );
  const isMobile = useMediaQuery(MOBILE_MQ);

  useGSAP(
    () => {
      // ≤768: no pin, no scrub — the act is a plain stacked scroll section
      // (title / shot / expanded cards), laid out and revealed by CSS alone.
      // Read matchMedia LIVE: the hook's value lags one render on hydration
      // (SSR snapshot false), which would let the pin slip through.
      if (window.matchMedia(MOBILE_MQ).matches) return;
      const stage = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const shot = stage.querySelector<HTMLElement>(".act2-shot")!;
      const lineBack = stage.querySelector<HTMLElement>(
        ".act-title-line--back"
      )!;
      const lineFront = stage.querySelector<HTMLElement>(
        ".act-title-line--front"
      )!;
      const cardCenter = stage.querySelector<HTMLElement>(".card-center")!;
      const cards = [
        ".card-tl",
        ".card-tr",
        ".card-bl",
        ".card-br", // reveal order per spec: tl -> tr -> bl -> br
      ].map((s) => stage.querySelector<HTMLElement>(s)!);

      /* untransformed center of an element in STAGE coordinates — offset*
         metrics ignore transforms, so this is stable no matter where the
         scrub is or what the pin has done (the known measure() pitfall). */
      const centerOf = (el: HTMLElement) => {
        let x = el.offsetWidth / 2;
        let y = el.offsetHeight / 2;
        let n: HTMLElement | null = el;
        while (n && n !== stage) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return { x, y };
      };
      const shotDelta = () => {
        const c = centerOf(cardCenter);
        const s = centerOf(shot);
        return {
          dx: c.x - s.x,
          dy: c.y - s.y,
          // UNIFORM scale — the shot stays visible in the final bento, so it
          // must keep its phone aspect: fit inside the center cell
          k: Math.min(
            cardCenter.offsetWidth / shot.offsetWidth,
            cardCenter.offsetHeight / shot.offsetHeight
          ),
        };
      };
      /* off-screen x for a riding line: half the stage + half the line +
         margin — fully clear of the viewport at both ends. offset* metrics
         ignore transforms, so this stays stable under the scrub. */
      const lineTravel = (el: HTMLElement) =>
        (stage.offsetWidth + el.offsetWidth) / 2 + 48;

      gsap.set(shot, { transformOrigin: "50% 50%" });

      // reduced motion: no pin, no scrub — final bento state, statically
      // (the riding lines are gone in the final state: they exit mid-scene)
      if (reduced) {
        const s = shotDelta();
        gsap.set(shot, { autoAlpha: 1, x: s.dx, y: s.dy, scale: s.k });
        gsap.set([lineBack, lineFront], { autoAlpha: 0 });
        gsap.set(cards, { autoAlpha: 1 });
        return;
      }

      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // seed the riding lines: centered vertically on their track, parked
        // off-screen (back left, front right), THEN revealed — one atomic
        // set per line, so they can never flash centered
        gsap.set(lineBack, {
          xPercent: -50,
          yPercent: -50,
          x: () => -lineTravel(lineBack),
          autoAlpha: 1,
        });
        gsap.set(lineFront, {
          xPercent: -50,
          yPercent: -50,
          x: () => lineTravel(lineFront),
          autoAlpha: 1,
        });

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${ACT2_PIN_LENGTH}`,
            pin: stage,
            scrub: 0.5,
            invalidateOnRefresh: true, // re-measure FLIP geometry on resize
            refreshPriority: 1, // measured after the act-1 pins re-apply
          },
        });
        ScrollTrigger.sort();

        tl
          // ---- phase 1: hero content enters ----
          .fromTo(
            shot,
            { autoAlpha: 0, scale: 0.96 },
            { autoAlpha: 1, scale: 1, duration: IN_END },
            0
          )
          // riding lines meet at the phone (both pass behind it)
          .fromTo(
            lineBack,
            { x: () => -lineTravel(lineBack) },
            { x: 0, duration: IN_END },
            0
          )
          .fromTo(
            lineFront,
            { x: () => lineTravel(lineFront) },
            { x: 0, duration: IN_END },
            0
          )
          // ---- phase 2: hero -> bento (manual FLIP, function-based values
          // re-measured on every refresh). The shot lands and STAYS — no
          // fade, no outline frame ----
          .to(
            shot,
            {
              x: () => shotDelta().dx,
              y: () => shotDelta().dy,
              scale: () => shotDelta().k,
              duration: MOVE_END - MOVE_START,
            },
            MOVE_START
          )
          // ...while the lines keep riding and exit to the opposite edges —
          // no shrink, no fade: they simply leave the screen
          .to(
            lineBack,
            {
              x: () => lineTravel(lineBack),
              duration: MOVE_END - MOVE_START,
            },
            MOVE_START
          )
          .to(
            lineFront,
            {
              x: () => -lineTravel(lineFront),
              duration: MOVE_END - MOVE_START,
            },
            MOVE_START
          )
          // ---- phase 3: side cards, tl -> tr -> bl -> br ----
          .to({}, { duration: 0.1 }, 0.9); // hold timeline duration at 1.0

        cards.forEach((c, i) =>
          tl!.fromTo(
            c,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: CARD_DUR },
            CARDS_START + i * CARD_STAGGER
          )
        );

        // hover expand is CSS-only, but keep it OFF during the scrub-in so
        // pointer position can't disturb the FLIP measure; released once the
        // scrubbed playhead first reaches the end of the act
        const cols = gsap.utils.toArray<HTMLElement>(
          stage.querySelectorAll(".bento-col")
        );
        gsap.set(cols, { pointerEvents: "none" });
        tl.eventCallback("onComplete", () =>
          gsap.set(cols, { pointerEvents: "auto" })
        );

        ScrollTrigger.refresh();
      };

      // create the trigger only after act-1 pins exist (fonts.ready
      // microtasks), then one macrotask later — order-independent thanks to
      // refreshPriority, this just avoids a useless stale first measure
      let timer: ReturnType<typeof setTimeout> | null = null;
      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        timer = setTimeout(start, 0);
      });

      return () => {
        cancelled = true;
        if (timer !== null) clearTimeout(timer);
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    },
    { dependencies: [reduced, isMobile] }
  );

  return (
    <section ref={rootRef} className="act2" id="features">
      {/* final bento layout — ALWAYS laid out in final positions;
          nothing here is layout-animated, only opacity/transform. Side
          columns are flex wrappers for the pure-CSS hover expand mechanic
          (globals.css → bento card hover mechanic). */}
      <div className="act2-grid">
        <div className="bento-col bento-col--left">
          <div className="act2-card bento-card bento-card--top card-tl">
            <p className="bento-card__title">
              Fiat and crypto, side by side — always current
            </p>
            {/* TODO copy: sub drafts — no sub: lines in bitbeon-copy.md yet */}
            <p className="bento-card__sub">
              Balances refresh in real time — what you see is what you hold,
              in every currency.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="card-illo"
              src="/cards/act2-fiat-crypto.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className="act2-card bento-card bento-card--bottom card-bl">
            <p className="bento-card__title">
              To 100+ destinations. Free between BitBeon users
            </p>
            <p className="bento-card__sub">
              Send to friends instantly at zero cost, or worldwide with the
              fee shown before you confirm.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="card-illo"
              src="/cards/act2-destinations.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
        {/* transparent FLIP anchor — the shot itself parks here */}
        <div className="card-center" aria-hidden="true" />
        <div className="bento-col bento-col--right">
          <div className="act2-card bento-card bento-card--top card-tr">
            <p className="bento-card__title">
              Crypto to fiat and back, at rates you can see
            </p>
            <p className="bento-card__sub">
              Swap at the live rate with no hidden spread — the number on
              screen is the number you get.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="card-illo"
              src="/cards/act2-crypto-fiat.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className="act2-card bento-card bento-card--bottom card-br">
            <p className="bento-card__title">
              Your own IBAN — for salaries, invoices, anyone
            </p>
            <p className="bento-card__sub">
              Share it like any account number — incoming payments land
              straight in your balance.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="card-illo"
              src="/cards/act2-iban.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* hero overlay above the grid: the screenshot that FLIPs into the
          center card */}
      <div className="act2-hero" aria-hidden="false">
        <div className="act2-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/main.webp" alt="BitBeon app — home screen" />
          {/* iPhone contour outline — rides the FLIP with the shot */}
          <PhoneFrame radius={48} />
        </div>
      </div>

      {/* riding headline: the layer creates NO stacking context, so both
          lines (z 1 in act 2, see globals.css) pass BEHIND the phone
          overlay (z 2) — text never crosses the iPhone frame outline */}
      <h2 className="act-title-layer">
        <span className="act-title-line act-title-line--back">Everything</span>
        <span className="act-title-line act-title-line--front">
          in one balance
        </span>
      </h2>
    </section>
  );
}
