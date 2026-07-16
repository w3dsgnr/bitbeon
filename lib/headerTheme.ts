import gsap from "gsap";

export type HeaderTheme = "light" | "dark";

/* The site header is a page-level fixed singleton (see SiteHeader.tsx).
   Theme colors live in CSS vars keyed off [data-theme] with a 300ms ease
   transition — a color-state change, not a scrub animation. Called from
   Security's ScrollTrigger callbacks. */
export function setHeaderTheme(theme: HeaderTheme) {
  document
    .querySelector<HTMLElement>(".site-header")
    ?.setAttribute("data-theme", theme);
}

/* Hide/show while the footer occupies the stage (Footer's ScrollTrigger).
   Same toggle-tween shape as Hero's intro handoff — autoAlpha + y on the
   GSAP channels that already own this element (CSS can't: Hero leaves inline
   opacity/visibility/transform behind, which beats any stylesheet rule).
   overwrite:"auto" settles races with Hero's own header tweens. */
export function setHeaderHidden(hidden: boolean, instant = false) {
  const el = document.querySelector<HTMLElement>(".site-header");
  if (!el) return;
  gsap.to(el, {
    autoAlpha: hidden ? 0 : 1,
    y: hidden ? -72 : 0, // Hero's off-stage y — one shared hidden pose
    duration: instant ? 0 : 0.35,
    ease: "power3.out",
    overwrite: "auto",
  });
}
