"use client";

/* CookieConsent — EU (GDPR / ePrivacy) first-layer banner + preferences.
   Page-level fixed overlay like SiteHeader: lives OUTSIDE every pinned stage,
   plain React/CSS state — no GSAP, no Lenis interaction.

   Compliance shape:
   - nothing non-essential runs before a choice; no pre-ticked categories;
   - "Accept all" and "Reject all" are equal-prominence on the first layer;
   - per-category second layer (essential locked on);
   - the choice is stored and re-openable via the footer's "Cookie settings"
     link (any <a href="#cookie-settings">).

   Consumers: read getConsent() or listen for the "bitbeon:consent"
   CustomEvent before loading analytics/marketing scripts. */
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "bitbeon-consent-v1";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  // reopened = a stored choice already exists (footer link) — only then may
  // Escape dismiss the dialog without saving a new choice
  const reopenedRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!getConsent()) setVisible(true);

    // footer "Cookie settings" reopens the dialog with the panel expanded
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest(
        'a[href="#cookie-settings"]'
      );
      if (!link) return;
      e.preventDefault();
      const stored = getConsent();
      reopenedRef.current = !!stored;
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setPrefsOpen(true);
      setVisible(true);
      // deliberate focus move — the user asked for this dialog
      requestAnimationFrame(() => rootRef.current?.focus());
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && reopenedRef.current) setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const decide = (a: boolean, m: boolean) => {
    const consent: Consent = {
      necessary: true,
      analytics: a,
      marketing: m,
      ts: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* storage blocked — treat as session-only consent */
    }
    window.dispatchEvent(
      new CustomEvent<Consent>("bitbeon:consent", { detail: consent })
    );
    setVisible(false);
    setPrefsOpen(false);
  };

  if (!visible) return null;

  return (
    <section
      ref={rootRef}
      className="cookie"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      tabIndex={-1}
    >
      <div className="cookie__head">
        <span className="cookie__mark" aria-hidden="true" />
        <h2 className="cookie__title" id="cookie-title">
          Cookies at BitBeon
        </h2>
      </div>

      <p className="cookie__body" id="cookie-desc">
        Essential cookies keep sign-in and security working — they are always
        on. Analytics and marketing cookies run only if you allow them.{" "}
        <a className="cookie__policy" href="#">
          Cookie Policy
        </a>
      </p>

      {prefsOpen && (
        <div className="cookie__prefs">
          <div className="cookie__row">
            <div className="cookie__row-text">
              <p className="cookie__row-title">Essential</p>
              <p className="cookie__row-desc">
                Sign-in, security and fraud prevention. Always on.
              </p>
            </div>
            <button
              type="button"
              className="cookie__switch"
              role="switch"
              aria-checked="true"
              aria-label="Essential cookies — always on"
              disabled
            >
              <span className="cookie__knob" aria-hidden="true" />
            </button>
          </div>

          <div className="cookie__row">
            <div className="cookie__row-text">
              <p className="cookie__row-title">Analytics</p>
              <p className="cookie__row-desc">
                Anonymous usage stats that show us what to improve.
              </p>
            </div>
            <button
              type="button"
              className="cookie__switch"
              role="switch"
              aria-checked={analytics}
              aria-label="Analytics cookies"
              onClick={() => setAnalytics((v) => !v)}
            >
              <span className="cookie__knob" aria-hidden="true" />
            </button>
          </div>

          <div className="cookie__row">
            <div className="cookie__row-text">
              <p className="cookie__row-title">Marketing</p>
              <p className="cookie__row-desc">
                Measures campaigns and personalises offers.
              </p>
            </div>
            <button
              type="button"
              className="cookie__switch"
              role="switch"
              aria-checked={marketing}
              aria-label="Marketing cookies"
              onClick={() => setMarketing((v) => !v)}
            >
              <span className="cookie__knob" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* first layer: Accept and Reject are the SAME component style —
          equal prominence is a legal requirement, not a design choice */}
      <div className="cookie__actions">
        <button
          type="button"
          className="cookie__btn"
          onClick={() => decide(true, true)}
        >
          Accept all
        </button>
        <button
          type="button"
          className="cookie__btn"
          onClick={() => decide(false, false)}
        >
          Reject all
        </button>
        {prefsOpen ? (
          <button
            type="button"
            className="cookie__btn"
            onClick={() => decide(analytics, marketing)}
          >
            Save choices
          </button>
        ) : (
          <button
            type="button"
            className="cookie__more"
            onClick={() => setPrefsOpen(true)}
          >
            Cookie settings
          </button>
        )}
      </div>
    </section>
  );
}
