import type { LegalDoc } from "./types";

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  metaTitle: "Privacy Policy — BitBeon",
  metaDescription:
    "How LUNTRA sp. z o.o. processes personal data in connection with the BitBeon service: purposes, legal bases, recipients, retention, and your GDPR rights.",
  updated: "5 Jun 2026",
  summary: [
    "The Operator running the Service controls personal data; legal details appear in Imprint / Legal Information.",
    "Data processing supports Service provision, legal compliance (AML/CFT, tax, financial regulations), fraud prevention, and service improvement.",
    "Specialised service providers handle KYC/AML, fraud prevention, and sanctions screening functions.",
    "AML/KYC, transaction, and tax records are retained as legally required, even after Account closure.",
    "Data protection rights include access, rectification, erasure, restriction, portability, and objection — some limited by legal retention requirements.",
    "Account and transaction information may be reported to tax and other authorities across borders per EU and national rules.",
    "Data transfers outside the EEA use appropriate safeguards like standard contractual clauses.",
    "Cookies and similar technologies are used; details and management options appear in the Cookie Policy.",
  ],
  sections: [
    {
      n: "1",
      heading: "Controller and contact details",
      blocks: [
        {
          t: "p",
          text: "This Policy explains personal data processing connected to the Service. The controller of your personal data is:",
        },
        {
          t: "address",
          lines: [
            "LUNTRA sp. z o.o.",
            "ul. Romana Dmowskiego 3/9, 50-203 Wrocław, Poland",
            "KRS: 0001143324 · NIP: 8982315211 · REGON: 540382294",
          ],
        },
        {
          t: "p",
          text: "You can contact the Operator about data protection matters via the in-app chat, the contact / support options within the Service, or by post at the address above. Further details appear in Imprint / Legal Information. If a Data Protection Officer or dedicated privacy contact is appointed, notice will be provided in Imprint / Legal Information or a Policy update.",
        },
      ],
    },
    {
      n: "2",
      heading: "Scope of this Policy and relationship with third-party platforms",
      blocks: [
        {
          t: "p",
          text: "This Policy applies when you access or use the Service, create an Account, participate in identity verification or KYC/AML processes, communicate with the provider, or when data processing is legally required or protects legitimate interests.",
        },
        {
          t: "p",
          text: "When accessing the Service through Integrated Applications or third-party platforms, those third parties act as independent controllers for their own processing under their own privacy policies. The Operator acts as independent controller for Service-related processing. In exceptional cases where joint control applies, obligations will be met under applicable law.",
        },
        {
          t: "p",
          text: "Technical integrations or data exchanges do not create joint controller relationships. This Policy does not cover processing by Integrated Application operators or other third-party services; their own privacy policies apply.",
        },
      ],
    },
    {
      n: "3",
      heading: "Categories of personal data we process",
      blocks: [
        { t: "p", text: "Processing depends on Service usage and legal requirements:" },
        { t: "h3", text: "Identification and KYC data" },
        {
          t: "ul",
          items: [
            "Name, surname, date and place of birth, nationality, citizenship",
            "Address, contact details, government-issued identifiers (ID card, passport number, tax ID where permitted)",
            "Copies or images of identity documents and proof-of-address documents",
            "Photographs, video recordings and biometric templates used for identity verification and liveness detection where permitted",
            "Occupation, employer, nature of business information",
            "Beneficial owner and control structure information for legal entities",
          ],
        },
        { t: "h3", text: "Account and transactional data" },
        {
          t: "ul",
          items: [
            "Account identifiers, usernames, access credentials (hashed or protected)",
            "Transaction history in Digital Assets and Fiat Currencies",
            "Account balances where applicable",
            "Funding source information (linked bank accounts, payment methods in tokenized or masked form)",
            "Order, trade, and transaction details",
          ],
        },
        { t: "h3", text: "Compliance, risk and tax-related data" },
        {
          t: "ul",
          items: [
            "Risk scores and flags from systems or service providers",
            "Sanctions screening, PEP status, and adverse media information",
            "Internal notes and communications relevant to KYC/AML assessment, fraud prevention, or disputes",
            "Tax residence, tax identification numbers, and transaction value summaries required by law",
          ],
        },
        { t: "h3", text: "Technical and usage data" },
        {
          t: "ul",
          items: [
            "IP address, device identifiers, browser type and version, operating system",
            "Access times, pages or screens viewed, clicks and usage data",
            "Referrer URLs and Integrated Application information",
            "Cookie identifiers and similar technologies",
          ],
        },
        { t: "h3", text: "Communication data" },
        {
          t: "ul",
          items: [
            "Message content sent to the provider (emails, chat, support tickets)",
            "Associated metadata (timestamps, sender/recipient information)",
          ],
        },
        { t: "h3", text: "Marketing and preference data" },
        {
          t: "ul",
          items: [
            "Marketing consents and preferences",
            "Interactions with messages or campaigns (whether email was opened)",
            "Feedback from surveys or reviews",
          ],
        },
      ],
    },
    {
      n: "4",
      heading: "Sources of personal data",
      blocks: [
        { t: "p", text: "Personal data comes from:" },
        {
          t: "ul",
          items: [
            "You directly through the Service, onboarding, forms, or communications",
            "Integrated Applications or partners passing data to enable the Service",
            "Third-party verification and KYC/AML service providers",
            "Payment service providers, banks, and financial institutions",
            "Publicly accessible registers and sources (company registers, sanctions lists, court or regulatory databases)",
            "The provider's own systems generating technical, usage, risk, transactional, and analytics data",
            "Public authorities or third parties lawfully providing information for compliance, tax, enforcement, or fraud prevention",
          ],
        },
      ],
    },
    {
      n: "5",
      heading: "Purposes and legal bases for processing",
      blocks: [
        {
          t: "p",
          text: "Processing occurs only with legal basis under applicable data protection law, particularly GDPR.",
        },
        { t: "h3", text: "5.1 Provision of the Service and performance of a contract" },
        {
          t: "p",
          text: "Purpose: Create and manage Account; provide and operate the Service including processing orders and transactions; provide customer support and handle requests.",
        },
        {
          t: "p",
          text: "Legal basis: Performance of contract or steps taken at your request prior to contract entry (Article 6(1)(b) GDPR); for related processing, legitimate interests (Article 6(1)(f) GDPR) such as ensuring Service security and stability.",
        },
        {
          t: "h3",
          text: "5.2 Compliance with legal obligations (including AML/CFT, tax and financial regulations)",
        },
        {
          t: "p",
          text: "Purpose: Conduct KYC and customer due diligence; perform ongoing monitoring, sanctions screening, and risk assessments; comply with the EU \"Travel Rule\" (Regulation (EU) 2023/1113) by collecting, transmitting, receiving and verifying information on the originator and beneficiary of crypto-asset transfers; keep records and report to competent authorities as required; comply with tax, accounting, reporting, and regulatory obligations including administrative cooperation and financial information reporting.",
        },
        {
          t: "p",
          text: "Legal basis: Compliance with legal obligations to which the Controller is subject (Article 6(1)(c) GDPR).",
        },
        { t: "h3", text: "5.3 Security, fraud prevention and risk management" },
        {
          t: "p",
          text: "Purpose: Prevent, detect and investigate fraud, abuse, unauthorised access, money laundering, terrorist financing, sanctions evasion, and law violations; protect system and Service integrity and security; manage risk and enforce rights.",
        },
        {
          t: "p",
          text: "Legal basis: Legitimate interests in protecting the Service, Users, and business, and in enforcing rights (Article 6(1)(f) GDPR); in some cases, compliance with legal obligations (Article 6(1)(c) GDPR).",
        },
        { t: "h3", text: "5.4 Analytics and Service improvement" },
        {
          t: "p",
          text: "Purpose: Understand Service usage; develop and improve Service, user experience, and security; create aggregated non-identifying statistics.",
        },
        {
          t: "p",
          text: "Legal basis: Legitimate interests in improving and developing the Service (Article 6(1)(f) GDPR); where required by law such as non-essential cookies, your consent (Article 6(1)(a) GDPR).",
        },
        { t: "h3", text: "5.5 Marketing and communication" },
        {
          t: "p",
          text: "Purpose: Send service-related messages like security alerts, updates, and administrative communications; send marketing messages about products and services where permitted; show personalised content or offers where agreed.",
        },
        {
          t: "p",
          text: "Legal basis: For service-related communications, performance of contract (Article 6(1)(b) GDPR) and/or legitimate interests (Article 6(1)(f) GDPR); for electronic direct marketing to existing customers, legitimate interests in promoting services (Article 6(1)(f) GDPR) subject to opt-out rights; in other cases where required by law, your consent (Article 6(1)(a) GDPR).",
        },
        { t: "h3", text: "5.6 Legal claims and compliance" },
        {
          t: "p",
          text: "Purpose: Establish, exercise, or defend legal claims; respond to lawful requests from courts, regulators, and public authorities; cooperate with audits and investigations.",
        },
        {
          t: "p",
          text: "Legal basis: Legitimate interests in protecting rights of the provider and Users (Article 6(1)(f) GDPR); compliance with legal obligations (Article 6(1)(c) GDPR).",
        },
      ],
    },
    {
      n: "6",
      heading: "Recipients and categories of recipients",
      blocks: [
        {
          t: "p",
          text: "Personal data may be shared with these categories only as necessary for relevant purposes:",
        },
        {
          t: "defs",
          items: [
            [
              "Group entities:",
              "Other companies within the same group as the Operator for internal administration, risk management, compliance, or service provision.",
            ],
            [
              "Verification providers and KYC/AML partners:",
              "Specialised providers of identity verification, document authentication, sanctions screening, transaction monitoring, and fraud prevention.",
            ],
            [
              "Payment service providers and banks:",
              "Processing Fiat Currency payments, withdrawals, settlements, chargebacks, and related controls.",
            ],
            [
              "Counterparty crypto-asset service providers and intermediaries:",
              "When you send or receive crypto-assets, originator and beneficiary information is shared with the counterparty's crypto-asset service provider and any intermediaries as required by the EU Travel Rule (Regulation (EU) 2023/1113).",
            ],
            [
              "Technical and infrastructure providers:",
              "IT hosting, cloud, security, analytics, communications, and other technology service providers.",
            ],
            [
              "Professional advisors:",
              "Lawyers, auditors, consultants, accountants for legal, compliance, or business purposes.",
            ],
            [
              "Public authorities and regulators:",
              "Financial intelligence units, law enforcement, courts, data protection authorities, tax authorities, and other public bodies where required by law or legitimately requested, including AML/CFT, tax reporting, administrative cooperation, sanctions, or other regulatory obligations.",
            ],
            [
              "Third parties in corporate transactions:",
              "Potential or actual purchasers, investors, or other parties and their advisors in connection with merger, acquisition, restructuring, or asset sale, subject to appropriate confidentiality safeguards.",
            ],
          ],
        },
        { t: "p", text: "The provider does not sell personal data to third parties." },
      ],
    },
    {
      n: "7",
      heading: "International data transfers",
      blocks: [
        {
          t: "p",
          text: "Some recipients may be located outside the European Economic Area or process data outside the EEA. Where transferring personal data to countries without adequate data protection as recognised by the European Commission, appropriate safeguards are in place, such as standard contractual clauses approved by the Commission or other mechanisms recognised by applicable law.",
        },
        {
          t: "p",
          text: "Contact the provider for more information on international transfers and, where applicable, to obtain copies of relevant safeguards (subject to confidentiality redactions).",
        },
      ],
    },
    {
      n: "8",
      heading: "Retention of personal data",
      blocks: [
        {
          t: "p",
          text: "Personal data is kept only as long as necessary for collection purposes or as required by applicable law. Retention periods depend on data category:",
        },
        {
          t: "defs",
          items: [
            [
              "KYC/AML, transactional and tax-related data:",
              "Kept for at least the period required by AML, tax, and financial regulations (potentially several years after business relationship end or transaction completion) and longer where necessary for legal claims or investigations.",
            ],
            [
              "Account data:",
              "Retained for the life of your Account and reasonable period after closure to manage follow-up issues, comply with record-keeping obligations, and protect rights.",
            ],
            [
              "Technical and analytics data:",
              "Retained for shorter periods necessary for security, analysis, and improvement, unless longer retention is justified.",
            ],
            [
              "Marketing data:",
              "Retained until opt-out or consent withdrawal and reasonable period thereafter to keep preference records.",
            ],
          ],
        },
        {
          t: "p",
          text: "When data is no longer needed, it will be deleted or anonymised unless retention is required or permitted by law.",
        },
      ],
    },
    {
      n: "9",
      heading: "Automated decision-making and profiling",
      blocks: [
        {
          t: "p",
          text: "Automated systems, including profiling, support KYC/AML risk assessment, sanctions screening, transaction monitoring, fraud detection and prevention, security and access control, product analytics and improvement, and selection of relevant information or offers where permitted.",
        },
        {
          t: "p",
          text: "These systems identify potentially suspicious or high-risk activities and manage risks effectively. Where such automated processing produces legal effects concerning you or similarly significantly affects you and where required by law, appropriate safeguards protect your rights, freedoms, and legitimate interests, and you have the right to obtain human intervention, express your point of view, and contest the decision.",
        },
      ],
    },
    {
      n: "10",
      heading: "Your rights",
      blocks: [
        {
          t: "p",
          text: "Under data protection law, you have the following rights concerning your personal data, subject to applicable conditions and limitations:",
        },
        {
          t: "defs",
          items: [
            [
              "Right of access:",
              "Obtain confirmation whether your personal data is processed and, if so, receive a copy and certain information.",
            ],
            ["Right to rectification:", "Have inaccurate or incomplete personal data corrected."],
            [
              "Right to erasure:",
              "Request deletion of your personal data in certain circumstances (where no longer needed or where you withdraw consent and there is no other legal basis).",
            ],
            [
              "Right to restriction of processing:",
              "Request that processing be restricted in certain cases (while verifying accuracy or the processing basis).",
            ],
            [
              "Right to data portability:",
              "Receive your provided personal data in structured, commonly used, machine-readable format and transmit it to another controller where technically feasible and processing is based on consent or contract and carried out by automated means.",
            ],
            [
              "Right to object:",
              "Object, on grounds relating to your particular situation, to processing based on legitimate interests, including profiling; the provider will no longer process your data for those purposes unless demonstrating compelling legitimate grounds.",
            ],
            [
              "Right to object to direct marketing:",
              "Object at any time to personal data processing for direct marketing, including related profiling.",
            ],
            [
              "Right to withdraw consent:",
              "Where processing is based on your consent, withdraw it at any time; this will not affect the lawfulness of processing before withdrawal.",
            ],
          ],
        },
        {
          t: "p",
          text: "Some rights may be restricted where the provider is legally required to retain or process certain data, for example under AML Regulations, tax laws, or other regulatory requirements. In particular, data legally required for AML/CFT, tax, or record-keeping purposes may not be fully deleted or restricted.",
        },
        {
          t: "p",
          text: "To exercise your rights, contact the provider using Section 1 details. Identity verification may be requested before responding.",
        },
      ],
    },
    {
      n: "11",
      heading: "Right to lodge a complaint",
      blocks: [
        {
          t: "p",
          text: "If you believe personal data processing violates data protection law, you have the right to lodge a complaint with the competent supervisory authority.",
        },
        { t: "p", text: "The primary supervisory authority for the Operator is:" },
        {
          t: "address",
          lines: [
            "President of the Personal Data Protection Office (Prezes Urzędu Ochrony Danych Osobowych)",
            "ul. Stawki 2, 00-193 Warsaw, Poland",
          ],
        },
        {
          t: "p",
          text: "You may also have the right to lodge a complaint with the data protection authority in the EU Member State of your habitual residence, place of work, or place of the alleged infringement.",
        },
      ],
    },
    {
      n: "12",
      heading: "Cookies and similar technologies",
      blocks: [
        {
          t: "p",
          text: "Cookies and similar technologies are used in connection with the Service for enabling basic functionality and security, remembering preferences, performing analytics and improving the Service, and where applicable, providing personalised content or marketing.",
        },
        {
          t: "p",
          text: "For more information, including cookie types and management choices, see the Cookie Policy and cookie settings available in the Service. Where required by law, consent is obtained before setting non-essential cookies or similar technologies.",
        },
      ],
    },
    {
      n: "13",
      heading: "Changes to this Policy",
      blocks: [
        {
          t: "p",
          text: "This Policy may be updated to reflect changes in applicable law, processing activities, or services. The latest version will be published within the Service and will indicate the update date.",
        },
        {
          t: "p",
          text: "Where changes are material or required by law, the provider will endeavour to inform you in advance through the Service or by other appropriate means. Continued Service use after the updated Policy takes effect constitutes acknowledgement of the updated Policy, without prejudice to any specific consent requirements that may apply.",
        },
      ],
    },
    {
      n: "14",
      heading: "Contact",
      blocks: [
        {
          t: "p",
          text: "If you have questions about this Policy, how personal data is processed, or wish to exercise data protection rights, contact the provider using Imprint / Legal Information details or via contact/support channels provided within the Service.",
        },
      ],
    },
  ],
};
