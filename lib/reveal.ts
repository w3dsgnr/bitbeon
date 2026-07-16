import gsap from "gsap";

export interface RevealOpts {
  /* ScrollTrigger trigger element; defaults to the first target */
  trigger?: Element | null;
  start?: string; // default "top 70%"
  y?: number; // default 24
  duration?: number; // default 0.8
  stagger?: number; // default 0.12
  /* REQUIRED in practice for part-B sections: must be LOWER than every pin
     above the trigger (Act4 = -1, Security = -2), or the trigger's start is
     measured before the upstream pin spacers re-apply on refresh and lands
     ~a pin-length too early. -2 for sections above/at Security, -3 below. */
  refreshPriority?: number;
}

/* Standard project reveal (the pattern acts 2-4 inline): autoAlpha 0 -> 1,
   y -> 0, power3.out, ScrollTrigger TOGGLE (never scrub). Targets must ship
   `opacity: 0; visibility: hidden;` in CSS so there is no SSR flash before
   fonts.ready. Call inside a useGSAP context — cleanup is automatic. */
export function reveal(
  targets: gsap.TweenTarget,
  opts: RevealOpts = {}
): gsap.core.Tween {
  const triggerEl =
    opts.trigger ??
    ((Array.isArray(targets) ? targets[0] : targets) as Element);
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: opts.y ?? 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: opts.duration ?? 0.8,
      ease: "power3.out",
      stagger: opts.stagger ?? 0.12,
      scrollTrigger: {
        trigger: triggerEl,
        start: opts.start ?? "top 70%",
        toggleActions: "play none none reverse",
        refreshPriority: opts.refreshPriority ?? 0,
      },
    }
  );
}
