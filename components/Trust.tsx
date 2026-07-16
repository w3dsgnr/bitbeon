"use client";

/* BitBeon — Part B, section 4: "Built on a foundation of trust".
   Layout follows the Cash App security-section reference (owner request,
   2026-07-09): intro column (H2 + body; the "Learn about security" pill was
   cut by owner decision) and three square feature cards with captions below
   — replacing the former
   Figma 78:4432 stat tiles. The captions keep the ORIGINAL stat meanings
   (bitbeon-copy.md → Built on trust): Bulletproof / Licensed / 100+; each
   card's visual animates that meaning:
   1. black  — end-to-end-encryption toggle (padlock closes as it flips on)
      → "Bulletproof — Security & encryption";
   2. map    — license panel (LUNTRA / RDWW-1771 per TBD-1) over the Warsaw
      map with a soft location ping → "Licensed — Regulated & compliant";
   3. purple — looping toast stack of payments across the globe (per-toast
      currency badge) → "100+ — Countries available".
   Visuals are mock-UI drawn in CSS/SVG, no assets. Loops are pure CSS,
   frozen to a designed rest state under prefers-reduced-motion (pause
   control removed — owner request 2026-07-16). Section reveal = standard
   project reveal only (refreshPriority -3, below Security's triggers). */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

/* one toast per corner of the world — the "100+ countries" stat in motion */
const TOASTS = [
  { sym: "€", title: "Payment sent", sub: "Lisbon · €172" },
  { sym: "¥", title: "Card payment", sub: "Tokyo · ¥4,180" },
  { sym: "$", title: "Top-up received", sub: "New York · $640" },
  { sym: "zł", title: "Withdrawal", sub: "Warsaw · 120 zł" },
] as const;

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

/* round badge — the reference's "!" dot, in brand purple; the char carries
   the card's meaning (currency symbols / license check) */
function Dot({ char }: { char: string }) {
  return (
    <span className="trust__dot" aria-hidden="true">
      {char}
    </span>
  );
}

/* 15px stroke icons for the license-panel rows */
const ROW_ICONS = {
  shield: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1.8l5 2v4.1c0 3.3-2.2 5.5-5 6.5-2.8-1-5-3.2-5-6.5V3.8z" />
      <path d="M5.8 8l1.6 1.6 2.8-3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="4" y="2" width="8" height="12" rx="1.5" />
      <path d="M6.5 6h3M6.5 9h3M6.5 12h2" strokeLinecap="round" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2 6.8h12" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="7" cy="7" r="4.2" />
      <path d="M10.2 10.2l3.2 3.2" strokeLinecap="round" />
    </svg>
  ),
} as const;

/* license facts — entity/registry per bitbeon-copy.md TBD-1 (kept as-is) */
const LICENSE_ROWS = [
  { icon: "shield", text: "Licensed virtual currency business" },
  { icon: "doc", text: "Registry no. RDWW-1771" },
  { icon: "card", text: "PCI DSS compliant" },
  { icon: "search", text: "Independent audits" },
] as const;

/* abstract street map — light grid, one diagonal avenue, two block fills */
function MapArt() {
  return (
    <svg
      className="trust__map"
      viewBox="0 0 420 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="420" height="420" fill="#e9edf1" />
      <g fill="#dfe4e9">
        <rect x="-20" y="30" width="150" height="110" rx="10" />
        <rect x="300" y="250" width="160" height="130" rx="10" />
        <rect x="150" y="330" width="110" height="120" rx="10" />
      </g>
      <g stroke="#fbfcfd" strokeLinecap="round" fill="none">
        <g strokeWidth="9">
          <path d="M-10 160h440" />
          <path d="M-10 310h440" />
          <path d="M140 -10v440" />
          <path d="M290 -10v440" />
        </g>
        <g strokeWidth="5">
          <path d="M-10 70h440" />
          <path d="M-10 238h440" />
          <path d="M60 -10v440" />
          <path d="M368 -10v440" />
        </g>
        <path d="M-20 400 240 -20" strokeWidth="13" />
      </g>
    </svg>
  );
}

export default function Trust() {
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

      const head = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".trust__title, .trust__body")
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".trust__card")
      );

      if (reduced) {
        gsap.set([...head, ...cards], { autoAlpha: 1 });
        return;
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const start = () => {
        if (cancelled || !rootRef.current) return;
        // -3: below Security's triggers (-2) — measured after the act pins
        // above re-apply their spacers on refresh.
        // start "top 92%" + short tween: the section follows the dark
        // Security frame, so its content must already be there when the
        // frame scrolls away — a late reveal reads as content lagging the
        // scroll (owner bug report 2026-07-10).
        reveal(head, {
          trigger: root,
          start: "top 92%",
          duration: 0.55,
          y: 16,
          stagger: 0.08,
          refreshPriority: -3,
        });
        reveal(cards, {
          trigger: root,
          start: "top 92%",
          duration: 0.55,
          y: 16,
          stagger: 0.08,
          refreshPriority: -3,
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
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} className="trust">
      <div className="trust__grid">
        <div className="trust__intro">
          <h2 className="trust__title">Built on a foundation of trust</h2>
          <p className="trust__body">
            Held to the same standards as a regulated financial institution —
            institution-grade encryption, independent audits and a licensed
            operating entity, working quietly in the background.
          </p>
        </div>

        <div className="trust__cards">
          {/* 1 — Bulletproof: encryption toggle, padlock closes as it locks */}
          <figure className="trust__card">
            <div className="trust__tile">
              <div
                className="trust__visual trust__visual--lock"
                aria-hidden="true"
              >
                <div className="trust__lock">
                  <span className="trust__toggle">
                    <span className="trust__toggle-knob">
                      <svg
                        className="trust__knob-lock trust__knob-lock--open"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8.5 11V7.5a3.5 3.5 0 0 1 6.7-1.4" />
                      </svg>
                      <svg
                        className="trust__knob-lock trust__knob-lock--closed"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11" />
                      </svg>
                    </span>
                  </span>
                  <span className="trust__lock-label">
                    End-to-end encryption
                  </span>
                </div>
              </div>
            </div>
            <figcaption className="trust__caption">
              <strong>Bulletproof</strong> — Security &amp; encryption
            </figcaption>
          </figure>

          {/* 2 — Licensed: license panel over the Warsaw map, soft HQ ping */}
          <figure className="trust__card">
            <div className="trust__tile">
              <div
                className="trust__visual trust__visual--map"
                aria-hidden="true"
              >
                <MapArt />
                <span className="trust__ping">
                  <span className="trust__ping-ring" />
                </span>
                <div className="trust__panel">
                  <Dot char="✓" />
                  <p className="trust__panel-title">Licensed to operate</p>
                  <ul className="trust__panel-rows">
                    {LICENSE_ROWS.map((r) => (
                      <li key={r.text}>
                        {ROW_ICONS[r.icon]}
                        <span>{r.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <figcaption className="trust__caption">
              <strong>Licensed</strong> — Regulated &amp; compliant
            </figcaption>
          </figure>

          {/* 3 — 100+: payments landing from around the world */}
          <figure className="trust__card">
            <div className="trust__tile">
              <div
                className="trust__visual trust__visual--alerts"
                aria-hidden="true"
              >
                <div className="trust__toasts">
                  {TOASTS.map((t) => (
                    <div className="trust__toast" key={t.sub}>
                      <Dot char={t.sym} />
                      <div className="trust__toast-text">
                        <strong>{t.title}</strong>
                        <span>{t.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <figcaption className="trust__caption">
              <strong>100+</strong> — Countries available
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
