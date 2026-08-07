/**
 * NyayaSetu — KnowYourRightsPage Component
 * Statutory Rights Search & Recourse Portal across Indian Legislation:
 *  - Searchable by everyday legal situations
 *  - Categorized by Police, Banking, Consumer, Rental, Workplace & Cyber Rights
 *  - Displays exact Indian Acts, statutory deadlines, citizen guarantees & helpline numbers
 */

import { useState, useMemo } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiSearch, HiShieldCheck, HiPhone, HiClock, HiScale } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const ALL_STATUTORY_RIGHTS = [
  {
    id: 'r-1',
    category: 'Police & Crime',
    title: 'Right to Zero FIR Registration',
    act: 'Section 154 CrPC / BNSS 173',
    guarantee: 'Police cannot refuse to register an FIR for cognizable offences, regardless of jurisdiction.',
    deadline: 'Immediate upon complaint',
    forum: 'Station House Officer (SHO) / Magistrate',
    helpline: '112 / 100',
    icon: '👮‍♂️',
  },
  {
    id: 'r-2',
    category: 'Police & Crime',
    title: 'Mandatory Production Before Magistrate Within 24 Hours',
    act: 'Article 22(2) Constitution & Sec 57 CrPC',
    guarantee: 'Every arrested person must be produced before the nearest Magistrate within 24 hours of arrest.',
    deadline: 'Strict 24 Hours',
    forum: 'Judicial Magistrate Court',
    helpline: 'NALSA 15100',
    icon: '⚖️',
  },
  {
    id: 'r-3',
    category: 'Banking & Finance',
    title: 'Zero Customer Liability for Unauthorized UPI/Debit',
    act: 'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18',
    guarantee: 'Zero liability if reported to bank within 3 working days. Bank must shadow-credit within 10 days.',
    deadline: 'Report within 3 Working Days',
    forum: 'RBI Banking Ombudsman',
    helpline: '14448',
    icon: '🏦',
  },
  {
    id: 'r-4',
    category: 'Banking & Finance',
    title: 'ATM Failed Cash Non-Dispense Reversal & Daily Penalty',
    act: 'RBI Monetary Policy Guidelines',
    guarantee: 'Bank must reverse failed ATM cash deductions within 5 days or pay Rs. 100/day penalty.',
    deadline: '5 Working Days',
    forum: 'Bank Nodal Officer / RBI Ombudsman',
    helpline: '14448',
    icon: '💳',
  },
  {
    id: 'r-5',
    category: 'Consumer Rights',
    title: 'Right to Refund or Replacement for Defective Products',
    act: 'Consumer Protection Act 2019',
    guarantee: 'Consumers are entitled to full refund, replacement, or compensation for defective goods & service deficiency.',
    deadline: '15 Days Legal Notice',
    forum: 'District Consumer Disputes Redressal Commission',
    helpline: '1915 (National Consumer Helpline)',
    icon: '🛒',
  },
  {
    id: 'r-6',
    category: 'Property & Rental',
    title: 'Security Deposit Refund & Notice Restrictions',
    act: 'Model Tenancy Act & State Rent Control Acts',
    guarantee: 'Security deposit must be refunded within 30 days. Landlords cannot cut off electricity/water supply.',
    deadline: '30 Days after vacating',
    forum: 'Rent Controller Tribunal',
    helpline: 'State Rent Authority Portal',
    icon: '🏠',
  },
  {
    id: 'r-7',
    category: 'Employment & Workplace',
    title: 'Mandatory Timely Salary Disbursal & Notice Pay',
    act: 'Payment of Wages Act 1936',
    guarantee: 'Salaries must be paid by the 7th or 10th of every month. Wrongful termination entitles employee to notice pay.',
    deadline: '7th/10th of every month',
    forum: 'Assistant Labour Commissioner (ALC)',
    helpline: 'EPFO 1800-118-005',
    icon: '💼',
  },
  {
    id: 'r-8',
    category: 'Cyber & Digital',
    title: 'Instant Financial Freeze of Cyber Fraud Transactions',
    act: 'IT Act 2000 (Sec 66C/66D)',
    guarantee: 'Immediate hotline freezing of stolen bank funds reported on 1930 within the golden hour.',
    deadline: 'Within Golden Hour',
    forum: 'National Cyber Crime Reporting Portal',
    helpline: '1930',
    icon: '💻',
  },
  {
    id: 'r-9',
    category: 'Business & Company',
    title: 'MSME Statutory 45-Day Payment Rule & Interest Penalty',
    act: 'MSMED Act 2006 (Sec 15 & 16)',
    guarantee: 'Buyers must pay MSME suppliers within 45 days. Defaulting buyers pay compound interest at 3x RBI bank rate.',
    deadline: '45 Days Maximum',
    forum: 'MSME Samadhaan Facilitation Council',
    helpline: 'samadhaan.msme.gov.in',
    icon: '🏢',
  },
];

const KnowYourRightsPage = () => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoriesList = ['All', 'Police & Crime', 'Banking & Finance', 'Consumer Rights', 'Property & Rental', 'Employment & Workplace', 'Cyber & Digital', 'Business & Company'];

  const filteredRights = useMemo(() => {
    return ALL_STATUTORY_RIGHTS.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.act.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guarantee.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">CITIZEN STATUTORY GUARANTEES</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Know Your <span className="text-ct-gold italic">Statutory Rights</span> Under Indian Law
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Grounded in official Indian Acts, High Court rulings, and regulatory guidelines.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="court-card-surface p-5 mb-10 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4">

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[260px]">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ct-gold" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rights (e.g. FIR, UPI refund, 24 hours, deposit, 1930, salary)…"
              className="w-full rounded-xl border border-ct-gold/20 bg-ct-void py-2.5 pl-11 pr-4 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoriesList.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 font-general text-[10px] uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white font-bold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border border-ct-gold/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Rights Explorer Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRights.map((r) => (
            <BentoTilt key={r.id} className="h-full" tiltAmount={5}>
              <div className="court-card-surface p-6 relative group flex flex-col justify-between h-full border border-ct-gold/30 hover:border-ct-gold transition-all shadow-court-card">

                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                      {r.category}
                    </span>
                    <span className="text-2xl" role="img" aria-hidden>{r.icon}</span>
                  </div>

                  {/* Right Title */}
                  <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-gold transition-colors mb-2">
                    {r.title}
                  </h3>

                  {/* Act & Section */}
                  <div className="rounded-xl border border-ct-gold/20 bg-ct-deep p-3 mb-4">
                    <p className="font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold">Statutory Act & Section</p>
                    <p className="font-cormorant text-lg font-bold text-ct-ivory mt-0.5">{r.act}</p>
                  </div>

                  {/* Citizen Guarantee Description */}
                  <p className="font-inter text-xs text-ct-muted leading-relaxed mb-4">
                    "{r.guarantee}"
                  </p>
                </div>

                {/* Footer Details */}
                <div className="border-t border-ct-gold/15 pt-4 flex flex-col gap-2 font-inter text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-general text-[9px] uppercase text-ct-muted">Mandatory Deadline</span>
                    <span className="font-bold text-ct-gold">{r.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-general text-[9px] uppercase text-ct-muted">Official Helpline</span>
                    <span className="font-mono font-bold text-emerald-400">📞 {r.helpline}</span>
                  </div>
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default KnowYourRightsPage;
