/* BitBeon — shared template for the five legal documents
   (/privacy-policy, /terms-of-service, /cookie-policy, /aml-kyc, /imprint).

   Server component: static text, native scroll (Lenis lives only on the home
   page — Hero.tsx), and the App Router already scrolls to top on navigation.
   Per-route <title>/<meta description> come from each route's `metadata`
   export, fed by the same LegalDoc object (single source of truth in
   lib/legal/*).

   Layout: one centered frosted-glass card (~800px) over the footer's live
   PixelBlast backdrop (LegalBackdrop — the only client island). The green
   "important things" callout is the only saturated surface; source section
   numbers hang in the card's left padding on wide screens (LegalPage.css). */
import type { ReactNode } from "react";
import Link from "next/link";
import type { LegalBlock, LegalDoc } from "@/lib/legal/types";
import LegalBackdrop from "./LegalBackdrop";
import "./LegalPage.css";

/* minimal inline markup: **bold** spans and bare-URL auto-links — the only
   two things the source documents use inside a paragraph */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.t) {
    case "p":
      return <p>{inline(block.text)}</p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>
      );
    case "defs":
      return (
        <ul className="lp-defs">
          {block.items.map(([term, def], i) => (
            <li key={i}>
              <strong>{term}</strong> {def}
            </li>
          ))}
        </ul>
      );
    case "address":
      /* postal/registry blocks — first line is the addressee, set bold */
      return (
        <p className="lp-address">
          {block.lines.map((line, i) => (
            <span key={i}>
              {i === 0 ? <strong>{line}</strong> : line}
              {i < block.lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
  }
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="lp">
      <LegalBackdrop />
      <main className="lp__main" id="main">
        <div className="lp__col">
          <Link className="lp__back" href="/">
            <span aria-hidden="true">←</span> Back to home
          </Link>

          <article className="lp__card">
            <header className="lp__head">
              <p className="lp__eyebrow">BitBeon · Legal</p>
              <h1 className="lp__title">{doc.title}</h1>
              <p className="lp__updated">Last updated {doc.updated}</p>
            </header>

            <section className="lp__callout" aria-label="Summary">
              <h2 className="lp__callout-title">The important things to know</h2>
              <ul className="lp__callout-list">
                {doc.summary.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {doc.sections.map((section, i) => (
              <section className="lp-sec" key={i}>
                <h2 className="lp-sec__heading">
                  {section.n && (
                    <span className="lp-sec__num" aria-hidden="true">
                      {section.n}
                    </span>
                  )}
                  {/* the number is decoration for sighted readers; screen
                      readers get it as part of the heading text */}
                  <span className="sr-only">
                    {section.n ? `Section ${section.n}. ` : ""}
                  </span>
                  {section.heading}
                </h2>
                {section.blocks.map((block, j) => (
                  <Block block={block} key={j} />
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}
