# BitBeon — landing page

Marketing site for BitBeon: fiat + crypto in one app. A scroll-driven
narrative landing built with Next.js.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [GSAP](https://gsap.com) + ScrollTrigger — pinned scroll scenes, FLIP
  choreography, frame-sequence scrubbing
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling (drives one
  shared animation loop with GSAP's ticker)
- Tailwind CSS v4 (design tokens + hand-written CSS in `app/globals.css`)
- Three.js — WebGL footer background (PixelBlast)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To preview from another device on your network:

```bash
npx next dev -H 0.0.0.0
```

## Production build

```bash
npm run build
npm start
```

## Structure

- `app/` — routes: the landing (`page.tsx`), five legal documents
  (`/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/aml-kyc`,
  `/imprint`) and global styles
- `components/` — page sections in scroll order (Hero, Act2–4, CryptoHero,
  CryptoHighlights, Security, Trust, GetStarted, Faq, Footer) plus shared
  pieces (SiteHeader, CookieConsent, PhoneFrame, BitCard, PixelBlast)
- `lib/` — legal-document content (single source of truth for the five
  documents), reveal/scroll helpers
- `public/` — image assets, including the scroll-scrubbed frame sequences
  (`hero-logo-seq`, `coin-seq`, `move-seq`, `freedom`)

## Behavior notes

- Desktop (>768px): the story acts are pinned scroll scenes; mobile gets
  static stacked sections with the same content.
- `prefers-reduced-motion` is respected everywhere: pins, scrubs and CSS
  loops resolve to designed rest states.
- The EU cookie consent banner gates all non-essential scripts until a
  stored choice exists.
