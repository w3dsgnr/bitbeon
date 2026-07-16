"use client";

/* BitBeon — ACT 4 "Your wallet in your pocket": holo tilt card -> bento.
   Same skeleton as acts 2/3 (the hero-to-bento choreography with an act-4
   config). Invariants unchanged: ONE LOOP (Lenis -> gsap.ticker ->
   ScrollTrigger), ONE timeline on ONE pin, scrub 0.5, ease none,
   composite-only props in the scrub. The BitCard tilt rAF is the accepted
   exception: event-driven, self-terminating, cancelled on cleanup.
   Scroll tweens target the POSITIONING WRAPPER (.act4-card-pos) only — they
   never reach inside the component; the tilt hand-off tweens the component's
   public CSS vars (--rotate-x/y) and the glow layer, one-shot, non-scrub. */
import { useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BitCard from "./BitCard";
import PhoneFrame from "./PhoneFrame";
import { useMediaQuery, MOBILE_MQ } from "@/lib/useMediaQuery";

const ACT4_PIN_LENGTH = 3000; // pin scroll budget (tuning)

/* ---- progress map ----
   entrance 0 -> 0.15, interactive phase 0.15 -> 0.45 (nothing scrubs — the
   card is hoverable), FLIP 0.5 -> 0.85, side cards 0.7 -> 0.95 */
const IN_END = 0.15;
const MOVE_START = 0.5; // also the tilt hand-off point (one-shot guard)
const MOVE_END = 0.85;
const BORDER_IN = [0.65, 0.82] as const; // center phone (/Card details.png)
const CARDS_START = 0.7;
const CARD_STAGGER = 0.04;
const CARD_DUR = 0.13; // last card: 0.7 + 3*0.04 + 0.13 = 0.95

/* the holo card does NOT dissolve: it lands ON the phone screenshot as the
   in-app card. Mock units (phone png = 310x674): card 280x174, its top edge
   110px below the phone's top — all scaled with the phone's rendered size */
const PHONE_W = 310;
const PHONE_H = 674;
const CARD_END_W = 280;
const CARD_END_H = 174;
const CARD_END_TOP = 110;

/* copy from the act-4 mock (Figma 71:4865); subs are DRAFTS — bitbeon-copy.md
   carries no sub: lines yet (TODO copy: replace verbatim when they land) */
const TITLE_LINES = ["Your wallet", "in your pocket"] as const;
const CARDS: {
  cls: string;
  text: string;
  sub: string;
  illoSrc: string;
}[] = [
  {
    cls: "card-tl",
    text: "Virtual card instantly — plastic to your door",
    sub: "Start paying online the moment you're approved; the physical card follows by post.",
    illoSrc: "/cards/act4-virtual-card.png",
  },
  {
    cls: "card-bl",
    text: "Freeze and unfreeze in one tap",
    sub: "Misplaced your card? Pause it instantly and pick up right where you left off.",
    illoSrc: "/cards/act4-freeze.png",
  },
  {
    cls: "card-tr",
    text: "Pay with fiat or crypto — converted as you go",
    sub: "Set your spending priority once — the app converts at the live rate as you pay.",
    illoSrc: "/cards/act4-pay-convert.png",
  },
  {
    cls: "card-br",
    text: "Apple Pay and Google Pay, ready to tap",
    sub: "Add the card to your phone's wallet and pay contactless from day one.",
    illoSrc: "/cards/act4-apple-google.png",
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

export default function Act4() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [tiltEnabled, setTiltEnabled] = useState(true);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );
  const isMobile = useMediaQuery(MOBILE_MQ);

  useGSAP(
    () => {
      // ≤768: no pin, no scrub — the act is a plain stacked scroll section
      // (title / phone shot / expanded cards, CSS-owned); the holo card
      // overlay is display:none, so the tilt never engages.
      // Read matchMedia LIVE: the hook's value lags one render on hydration
      // (SSR snapshot false), which would let the pin slip through.
      if (window.matchMedia(MOBILE_MQ).matches) return;
      const stage = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const cardPos = stage.querySelector<HTMLElement>(".act4-card-pos")!;
      const lineBack = stage.querySelector<HTMLElement>(
        ".act-title-line--back"
      )!;
      const lineFront = stage.querySelector<HTMLElement>(
        ".act-title-line--front"
      )!;
      const cardCenter = stage.querySelector<HTMLElement>(
        ".act4-grid .card-center"
      )!;
      const cards = ["card-tl", "card-tr", "card-bl", "card-br"].map(
        (c) => stage.querySelector<HTMLElement>(`.act4-grid .${c}`)!
      );
      // tilt hand-off targets (public surface: wrapper vars + glow layer)
      const cardWrap = stage.querySelector<HTMLElement>(".pc-card-wrapper")!;
      const glow = stage.querySelector<HTMLElement>(".pc-behind");

      /* untransformed center in STAGE coordinates — offset* metrics ignore
         transforms (the established FLIP-measure pattern: the pin is a
         transform context, so viewport-relative rects would lie) */
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
      /* the phone (.center-shot) covers the center cell — reproduce its
         object-fit: cover math to find where the in-app card slot actually
         renders, then aim the plastic card's center at it */
      const cardDelta = () => {
        const cw = cardCenter.offsetWidth;
        const ch = cardCenter.offsetHeight;
        const pk = Math.max(cw / PHONE_W, ch / PHONE_H); // cover scale
        const c = centerOf(cardCenter);
        const phoneTop = c.y - (PHONE_H * pk) / 2;
        const p = centerOf(cardPos);
        return {
          dx: c.x - p.x, // the slot is horizontally centered in the phone
          dy: phoneTop + (CARD_END_TOP + CARD_END_H / 2) * pk - p.y,
          // UNIFORM width-driven scale; the plastic 1.586 aspect makes the
          // landed height ~176px (vs the 174 mock) — imperceptible
          s: (CARD_END_W * pk) / cardPos.offsetWidth,
        };
      };
      /* off-screen x for a riding line: half the stage + half the line +
         margin — fully clear of the viewport at both ends */
      const lineTravel = (el: HTMLElement) =>
        (stage.offsetWidth + el.offsetWidth) / 2 + 48;

      gsap.set(cardPos, { transformOrigin: "50% 50%" });

      // reduced motion: no pin, no scrub, no tilt — final bento, statically
      // (the riding lines are gone in the final state; the card sits in its
      // landed spot over the phone)
      if (reduced) {
        setTiltEnabled(false);
        const d = cardDelta();
        gsap.set(cardPos, { autoAlpha: 1, x: d.dx, y: d.dy, scale: d.s });
        cardWrap.classList.add("pc-landed");
        gsap.set([lineBack, lineFront], { autoAlpha: 0 });
        gsap.set([cardCenter, ...cards], { autoAlpha: 1 });
        return;
      }

      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;
      let tiltOn = true; // one-shot guard state for the hand-off

      const handOff = () => {
        tiltOn = false;
        setTiltEnabled(false); // BitCard removes listeners + kills its rAF
        // settle the card flat + drop the glow (0.3s, non-scrub, one-shot)
        gsap.to(cardWrap, {
          "--rotate-x": "0deg",
          "--rotate-y": "0deg",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        if (glow)
          gsap.to(glow, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
      };
      const handBack = () => {
        tiltOn = true;
        setTiltEnabled(true);
        // hand opacity back to the CSS calc(--card-opacity) hover logic
        if (glow) gsap.set(glow, { clearProps: "opacity" });
      };

      /* tilt is OFF only while the card is in flight (the FLIP owns the
         motion); once landed on the phone it is interactive again — the
         .pc-landed state runs half tilt angles + a 5% hover grow */
      const onUpdate = (self: ScrollTrigger) => {
        const p = self.progress;
        const inFlight = p >= MOVE_START && p < MOVE_END;
        if (inFlight && tiltOn) handOff();
        else if (!inFlight && !tiltOn) handBack();
        cardWrap.classList.toggle("pc-landed", p >= MOVE_END);
      };

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // seed the riding lines: centered on their track, parked off-screen
        // (back left, front right), THEN revealed — atomic set per line
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
            end: `+=${ACT4_PIN_LENGTH}`,
            pin: stage,
            scrub: 0.5,
            invalidateOnRefresh: true, // re-measure FLIP geometry on resize
            refreshPriority: -1, // below act3 (0): measured after pins above
            onUpdate,
          },
        });
        ScrollTrigger.sort();

        tl
          // ---- phase 1: card + title enter ----
          .fromTo(
            cardPos,
            { autoAlpha: 0, y: 60 },
            { autoAlpha: 1, y: 0, duration: IN_END },
            0
          )
          // riding lines meet around the card (back behind it, front over
          // it) and stay put through the interactive hover hold
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
          // ---- phase 2 (after the interactive hold): FLIP to the slot.
          // Wrapper-only transforms; the card's internal tilt state was
          // settled by the one-shot hand-off at MOVE_START ----
          // the card STAYS visible — it shrinks onto the phone screenshot
          // and becomes the in-app card (holo layers keep running)
          .to(
            cardPos,
            {
              x: () => cardDelta().dx,
              y: () => cardDelta().dy,
              scale: () => cardDelta().s,
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
          .fromTo(
            cardCenter,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: BORDER_IN[1] - BORDER_IN[0] },
            BORDER_IN[0]
          )
          .to({}, { duration: 0.05 }, 0.95); // hold timeline duration at 1.0

        // ---- phase 3: side cards, tl -> tr -> bl -> br ----
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

      let timer: ReturnType<typeof setTimeout> | null = null;
      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        timer = setTimeout(start, 0);
      });

      return () => {
        cancelled = true;
        if (timer !== null) clearTimeout(timer);
        cardWrap.classList.remove("pc-landed");
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    },
    { dependencies: [reduced, isMobile] }
  );

  return (
    <section ref={rootRef} className="act4" id="card">
      <div className="act4-grid">
        {[CARDS.slice(0, 2), CARDS.slice(2)].map((pair, ci) => (
          <div
            key={ci === 0 ? "left" : "right"}
            className={`bento-col bento-col--${ci === 0 ? "left" : "right"}`}
          >
            {pair.map((c, i) => (
              <div
                key={c.cls}
                className={`act4-card bento-card bento-card--${
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
        <div className="card-center">
          {/* phone screenshot — revealed under the incoming holo card,
              which lands on it as the in-app card (260x164 @ 115px) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="center-shot" src="/Card details.png" alt="" />
          {/* iPhone contour outline — reveals with the cell */}
          <PhoneFrame radius={38} />
        </div>
      </div>

      {/* hero overlay: holo tilt card; the POSITIONING WRAPPER is the only
          scroll-tween target. The hero layer is pointer-transparent, the
          wrapper restores pointer events so hover tilt works while pinned. */}
      <div className="act4-hero">
        <div className="act4-card-pos">
          {/* holo vision (holo-card-playground): Bank card artwork under the
              hologram, symbol mask on the shine — the face lives in the png */}
          <BitCard
            behindGlowColor="rgba(0, 13, 255, 0.35)"
            enableTilt={tiltEnabled}
            imageUrl="/Bank card.png"
            iconUrl="/Frame 2043684588.png"
          />
        </div>
      </div>

      {/* riding headline: the layer creates NO stacking context, so the back
          line (z 1) passes BEHIND the holo card overlay (z 2) and the front
          line (z 3) rides OVER it */}
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
