"use client";

import { useEffect, useState } from "react";

/* SiteHeader — page-level FIXED overlay (Figma node 78:2403).
   Lives OUTSIDE every pinned stage (pins create transform contexts that would
   re-anchor position:fixed). No GSAP inside — the burger state below is plain
   React/CSS (class toggle), it never touches the header root's transform.

   .freedom-header = ANIMATION HOOK, do not remove: Hero's freedom act reveals
   this element (autoAlpha) at the end of phase B via
   document.querySelector(".freedom-header") and it persists across all
   later sections.

   Theming: data-theme="light" | "dark" drives the --hd-* CSS vars
   (globals.css). Switched by Security's ScrollTriggers through
   lib/headerTheme.ts with a 300ms color transition (state, not scrub).

   ≤768px the nav pill is replaced by a burger + dropdown panel. Both live
   INSIDE the header so the freedom reveal (autoAlpha) and the --hd-* theme
   vars cover them too. */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    /* data-theme="dark" at SSR: the header is visible from first paint over
       the DARK intro scene. Hero's intro trigger flips it to light when the
       header leaves the intro; Security keeps switching it later. */
    <header
      className="site-header freedom-header"
      data-theme="dark"
      data-menu-open={menuOpen || undefined}
    >
      <a className="site-header__logo" href="#top" aria-label="BitBeon — home">
        <span className="site-header__mark" aria-hidden="true" />
        <span className="site-header__wordmark">BitBeon</span>
      </a>
      {/* section list mirrors the footer's Product column (minus Get started,
          which is the CTA button) */}
      <nav className="site-header__nav" aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#card">Virtual Card</a>
        <a href="#crypto">Crypto</a>
        <a href="#security">Security</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="site-header__cta" href="#start">
        Get started
      </a>
      <button
        type="button"
        className="site-header__burger"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {/* only one Primary nav is exposed at a time — the pill and the panel
          are never display-ed together (768px swap in globals.css) */}
      <nav id="site-menu" className="site-header__menu" aria-label="Primary">
        <a href="#features" onClick={closeMenu}>
          Features
        </a>
        <a href="#card" onClick={closeMenu}>
          Virtual Card
        </a>
        <a href="#crypto" onClick={closeMenu}>
          Crypto
        </a>
        <a href="#security" onClick={closeMenu}>
          Security
        </a>
        <a href="#faq" onClick={closeMenu}>
          FAQ
        </a>
      </nav>
    </header>
  );
}
