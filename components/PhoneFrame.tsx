import type { CSSProperties } from "react";

/* BitBeon — decorative iPhone frame: an SVG outline tracing the phone
   contour around a screenshot (body line + side buttons; the screenshots
   already carry the dynamic island, so the frame draws none).
   Pure presentation: absolutely positioned over the shot, pointer-inert,
   sized with CSS calc() geometry (globals.css → .phone-frame) so the
   contour hugs the screenshot box even when the bento cell drifts off the
   310:674 mock ratio. Only the corner radius varies per callsite (act-2
   hero shot 48, acts-3/4 center shot 38) — forwarded as --pf-r. */

const GAP = 7; // screenshot edge -> contour centerline, px
const BLEED = 14; // svg overhang past the shot; = .phone-frame inset

/* side controls, px from the SCREENSHOT top (iPhone 15 Pro silhouette
   eyeballed onto the 310x674 mock phone) */
const LEFT_BUTTONS = [
  { top: 100, h: 20 }, // action
  { top: 150, h: 44 }, // volume up
  { top: 202, h: 44 }, // volume down
];
const RIGHT_BUTTONS = [{ top: 176, h: 74 }]; // side (power)

export default function PhoneFrame({ radius }: { radius: number }) {
  return (
    <svg
      className="phone-frame"
      aria-hidden="true"
      style={{ "--pf-r": `${radius + GAP}px` } as CSSProperties}
    >
      <rect className="phone-frame__body" />
      {LEFT_BUTTONS.map((b) => (
        <rect
          key={b.top}
          className="phone-frame__btn"
          y={BLEED + b.top}
          height={b.h}
        />
      ))}
      {RIGHT_BUTTONS.map((b) => (
        <rect
          key={b.top}
          className="phone-frame__btn phone-frame__btn--right"
          y={BLEED + b.top}
          height={b.h}
        />
      ))}
    </svg>
  );
}
