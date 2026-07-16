import type { LegalDoc } from "./types";

export const imprint: LegalDoc = {
  slug: "imprint",
  title: "Imprint / Legal Information",
  metaTitle: "Imprint / Legal Information — BitBeon",
  metaDescription:
    "Legal information for BitBeon: LUNTRA sp. z o.o. company details, registrations (KRS, RDWW), supervisory authorities, and contact channels.",
  updated: "5 Jun 2026",
  summary: [
    "The Service is operated by LUNTRA sp. z o.o., a Polish limited liability company with its registered office in Wrocław.",
    "The Operator is entered in the Polish National Court Register (KRS) and in the Polish Virtual Currency Business Register (RDWW).",
    "\"BitBeon\" is a brand used by the Operator for the Service.",
    "Polish law governs the Service, together with directly applicable EU law (GDPR and EU AML rules).",
    "Contact the Operator using the listed details for questions, complaints, or requests.",
  ],
  sections: [
    {
      n: "1",
      heading: "Provider of the Service",
      blocks: [
        {
          t: "p",
          text: "**LUNTRA spółka z ograniczoną odpowiedzialnością (LUNTRA sp. z o.o.)**",
        },
        {
          t: "p",
          text: "Registered office: ul. Romana Dmowskiego 3/9, 50-203 Wrocław, Poland",
        },
        {
          t: "ul",
          items: [
            "KRS (National Court Register): 0001143324",
            "Registry court: District Court for Wrocław-Fabryczna in Wrocław, 6th Commercial Division of the National Court Register",
            "NIP (Tax ID): 8982315211",
            "REGON: 540382294",
            "Legal form: Limited liability company incorporated under Polish law",
            "Date of registration in the KRS: 9 December 2024",
            "Share capital: PLN 5,000.00, fully paid in",
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
          text: "Management Board: Rafał Kufieta — President of the Management Board.",
        },
        {
          t: "p",
          text: "Manner of representation: each member of the Management Board is authorised to make declarations on behalf of the company independently.",
        },
      ],
    },
    {
      n: "3",
      heading: "Virtual currency business registration and authorised activities",
      blocks: [
        { t: "p", text: "RDWW registration number: RDWW-1771" },
        {
          t: "p",
          text: "Register: Register of Virtual Currency Activities (Rejestr Działalności w Zakresie Walut Wirtualnych)",
        },
        {
          t: "p",
          text: "Registering authority: Director of the Tax Administration Chamber in Katowice (Dyrektor Izby Administracji Skarbowej w Katowicach)",
        },
        {
          t: "p",
          text: "Date of entry: 18 December 2024 (certificate no. 2401-CKRDST.4225.1180.2024)",
        },
        {
          t: "p",
          text: "The Operator provides virtual currency services in accordance with the Polish Act of 1 March 2018 on Counteracting Money Laundering and Terrorist Financing, including:",
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
            "Generalny Inspektor Informacji Finansowej (GIIF) — General Inspector of Financial Information",
            "ul. Świętokrzyska 12, 00-916 Warsaw, Poland",
          ],
        },
        { t: "h3", text: "For the Virtual Currency Activities Register" },
        {
          t: "address",
          lines: [
            "Dyrektor Izby Administracji Skarbowej w Katowicach",
            "ul. Paderewskiego 32b, 41-282 Katowice, Poland",
          ],
        },
        { t: "h3", text: "For personal data protection" },
        {
          t: "address",
          lines: [
            "Prezes Urzędu Ochrony Danych Osobowych (UODO) — President of the Personal Data Protection Office",
            "ul. Stawki 2, 00-193 Warsaw, Poland",
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
            "LUNTRA sp. z o.o.",
            "ul. Romana Dmowskiego 3/9",
            "50-203 Wrocław, Poland",
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
          text: "The Service is governed by Polish law. EU consumers retain mandatory consumer protection rights. European Commission ODR platform: https://ec.europa.eu/consumers/odr",
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
            ["Operator:", "LUNTRA sp. z o.o."],
            ["User / you:", "Any person or entity accessing the Service."],
            ["Account:", "Registered user account within the Service."],
            ["Digital Assets:", "Virtual currencies and tokens supported."],
            ["Fiat Currency:", "Legal tender from sovereign states."],
            ["Integrated Application:", "Third-party services with Service integration."],
            ["Applicable Law:", "Polish law and directly applicable EU law."],
          ],
        },
      ],
    },
  ],
};
