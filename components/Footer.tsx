"use client";

/* BitBeon — Part B, section 7: Footer (Make–Believe reference redesign).
   A white 60px "cap" strip with rounded bottom corners hands the light page
   over to a full-bleed dark panel. Inside the panel: brand logo (header
   dark-theme mark) + Product / Legal link columns, then the giant marquee
   line (the hero freedom phrases) where the reference shows "Get in Touch",
   then small legal print and the bottom bar.

   The marquee is a time-based GSAP tween (xPercent -50 loop over two
   identical track halves — the hero marquee pattern). It runs on the ONE
   LOOP's gsap.ticker (not a second rAF, not scrub) and is paused while the
   footer is off-screen.

   The panel background is the live PixelBlast WebGL layer (its internal rAF
   is the documented ONE-LOOP exception, see PixelBlast.tsx header) —
   recolored to the brand blue-azure per the redesign. Lazily mounted near
   the viewport; autoPauseOffscreen halts it when scrolled away.

   Copy: columns/copyright 1:1 from bitbeon-copy.md → Footer. The Wrocław
   address, tagline and legal/disclaimer paragraphs are NOT in the copy doc
   yet ([TBD: юрлицо]) — placeholders below, marked TODO copy. CTA buttons
   (Get started / Contact support) were dropped from the footer by owner
   decision — the same links live in the Product column and the header. */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setHeaderHidden } from "@/lib/headerTheme";

/* WebGL stays out of the initial bundle; mounted only near the viewport */
const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

/* 1:1 the hero freedom marquee phrases (Figma 78:4852..4854) */
const PHRASES = ["Every currency.", "Total freedom.", "One wallet."];

const PRODUCT_LINKS: Array<[string, string]> = [
  ["Features", "#features"],
  ["Virtual Card", "#card"],
  ["Crypto", "#crypto"],
  ["Security", "#security"],
  ["Get started", "#start"],
  ["FAQ", "#faq"],
];

const LEGAL_LINKS: Array<[string, string]> = [
  // legal documents live at app/<slug>/page.tsx, rendered by LegalPage.tsx
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Use", "/terms-of-service"],
  ["Cookie Policy", "/cookie-policy"],
  ["KYC / AML Policy", "/aml-kyc"],
  ["Imprint", "/imprint"],
  /* intercepted by CookieConsent (delegated click on this href) — reopens
     the consent dialog with the preferences panel expanded */
  ["Cookie settings", "#cookie-settings"],
];

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServer = () => false;

