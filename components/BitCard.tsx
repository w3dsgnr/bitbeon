"use client";

/* BitBeon — BitCard: stripped-down React Bits ProfileCard (JS+CSS variant).
   Kept: the pointer-driven tilt engine (rAF — accepted exception to the ONE
   LOOP rule: event-driven and self-terminating on settle, cancelled in
   cleanup), pc-behind glow, pc-shine holo, pc-glare, pc-card/pc-inside shell.
   Removed: user-info / details / avatar blocks, textures (icon/grain), the
   deviceorientation (mobile tilt) branch and its permission flow.
   Plastic proportions live in CSS: aspect-ratio 1.586 + width, radius via
   --card-radius (single source, overridable through the `radius` prop). */
import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import "./BitCard.css";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg, #10101c 0%, #131342 60%, #001040 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (v: number, min = 0, max = 100) =>
  Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (
  v: number,
  fMin: number,
  fMax: number,
  tMin: number,
  tMax: number
) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface BitCardProps {
  enableTilt?: boolean;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  innerGradient?: string;
  /** plastic corner radius — feeds --card-radius (design call, default 24px) */
  radius?: string;
  /** symbol mask for the hologram (React Bits iconUrl analog) — the shine
      shows only through the symbols; white-on-transparent, alpha mask */
  iconUrl?: string;
  /** card artwork rendered UNDER the hologram (z2, below .pc-shine) */
  imageUrl?: string;
  className?: string;
  children?: ReactNode;
}

const BitCardComponent = ({
  enableTilt = true,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  innerGradient,
  radius = "24px",
  iconUrl,
  imageUrl,
  className = "",
  children,
}: BitCardProps) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      // rect, NOT clientWidth: the pointer offsets are measured against the
      // rendered (possibly transform-SCALED) box — when the card sits shrunk
      // on the phone, clientWidth would still report the unscaled 647px and
      // every percent (and the tilt with them) would collapse
      const rect = shell.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      for (const [k, v] of Object.entries(properties))
        wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar =
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05;

      // self-terminating: the rAF stops as soon as the spring settles
      if (stillFar) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        // rect, not client*: same scaled coordinate space as the offsets
        const rect = shell.getBoundingClientRect();
        this.setTarget(rect.width / 2, rect.height / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (evt: PointerEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add("active");
      shell.classList.add("entering");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    shell.addEventListener("pointerenter", handlePointerEnter);
    shell.addEventListener("pointermove", handlePointerMove);
    shell.addEventListener("pointerleave", handlePointerLeave);

    // rect-based: if tilt re-enables while the card is transform-scaled
    // (landed on the phone), client* would put the start point off-card
    const rect = shell.getBoundingClientRect();
    const initialX = (rect.width || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", handlePointerEnter);
      shell.removeEventListener("pointermove", handlePointerMove);
      shell.removeEventListener("pointerleave", handlePointerLeave);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel(); // rAF is guaranteed dead past this point
      shell.classList.remove("active", "entering");
    };
  }, [
    enableTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color": behindGlowColor ?? "rgba(0, 13, 255, 0.35)",
        "--behind-glow-size": behindGlowSize ?? "50%",
        "--card-radius": radius,
        "--holo-mask": iconUrl ? `url("${iconUrl}")` : "none",
      } as React.CSSProperties),
    [innerGradient, behindGlowColor, behindGlowSize, radius, iconUrl]
  );

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            {/* artwork UNDER the hologram (z2) — shine lays on top of it */}
            {imageUrl && (
              <div className="pc-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" />
              </div>
            )}
            <div className="pc-shine" />
            {/* card content sits BETWEEN shine (z3) and glare (z4) */}
            <div className="pc-content-slot">{children}</div>
            <div className="pc-glare" />
          </div>
        </section>
      </div>
    </div>
  );
};

const BitCard = React.memo(BitCardComponent);
export default BitCard;
