"use client";

/* BitBeon — ACT 3: same choreography as act 2, but the hero is a CANVAS
   frame-sequence dressed as the act-1 finale — a framed window (24px border
   in the section bg, radius 40) that scrubs its frames and then FLIPs into
   the center bento card.
   Invariants unchanged: ONE LOOP (Lenis -> ticker -> ScrollTrigger), ONE
   timeline on ONE pin, scrub 0.5, ease none, composite-only tweens. The
   canvas lives OUTSIDE the scrub — ScrollTrigger only dictates the frame
   index via onUpdate. */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhoneFrame from "./PhoneFrame";
import { useMediaQuery, MOBILE_MQ } from "@/lib/useMediaQuery";

const ACT3_PIN_LENGTH = 2500;

/* ---- sequence ---- */
const ACT3_FRAME_COUNT = 145;
const ACT3_FRAME_START = 6; // first shown frame — frame_0007 (0-based index)
const ACT3_FRAME_PATH = (i: number) =>
  `/move-seq/frame_${String(i + 1).padStart(4, "0")}.webp`;
const PRELOAD_EAGER = 20; // high-priority head start, fired on approach
const PRELOAD_BATCH = 4; // lazy tail: concurrent loads, in index order
const SEQ_ZONE = [0.05, 0.55] as const; // progress span the frames scrub over

/* ---- progress map (same as act 2) ---- */
const IN_END = 0.15;
const MOVE_START = 0.25;
const MOVE_END = 0.7;
const SHOT_FADE = [0.5, 0.7] as const;
const BORDER_IN = [0.55, 0.75] as const; // center phone (/Send.png) reveals
const CARDS_START = 0.6;
const CARD_STAGGER = 0.05;
const CARD_DUR = 0.15;
/* hero headline 160px -> 26.105px over the phone's scan area (ref: Figma) */
const TITLE_SCALE = 26.105 / 160;

/* copy from the act-3 mock (Figma 71:4670); subs are DRAFTS — bitbeon-copy.md
   carries no sub: lines yet (TODO copy: replace verbatim when they land) */
