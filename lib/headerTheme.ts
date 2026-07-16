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