export default function Footer() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [blastOn, setBlastOn] = useState(false);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  /* lazy-mount PixelBlast when the footer approaches; once mounted it stays
     (autoPauseOffscreen handles pausing when scrolled away) */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || blastOn) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlastOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "50%" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [blastOn]);

  useGSAP(
    () => {
      const root = rootRef.current!;
      gsap.registerPlugin(ScrollTrigger);

      const track = root.querySelector<HTMLElement>(".footer__track")!;
      const panel = root.querySelector<HTMLElement>(".footer__panel")!;
      const logo = root.querySelector<HTMLElement>(".footer__logo")!;

      /* hide the fixed header while the footer is on stage — a state toggle
         like the theme switch (not scrub), so it runs for reduced motion too
         (instant swap there, no slide) */
      const hideHeader = ScrollTrigger.create({
        trigger: panel,
        start: "top 40%",
        refreshPriority: -3,
        onToggle: (self) => setHeaderHidden(self.isActive, reduced),
      });

      if (reduced) {
        gsap.set([panel, logo], { autoAlpha: 1 });
        return () => {
          hideHeader.kill();
          setHeaderHidden(false, true);
        }; // no marquee, no reveal motion
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let marquee: gsap.core.Tween | null = null;
      let revealTl: gsap.core.Timeline | null = null;
      const triggers: ScrollTrigger[] = [];

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // ---- marquee: endless xPercent loop over two identical halves
        // (hero pattern); ambient time-based tween on gsap.ticker, paused
        // off-screen — never scrubbed
        marquee = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 24,
          repeat: -1,
          paused: true,
        });
        triggers.push(
          ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            refreshPriority: -3, // below the Security pin (-2)
            onToggle: (self) =>
              self.isActive ? marquee?.play() : marquee?.pause(),
          })
        );

        // ---- panel reveal, then the brand logo pops (one toggle timeline)
        revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            toggleActions: "play none none reverse",
            refreshPriority: -3,
          },
        });
        revealTl
          .fromTo(
            panel,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
          )
          .fromTo(
            logo,
            { autoAlpha: 0, scale: 0.8 },
            { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
            "-=0.3"
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
        marquee?.kill();
        revealTl?.scrollTrigger?.kill();
        revealTl?.kill();
        triggers.forEach((t) => t.kill());
        hideHeader.kill();
        setHeaderHidden(false, true);
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  /* each half carries its own gaps + trailing gap, so -50% is one exact
     half (hero marquee lesson) */
  const half = (key: string) => (
    <div className="footer__track-half" key={key} aria-hidden={key === "b"}>
      {PHRASES.map((p) => (
        <span className="footer__phrase" key={p}>
          {p}
        </span>
      ))}
    </div>
  );

  return (
    <footer ref={rootRef} className="footer">
      {/* white hand-off strip: 60px tall, rounded bottom corners reveal the
          dark panel beneath (radius scales 60px→24px with viewport width) */}
      <div className="footer__cap" aria-hidden="true" />

      <div className="footer__panel">
        {/* live PixelBlast bg — brand blue-azure per the redesign; NO
            pointer-events:none — the mouse ripple is a feature. Content
            blocks sit above it (position: relative). */}
        {blastOn && (
          <div className="footer__blast" aria-hidden="true">
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#2E5CFF"
              patternScale={2}
              patternDensity={1}
              enableRipples
              rippleSpeed={0.3}
              rippleThickness={0.1}
              rippleIntensityScale={1}
              speed={0.5}
              transparent
              edgeFade={0.25}
            />
          </div>
        )}

        {/* middle grid: brand logo (header dark-theme mark) left, Product
            column center, Legal column far right */}
        <div className="footer__grid">
          <a className="footer__logo" href="#top" aria-label="BitBeon — home">
            <span className="footer__mark" aria-hidden="true" />
            <span className="footer__wordmark">BitBeon</span>
          </a>
          <div className="footer__col footer__col--nav">
            <p className="footer__col-title">Product</p>
            {PRODUCT_LINKS.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer__col footer__col--legal">
            <p className="footer__col-title">Legal</p>
            {LEGAL_LINKS.map(([label, href]) =>
              href.startsWith("/") ? (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ) : (
                /* hash links stay plain anchors — "#cookie-settings" must hit
                   CookieConsent's delegated document click handler */
                <a key={label} href={href}>
                  {label}
                </a>
              )
            )}
          </div>
        </div>

        {/* giant marquee line — the reference's "Get in Touch" slot */}
        <div className="footer__marquee">
          <div className="footer__track">
            {half("a")}
            {half("b")}
          </div>
        </div>

        {/* small legal print above the bottom bar — owner-approved disclaimer
            (source: meinbit.io footer, brand adapted to BitBeon; LUNTRA
            registry details verbatim) */}
        <div className="footer__legal-text">
          <p>
            The BitBeon platform is operated by LUNTRA Sp. z o.o. If you have
            any questions about the services we provide, please contact us via
            the in-app chat or through our other contact channels.
          </p>
          <p>
            LUNTRA Spółka z ograniczoną odpowiedzialnością is a company
            incorporated under the laws of the Republic of Poland, registered
            in the National Court Register (Krajowy Rejestr Sądowy) under KRS
            No. 0001143324. NIP (Tax ID): 8982315211. REGON: 540382294.
            Registered office: ul. Romana Dmowskiego 3/9, 50-203 Wrocław,
            Poland. Share capital: PLN 5,000.00 (fully paid up).
          </p>
          <p>
            LUNTRA Sp. z o.o. is entered in the Register of Virtual Currency
            Activities (Rejestr Działalności w Zakresie Walut Wirtualnych)
            maintained by the Director of the Tax Administration Chamber in
            Katowice (Dyrektor Izby Administracji Skarbowej w Katowicach)
            under registration No. RDWW-1771, with effect from 18 December
            2024. The Company provides virtual currency services in accordance
            with the Polish Act of 1 March 2018 on Counteracting Money
            Laundering and Terrorist Financing.
          </p>
          <p>
            Virtual currencies are not legal tender and are not guaranteed by
            any public authority. The value of crypto-assets may fluctuate
            significantly, and you may lose all of the funds invested.
            Crypto-asset services are not covered by investor compensation or
            deposit guarantee schemes.
          </p>
        </div>

        {/* bottom bar: copyright left, quick legal links right */}
        <div className="footer__bottom">
          <span className="footer__copyright">© LUNTRA Sp. z o.o. 2026</span>
          <div className="footer__legal-chips">
            <Link href="/cookie-policy">Cookies policy</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
