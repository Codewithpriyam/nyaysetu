/**
 * NyayaSetu — 9 Legal Categories grouped into 3 Sets of 3
 * Expanded with 5 rich everyday situations per category to fill layout boxes cleanly.
 */

export const CATEGORY_SETS = [
  // ─── SET 1 ─────────────────────────────────────────────────────────────────
  {
    setNumber: 1,
    title: "Police, Banking & Consumer Rights",
    categories: [
      {
        id:          'police-crime',
        slug:        'police-crime',
        title:       'Police & Crime',
        label:       'Police & Crime',
        icon:        '👮',
        image:       '/img/categories/police-crime.png',
        rightsCount: 14,
        description: 'Police complaints, FIR registration, arrest rights, bail procedure, and criminal defense basics.',
        examples:    [
          'Police refusing to register FIR (Zero FIR & Sec 154 CrPC / BNSS 173)',
          'Anticipatory Bail Application before Sessions Court & High Court',
          'Defense against False Criminal Complaints & Sec 482 Quashing',
          'Arrest Rights, Custodial Protection & D.K. Basu Guidelines',
          'Police Harassment & State Human Rights Commission (SHRC) Complaint',
        ],
        authorities: ['Police Station', 'Magistrate Court', 'State Human Rights Commission'],
      },
      {
        id:          'banking-finance',
        slug:        'banking-finance',
        title:       'Banking & Finance',
        label:       'Banking & Finance',
        icon:        '🏦',
        image:       '/img/categories/banking-finance.png',
        rightsCount: 18,
        description: 'Unauthorized UPI transfers, ATM cash failure, loan disputes, credit card fraud, and insurance claims.',
        examples:    [
          'Unauthorized UPI & Net Banking Transfers (RBI Zero Liability Rule)',
          'ATM Cash Non-Dispense Failure & Rs. 100/day Penalty Claim',
          'Fraudulent Credit Card Charges & International Scam Disallowance',
          'Insurance Claim Rejection (Health, Term & Motor Claims)',
          'Bank Loan Recovery Agent Harassment & Misconduct Complaints',
        ],
        authorities: ['RBI Banking Ombudsman', 'IRDAI', 'Debt Recovery Tribunal'],
      },
      {
        id:          'consumer-rights',
        slug:        'consumer-rights',
        title:       'Consumer Rights',
        label:       'Consumer Rights',
        icon:        '🛒',
        image:       '/img/categories/consumer-rights.png',
        rightsCount: 22,
        description: 'Defective products, refund denial, warranty disputes, e-commerce fraud, and service deficiency.',
        examples:    [
          'E-Commerce Damaged Product Delivery & Refund Denial',
          'Defective Goods / Electronics Warranty Claim Rejection',
          'Service Deficiency by Telecom, Airlines & Real Estate Developers',
          'Misleading Advertisements & False Price Marking',
          'Food Contamination & Safety Standard Violations',
        ],
        authorities: ['District Consumer Forum', 'NCDRC', 'National Consumer Helpline'],
      },
    ],
  },

  // ─── SET 2 ─────────────────────────────────────────────────────────────────
  {
    setNumber: 2,
    title: "Travel, Employment & Property",
    categories: [
      {
        id:          'travel-transport',
        slug:        'travel-transport',
        title:       'Travel & Transport',
        label:       'Travel & Transport',
        icon:        '🚂',
        image:       '/img/categories/travel-transport.png',
        rightsCount: 12,
        description: 'Flight cancellations, railway refund delays, luggage loss, cab overcharging, and hotel disputes.',
        examples:    [
          'Flight Cancellation & Boarding Denial Compensation (DGCA Rules)',
          'Train Ticket Cancellation & Delay Refund Disputes (TDR Filing)',
          'Lost, Damaged or Delayed Airline Checked-in Baggage Claims',
          'Cab Aggregator Surge Overcharging & Driver Harassment',
          'Hotel & Tour Package Non-Fulfillment Refunds',
        ],
        authorities: ['DGCA', 'Railway Claims Tribunal', 'Consumer Forum'],
      },
      {
        id:          'employment-workplace',
        slug:        'employment-workplace',
        title:       'Employment & Workplace',
        label:       'Employment & Workplace',
        icon:        '💼',
        image:       '/img/categories/employment-workplace.png',
        rightsCount: 16,
        description: 'Unpaid salaries, wrongful termination, notice period pay, PF non-deposit, and workplace harassment.',
        examples:    [
          'Unpaid Salaries, Performance Bonuses & Severance Pay Recovery',
          'Wrongful Termination without Statutory Notice Period Pay',
          'PF (EPFO) Non-Deposit & Gratuity Withholding Disputes',
          'Relieving Letter / Experience Certificate Delay & Blacklisting',
          'Workplace Sexual Harassment (POSH Act Complaint Procedure)',
        ],
        authorities: ['Labour Commissioner', 'EPFO', 'Labour Court'],
      },
      {
        id:          'property-rental',
        slug:        'property-rental',
        title:       'Property & Rental',
        label:       'Property & Rental',
        icon:        '🏠',
        image:       '/img/categories/property-rental.png',
        rightsCount: 20,
        description: 'Security deposit refund, rental agreement breaches, illegal eviction, RERA builder delays, and society NOC.',
        examples:    [
          'Landlord Refusing to Return Security Deposit upon Vacating',
          'Illegal Tenant Eviction & Electricity/Water Cut-off Protection',
          'Builder Delay in Property Possession & RERA Interest Penalty',
          'Property Title Fraud, Boundary Disputes & Illegal Encroachment',
          'Housing Society NOC Refusal & Maintenance Charge Disputes',
        ],
        authorities: ['RERA Tribunal', 'Rent Controller Court', 'Civil Court'],
      },
    ],
  },

  // ─── SET 3 ─────────────────────────────────────────────────────────────────
  {
    setNumber: 3,
    title: "Cyber, Business & Court Procedures",
    categories: [
      {
        id:          'cyber-digital',
        slug:        'cyber-digital',
        title:       'Cyber & Digital',
        label:       'Cyber & Digital',
        icon:        '💻',
        image:       '/img/categories/cyber-digital.png',
        rightsCount: 15,
        description: 'OTP financial fraud, account hacking, online harassment, identity theft, and fake investment scams.',
        examples:    [
          'OTP Scam & Phishing Money Stolen from Savings Account',
          'Social Media Account Hacking, Impersonation & Identity Theft',
          'Online Harassment, Cyber Stalking & Non-Consensual Media',
          'Fake Online Investment Scams & Crypto Fraud Recovery',
          'Data Breach & Unauthorized Personal Information Leaks',
        ],
        authorities: ['National Cyber Crime Portal (1930)', 'Cyber Cell Police', 'IT Adjudicating Officer'],
      },
      {
        id:          'business-company',
        slug:        'business-company',
        title:       'Business & Company',
        label:       'Business & Company',
        icon:        '🏢',
        image:       '/img/categories/general-court.png',
        rightsCount: 19,
        description: 'Client non-payment, vendor breach of contract, startup registration, MSME payment delay, and partnership disputes.',
        examples:    [
          'Client Non-Payment for Delivered Services & Contract Breach',
          'MSME Samadhaan Delayed Payment Conciliation (45-Day Rule)',
          'Vendor Non-Delivery & Supply Chain Breach of Agreement',
          'Partnership & Co-Founder Equity / Profit Sharing Disputes',
          'Trademark Infringement & Intellectual Property Copying',
        ],
        authorities: ['MSME Samadhaan', 'NCLT', 'Arbitration Tribunal'],
      },
      {
        id:          'general-legal',
        slug:        'general-legal',
        title:       'Court & General Legal',
        label:       'Court & General Legal',
        icon:        '⚖️',
        image:       '/img/categories/general-court.png',
        rightsCount: 25,
        description: 'Legal notice response, RTI application process, affidavit drafting, consumer court process, and court summons.',
        examples:    [
          'Received a Legal Notice — Drafting Formal Reply within 15 Days',
          'Right to Information (RTI) Application & First Appeal Process',
          'Court Summons & Subpoena Appearance Procedures',
          'Affidavit, Power of Attorney & Agreement Verification',
          'High Court Writ Petition Filing for Fundamental Rights',
        ],
        authorities: ['District Court', 'High Court', 'Supreme Court of India'],
      },
    ],
  },
];

/** Flat list of all 9 categories for quick lookup */
export const ALL_CATEGORIES = CATEGORY_SETS.flatMap((set) => set.categories);
export const LEGAL_CATEGORIES = ALL_CATEGORIES;

export const getCategoryBySlug = (slug) =>
  ALL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
