"use client";

/* BitBeon — Hero, segment [0]-[2] (intro state + logo sequence), before "move-seq".
   ONE LOOP: Lenis owns scroll, gsap.ticker is the slave, ScrollTrigger updates on
   Lenis's scroll event. No second rAF under scroll logic. LightRays' rAF is ambient. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import LightRays from "./LightRays";
import { setHeaderTheme } from "@/lib/headerTheme";

const FRAMES = 122;
const frameUrl = (i: number) =>
  `/hero-logo-seq/frame_${String(i + 1).padStart(4, "0")}.webp`;

const COIN_FRAMES = 169;
const coinFrameUrl = (i: number) =>
  `/coin-seq/frame_${String(i + 1).padStart(4, "0")}.webp`;

/* ---- Act 2 continuation ("freedom" scene) — pin budget & progress map ---- */
const PIN_LENGTH = 5000; // total pin scroll distance (px) for the coin section
const MARQUEE_SPEED = 50; // px/s — phase C loop speed (tuning knob)
const ENABLE_PHRASE_BLUR = false; // optional blur(8px)->0 on side-phrase reveal
/* framed-state geometry — ADAPTIVE: the desktop 32px border / 64px radius
   scale down with the viewport width (≈16px/28px at 390px), so the framed
   window never looks over-rounded on phones. Function values, re-evaluated
   on every ScrollTrigger refresh (invalidateOnRefresh). */
const frameInset = () =>
  Math.round(Math.min(32, Math.max(16, window.innerWidth * 0.042)));
const frameRadius = () =>
  Math.round(Math.min(64, Math.max(28, window.innerWidth * 0.056)));

/* the fixed header is driven from TWO scroll ranges (intro + freedom act).
   This flag tells the freedom handoff that the intro currently owns the
   header, so transient mid-refresh progress values can never hide it while
   the user sits on the first screen. */
const headerCtl = { introActive: false };

const SEQ_END = 0.55; // frames 1-169 scrub over progress 0 -> 0.55
const EXPAND_START = SEQ_END * (115 / COIN_FRAMES); // ≈0.374 — window opens from frame 115
const EXPAND_END = 0.6; // window reaches fullscreen

/* clip-path window states — same component count & units on every keyframe so
   GSAP interpolates inset() per-component (composite-only, image never moves) */
const clipClosed = () => {
  const x = window.innerWidth / 2 - 0.5;
  const y = window.innerHeight / 2 - 0.5;
  return `inset(${y}px ${x}px ${y}px ${x}px round 0px)`;
};
const CLIP_OPEN = "inset(0px 0px 0px 0px round 0px)";
const clipFramed = () => {
  const i = frameInset();
  return `inset(${i}px ${i}px ${i}px ${i}px round ${frameRadius()}px)`;
};
const FRAME_END = 0.78; // framed (inset + radius) state reached
const REVEAL_END = 0.9; // header/subtitle in; marquee handoff point

/* Reusable "sequence act" — the SAME pattern as the hero logo sequence, minus the
   engine (Lenis is already running from the hero). A pinned, scroll-scrubbed image
   sequence on a canvas + a direction-aware SplitText headline: char-stagger on the
   downward entrance, opacity fade-out on every other transition (forward exit and
   reverse). Deterministic at any scroll point. */
interface SeqActOpts {
  mounted: boolean;
  reduced: boolean;
  rootRef: RefObject<any>;
  stageRef: RefObject<any>;
  wrapRef: RefObject<any>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  headlineRef: RefObject<any>;
  framesRef: RefObject<HTMLImageElement[] | null>;
  urls: (i: number) => string;
  count: number;
  seqStart: number; // first shown frame index — earlier frames never load
  zone: [number, number];
  end: string;
}

