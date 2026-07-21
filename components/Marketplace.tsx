"use client";

/* BitBeon — MARKETPLACE act (between acts 3 and 4): riding-headline
   choreography from act 2, but the hero is a VERTICAL PROCESSION of three
   marketplace screenshots. While the headline lines ride horizontally, the
   phone column rides up — screens pass one after another; the LAST screen
   arrives at the viewport center (by then the lines have already exited)
   and FLIPs into the center bento cell, then the side cards pop.
   Invariants unchanged: ONE LOOP (Lenis -> gsap.ticker -> ScrollTrigger),
   ONE timeline on ONE pin, scrub 0.5, ease none, composite-only props.
   Geometry is measured with offset* metrics (transform-free): the track's
   final resting transform is y:0 — the column is LAID OUT with the last
   shot centered, and starts shifted down by one full procession — so the
   untransformed measure equals the geometry the FLIP actually plays over. */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhoneFrame from "./PhoneFrame";
import { useMediaQuery, MOBILE_MQ } from "@/lib/useMediaQuery";

const ACTM_PIN_LENGTH = 3000; // pin scroll budget (tuning)

/* ---- progress map ----
   phase 1: lines + column enter; phase 2: column rides up WHILE the lines
   ride out (text clears the edges before the last screen settles); phase 3:
   the last screen FLIPs into the center cell; phase 4: side cards pop */
const IN_END = 0.12;
const TRACK_START = 0.12; // column ride: shot 1 centered -> shot 3 centered
const TRACK_END = 0.6;
const LINES_OUT = [0.3, 0.55] as const; // lines exit BEFORE the FLIP
const MOVE_START = 0.62; // last shot -> center bento cell
const MOVE_END = 0.84;
const CARDS_START = 0.72;
const CARD_STAGGER = 0.05;
const CARD_DUR = 0.13; // last card: 0.72 + 3*0.05 + 0.13 = 1.0

const TITLE_LINES = ["Sell local", "earn eurozone-wide"] as const;

const SHOTS = [
  "/Marketplace-1.webp",
  "/Marketplace-2.webp",
  "/Marketplace-3.webp",
] as const;

/* card copy: the marketplace pitch — Slovak producers reach the whole
   eurozone. Renders reuse the act-3 card set (same bento template). */
const CARDS: {
  cls: string;
  text: string;
  sub: string;
  illoSrc: string;
}[] = [
  {
    cls: "card-tl",
    text: "Your storefront in every eurozone country",
    sub: "List a product once and it's on sale from Bratislava to Lisbon — no extra setup per market.",
    illoSrc: "/cards/act3-one-tap.webp",
  },
  {
    cls: "card-bl",
    text: "Sales land straight in your balance",
    sub: "Buyers pay in euros and the money settles into your BitBeon account instantly, ready to spend.",
    illoSrc: "/cards/act3-send-seconds.webp",
  },
  {
    cls: "card-tr",
    text: "Built for Slovak makers",
    sub: "Local producers get the reach of a continental marketplace — your craft travels, you stay home.",
    illoSrc: "/cards/act3-rates-locked.webp",
  },
  {
    cls: "card-br",
    text: "Every order tracked, from cart to payout",
    sub: "Follow each sale from checkout to settlement in the same app that holds your money.",
    illoSrc: "/cards/act3-transfer-tracked.webp",
  },
];

