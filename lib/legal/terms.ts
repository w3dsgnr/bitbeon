import type { LegalDoc } from "./types";

export const termsOfService: LegalDoc = {
  slug: "terms-of-service",
  title: "Terms of Use",
  metaTitle: "Terms of Use — BitBeon",
  metaDescription:
    "The contract governing your use of the BitBeon service operated by LUNTRA sp. z o.o.: eligibility, KYC/AML, fees, risks, liability, and governing law.",
  updated: "5 Jun 2026",
  summary: [
    "Contract between user and the Operator running the \"BitBeon\" brand service.",
    "Legal eligibility required; KYC/AML checks may be necessary.",
    "Digital Assets involve significant risk; no investment, tax, or legal advice provided.",
    "Users responsible for account security and legal compliance including taxes.",
    "Service may be suspended or terminated for legal, regulatory, or compliance reasons.",
    "Liability limited to maximum extent permitted by law.",
    "Governed by Polish law with mandatory EU consumer protections where applicable.",
  ],
  sections: [
    {
      n: "1",
      heading: "Definitions and scope",
      blocks: [
        { t: "p", text: "1.1 Key definitions include:" },
        {
          t: "defs",
          items: [
            [
              "Service:",
              "Digital asset services under the \"BitBeon\" brand across websites, apps, and integrated platforms.",
            ],
            ["Operator:", "Polish legal entity providing the Service."],
            ["User / you:", "Natural person or legal entity accessing the Service."],
            ["Account:", "Registered user account within the Service."],
            ["Digital Assets:", "Virtual currencies, tokens, or digital value representations."],
            ["Fiat Currency:", "Legal tender from sovereign states or monetary authorities."],
            ["Integrated Application:", "Third-party services where Service is embedded."],
            ["Applicable Law:", "All relevant laws including Polish law and EU regulations."],
          ],
        },
        { t: "p", text: "1.2 \"We / us / our\" refers to Operator; \"you / your\" refers to User." },
        { t: "p", text: "1.3 Imprint / Legal Information prevails regarding Operator identification." },
        {
          t: "p",
          text: "1.4 These Terms govern Service access; additional terms may apply to specific features and prevail in conflicts.",
        },
      ],
    },
    {
      n: "2",
      heading: "Acceptance of the Terms",
      blocks: [
        {
          t: "p",
          text: "2.1 Creating an Account, accessing the Service, or clicking accept constitutes agreement to these Terms.",
        },
        { t: "p", text: "2.2 Non-acceptance requires discontinuation of Service use." },
        {
          t: "p",
          text: "2.3 Users on behalf of legal entities warrant authority to bind that entity.",
        },
      ],
    },
    {
      n: "3",
      heading: "Eligibility",
      blocks: [
        { t: "p", text: "3.1 Service use permitted only if:" },
        {
          t: "ul",
          items: [
            "At least 18 years old or legal age in jurisdiction",
            "Full legal capacity to enter binding contracts",
            "No Applicable Law prohibitions preventing Service use",
          ],
        },
        { t: "p", text: "3.2 Service use prohibited if:" },
        {
          t: "ul",
          items: [
            "Located in jurisdiction where Service provision is restricted",
            "Subject to sanctions or listed on sanctioned persons lists",
            "Use would breach Applicable Law including AML/CFT or financial regulations",
          ],
        },
        {
          t: "p",
          text: "3.3 Operator may restrict access from certain jurisdictions or User categories for legal, regulatory, or risk reasons.",
        },
      ],
    },
    {
      n: "4",
      heading: "Description of the Service",
      blocks: [
        { t: "p", text: "4.1 Service may enable:" },
        {
          t: "ul",
          items: [
            "Exchange between Digital Assets and Fiat Currency",
            "Exchange between different Digital Assets",
            "Holding Digital Asset and Fiat Currency balances",
            "Additional functionality introduced over time",
          ],
        },
        {
          t: "p",
          text: "4.2 Available features depend on residence, verification status, Integrated Application use, and other factors.",
        },
        {
          t: "p",
          text: "4.3 No guarantee of continuous availability of particular Digital Assets, currency pairs, payment methods, partners, or features; these may be modified or removed at Operator's discretion within legal compliance.",
        },
        {
          t: "p",
          text: "4.4 Service does not provide personal bank accounts, EU Payment Services Directive accounts, or deposit guarantee scheme coverage unless expressly stated.",
        },
        {
          t: "p",
          text: "4.5 Users remain solely responsible for third-party wallets, interfaces, or accounts; Operator does not generate, store, or manage private keys for third-party wallets unless expressly stated.",
        },
      ],
    },
    {
      n: "5",
      heading: "KYC/AML and compliance",
      blocks: [
        {
          t: "p",
          text: "5.1 Operator must comply with anti-money-laundering and counter-terrorist-financing obligations as obliged institution.",
        },
        {
          t: "p",
          text: "5.2 Users agree to comply with KYC/AML requests including providing information and documents as reasonably requested.",
        },
        {
          t: "p",
          text: "5.3 Third-party verification providers may conduct identity verification, sanctions screening, transaction monitoring, and risk checks per the KYC/AML Policy and Privacy Policy.",
        },
        {
          t: "p",
          text: "5.4 Information from third-party Integrated Applications may be considered; however, Operator remains solely responsible for AML/CFT compliance and reserves right to conduct independent checks and request direct documentation.",
        },
        {
          t: "p",
          text: "5.5 Non-provision of requested information or unsuccessful verification may result in:",
        },
        {
          t: "ul",
          items: [
            "Account opening refusal or maintenance discontinuation",
            "Feature restriction or suspension",
            "Service access termination",
          ],
        },
        { t: "p", text: "5.6 The KYC/AML Policy forms part of these Terms." },
      ],
    },
    {
      n: "6",
      heading: "Integrated Applications and third-party platforms",
      blocks: [
        { t: "p", text: "6.1 Service through Integrated Applications:" },
        {
          t: "ul",
          items: [
            "These Terms govern User-Operator relationship regarding Service",
            "Third-party operator terms govern User-third party relationship",
          ],
        },
        {
          t: "p",
          text: "6.2 Integrated Applications are independent third-party operated; User assumes risk of use.",
        },
        {
          t: "p",
          text: "6.3 Operator not responsible for Integrated Application content, security, availability, compliance, performance, or operator decisions.",
        },
        {
          t: "p",
          text: "6.4 Service availability through Integrated Applications creates no partnership, joint venture, employment, agency, or corporate group relationship.",
        },
        {
          t: "p",
          text: "6.5 Integrated Applications and third parties lack authority to make Operator promises, representations, bindings, or Term modifications.",
        },
        {
          t: "p",
          text: "6.6 Service-related inconsistencies between Integrated Application terms and these Terms result in these Terms prevailing.",
        },
      ],
    },
    {
      n: "7",
      heading: "Your Account and security",
      blocks: [
        {
          t: "p",
          text: "7.1 Users responsible for Account credential confidentiality and security and all Account activities.",
        },
        {
          t: "p",
          text: "7.2 Unauthorised access or security breaches must be reported without undue delay.",
        },
        {
          t: "p",
          text: "7.3 Operator may implement additional security measures (e.g., multi-factor authentication) which users must follow.",
        },
        {
          t: "p",
          text: "7.4 Operator not responsible for unauthorised access losses from credential mishandling or security instruction non-compliance, except where mandatory law requires responsibility.",
        },
      ],
    },
    {
      n: "8",
      heading: "User obligations and prohibited activities",
      blocks: [
        {
          t: "p",
          text: "8.1 Service use must comply with these Terms, Operator policies, and Applicable Law.",
        },
        { t: "p", text: "8.2 Users must not:" },
        {
          t: "ul",
          items: [
            "Use Service for unlawful purposes including money laundering, terrorist financing, fraud, sanctions evasion, tax evasion, market manipulation, or criminal conduct",
            "Use Service for high-risk or unacceptable activities per internal policies",
            "Circumvent KYC/AML, sanctions, tax reporting, or compliance measures",
            "Interfere with Service operation or related systems",
            "Access another User's Account",
            "Use automated access means (bots, scrapers) without express authorisation",
            "Reverse engineer, decompile, or disassemble Service components except as legally permitted",
            "Infringe intellectual property rights",
          ],
        },
        {
          t: "p",
          text: "8.3 Operator may restrict or terminate Accounts for reasonably believed prohibited activity engagement.",
        },
      ],
    },
    {
      n: "9",
      heading: "Fees, pricing and taxes",
      blocks: [
        {
          t: "p",
          text: "9.1 Service fees charged for certain transactions or features, displayed in interface or separate fee schedule.",
        },
        {
          t: "p",
          text: "9.2 Transaction initiation or feature use constitutes fee payment agreement.",
        },
        {
          t: "p",
          text: "9.3 Fee updates comply with Section 16; changes don't apply retroactively to completed transactions.",
        },
        {
          t: "p",
          text: "9.4 Users responsible for applicable taxes including income, capital gains, withholding, and stamp taxes; Operator provides no tax advice.",
        },
        {
          t: "p",
          text: "9.5 Tax reporting and administrative cooperation compliance may require Operator to collect, store, and report Account, User, and transaction information to tax or authorities, including cross-border exchange per Privacy Policy.",
        },
      ],
    },
    {
      n: "10",
      heading: "Risks, relationship and disclaimers (no advice, no fiduciary duty)",
      blocks: [
        {
          t: "p",
          text: "10.1 Digital Assets are highly volatile, may lose rapid value or become worthless; markets may be illiquid with prices influenced by uncontrollable events.",
        },
        {
          t: "p",
          text: "10.2 Service and Digital Asset operation depends on uncontrolled networks, protocols, smart contracts, and technology subject to malfunction, attacks, forks, or unexpected operation.",
        },
        {
          t: "p",
          text: "10.3 Digital Asset regulatory treatment is evolving; legal changes may affect Service use, Digital Asset legality or treatment, and transaction tax consequences.",
        },
        {
          t: "p",
          text: "10.4 Service information is general only, not investment, financial, legal, accounting, or tax advice; users solely responsible for decisions and should seek professional advice.",
        },
        {
          t: "p",
          text: "10.5 No guarantee of Service, feature, partner, payment method, or Digital Asset continuous or jurisdiction-specific availability.",
        },
        {
          t: "p",
          text: "10.6 Operator acts solely as Service provider without adviser, broker, agent, trustee, asset manager, or fiduciary roles; no Operator communication or information creates fiduciary duty or constitutes investment or financial advice.",
        },
        {
          t: "p",
          text: "10.7 Operator assumes no duty to monitor or manage overall Digital Asset or Fiat Currency holdings within Service, third-party wallets, or Third-Party Services.",
        },
      ],
    },
    {
      n: "11",
      heading: "Suspension, limitations and termination",
      blocks: [
        {
          t: "p",
          text: "11.1 Operator may suspend, limit, or terminate Service access, specific features, or close Accounts if:",
        },
        {
          t: "ul",
          items: [
            "Terms or referenced policies are breached",
            "Reasonable grounds exist for fraud, money laundering, terrorist financing, sanctions evasion, tax evasion, or unlawful activity",
            "Information or document provision fails",
            "Compliance with AML/CFT, sanctions, tax reporting, or regulatory obligations is necessary",
            "Court, regulator, or competent authority requires termination",
            "Service discontinuation is decided for jurisdiction coverage",
          ],
        },
        {
          t: "p",
          text: "11.2 Reasonable notice efforts are made where legally permitted; detailed reasons or advance notice may be prevented.",
        },
        {
          t: "p",
          text: "11.3 Users may close Accounts anytime subject to completing KYC/AML checks and settling outstanding obligations.",
        },
        {
          t: "p",
          text: "11.4 Terms continue applying as necessary to resolve outstanding transactions or matters after Account closure.",
        },
      ],
    },
    {
      n: "12",
      heading: "Intellectual property",
      blocks: [
        {
          t: "p",
          text: "12.1 Operator or licensors own all Service intellectual property rights including software, design, text, graphics, logos, trademarks, domain names, and content.",
        },
        {
          t: "p",
          text: "12.2 Limited, non-exclusive, non-transferable, revocable licence grants Service access and use for intended purposes per these Terms.",
        },
        {
          t: "p",
          text: "12.3 Material reproduction, modification, derivative creation, public display, republication, download, storage, or transmission prohibited except for normal Service use or express authorisation.",
        },
        {
          t: "p",
          text: "12.4 \"BitBeon\" and associated logos require prior written Operator consent for use.",
        },
      ],
    },
    {
      n: "13",
      heading: "Third-party services and links",
      blocks: [
        {
          t: "p",
          text: "13.1 Service may contain third-party website, application, wallet, exchange, payment provider, or service links or integrations.",
        },
        {
          t: "p",
          text: "13.2 Third-Party Service use is user risk at own discretion, governed by third-party terms and policies; Operator not responsible for content, performance, availability, security, compliance, or legality.",
        },
        {
          t: "p",
          text: "13.3 Operator doesn't endorse or recommend particular Third-Party Services unless expressly stated.",
        },
        {
          t: "p",
          text: "13.4 Service interoperability with Third-Party Services or Integrated Applications creates no joint or several Operator liability or responsibility for losses from separate third-party relationships.",
        },
      ],
    },
    {
      n: "14",
      heading: "Limitation of liability",
      blocks: [
        {
          t: "p",
          text: "14.1 Nothing excludes or limits liability for wilful misconduct, gross negligence, death, or personal injury negligence liability under Applicable Law.",
        },
        { t: "p", text: "14.2 Subject to Section 14.1 and mandatory consumer rights:" },
        {
          t: "ul",
          items: [
            "No liability for profit loss, revenue loss, business loss, opportunity loss, data loss, goodwill loss, or indirect, consequential, incidental, punitive, or special damages",
            "Total aggregate liability is limited to greater of: (i) total fees paid in preceding twelve months or (ii) EUR 1,000",
          ],
        },
        {
          t: "p",
          text: "14.3 Consumer protection law limitations apply only to permitted extent in consumer residence country.",
        },
        { t: "p", text: "14.4 Operator not liable for losses from:" },
        {
          t: "ul",
          items: [
            "Account or credential security maintenance failure",
            "Unauthorised access from user acts or omissions",
            "Good faith suspension, limitation, or termination per Terms or legal obligations",
            "Uncontrollable events including network failures, power supply failures, third-party actions or omissions",
          ],
        },
      ],
    },
    {
      n: "15",
      heading: "Indemnity (for non-consumer Users)",
      blocks: [
        {
          t: "p",
          text: "15.1 Non-consumer users indemnify and hold harmless Operator, group companies, directors, officers, employees, and agents from claims, demands, actions, proceedings, losses, damages, fines, penalties, costs, and expenses arising from:",
        },
        {
          t: "ul",
          items: [
            "Terms or Applicable Law breach",
            "Service use with Integrated Applications or Third-Party Services, including customer or user representations",
            "Regulatory, tax, reporting, or compliance issues from own obligation failure as independent controller, service provider, or obliged institution",
            "Inaccurate, incomplete, or misleading information, documents, or instructions",
          ],
        },
        {
          t: "p",
          text: "15.2 Indemnity doesn't apply to claims from Operator wilful misconduct or gross negligence.",
        },
      ],
    },
    {
      n: "16",
      heading: "Changes to the Service and to these Terms",
      blocks: [
        {
          t: "p",
          text: "16.1 Operator may modify, suspend, or discontinue Service parts anytime with Applicable Law compliance.",
        },
        {
          t: "p",
          text: "16.2 Terms may be updated; material changes receive advance notice through Service or other means.",
        },
        {
          t: "p",
          text: "16.3 Updated Terms take effect upon publication unless different dates are stated; continued Service use constitutes acceptance.",
        },
        {
          t: "p",
          text: "16.4 Updated Terms non-acceptance requires Service discontinuation and Account closure request.",
        },
      ],
    },
    {
      n: "17",
      heading: "Governing law and dispute resolution",
      blocks: [
        {
          t: "p",
          text: "17.1 Terms are governed by Polish law without conflict-of-laws regard, subject to Section 17.2.",
        },
        {
          t: "p",
          text: "17.2 EU consumer residents may benefit from mandatory consumer protection rules of residence country unaffected by these Terms.",
        },
        {
          t: "p",
          text: "17.3 Polish courts have non-exclusive jurisdiction; consumer residents may bring proceedings in residence country courts where required.",
        },
        {
          t: "p",
          text: "17.4 European Commission online dispute resolution platform available at https://ec.europa.eu/consumers/odr; alternative dispute resolution use is not undertaken unless legally required.",
        },
      ],
    },
    {
      n: "18",
      heading: "Contact and miscellaneous",
      blocks: [
        {
          t: "p",
          text: "18.1 Operator contact details are in the Imprint / Legal Information section.",
        },
        {
          t: "p",
          text: "18.2 Invalid or unenforceable provisions are enforced maximally with remaining provisions in full force.",
        },
        {
          t: "p",
          text: "18.3 Users may not transfer or assign rights or obligations without prior written consent; Operator may assign rights and obligations within group or reorganisation provided user rights aren't adversely affected.",
        },
        {
          t: "p",
          text: "18.4 Right or remedy non-exercise failure or delay is not waiver construction.",
        },
      ],
    },
    {
      heading: "Operator information",
      blocks: [
        {
          t: "p",
          text: "**Company:** LUNTRA sp. z o.o. (limited liability company registered in Poland)",
        },
        {
          t: "ul",
          items: [
            "KRS: 0001143324 (District Court for Wrocław-Fabryczna in Wrocław, 6th Commercial Division of the National Court Register)",
            "NIP: 8982315211",
            "REGON: 540382294",
            "Registered Office: ul. Romana Dmowskiego 3/9, 50-203 Wrocław, Poland",
            "Share capital: PLN 5,000.00, fully paid in",
            "RDWW Registration Number: RDWW-1771 (Register of Virtual Currency Activities)",
            "RDWW Registration Date: 18 December 2024",
          ],
        },
        { t: "h3", text: "Authorised activities" },
        {
          t: "ul",
          items: [
            "Exchange between virtual currencies and fiat currencies",
            "Exchange between virtual currencies",
            "Intermediation in such exchanges",
            "Maintenance of accounts for virtual currencies per Polish law",
          ],
        },
        { t: "p", text: "© LUNTRA sp. z o.o. All rights reserved." },
      ],
    },
  ],
};