function useSequenceAct(o: SeqActOpts) {
  useGSAP(
    () => {
      if (!o.mounted) return;
      const canvas = o.canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // ---- preload the frame sequence (once) ----
      if (!o.framesRef.current) {
        o.framesRef.current = Array.from({ length: o.count }, (_, i) => {
          const img = new Image();
          img.decoding = "async";
          // frames below seqStart are never shown — skip the requests
          if (i >= o.seqStart) img.src = o.urls(i);
          return img;
        });
      }
      const frames = o.framesRef.current;
      let current = -1;
      let painted = -1;

      const paint = (img: HTMLImageElement) => {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!cw || !ch || !iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih); // cover — fill the screen
        const w = iw * scale;
        const h = ih * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };
      // paint the nearest DECODED frame at or below the target — on a cold
      // load the scrub must not freeze the canvas on whatever frame the
      // network reached; it advances as later frames arrive (see onload)
      const draw = (index: number) => {
        const i = Math.max(0, Math.min(o.count - 1, Math.round(index)));
        current = i;
        let j = i;
        while (j >= 0) {
          const img = frames[j];
          if (img && img.complete && img.naturalWidth) break;
          j--;
        }
        if (j < 0 || j === painted) return;
        painted = j;
        paint(frames[j]);
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        painted = -1; // canvas was cleared by the resize — force a repaint
        if (current >= 0) draw(current);
      };
      frames.forEach((img, i) => {
        img.onload = () => {
          // a frame at or below the current target arrived — catch up
          if (current >= 0 && i <= current) draw(current);
        };
      });
      resize();
      window.addEventListener("resize", resize);

      // reduced-motion: no pin, no scrub — show the final framed composition
      // statically (it covers the canvas, so frame 0 stays as a harmless base)
      if (o.reduced) {
        draw(o.seqStart);
        const stage = o.stageRef.current as HTMLElement;
        const frame = stage.querySelector<HTMLElement>(".freedom-frame");
        if (frame) {
          const track = stage.querySelector<HTMLElement>(".freedom-track");
          const anchor = stage.querySelector<HTMLElement>(
            ".freedom-phrase--total"
          );
          if (track && anchor) {
            track.style.left = `${
              window.innerWidth / 2 -
              (anchor.offsetLeft + anchor.offsetWidth / 2)
            }px`;
            gsap.set(track, { yPercent: -50 });
          }
          gsap.set(stage.querySelector(".freedom-bg"), { autoAlpha: 1 });
          gsap.set(frame, { clipPath: clipFramed() });
          gsap.set(stage.querySelectorAll(".freedom-phrase--side"), {
            opacity: 1,
          });
          gsap.set(stage.querySelectorAll(".freedom-phrase--total"), {
            scale: 0.9,
          });
          gsap.set(stage.querySelectorAll(".freedom-subtitle"), {
            autoAlpha: 1,
          });
          gsap.set(document.querySelector(".freedom-header"), {
            autoAlpha: 1,
          });
        }
        return () => window.removeEventListener("resize", resize);
      }

      // ---------- MOTION ----------
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // the wrap is visible from load: below the fold until the previous act
      // releases, the section then slides in already showing the seqStart
      // frame — the act reads as started during the handoff scroll instead
      // of arriving as a white screen that only fills once the pin engages
      gsap.set(o.wrapRef.current, { autoAlpha: 1 });
      gsap.set(o.headlineRef.current, { autoAlpha: 0 });
      draw(o.seqStart);

      let split: SplitText | null = null;
      let tl: gsap.core.Timeline | null = null;
      let marqueeTween: gsap.core.Tween | null = null;
      const triggers: ScrollTrigger[] = [];
      let cancelled = false;

      const start = () => {
        if (cancelled || !o.rootRef.current) return;
        const stage = o.stageRef.current as HTMLElement;

        // ---- freedom scene elements (phases A/B/C after the sequence) ----
        const freedomFrame =
          stage.querySelector<HTMLElement>(".freedom-frame");
        const freedomBg = stage.querySelector<HTMLElement>(".freedom-bg");
        const track = stage.querySelector<HTMLElement>(".freedom-track");
        const totalPhrases = stage.querySelectorAll<HTMLElement>(
          ".freedom-phrase--total"
        );
        const sidePhrases = stage.querySelectorAll<HTMLElement>(
          ".freedom-phrase--side"
        );
        const subtitle = stage.querySelector<HTMLElement>(".freedom-subtitle");
        // page-level fixed overlay, lives OUTSIDE the pinned stage
        const header = document.querySelector<HTMLElement>(".freedom-header");
        const hasFreedom = !!(freedomFrame && track);

        // center the "Total freedom" slot of the FIRST half on the viewport
        // center — layout offset (left), not transform, so the marquee's
        // xPercent owns the transform channel exclusively
        const centerTrack = () => {
          if (!hasFreedom) return;
          const anchor = totalPhrases[0];
          track!.style.left = `${
            window.innerWidth / 2 - (anchor.offsetLeft + anchor.offsetWidth / 2)
          }px`;
        };
        if (hasFreedom) {
          gsap.set(track!, { yPercent: -50 });
          centerTrack();
        }

        // ---- phase C: time-based marquee, handed off from the scrub ----
        let marqueeOn = false;
        let headerOn = false;
        const startMarquee = () => {
          if (!hasFreedom) return;
          gsap.killTweensOf(track!); // kill a possibly-running return tween
          gsap.set(track!, { xPercent: 0 });
          marqueeTween?.kill();
          marqueeTween = gsap.to(track!, {
            xPercent: -50, // exactly one identical half -> seamless
            duration: track!.scrollWidth / 2 / MARQUEE_SPEED,
            ease: "none",
            repeat: -1,
          });
        };
        const stopMarquee = () => {
          marqueeTween?.pause();
          gsap.to(track!, {
            xPercent: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          }); // hand control back to the scrub state
        };

        // ---- SplitText headline: same params as "One app" ----
        split = new SplitText(o.headlineRef.current, { type: "chars" });
        const chars = split.chars;
        gsap.set(chars, {
          opacity: 0,
          yPercent: 40,
          willChange: "transform,opacity",
          force3D: true,
        });
        gsap.set(o.headlineRef.current, { autoAlpha: 1 });

        let inTween: gsap.core.Tween | null = null;
        const staggerIn = () => {
          inTween?.kill();
          inTween = gsap.fromTo(
            chars,
            { opacity: 0, yPercent: 40 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.04,
              overwrite: "auto",
            }
          );
        };
        const fadeIn = () => {
          inTween?.kill();
          gsap.to(chars, {
            opacity: 1,
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const fadeOut = () => {
          inTween?.kill();
          gsap.to(chars, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        const proxy = { f: o.seqStart };
        let headlineShown = false;
        const [Z0, Z1] = o.zone;

        const onUpdate = (self: ScrollTrigger) => {
          const p = self.progress;
          const inZone = p >= Z0 && p <= Z1;
          if (inZone && !headlineShown) {
            headlineShown = true;
            if (self.direction === 1) staggerIn();
            else fadeIn();
          } else if (!inZone && headlineShown) {
            headlineShown = false;
            fadeOut();
          }

          // marquee handoff: once, downward, past REVEAL_END; full reverse below
          if (hasFreedom) {
            if (p >= REVEAL_END && self.direction === 1 && !marqueeOn) {
              marqueeOn = true;
              startMarquee();
            } else if (p < REVEAL_END && marqueeOn) {
              marqueeOn = false;
              stopMarquee();
            }
          }

          // header handoff: re-enters at the framed state (FRAME_END), leaves
          // again when scrubbed back below it. Toggle tweens kept OFF the
          // scrub timeline — the intro trigger (Hero) also drives this fixed
          // element, and a scrubbed fromTo would re-hide it on every refresh.
          // NEVER hide while the intro owns the header: the load-time refresh
          // storm can report transient bogus progress on this trigger.
          if (header) {
            const wantHeader = p >= FRAME_END;
            if (wantHeader && !headerOn) {
              headerOn = true;
              gsap.to(header, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            } else if (!wantHeader && headerOn && !headerCtl.introActive) {
              headerOn = false;
              gsap.to(header, {
                autoAlpha: 0,
                y: -24,
                duration: 0.35,
                ease: "power2.in",
                overwrite: "auto",
              });
            }
          }
        };

        // ---- master scrub timeline ----
        // positions are progress fractions 1:1 (a dummy tween pins duration=1)
        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: o.rootRef.current,
            start: "top top",
            end: o.end,
            pin: o.stageRef.current,
            scrub: 0.5,
            invalidateOnRefresh: true,
            refreshPriority: 2, // after the hero pin (see note on the hero trigger)
            onUpdate,
            onRefresh: () => {
              resize();
              centerTrack();
            },
          },
        });
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

        tl.to(
          proxy,
          {
            f: o.count - 1,
            duration: SEQ_END,
            onUpdate: () => draw(proxy.f),
          },
          0
        ) // scrub the frames (scroll = playhead) — wrap already visible pre-pin
          .to({}, { duration: 0.1 }, REVEAL_END); // dummy: hold duration at 1.0 (phase C is time-based)

        if (hasFreedom) {
          tl
            // ---- phase A: mask-reveal parallel to frames 115-169. The frame
            // and image are ALWAYS fullscreen and static — only the clip-path
            // window opens from a 1x1px center (no scale, no distortion)
            .fromTo(
              freedomFrame!,
              { clipPath: clipClosed },
              { clipPath: CLIP_OPEN, duration: EXPAND_END - EXPAND_START },
              EXPAND_START
            )
            // the image and "Total freedom" are NEVER opacity-animated — both
            // sit at full opacity inside the frame and the window opens onto them
            // sequence hands off behind the now-covering frame; #f4f4f4 base in
            .to(o.wrapRef.current, { autoAlpha: 0, duration: 0.04 }, 0.56)
            .fromTo(
              freedomBg!,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.04 },
              0.56
            )
            // ---- phase B: the window shrinks to the framed container — same
            // property, image still static; edges are cut, not moved. The
            // "border" is NOT an element: it's the #f4f4f4 .freedom-bg base
            // showing around the clipped window — nothing extra fades in ----
            .to(
              freedomFrame!,
              { clipPath: clipFramed, duration: FRAME_END - EXPAND_END },
              EXPAND_END
            )
            // "Total freedom" settles into marquee size (160px * 0.9 = 144px)
            .to(
              [...totalPhrases],
              { scale: 0.9, duration: FRAME_END - EXPAND_END },
              EXPAND_END
            )
            // side phrases reveal in place (already at scale 0.75 — uniform row)
            .to(
              [...sidePhrases],
              {
                opacity: 1,
                ...(ENABLE_PHRASE_BLUR
                  ? { filter: "blur(0px)", startAt: { filter: "blur(8px)" } }
                  : {}),
                duration: 0.84 - 0.66,
              },
              0.66
            )
            // subtitle enters here; the header re-enters alongside via the
            // onUpdate handoff above (toggle, not scrub)
            .fromTo(
              subtitle!,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: REVEAL_END - FRAME_END },
              FRAME_END
            );
        } else {
          tl.to(o.wrapRef.current, { autoAlpha: 0, duration: 0.14 }, 0.86); // last frame -> white
        }

        ScrollTrigger.refresh();
      };

      (document.fonts?.ready ?? Promise.resolve()).then(start);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", resize);
        triggers.forEach((t) => t.kill());
        tl?.kill();
        marqueeTween?.kill();
        split?.revert();
      };
    },
    { dependencies: [o.mounted, o.reduced] }
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const darkRef = useRef<HTMLDivElement | null>(null);
  const introLogoRef = useRef<HTMLDivElement | null>(null);
  const introLogoImgRef = useRef<HTMLImageElement | null>(null);
  const seqWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const scrollDownRef = useRef<HTMLParagraphElement | null>(null);
  const framesRef = useRef<HTMLImageElement[] | null>(null);

  // part 2 — coin-seq
  const coinRootRef = useRef<HTMLElement | null>(null);
  const coinStageRef = useRef<HTMLDivElement | null>(null);
  const coinSeqWrapRef = useRef<HTMLDivElement | null>(null);
  const coinCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const coinHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const coinFramesRef = useRef<HTMLImageElement[] | null>(null);

  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [showRays, setShowRays] = useState(true);

  // client-only: mount flag + reduced-motion preference
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useGSAP(
    () => {
      if (!mounted) return;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // ---- preload the logo frame sequence (once) ----
      if (!framesRef.current) {
        const imgs = Array.from({ length: FRAMES }, () => {
          const img = new Image();
          img.decoding = "async";
          // this is the first thing on screen — beat the coin-seq preload
          (img as any).fetchPriority = "high";
          return img;
        });
        // request the last frame FIRST: it's what the dissolve shows, so it
        // must survive a cold load at any scroll speed
        imgs[FRAMES - 1].src = frameUrl(FRAMES - 1);
        imgs.forEach((img, i) => {
          if (i !== FRAMES - 1) img.src = frameUrl(i);
        });
        framesRef.current = imgs;
      }
      const frames = framesRef.current;
      let current = -1;
      let painted = -1;

      const paint = (img: HTMLImageElement) => {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!cw || !ch || !iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih); // cover — fill the screen
        const w = iw * scale;
        const h = ih * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };
      // paint the nearest DECODED frame at or below the target — on a cold
      // load the scrub must not freeze the canvas on whatever frame the
      // network reached; it advances as later frames arrive (see onload)
      const draw = (index: number) => {
        const i = Math.max(0, Math.min(FRAMES - 1, Math.round(index)));
        current = i;
        let j = i;
        while (j >= 0) {
          const img = frames[j];
          if (img && img.complete && img.naturalWidth) break;
          j--;
        }
        if (j < 0 || j === painted) return;
        painted = j;
        paint(frames[j]);
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        painted = -1; // canvas was cleared by the resize — force a repaint
        if (current >= 0) draw(current);
      };
      // paint a frame the moment it decodes (progressive load)
      frames.forEach((img, i) => {
        img.onload = () => {
          // a frame at or below the current target arrived — catch up
          if (current >= 0 && i <= current) draw(current);
        };
      });
      resize();
      window.addEventListener("resize", resize);

      // ---------- prefers-reduced-motion: static first frame on white, headline shown ----------
      if (reduced) {
        draw(0);
        return () => window.removeEventListener("resize", resize);
      }

      // ---------- MOTION ----------
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // pre-paint hidden states (layout effect => runs before browser paint, no flash)
      gsap.set(seqWrapRef.current, { autoAlpha: 0 });
      gsap.set(headlineRef.current, { autoAlpha: 0 });
      gsap.set(scrollDownRef.current, { autoAlpha: 1 });

      // ---- intro logo: ambient float (img) + cursor parallax (wrap) ----
      // two nested elements so each animation owns its transform exclusively
      gsap.fromTo(
        introLogoImgRef.current,
        { y: -10, rotation: -1.2 },
        {
          y: 10,
          rotation: 1.2,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }
      );
      const logoX = gsap.quickTo(introLogoRef.current, "x", {
        duration: 0.8,
        ease: "power3",
      });
      const logoY = gsap.quickTo(introLogoRef.current, "y", {
        duration: 0.8,
        ease: "power3",
      });
      const onLogoMouse = (e: MouseEvent) => {
        // the intro is covered by the opaque logo sequence within the first
        // viewport of scroll — past that the parallax would move a hidden node
        if (window.scrollY > window.innerHeight) return;
        logoX((e.clientX / window.innerWidth - 0.5) * 36);
        logoY((e.clientY / window.innerHeight - 0.5) * 36);
      };
      window.addEventListener("mousemove", onLogoMouse);

      // the header ships CSS-visible for the intro (first-paint greeting);
      // if the page loads mid-scroll (scroll restoration), snap it hidden
      // here — the intro trigger / freedom handoff re-show it as needed
      if (window.scrollY > 4) {
        gsap.set(".freedom-header", { autoAlpha: 0, y: -72 });
        setHeaderTheme("light");
      }

      let lenis: Lenis | null = null;
      let tickerFn: ((t: number) => void) | null = null;
      let split: SplitText | null = null;
      let masterTl: gsap.core.Timeline | null = null;
      const triggers: ScrollTrigger[] = [];
      let cancelled = false;

      const startEngine = () => {
        if (cancelled || !rootRef.current) return;

        // ---- ONE LOOP ----
        // anchors: true — Lenis intercepts same-page hash links (header nav,
        // footer links) and smooth-scrolls through its own loop
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
        lenis.on("scroll", () => ScrollTrigger.update());
        tickerFn = (t: number) => lenis!.raf(t * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        // ---- SplitText headline: direction-aware, NOT scrubbed ----
        split = new SplitText(headlineRef.current!, { type: "chars" });
        const chars = split.chars;
        gsap.set(chars, {
          opacity: 0,
          yPercent: 40,
          willChange: "transform,opacity",
          force3D: true,
        });
        gsap.set(headlineRef.current, { autoAlpha: 1 }); // container on; chars carry the reveal

        let inTween: gsap.core.Tween | null = null;
        const staggerIn = () => {
          inTween?.kill();
          inTween = gsap.fromTo(
            chars,
            { opacity: 0, yPercent: 40 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.04,
              overwrite: "auto",
            }
          );
        };
        const fadeIn = () => {
          // reverse re-entry (scroll up into the zone): opacity, no stagger
          inTween?.kill();
          gsap.to(chars, {
            opacity: 1,
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const fadeOut = () => {
          // every exit (forward before white, or reverse): opacity fade-out only
          inTween?.kill();
          gsap.to(chars, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        // ---- intro overlays: scroll-down cue + header ----
        // The header greets on the intro scene (dark theme over the dark bg),
        // slides up and away as the narrative starts, and stays gone until
        // the freedom act re-shows it (light theme) — see useSequenceAct's
        // header handoff. Toggle tweens, not scrub. onToggle also fires on
        // the initial refresh, so the header enters at load only when the
        // page actually sits at the top (scroll restoration safe).
        const introHeader =
          document.querySelector<HTMLElement>(".freedom-header");
        triggers.push(
          ScrollTrigger.create({
            trigger: rootRef.current,
            start: "top top",
            end: "+=15%",
            onLeave: () =>
              gsap.to(scrollDownRef.current, {
                autoAlpha: 0,
                duration: 0.3,
                overwrite: "auto",
              }),
            onEnterBack: () =>
              gsap.to(scrollDownRef.current, {
                autoAlpha: 1,
                duration: 0.3,
                overwrite: "auto",
              }),
            onToggle: (self) => {
              headerCtl.introActive = self.isActive;
              if (!introHeader) return;
              if (self.isActive) {
                // theme attr flips while the header is still transparent —
                // no visible color swap
                setHeaderTheme("dark");
                gsap.to(introHeader, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              } else {
                // pre-set the light theme for the freedom re-reveal
                setHeaderTheme("light");
                gsap.to(introHeader, {
                  autoAlpha: 0,
                  y: -72, // rides up out of view
                  duration: 0.35,
                  ease: "power2.in",
                  overwrite: "auto",
                });
              }
            },
          })
        );

        // ---- master scrub timeline (composite-only: opacity) ----
        const seqProxy = { f: 0 };
        let headlineShown = false;
        const HZ0 = 0.26;
        const HZ1 = 0.74; // headline visible zone (progress)
        const RAYS_OFF = 0.22; // unmount LightRays once the logo frame fully covers it

        const onUpdate = (self: ScrollTrigger) => {
          const p = self.progress;

          // headline state machine — deterministic at any point:
          // entrance (scroll down into zone) = stagger; every other transition = fade
          const inZone = p >= HZ0 && p <= HZ1;
          if (inZone && !headlineShown) {
            headlineShown = true;
            if (self.direction === 1) staggerIn();
            else fadeIn();
          } else if (!inZone && headlineShown) {
            headlineShown = false;
            fadeOut();
          }

          // rays are covered by the opaque logo frame, then unmounted (GL released)
          const wantRays = p < RAYS_OFF;
          setShowRays((prev) => (prev === wantRays ? prev : wantRays));
        };

        masterTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=250%",
            pin: stageRef.current,
            scrub: 1,
            invalidateOnRefresh: true,
            // sequential pins: refresh top-down regardless of creation order,
            // so pins below measure with the spacers above already applied
            refreshPriority: 3,
            onUpdate,
            onRefresh: resize,
          },
        });
        if (masterTl.scrollTrigger) triggers.push(masterTl.scrollTrigger);

        // seed the first frame so the fade-in reveals the logo (not an empty canvas)
        draw(0);

        masterTl
          .fromTo(
            seqWrapRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12 },
            0.06
          ) // reveal the logo OVER the still-dark intro (dark-on-dark — no white flash)
          .to(
            seqProxy,
            {
              f: FRAMES - 1,
              duration: 0.72,
              onUpdate: () => draw(seqProxy.f),
            },
            0.06
          ) // scrub the frames (scroll = playhead) — the FULL sequence,
        // including the baked exit; the tail then dissolves (below)
          .to(darkRef.current, { autoAlpha: 0, duration: 0.1 }, 0.5) // swap backdrop dark->white MID-play, hidden behind the opaque logo frame
          .to(
            seqWrapRef.current,
            { autoAlpha: 0, duration: 0.12 },
            0.72
          ); // the last frame dissolves in place onto the continuing white —
        // no wipe, no vertical motion; it starts right as the logo leaves
        // instead of holding a black frame

        ScrollTrigger.refresh();
      };

      // gate on fonts so SplitText measures the real glyphs (Playfair/Inter/Rubik)
      (document.fonts?.ready ?? Promise.resolve()).then(startEngine);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onLogoMouse);
        triggers.forEach((t) => t.kill());
        masterTl?.kill();
        split?.revert();
        if (tickerFn) gsap.ticker.remove(tickerFn);
        lenis?.destroy();
      };
    },
    { dependencies: [mounted, reduced] }
  );

  // ---- Part 2: coin-seq — same pattern, seamless onto the continuing white ----
  useSequenceAct({
    mounted,
    reduced,
    rootRef: coinRootRef,
    stageRef: coinStageRef,
    wrapRef: coinSeqWrapRef,
    canvasRef: coinCanvasRef,
    headlineRef: coinHeadlineRef,
    framesRef: coinFramesRef,
    urls: coinFrameUrl,
    count: COIN_FRAMES,
    seqStart: 6, // frame_0007 — start of the coin entrance

    // old zone [0.2, 0.74] remapped onto the new progress scale (frames now
    // end at 0.55) and clipped before the expanding square owns the center
    zone: [0.11, 0.37],
    end: `+=${PIN_LENGTH}`,
  });

  return (
    <>
      <section ref={rootRef} className="hero-root">
      <div ref={stageRef} className="hero-stage">
        {/* dark intro scene (fades to reveal the white base); holds the rays */}
        <div ref={darkRef} className="hero-dark">
          {mounted && showRays && !reduced && (
            <LightRays
              raysOrigin="bottom-center"
              raysColor="#000DFF"
              followMouse={false}
              mouseInfluence={0}
            />
          )}
          {/* centered brand mark — floats in place and follows the cursor;
              lives inside the dark scene, so the opaque logo sequence covers
              it as the narrative starts (no extra scroll wiring needed) */}
          <div ref={introLogoRef} className="hero-intro-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={introLogoImgRef}
              src="/meinbit-logo.png"
              alt="BitBeon logo"
              draggable={false}
            />
          </div>
        </div>

        {/* baked logo image-sequence, scrubbed on canvas */}
        <div ref={seqWrapRef} className="hero-seq-wrap">
          <canvas ref={canvasRef} className="hero-seq-canvas" />
        </div>

        <h1 ref={headlineRef} className="hero-headline h0">
          One app
        </h1>

        <p ref={scrollDownRef} className="scroll-down">
          scroll down
        </p>
      </div>
      </section>

      {/* Part 2 — coin-seq ("Every currency"), same pattern on the continuing white.
          coin frames are on WHITE, so the headline is ink (not the white h0 default). */}
      <section ref={coinRootRef} className="hero-root">
        <div ref={coinStageRef} className="hero-stage">
          <div ref={coinSeqWrapRef} className="hero-seq-wrap">
            <canvas ref={coinCanvasRef} className="hero-seq-canvas" />
          </div>
          <h1
            ref={coinHeadlineRef}
            className="hero-headline h0 headline-on-light"
          >
            Every currency
          </h1>

          {/* phases B-C base under the framed image */}
          <div className="freedom-bg" aria-hidden="true" />

          {/* mask-reveal window: frame + image are always fullscreen & static,
              only the clip-path window animates */}
          <div className="freedom-frame">
            {/* pure gradient seen inside the small starting window */}
            <div className="freedom-gradient" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="freedom-img"
              src="/freedom/image-531.png"
              alt="BitBeon app on a phone standing in a flower meadow"
            />
            {/* marquee track: two identical halves -> xPercent -50 loops seamlessly */}
            <div className="freedom-track">
              <div className="freedom-track-half">
                <span className="freedom-phrase freedom-phrase--side">
                  One app
                </span>
                <span className="freedom-phrase freedom-phrase--side">
                  Every currency
                </span>
                <span className="freedom-phrase freedom-phrase--total">
                  Total freedom
                </span>
              </div>
              <div className="freedom-track-half" aria-hidden="true">
                <span className="freedom-phrase freedom-phrase--side">
                  One app
                </span>
                <span className="freedom-phrase freedom-phrase--side">
                  Every currency
                </span>
                <span className="freedom-phrase freedom-phrase--total">
                  Total freedom
                </span>
              </div>
            </div>
            <p className="freedom-subtitle">
              Fiat and crypto in one app — move it instantly, spend it
              anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* site header moved to components/SiteHeader.tsx (rendered at page
          level in app/page.tsx) — still a page-level FIXED overlay outside
          every pinned stage, still revealed via the .freedom-header hook
          class. Later sections REUSE it, never re-create it. */}
    </>
  );
}
