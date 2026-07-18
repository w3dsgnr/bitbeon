/* Shared shape for the five legal documents (content: meinbit-legal-content.md,
   rebranded MeinBit → BitBeon; operator LAND GROUP s.r.o., registry details
   from the Slovak Commercial Register).

   Section numbers come from the SOURCE documents (`n`), not a CSS counter —
   legal text cross-references them ("see Section 14.1"), so renumbering on
   render would break the meaning. Unnumbered trailing sections (e.g. the
   Terms "Operator information") simply omit `n`. */

export type LegalBlock =
  /* paragraph; supports **bold** and bare-URL auto-linking (LegalPage.tsx) */
  | { t: "p"; text: string }
  /* plain bulleted list */
  | { t: "ul"; items: string[] }
  /* definition list — bold lead-in + description, one per line */
  | { t: "defs"; items: Array<[term: string, def: string]> }
  /* sub-heading inside a section (source ### level: "5.1 …", data groups) */
  | { t: "h3"; text: string }
  /* multi-line block (postal addresses, registry records); first line bold */
  | { t: "address"; lines: string[] };

export interface LegalSection {
  /** source section number ("1" … "18"); omit for unnumbered sections */
  n?: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** human-readable, rendered as "Last updated {updated}" */
  updated: string;
  /** bullets for "The important things to know" callout */
  summary: string[];
  sections: LegalSection[];
}
