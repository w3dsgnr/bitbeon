import type { LegalDoc } from "./types";

export const imprint: LegalDoc = {
  slug: "imprint",
  title: "Imprint / Legal Information",
  metaTitle: "Imprint / Legal Information — BitBeon",
  metaDescription:
    "Legal information for BitBeon: LAND GROUP s.r.o. company details, Commercial Register entry, supervisory authorities, and contact channels.",
  updated: "5 Jun 2026",
  summary: [
    "The Service is operated by LAND GROUP s.r.o., a Slovak limited liability company with its registered office in Bratislava.",
    "The Operator is entered in the Commercial Register of the City Court Bratislava III (Section Sro, Insert No. 25046/B).",
    "\"BitBeon\" is a brand used by the Operator for the Service.",
    "Slovak law governs the Service, together with directly applicable EU law (GDPR and EU AML rules).",
    "Contact the Operator using the listed details for questions, complaints, or requests.",
  ],
  sections: [
    {
      n: "1",
      heading: "Provider of the Service",
      blocks: [
        {
          t: "p",
          text: "**LAND GROUP spoločnosť s ručením obmedzeným (LAND GROUP s.r.o.)**",
        },
        {
          t: "p",
          text: "Registered office: Račianska 66, 831 02 Bratislava – mestská časť Nové Mesto, Slovakia",
        },
        {
          t: "ul",
          items: [
            "IČO (Company identification number): 35 821 540",
            "Registration: Commercial Register of the City Court Bratislava III, Section Sro, Insert No. 25046/B",
            "Legal form: Limited liability company (spoločnosť s ručením obmedzeným) incorporated under Slovak law",
            "Date of registration: 10 April 2001",
            "Share capital: EUR 13,279, fully paid up",
          ],
        },
      ],
    },
    {
      n: "2",
      heading: "Management and representation",
      blocks: [
        {
          t: "p",
          text: "Managing director (konateľ): Ing. Martin Porvazník.",
        },
        {
          t: "p",
          text: "Manner of acting on behalf of the company: the managing director acts and signs on behalf of the company independently.",
        },
      ],
    },
    {
      n: "3",
      heading: "Regulatory framework and activities",
      blocks: [
        {
          t: "p",
          text: "The Operator provides virtual currency / crypto-asset services and applies anti-money-laundering and counter-terrorist-financing measures in accordance with Act No. 297/2008 Coll. on the Prevention of Money Laundering and Terrorist Financing and directly applicable EU AML/CFT rules. Services provided may include:",
        },
        {
          t: "ul",
          items: [
            "Exchange between virtual currencies and fiat currencies",
            "Exchange between virtual currencies",
            "Intermediation in such exchanges",
            "Maintenance of accounts for virtual currencies",
          ],
        },
      ],
    },
    {
      n: "4",
      heading: "Supervisory and competent authorities",
      blocks: [
        { t: "h3", text: "For anti-money-laundering and counter-terrorist-financing" },
        {
          t: "address",
          lines: [
            "Finančná spravodajská jednotka (Financial Intelligence Unit)",
            "National Crime Agency, Presidium of the Police Force of the Slovak Republic",
            "Bratislava, Slovakia",
          ],
        },
        { t: "h3", text: "For personal data protection" },
        {
          t: "address",
          lines: [
            "Úrad na ochranu osobných údajov Slovenskej republiky (Office for Personal Data Protection of the Slovak Republic)",
            "Hraničná 12, 820 07 Bratislava, Slovakia",
          ],
        },
      ],
    },
    {
      n: "5",
      heading: "Contact details",
      blocks: [
        {
          t: "p",
          text: "General inquiries: in-app chat or the contact / support options within the Service.",
        },
        {
          t: "address",
          lines: [
            "Postal address:",
            "LAND GROUP s.r.o.",
            "Račianska 66",
            "831 02 Bratislava – mestská časť Nové Mesto, Slovakia",
          ],
        },
        {
          t: "p",
          text: "Electronic communication: the email address provided in the \"Contact\" or \"Support\" section of the Service.",
        },
        {
          t: "p",
          text: "Data protection rights inquiries: follow the instructions in the Privacy Policy.",
        },
      ],
    },
    {
      n: "6",
      heading: "Trademarks and intellectual property",
      blocks: [
        {
          t: "p",
          text: "\"BitBeon\" is a brand used by the Operator. Other names, logos, and marks may be trademarks of the Operator or third parties. All rights in content and technology are reserved unless stated otherwise.",
        },
      ],
    },
    {
      n: "7",
      heading: "Governing law and online dispute resolution",
      blocks: [
        {
          t: "p",
          text: "The Service is governed by the law of the Slovak Republic. EU consumers retain mandatory consumer protection rights. European Commission ODR platform: https://ec.europa.eu/consumers/odr",
        },
      ],
    },
    {
      heading: "Definitions and scope",
      blocks: [
        {
          t: "defs",
          items: [
            ["Service:", "Digital asset services provided under the \"BitBeon\" brand."],
            ["Operator:", "LAND GROUP s.r.o."],
            ["User / you:", "Any person or entity accessing the Service."],
            ["Account:", "Registered user account within the Service."],
            ["Digital Assets:", "Virtual currencies and tokens supported."],
            ["Fiat Currency:", "Legal tender from sovereign states."],
            ["Integrated Application:", "Third-party services with Service integration."],
            ["Applicable Law:", "Slovak law and directly applicable EU law."],
          ],
        },
      ],
    },
  ],
};