const TITLE_LINES = ["Money moves", "the way you want it"] as const;
const CARDS: {
  cls: string;
  text: string;
  sub: string;
  illoSrc: string;
}[] = [
  {
    cls: "card-tl",
    text: "One tap between accounts and currencies.",
    sub: "Your balances live side by side — moving between them is instant and free.",
    illoSrc: "/cards/act3-one-tap.png",
  },
  {
    cls: "card-bl",
    text: "Send in seconds — SEPA, SWIFT or on-chain",
    sub: "Pick the rail, we handle the routing — most transfers arrive in minutes, not days.",
    illoSrc: "/cards/act3-send-seconds.png",
  },
  {
    cls: "card-tr",
    text: "Rates locked before you confirm",
    sub: "The quote you approve is exactly what you pay — no drift between confirm and settle.",
    illoSrc: "/cards/act3-rates-locked.png",
  },
  {
    cls: "card-br",
    text: "Every transfer tracked, end to end",
    sub: "Follow each payment from sent to received, with a status update at every step.",
    illoSrc: "/cards/act3-transfer-tracked.png",
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

export default function Act3() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[] | null>(null);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );
  const isMobile = useMediaQuery(MOBILE_MQ);

  useGSAP(
    () => {
      // ≤768: no pin, no scrub, no canvas sequence — the act is a plain
      // stacked scroll section (title / phone shot / expanded cards, CSS-
      // owned); the money-moves frames are never even requested.
      // Read matchMedia LIVE: the hook's value lags one render on hydration
      // (SSR snapshot false), which would let the pin slip through.
      if (window.matchMedia(MOBILE_MQ).matches) return;
      const stage = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const windowEl = stage.querySelector<HTMLElement>(".act3-window")!;
      const title = stage.querySelector<HTMLElement>(".act3-title")!;
      const cardCenter = stage.querySelector<HTMLElement>(
        ".act3-grid .card-center"
      )!;
      const slot = stage.querySelector<HTMLElement>(".act3-title-final-slot")!;
      const cards = ["card-tl", "card-tr", "card-bl", "card-br"].map(
        (c) => stage.querySelector<HTMLElement>(`.act3-grid .${c}`)!
      );

      /* ---------- canvas sequence (outside any tween) ---------- */
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      if (!framesRef.current)
        framesRef.current = Array.from({ length: ACT3_FRAME_COUNT }, () => null);
      const frames = framesRef.current;
      let current = -1; // last DRAWN index (redraw only on change)

      const paint = (img: HTMLImageElement) => {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!cw || !ch || !iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih); // cover, no distortion
        const w = iw * scale;
        const h = ih * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };
      const draw = (index: number) => {
        const img = frames[index];
        // frame not decoded yet -> keep the previous frame, never blank
        if (!img || !img.complete || !img.naturalWidth) return;
        current = index;
        paint(img);
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        if (current >= 0 && frames[current]) paint(frames[current]!);
      };
      window.addEventListener("resize", resize);

      let pendingIndex = ACT3_FRAME_START; // what the scroll wants shown right now
      const loadFrame = (i: number, eager: boolean) => {
        if (frames[i]) return frames[i]!;
        const img = new Image();
        img.decoding = "async";
        if (eager) img.fetchPriority = "high";
        img.src = ACT3_FRAME_PATH(i);
        img.onload = () => {
          // late arrival of the frame the scroll is parked on -> draw it
          if (i === pendingIndex && i !== current) draw(i);
        };
        frames[i] = img;
        return img;
      };
      let preloadStarted = false;
      const startPreload = () => {
        if (preloadStarted) return;
        preloadStarted = true;
        const eagerEnd = Math.min(
          ACT3_FRAME_START + PRELOAD_EAGER,
          ACT3_FRAME_COUNT
        );
        for (let i = ACT3_FRAME_START; i < eagerEnd; i++) loadFrame(i, true);
        // lazy tail in index order, small concurrent window
        let next = eagerEnd;
        const pump = () => {
          if (next >= ACT3_FRAME_COUNT) return;
          const img = loadFrame(next++, false);
          const cont = () => pump();
          if (img.complete) cont();
          else {
            img.addEventListener("load", cont, { once: true });
            img.addEventListener("error", cont, { once: true });
          }
        };
        for (let k = 0; k < PRELOAD_BATCH; k++) pump();
      };

      const mapRange = (p: number) => {
        const t = (p - SEQ_ZONE[0]) / (SEQ_ZONE[1] - SEQ_ZONE[0]);
        return Math.max(0, Math.min(1, t));
      };
      const onUpdate = (self: ScrollTrigger) => {
        const index =
          ACT3_FRAME_START +
          Math.round(
            mapRange(self.progress) * (ACT3_FRAME_COUNT - 1 - ACT3_FRAME_START)
          );
        pendingIndex = index;
        if (index !== current) draw(index);
      };

      /* ---------- FLIP measure (offset* metrics — transform-free) ---------- */
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
      /* act-1 pattern: the window container + canvas are ALWAYS fullscreen
         and never transformed — the frames keep their scale, the shrinking
         clip-path window CROPS them.
         CRITICAL: from/to must carry the SAME component count. The computed
         style collapses the CSS default to `inset(24px round 40px)` (2
         numbers) while the target has 5 — GSAP pairs numbers in order and
         SNAPS the unmatched ones at tween start (the bottom-edge jump seen
         around frame 50). So the from-value is spelled out explicitly. */
      const CLIP_START = "inset(24px 24px 24px 24px round 40px)";
      const clipToCard = () => {
        const c = centerOf(cardCenter);
        const top = c.y - cardCenter.offsetHeight / 2;
        const left = c.x - cardCenter.offsetWidth / 2;
        const right = stage.offsetWidth - (left + cardCenter.offsetWidth);
        const bottom = stage.offsetHeight - (top + cardCenter.offsetHeight);
        // radius 38 = the phone png's bezel radius (.center-shot) — the
        // window dissolves into the phone with matching corners
        return `inset(${top}px ${right}px ${bottom}px ${left}px round 38px)`;
      };
      const titleDelta = () => {
        const c = centerOf(slot);
        const t = centerOf(title);
        return { dx: c.x - t.x, dy: c.y - t.y };
      };

      gsap.set(title, { transformOrigin: "50% 50%" });

      if (reduced) {
        const t = titleDelta();
        gsap.set(windowEl, { autoAlpha: 0 });
        gsap.set(title, {
          autoAlpha: 1,
          x: t.dx,
          y: t.dy,
          scale: TITLE_SCALE,
          color: "#141414",
        });
        gsap.set([cardCenter, ...cards], { autoAlpha: 1 });
        return () => window.removeEventListener("resize", resize);
      }

      let tl: gsap.core.Timeline | null = null;
      let approach: ScrollTrigger | null = null;
      let cancelled = false;

      const start = () => {
        if (cancelled || !rootRef.current) return;
        resize();

        // preload kick: fires in the APPROACH zone (act-2's territory), well
        // before this section pins, so the eager head is decoded on arrival
        approach = ScrollTrigger.create({
          trigger: stage,
          start: "top bottom+=150%",
          once: true,
          onEnter: startPreload,
        });

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${ACT3_PIN_LENGTH}`,
            pin: stage,
            scrub: 0.5,
            invalidateOnRefresh: true,
            refreshPriority: 0, // below act2 (1); measured after all pins above
            onUpdate, // frame index only — canvas is not tweened
            onRefresh: resize,
          },
        });
        ScrollTrigger.sort();

        tl
          // phase 1: framed window + headline enter (opacity only — the
          // window geometry belongs to clip-path, the image never scales)
          .fromTo(
            windowEl,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: IN_END },
            0
          )
          .fromTo(
            title,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: IN_END },
            0
          )
          // phase 2: the clip window shrinks to the card rect — frames keep
          // scrubbing at full scale beneath, edges get cropped
          .fromTo(
            windowEl,
            { clipPath: CLIP_START },
            {
              clipPath: clipToCard,
              duration: MOVE_END - MOVE_START,
            },
            MOVE_START
          )
          .to(
            windowEl,
            { autoAlpha: 0, duration: SHOT_FADE[1] - SHOT_FADE[0] },
            SHOT_FADE[0]
          )
          .to(
            title,
            {
              x: () => titleDelta().dx,
              y: () => titleDelta().dy,
              scale: TITLE_SCALE,
              color: "#141414",
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
          .to({}, { duration: 0.1 }, 0.9); // hold duration at 1.0

        // phase 3: side cards, tl -> tr -> bl -> br
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
        window.removeEventListener("resize", resize);
        approach?.kill();
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    },
    { dependencies: [reduced, isMobile] }
  );

  return (
    <section ref={rootRef} className="act3" id="currencies">
      <div className="act3-grid">
        {[CARDS.slice(0, 2), CARDS.slice(2)].map((pair, ci) => (
          <div
            key={ci === 0 ? "left" : "right"}
            className={`bento-col bento-col--${ci === 0 ? "left" : "right"}`}
          >
            {pair.map((c, i) => (
              <div
                key={c.cls}
                className={`act3-card bento-card bento-card--${
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
          {/* phone screenshot — revealed as the canvas window dissolves;
              the headline lands over its scan area */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="center-shot" src="/Send.png" alt="" />
          {/* iPhone contour outline — reveals with the cell */}
          <PhoneFrame radius={38} />
          <div className="act3-title-final-slot" aria-hidden="true" />
        </div>
      </div>

      {/* hero overlay: the act-1-finale framed window, now scrubbing a
          canvas sequence; FLIPs into the center card */}
      <div className="act3-hero">
        <div className="act3-window">
          <canvas ref={canvasRef} className="act3-canvas" />
        </div>
        <h2 className="act3-title">
          {TITLE_LINES[0]}
          <br />
          {TITLE_LINES[1]}
        </h2>
      </div>
    </section>
  );
}
