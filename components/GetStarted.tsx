"use client";

/* BitBeon — Part B, section 5: "Get started in minutes" (#start).
   No design — composed in the project style (light, DM Sans, 24px radii);
   steps are a quiet stack of elevated white cards, 1400px content column
   (same as Trust). Left column is sticky; the right rail carries a scrubbed
   progress line (scaleY — transform only, invariant OK) and per-step
   toggleClass highlights (CSS transitions, not scrub). Copy 1:1 from
   bitbeon-copy.md → Get started. */
import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

const STEPS = [
  {
    num: "01",
    title: "Register for free",
    body: "Sign up with your phone number. No hidden fees, no paperwork.",
  },
  {
    num: "02",
    title: "Verify your identity",
    body: "Complete a quick KYC check to unlock your full account.",
  },
  {
    num: "03",
    title: "Issue your card",
    body: "Order a virtual or plastic Mastercard linked to your wallet.",
  },
  {
    num: "04",
    title: "Fund your wallet",
    body: "Top up by transfer, card, or crypto deposit.",
  },
  {
    num: "05",
    title: "Send, receive & exchange",
    body: "Manage all your finances worldwide from one powerful app.",
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

export default function GetStarted() {
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

      const intro = root.querySelector<HTMLElement>(".gs__intro")!;
      const list = root.querySelector<HTMLElement>(".gs__list")!;
      const rail = root.querySelector<HTMLElement>(".gs__rail")!;
      const progress = root.querySelector<HTMLElement>(".gs__rail-progress")!;
      const head = root.querySelector<HTMLElement>(".gs__rail-head")!;
      const steps = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".gs__step")
      );

      if (reduced) {
        gsap.set([intro, ...steps], { autoAlpha: 1 });
        gsap.set(progress, { scaleY: 1 });
        // the head is a motion affordance — pointless when nothing scrubs
        gsap.set(head, { autoAlpha: 0 });
        steps.forEach((s) => s.classList.add("is-active"));
        return;
      }

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      const triggers: ScrollTrigger[] = [];
      let railTween: gsap.core.Timeline | null = null;

      const start = () => {
        if (cancelled || !rootRef.current) return;

        // -3 everywhere here: below the Security pin (-2), measured after
        // its spacer applies on refresh
        reveal(intro, { trigger: root, start: "top 70%", refreshPriority: -3 });
        reveal(steps, {
          trigger: list,
          start: "top 75%",
          stagger: 0.12,
          refreshPriority: -3,
        });

        // progress line + luminous head — the only scrub here; scaleY / y =
        // transform only. The rail box runs to the list bottom (its tail is
        // masked by the last card's cover), so the tweens stop at the LAST
        // DOT's center, measured via offsetTop (transform-independent) and
        // re-measured on refresh.
        const lastStep = steps[steps.length - 1];
        const lastDot = lastStep.querySelector<HTMLElement>(".gs__step-dot")!;
        const railSpan = () =>
          lastStep.offsetTop +
          lastDot.offsetTop +
          lastDot.offsetHeight / 2 -
          rail.offsetTop;

        // scrub window = first dot crossing the 55% line -> last dot crossing
        // it: the SAME line the step toggles use, so the head rides the
        // reading line and docks into each dot as its card lights up
        railTween = gsap
          .timeline({
            scrollTrigger: {
              trigger: list,
              start: () => `top+=${rail.offsetTop} 55%`,
              end: () => `top+=${rail.offsetTop + railSpan()} 55%`,
              scrub: true,
              refreshPriority: -3,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            progress,
            { scaleY: 0 },
            { scaleY: () => railSpan() / rail.offsetHeight, ease: "none" },
            0
          )
          .fromTo(head, { y: 0 }, { y: () => railSpan(), ease: "none" }, 0);

        // step highlight: start/end share the 55% viewport line, so the
        // intervals tile edge-to-edge — exactly one step active at a time.
        // The .is-active look is a 250ms CSS transition (not scrub).
        steps.forEach((el) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: el,
              start: "top 55%",
              end: "bottom 55%",
              toggleClass: { targets: el, className: "is-active" },
              refreshPriority: -3,
            })
          );
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
        railTween?.scrollTrigger?.kill();
        railTween?.kill();
        triggers.forEach((t) => t.kill());
      };
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} id="start" className="gs">
      <div className="gs__grid">
        <div className="gs__intro">
          <h2 className="gs__title">
            Get started
            <br />
            in minutes
          </h2>
          <p className="gs__sub">No queues. No paperwork. No waiting.</p>
        </div>
        <div className="gs__list">
          <div className="gs__rail" aria-hidden="true">
            <div className="gs__rail-progress" />
            <div className="gs__rail-head" />
          </div>
          <ol className="gs__steps">
            {STEPS.map((s) => (
              <li className="gs__step" key={s.num}>
                <span className="gs__step-dot" aria-hidden="true" />
                <span className="gs__step-num">{s.num}</span>
                <div className="gs__step-text">
                  <h3 className="gs__step-title">{s.title}</h3>
                  <p className="gs__step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
