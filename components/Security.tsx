"use client";

/* BitBeon — Part B, section 3: Security (#security, Figma 78:3365).
   Static dark rounded frame (part-B tokens 20/60, CSS-owned — no pin, no
   scrub): bg toggles light->black, ScrambleText headline, three cards.

   Invariants honored:
   - rides the ONE LOOP (no own rAF);
   - nothing here is scrubbed or pinned;
   - bg color / theme switches are TOGGLE tweens (allowed).

   Background is a plain black fill (the PixelBlast WebGL layer moved to the
   Footer by owner decision). Card order on screen is 2FA, Biometric, PIN per
   the part-B spec §4.5 (bitbeon-copy.md lists Biometric first — display
   order intentionally differs; texts themselves are 1:1).

   Card visuals are animated CSS/SVG mock-UI (owner request 2026-07-10 —
   same treatment as the Trust cards; replaces the static 3D-icon PNGs).
   Each loop acts out its caption's thesis:
   1. 2FA        — a verification code types itself in, then "Verified";
   2. Biometric  — Face ID scan sweeps the face, which resolves to a check;
   3. PIN        — keypad presses fill the four PIN dots, then
                   "Transfer confirmed".
   Loops are pure CSS on a shared per-card clock, frozen to a designed rest
   state under prefers-reduced-motion (pause control removed — owner request
   2026-07-16). */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { setHeaderTheme } from "@/lib/headerTheme";

const H2_TEXT = "Security you can actually feel";
const SUB_TEXT =
  "Three layers of protection on every login and transaction — so your account stays yours, no matter what.";

const CODE_DIGITS = ["7", "2", "9", "4", "1", "8"] as const;

/* keypad keys; --p1..--p4 mark the pressed sequence (2 → 9 → 5 → 1), each
   press synced to a PIN dot filling on the same 7s clock */
const PIN_PRESS: Record<string, string> = {
  "2": "security__pin-key--p1",
  "9": "security__pin-key--p2",
  "5": "security__pin-key--p3",
  "1": "security__pin-key--p4",
};

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

/* Face ID bracket + face that resolves to a check while the scan line
   sweeps; corner brackets flash brand purple on recognition */