/* prefers-reduced-motion as an external store (SSR snapshot: false) */
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function Marketplace() {
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
      // (title / one marketplace shot / expanded cards, CSS-owned).
      // Read matchMedia LIVE: the hook's value lags one render on hydration
      // (SSR snapshot false), which would let the pin slip through.
      if (window.matchMedia(MOBILE_MQ).matches) return;
      const stage = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const track = stage.querySelector<HTMLElement>(".actm-track")!;
      const shots = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".actm-shot")
      );
      const lastShot = shots[shots.length - 1];
      const lineBack = stage.querySelector<HTMLElement>(
        ".act-title-line--back"
      )!;
      const lineFront = stage.querySelector<HTMLElement>(
        ".act-title-line--front"
      )!;
      const cardCenter = stage.querySelector<HTMLElement>(
        ".actm-grid .card-center"
      )!;
      const cards = ["card-tl", "card-tr", "card-bl", "card-br"].map(
        (c) => stage.querySelector<HTMLElement>(`.actm-grid .${c}`)!
      );

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
        const s = centerOf(lastShot);
        return {
          dx: c.x - s.x,
          dy: c.y - s.y,
          // UNIFORM scale — the shot stays visible in the final bento, so it
          // must keep its phone aspect: fit inside the center cell
          k: Math.min(
            cardCenter.offsetWidth / lastShot.offsetWidth,
            cardCenter.offsetHeight / lastShot.offsetHeight
          ),
        };
      };
      /* one full procession: the column starts shifted down so shot 1 sits
         where shot 3 is laid out (viewport center) and rides up to y:0.
         offsetTop is transform-free — stable under the scrub. */
      const trackTravel = () => lastShot.offsetTop - shots[0].offsetTop;
      /* off-screen x for a riding line: half the stage + half the line +
         margin — fully clear of the viewport at both ends */
      const lineTravel = (el: HTMLElement) =>
        (stage.offsetWidth + el.offsetWidth) / 2 + 48;

      gsap.set(lastShot, { transformOrigin: "50% 50%" });

      // reduced motion: no pin, no scrub — final bento state, statically
      // (lines gone, shots 1/2 parked off-screen above, last shot landed)
      if (reduced) {
        const s = shotDelta();
        gsap.set(track, { autoAlpha: 1, y: 0 });
        gsap.set(lastShot, { x: s.dx, y: s.dy, scale: s.k });
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
            end: `+=${ACTM_PIN_LENGTH}`,
            pin: stage,
            scrub: 0.5,
            invalidateOnRefresh: true, // re-measure FLIP geometry on resize
            refreshPriority: -0.5, // between act3 (0) and act4 (-1)
          },
        });
        ScrollTrigger.sort();

        tl
          // ---- phase 1: the phone column + riding lines enter ----
          .fromTo(
            track,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: IN_END },
            0
          )
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
          // ---- phase 2: the column rides up (screens pass one after
          // another) while the lines ride out to the opposite edges — the
          // text has cleared the screen before the last shot settles ----
          .fromTo(
            track,
            { y: () => trackTravel() },
            { y: 0, duration: TRACK_END - TRACK_START },
            TRACK_START
          )
          .to(
            lineBack,
            {
              x: () => lineTravel(lineBack),
              duration: LINES_OUT[1] - LINES_OUT[0],
            },
            LINES_OUT[0]
          )
          .to(
            lineFront,
            {
              x: () => -lineTravel(lineFront),
              duration: LINES_OUT[1] - LINES_OUT[0],
            },
            LINES_OUT[0]
          )
          // ---- phase 3: the last screen shrinks into the center bento
          // cell (manual FLIP, function-based values re-measured on every
          // refresh). The shot lands and STAYS — no fade ----
          .to(
            lastShot,
            {
              x: () => shotDelta().dx,
              y: () => shotDelta().dy,
              scale: () => shotDelta().k,
              duration: MOVE_END - MOVE_START,
            },
            MOVE_START
          )
          .to({}, { duration: 0.05 }, 0.95); // hold timeline duration at 1.0

        // ---- phase 4: side cards, tl -> tr -> bl -> br ----
        cards.forEach((c, i) =>
          tl!.fromTo(
            c,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: CARD_DUR },
            CARDS_START + i * CARD_STAGGER
          )
        );

        // hover expand is CSS-only, but stays OFF during the scrub-in so
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

      // create the trigger only after the pins above exist (fonts.ready
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
    <section ref={rootRef} className="actm" id="marketplace">
      <div className="actm-grid">
        {[CARDS.slice(0, 2), CARDS.slice(2)].map((pair, ci) => (
          <div
            key={ci === 0 ? "left" : "right"}
            className={`bento-col bento-col--${ci === 0 ? "left" : "right"}`}
          >
            {pair.map((c, i) => (
              <div
                key={c.cls}
                className={`actm-card bento-card bento-card--${
                  i === 0 ? "top" : "bottom"
                } ${c.cls}`}
              >
                <p className="bento-card__title">{c.text}</p>
                <p className="bento-card__sub">{c.sub}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="card-illo"
                  src={c.illoSrc}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        ))}
        {/* transparent FLIP anchor — the last marketplace shot parks here */}
        <div className="card-center" aria-hidden="true" />
      </div>

      {/* hero overlay above the grid: the vertical procession of marketplace
          screens. The track's RESTING layout centers the LAST shot — GSAP
          shifts it down by one procession and rides it back to y:0 */}
      <div className="actm-hero" aria-hidden="false">
        <div className="actm-track">
          {SHOTS.map((src, i) => (
            <div key={src} className="actm-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={i === 0 ? "BitBeon app — marketplace" : ""}
              />
              {/* iPhone contour outline — rides (and FLIPs) with the shot */}
              <PhoneFrame radius={48} />
            </div>
          ))}
        </div>
      </div>

      {/* riding headline: the layer creates NO stacking context, so both
          lines (z 1, see globals.css) pass BEHIND the phone overlay (z 2) —
          text never crosses the iPhone frame outlines */}
      <h2 className="act-title-layer">
        <span className="act-title-line act-title-line--back">
          {TITLE_LINES[0]}
        </span>
        <span className="act-title-line act-title-line--front">
          {TITLE_LINES[1]}
        </span>
      </h2>
    </section>
  );
}
