"use client";

/* BitBeon — Part B, section 6: FAQ (#faq). No design — composed in the
   project style: single centered column, accordion. Expansion uses the CSS
   grid trick (grid-template-rows 0fr -> 1fr, 350ms) — an interaction
   animation, not scrub. One item open at a time. Copy 1:1 from
   bitbeon-copy.md → FAQ (TBD markers kept verbatim — copy doc is the source
   of truth). */
import { useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

const QA = [
  {
    q: "What is BitBeon?",
    a: "BitBeon is a multi-currency wallet that combines fiat and crypto in one app. Store, send, receive and exchange money across currencies, issue virtual and plastic Mastercards, and pay worldwide — all from your phone.",
  },
  {
    q: "Where is BitBeon available?",
    a: "BitBeon is built for users across Europe. It supports EUR, USD and other major currencies with SEPA and SWIFT transfers. Availability may vary by country — check the app for your region.",
  },
  {
    q: "How do I create an account?",
    a: "Download the BitBeon app, enter your phone number and set a password. Registration takes under a minute. Complete a quick identity check (KYC) to unlock full functionality — usually just a few minutes.",
  },
  {
    q: "Why is identity verification required?",
    a: "KYC (Know Your Customer) is required by regulations to prevent fraud and money laundering. It also unlocks higher limits and card issuance. We use advanced ML to keep the process fast and secure.",
  },
  {
    q: "What cards does BitBeon offer?",
    a: "Two Mastercards: a virtual card (issued instantly, ideal for online payments and Apple Pay / Google Pay) and a physical plastic card (delivered to your address). Both link directly to your wallet balance.",
  },
  {
    q: "Can I pay with crypto using my card?",
    a: "Yes. Set your spending priority — fiat or crypto. Choose crypto and the app converts it to fiat automatically at the current rate. No manual exchange needed.",
  },
  {
    q: "What cryptocurrencies are supported?",
    a: "BitBeon supports Bitcoin (BTC), Ethereum (ETH), USD Coin (USDC), TRON (TRX), Solana (SOL) and more. Hold, send, receive and instantly swap between any supported assets.",
  },
  {
    q: "How are my funds protected?",
    a: "Your account is protected by biometric authentication (Face ID / Touch ID), a personal PIN and two-factor authentication (2FA). Data is encrypted locally on your device, and you can freeze your card instantly if you suspect any unauthorised use.",
  },
  {
    // [TBD: цены] — kept verbatim from bitbeon-copy.md (do not resolve here)
    q: "What are the fees?",
    a: "Transfers between BitBeon users are free. For external transfers (SEPA, SWIFT) and crypto transactions, standard network or processing fees may apply. Card issuance: virtual from €9, plastic from €14. See the Plans section in the app for current pricing.",
  },
  {
    // [TBD: юрлицо] — entity name pending (bitbeon-copy.md)
    q: "How do I contact support?",
    a: "In-app support is available 24/7 via the chat button. You can also reach us through the Support page on our website. For regulatory or compliance inquiries, contact LUNTRA sp. z o.o. directly.",
  },
] as const;

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function Faq() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  useGSAP(
    () => {
      const root = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const head = root.querySelector<HTMLElement>(".faq__title")!;
      const rows = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".faq__item")
      );

      if (reduced) {
        gsap.set([head, ...rows], { autoAlpha: 1 });
        return;
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const start = () => {
        if (cancelled || !rootRef.current) return;
        // -3: below the Security pin (-2)
        reveal(head, { trigger: root, start: "top 75%", refreshPriority: -3 });
        reveal(rows, {
          trigger: root,
          start: "top 70%",
          stagger: 0.06,
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
    <section ref={rootRef} id="faq" className="faq">
      <h2 className="faq__title">Common questions</h2>
      <div className="faq__list">
        {QA.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className={`faq__item${isOpen ? " is-open" : ""}`} key={item.q}>
              <button
                type="button"
                className="faq__question"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  +
                </span>
              </button>
              <div className="faq__answer">
                <div className="faq__answer-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
