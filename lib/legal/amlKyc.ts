import type { LegalDoc } from "./types";

/* The source document's "important things" is one paragraph; split into
   sentence-per-bullet for the shared callout format (wording unchanged). */
export const amlKycPolicy: LegalDoc = {
  slug: "aml-kyc",
  title: "AML / KYC Policy",
  metaTitle: "AML / KYC Policy — BitBeon",
  metaDescription:
    "BitBeon's anti-money-laundering and know-your-customer framework: due diligence, sanctions screening, the EU Travel Rule, record-keeping, and user obligations.",
  updated: "5 Jun 2026",
  summary: [
    "The Operator requires identity verification and transaction monitoring.",
    "Failure to provide requested information may result in account denial, restrictions, or closure.",
    "A risk-based methodology determines the intensity of compliance checks.",
    "Users and transactions face screening against sanctions lists, with possible reporting to authorities that typically cannot be disclosed.",
    "Third-party verification providers assist with identity checks and fraud prevention.",
    "KYC/AML records are retained for years post-relationship.",
    "The Operator disclaims liability for compliance-related losses within legal limits.",
  ],
  sections: [
    {
      n: "1",
      heading: "Definitions and scope",
      blocks: [
        {
          t: "p",
          text: "This Policy explains KYC and AML/CFT measures for the Service. Terms reference definitions in related legal documents, with the Imprint prevailing on Operator identification. The Policy applies to all Users and Service activities across all interfaces.",
        },
      ],
    },
    {
      n: "2",
      heading: "Legal framework and status as obliged entity",
      blocks: [
        {
          t: "p",
          text: "The Service is operated by LAND GROUP s.r.o. (IČO: 35 821 540), a limited liability company registered in the Commercial Register of the City Court Bratislava III (Section Sro, Insert No. 25046/B), with its registered office in Bratislava, Slovakia.",
        },
        {
          t: "p",
          text: "The Operator qualifies as an obliged entity under Act No. 297/2008 Coll. on the Prevention of Money Laundering and Terrorist Financing and related EU AML/CFT requirements. Obliged entities must conduct due diligence, monitor transactions, maintain records, and report suspicious activity. This Policy summarises high-level requirements without replacing detailed internal procedures.",
        },
      ],
    },
    {
      n: "3",
      heading: "Risk-based approach",
      blocks: [
        {
          t: "p",
          text: "The Operator assesses and classifies risks, applying intensive measures for higher-risk situations and simplified measures where legally permitted. Risk factors include:",
        },
        {
          t: "ul",
          items: [
            "the User's country of residence or incorporation;",
            "whether the User is a politically exposed person (PEP) or is closely related to a PEP;",
            "the size, frequency and pattern of transactions;",
            "the nature of the User's business or activities;",
            "whether the User uses the Service directly or via an Integrated Application;",
            "whether the User or related persons appear on sanctions lists, watchlists or adverse media.",
          ],
        },
        { t: "p", text: "Risk assessments undergo regular review." },
      ],
    },
    {
      n: "4",
      heading: "Customer due diligence (KYC)",
      blocks: [
        { t: "h3", text: "4.1 When we perform KYC" },
        {
          t: "p",
          text: "CDD measures occur when establishing business relationships, conducting certain occasional transactions above regulatory thresholds, suspecting money laundering or terrorist financing, or doubting previously obtained identification data accuracy. Where third-party interfaces performed prior KYC checks, the Operator may consider that information but retains independent compliance responsibility.",
        },
        { t: "h3", text: "4.2 Information we may request" },
        { t: "p", text: "For individuals, the Operator may request:" },
        {
          t: "ul",
          items: [
            "full name;",
            "date and place of birth;",
            "nationality and country of residence;",
            "address;",
            "government-issued identity document (for example, ID card, passport, residence permit);",
            "photographs or live video (for liveness detection and document matching); and",
            "information on the source of funds or source of wealth, where applicable.",
          ],
        },
        { t: "p", text: "For legal entities, requests may include:" },
        {
          t: "ul",
          items: [
            "company name, registration number, registered office and principal place of business;",
            "constitutional documents and corporate structure;",
            "identification data of directors or other authorised representatives;",
            "information about beneficial owners (ultimate beneficial owners – UBOs) and control structure;",
            "information on the nature and purpose of the business relationship;",
            "information on the source of funds or source of wealth, where applicable.",
          ],
        },
        { t: "h3", text: "4.3 Verification and ongoing monitoring" },
        {
          t: "p",
          text: "Identification verification uses reliable, independent sources including government registries, identity databases, and third-party electronic tools. Following relationship establishment, transactions receive continuous monitoring for consistency with User knowledge and risk profile. Periodic information updates or additional documents may be requested, with Service restriction until compliance.",
        },
      ],
    },
    {
      n: "5",
      heading: "Enhanced and simplified due diligence",
      blocks: [
        {
          t: "p",
          text: "Enhanced due diligence applies to higher-risk situations including PEP dealings, high-risk jurisdictions, complex or unusually large transactions, or elevated-risk situations. EDD may involve obtaining additional User information, source of funds documentation, enhanced verifications, and increased relationship monitoring. Simplified due diligence applies to lower-risk situations where regulations permit, while maintaining transaction monitoring.",
        },
      ],
    },
    {
      n: "6",
      heading: "Sanctions and watchlist screening",
      blocks: [
        {
          t: "p",
          text: "The Operator screens Users and connected persons against relevant sanctions and watchlists including EU, UN, and national authority lists. Identified matches may result in:",
        },
        {
          t: "ul",
          items: [
            "refuse to enter into a relationship;",
            "freeze or block transactions;",
            "restrict the use of the Service; and/or",
            "report to competent authorities, as required by AML Regulations.",
          ],
        },
        { t: "p", text: "Legal prohibitions may prevent disclosing such actions." },
      ],
    },
    {
      n: "7",
      heading: "Reporting of suspicious activity",
      blocks: [
        {
          t: "p",
          text: "The Operator files suspicious transaction reports with competent AML/CFT supervisory authorities where required. Legal prohibition generally prevents disclosing report filing or content (\"tipping-off\" prohibition). The Operator may request additional information or documentation for clarification or compliance purposes.",
        },
      ],
    },
    {
      n: "8",
      heading: "Use of third-party verification providers",
      blocks: [
        {
          t: "p",
          text: "The Operator employs specialised third-party providers for identity verification, document authentication, biometric and liveness detection, sanctions screening, and transaction monitoring. Verification Providers function as independent controllers or processors depending on roles and contracts. Details appear in the Privacy Policy. The Operator may modify or add Verification Providers, with information available upon request. Ultimate AML regulatory compliance responsibility remains with the Operator.",
        },
      ],
    },
    {
      n: "9",
      heading: "Record-keeping and retention",
      blocks: [
        { t: "p", text: "The Operator maintains records of:" },
        {
          t: "ul",
          items: [
            "customer identification data and documents;",
            "information obtained during CDD and EDD;",
            "transaction data;",
            "internal and external reports and communications related to AML/CFT.",
          ],
        },
        {
          t: "p",
          text: "Records are retained for periods required by AML Regulations following relationship end and may be retained longer where permitted or required. The Privacy Policy describes AML/CFT personal data processing and data protection rights, noting certain rights may face limitations due to mandatory retention requirements.",
        },
      ],
    },
    {
      n: "10",
      heading: "User obligations",
      blocks: [
        { t: "p", text: "Users must:" },
        {
          t: "ul",
          items: [
            "provide true, accurate, current and complete information when requested by the Operator or any Verification Provider acting on our behalf;",
            "promptly update such information if it changes;",
            "provide any additional information and documents that we reasonably request to comply with AML Regulations;",
            "not use the Service for any unlawful purpose, including money laundering, terrorist financing, fraud, sanctions evasion or other criminal activity.",
          ],
        },
        {
          t: "p",
          text: "Providing false information or failing to provide requested documentation may result in account denial, feature restriction, transaction delays, or Service termination.",
        },
      ],
    },
    {
      n: "11",
      heading: "Refusal, suspension and termination",
      blocks: [
        { t: "p", text: "The Operator may discretionarily:" },
        {
          t: "ul",
          items: [
            "refuse to enter into or continue a business relationship;",
            "suspend or restrict your access to the Service;",
            "refuse, cancel or reverse certain transactions;",
            "freeze or block Digital Assets or Fiat Currencies held within the Service (where technically and legally possible); and/or",
            "close your Account",
          ],
        },
        { t: "p", text: "for AML/CFT compliance or risk management purposes." },
        {
          t: "p",
          text: "Transaction execution may be delayed, refused, or suspended if additional verification is required, criminal activity is suspected, or competent authorities direct such action. The Operator typically attempts notification but may be prohibited by regulations from providing detailed reasons or advance notice. No execution timeframe obligation exists during compliance checks, and delays cause no liability within legal limits.",
        },
      ],
    },
    {
      n: "12",
      heading: "Limitation of liability",
      blocks: [
        {
          t: "p",
          text: "The Operator disclaims liability for losses resulting from KYC performance, Service access refusal, transaction delays, or authority reporting within legal limits. This excludes liability for wilful misconduct or gross negligence. The Policy creates no additional liability basis beyond the Terms of Use, which apply equally to compliance measures.",
        },
      ],
    },
    {
      n: "13",
      heading: "Travel Rule (information accompanying transfers of crypto-assets)",
      blocks: [
        {
          t: "p",
          text: "As a provider of virtual currency / crypto-asset services, the Operator is subject to Regulation (EU) 2023/1113 on information accompanying transfers of funds and certain crypto-assets (the \"Travel Rule\"). For transfers of crypto-assets, the Operator is required to:",
        },
        {
          t: "ul",
          items: [
            "collect, hold and transmit prescribed information about the originator and the beneficiary — which may include names, wallet/account identifiers, and, where applicable, addresses, official personal document numbers, customer identification numbers, or the date and place of birth;",
            "obtain and verify equivalent information for incoming transfers; and",
            "share this information with the crypto-asset service provider of the counterparty, with intermediaries, and with competent authorities, as required by the Travel Rule and AML Regulations.",
          ],
        },
        {
          t: "p",
          text: "Where required information is missing, incomplete, or cannot be verified, the Operator may delay, reject, return, or suspend the relevant transfer and may request additional information before proceeding. The processing of personal data under the Travel Rule is described further in the Privacy Policy.",
        },
      ],
    },
    {
      n: "14",
      heading: "Relationship with other documents and changes to this Policy",
      blocks: [
        {
          t: "p",
          text: "This Policy integrates with the Terms of Use and Privacy Policy. In conflicts, the Terms of Use prevail regarding contractor relationships unless AML Regulations mandate otherwise. The Operator may update this Policy for regulatory or operational reasons, with updates published in the Service. Continued Service use after updates constitutes Policy acknowledgement.",
        },
      ],
    },
  ],
};
