"use client";

/* BitBeon — Part B, section 2: Crypto highlights (Figma 78:2422 lower half).
   Two alternating "illustration <-> text" rows, standard project reveal per
   row (toggle, not scrub). Copy 1:1 from bitbeon-copy.md → Crypto highlights
   (eyebrows uppercased via CSS — source text stays as written). */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function CryptoHighlights() {
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

      const rows = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".crypto-hl__row")
      );

      if (reduced) {
        gsap.set(rows, { autoAlpha: 1 });
        return;
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const start = () => {
        if (cancelled || !rootRef.current) return;
        rows.forEach((row) =>
          reveal(row, {
            trigger: row,
            start: "top 75%",
            stagger: 0.15,
            refreshPriority: -2, // after every act pin above (Act4 = -1)
          })
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
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} className="crypto-hl">
      <div className="crypto-hl__row">
        <div className="crypto-hl__card">
          <img
            src="/low-fees.webp"
            alt="A price tag shaped like a bank card reading “Low Fees” — no ATM, overdraft, hidden or monthly fees"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="crypto-hl__text">
          <p className="crypto-hl__eyebrow">Low fees</p>
          <p className="crypto-hl__body">
            Keep more of every move. No hidden spreads, no surprise charges —
            convert and transfer crypto at some of the lowest rates anywhere,
            with costs you can see upfront.
          </p>
        </div>
      </div>
      <div className="crypto-hl__row crypto-hl__row--flip">
        <div className="crypto-hl__text">
          <p className="crypto-hl__eyebrow">No separate wallet</p>
          <p className="crypto-hl__body">
            Your crypto lives right next to your fiat. No seed phrases to
            guard, no external app, no addresses to copy — just hold, send and
            swap straight from your BitBeon account.
          </p>
        </div>
        <div className="crypto-hl__card">
          <img
            src="/No-separate.webp"
            alt="BitBeon app screen showing fiat and crypto balances side by side"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