function FaceArt() {
  return (
    <svg
      className="security__face"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <g
        className="security__face-corners"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      >
        <path d="M8 36V22c0-7.7 6.3-14 14-14h14" />
        <path d="M84 8h14c7.7 0 14 6.3 14 14v14" />
        <path d="M112 84v14c0 7.7-6.3 14-14 14H84" />
        <path d="M36 112H22c-7.7 0-14-6.3-14-14V84" />
      </g>
      <g
        className="security__face-id"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M42 46v10M78 46v10" />
        <path d="M60 48v18c0 3-2.4 5-5.5 5" />
        <path d="M42 82c5.4 5.6 11.6 8.4 18 8.4S72.6 87.6 78 82" />
      </g>
      <path
        className="security__face-check"
        d="M38 62l14.5 14.5L83 44"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        className="security__face-scan"
        x="16"
        y="18"
        width="88"
        height="4"
        rx="2"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Security() {
  const rootRef = useRef<HTMLElement | null>(null);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  useGSAP(
    () => {
      const root = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

      const frame = root.querySelector<HTMLElement>(".security__frame")!;
      const h2 = root.querySelector<HTMLElement>(".security__title")!;
      const sub = root.querySelector<HTMLElement>(".security__sub")!;
      const cards = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".security__card")
      );

      if (reduced) {
        // static dark state, everything visible; keep the header-theme
        // trigger (color STATE, not motion)
        gsap.set(frame, { backgroundColor: "#000" });
        gsap.set([h2, sub, ...cards], { autoAlpha: 1, y: 0 });
        const themeTrigger = ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "bottom top",
          refreshPriority: -2,
          onToggle: (self) => setHeaderTheme(self.isActive ? "dark" : "light"),
        });
        return () => themeTrigger.kill();
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      const triggers: ScrollTrigger[] = [];
      const animations: (gsap.core.Timeline | gsap.core.Tween)[] = [];

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // ---- 1. bg light->black + header theme (spec §4.1 + §4.4, one
        // trigger). onToggle covers all four crossings, so the header goes
        // light again both above AND below the section, both directions.
        triggers.push(
          ScrollTrigger.create({
            trigger: root,
            start: "top 60%",
            end: "bottom top",
            // -2: measured only after all act pins above re-apply their
            // spacers, else start lands ~a pin-length early
            refreshPriority: -2,
            onToggle: (self) =>
              setHeaderTheme(self.isActive ? "dark" : "light"),
            onEnter: () =>
              gsap.to(frame, {
                backgroundColor: "#000000",
                duration: 0.6,
                ease: "power2.inOut",
                overwrite: "auto",
              }),
            onLeaveBack: () =>
              gsap.to(frame, {
                // must match --page-light (part-B light canvas)
                backgroundColor: "#ffffff",
                duration: 0.6,
                ease: "power2.inOut",
                overwrite: "auto",
              }),
          })
        );

        // ---- 2. scramble-reveal headline + sub (spec §4.3; replaces the
        // banned React Bits DecryptedText). Toggle, not scrub.
        const scrambleTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 55%",
            toggleActions: "play none none reverse",
            refreshPriority: -2,
          },
        });
        scrambleTl
          .fromTo(h2, { opacity: 0 }, { opacity: 1, duration: 0.2 })
          .to(
            h2,
            {
              duration: 1.1,
              scrambleText: {
                text: H2_TEXT,
                chars: "upperAndLowerCase",
                revealDelay: 0.1,
                speed: 0.4,
              },
            },
            "<"
          )
          .to(
            sub,
            {
              duration: 0.9,
              scrambleText: {
                text: SUB_TEXT,
                chars: "lowerCase",
                speed: 0.5,
              },
              opacity: 1,
            },
            "-=0.6"
          );
        animations.push(scrambleTl);

        // ---- 3. cards (spec §4.5) — toggle reveal after the headline
        animations.push(
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: root,
                start: "top 45%",
                toggleActions: "play none none reverse",
                refreshPriority: -2,
              },
            }
          )
        );

        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        timer = setTimeout(start, 0);
      });

      return () => {
        cancelled = true;
        if (timer !== null) clearTimeout(timer);
        animations.forEach((a) => {
          a.scrollTrigger?.kill();
          a.kill();
        });
        triggers.forEach((t) => t.kill());
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    /* the light page bg shows as a 20px gutter around the static rounded
       frame (CSS: .security padding + .security__frame border-radius) */
    <section ref={rootRef} id="security" className="security">
      <div className="security__frame">
        <div className="security__content">
          {/* real copy ships in the HTML (SEO / reduced motion); the
              scramble timeline hides it (opacity 0) until triggered */}
          <h2 className="security__title">{H2_TEXT}</h2>
          <p className="security__sub">{SUB_TEXT}</p>
          <div className="security__cards">
            {/* 1 — 2FA: the code types itself in, then "Verified" */}
            <div className="security__card">
              <div className="security__card-tile">
                <div
                  className="security__mock security__mock--code"
                  aria-hidden="true"
                >
                  <div className="security__scene">
                    <span className="security__mock-label">
                      Verification code
                    </span>
                    <span className="security__code-cells">
                      {CODE_DIGITS.map((d, i) => (
                        <span
                          className={`security__code-cell security__code-cell--${
                            i + 1
                          }`}
                          key={i}
                        >
                          {d}
                        </span>
                      ))}
                    </span>
                    <span className="security__chip">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                        <path
                          d="M3.5 8.5l3 3 6-6.5"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              <p className="security__card-caption">
                Two-Factor Authentication — An extra layer of security for
                every login and transaction.
              </p>
            </div>

            {/* 2 — Biometric: Face ID scan resolves the face to a check */}
            <div className="security__card">
              <div className="security__card-tile">
                <div
                  className="security__mock security__mock--face"
                  aria-hidden="true"
                >
                  <div className="security__scene">
                    <FaceArt />
                    <span className="security__mock-label">Face ID</span>
                  </div>
                </div>
              </div>
              <p className="security__card-caption">
                Biometric login — Face ID and Touch ID keep your account
                accessible only to you.
              </p>
            </div>

            {/* 3 — PIN: keypad presses fill the dots, transfer confirms */}
            <div className="security__card">
              <div className="security__card-tile">
                <div
                  className="security__mock security__mock--pin"
                  aria-hidden="true"
                >
                  <div className="security__scene">
                    <span className="security__chip">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                        <path
                          d="M3.5 8.5l3 3 6-6.5"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Transfer confirmed
                    </span>
                    <span className="security__pin-dots">
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          className={`security__pin-dot security__pin-dot--${n}`}
                          key={n}
                        />
                      ))}
                    </span>
                    <span className="security__pin-pad">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                        (k) => (
                          <span
                            className={`security__pin-key ${
                              PIN_PRESS[k] ?? ""
                            }`}
                            key={k}
                          >
                            {k}
                          </span>
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <p className="security__card-caption">
                PIN protection — Confirm every transfer with your personal
                PIN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
