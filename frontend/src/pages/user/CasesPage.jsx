/**
 * NyayaSetu — CasesPage Component
 * Full Legal Case Tracker & Dispute Management Hub.
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { HiShieldCheck, HiPlus, HiSearch, HiFilter, HiCheckCircle, HiClock, HiDocumentText } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const ALL_MOCK_CASES = [
  {
    id: 'case-101',
    title: 'E-Commerce Refund Denial & Defective Laptop Dispute',
    category: 'Consumer Rights',
    forum: 'District Consumer Disputes Redressal Commission, Patna',
    caseNumber: 'CC/PAT/2026/894',
    advocate: 'Adv. Sunita Jha',
    status: 'In Hearing Stage',
    progress: 75,
    lastUpdate: 'Notice served to Seller & Amazon India. Next hearing on 18th Feb 2026.',
  },
  {
    id: 'case-102',
    title: 'Unauthorized UPI Debit Reversal Claim (Rs. 24,500)',
    category: 'Banking & Finance',
    forum: 'RBI Banking Ombudsman (Online Portal 14448)',
    caseNumber: 'RBI/OMB/2026/19482',
    advocate: 'Adv. Rajesh Kumar',
    status: 'Investigation Pending',
    progress: 40,
    lastUpdate: 'RBI Ombudsman sent demand notice to HDFC Nodal Officer.',
  },
  {
    id: 'case-103',
    title: 'Landlord Refusing to Return Security Deposit (Rs. 35,000)',
    category: 'Property & Rental',
    forum: 'Rent Controller Tribunal, Ranchi',
    caseNumber: 'RCT/RNC/2026/302',
    advocate: 'Adv. Amit Kumar Sinha',
    status: 'Legal Notice Served',
    progress: 30,
    lastUpdate: '15-day notice period active. Landlord response awaited.',
  },
  {
    id: 'case-104',
    title: 'Unpaid Salary for 2 Months & Notice Pay Recovery',
    category: 'Employment & Workplace',
    forum: 'Assistant Labour Commissioner Office, Patna',
    caseNumber: 'ALC/PAT/2025/1102',
    advocate: 'Adv. Ramesh Chandra Sinha',
    status: 'Resolved & Closed',
    progress: 100,
    lastUpdate: 'Full salary Rs 1,20,000 credited to bank account.',
  },
];

const CasesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'In Hearing Stage' | 'Investigation Pending' | 'Resolved & Closed'

  const filteredCases = ALL_MOCK_CASES.filter((c) => {
    if (activeFilter === 'All') return true;
    return c.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">CASE MANAGEMENT & TRACKING</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Your Active Legal <span className="text-ct-gold italic">Cases & Disputes</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Track stage-by-stage progress, court forum updates, and legal notices filed across India.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="court-card-surface p-4 mb-8 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HiFilter className="text-ct-gold" size={18} />
            <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Filter by Status:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'In Hearing Stage', 'Investigation Pending', 'Legal Notice Served', 'Resolved & Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`rounded-xl px-4 py-1.5 font-general text-[10px] uppercase tracking-widest transition-all ${activeFilter === status ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white font-bold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border border-ct-gold/20'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid gap-6 grid-cols-1">
          {filteredCases.map((c) => (
            <BentoTilt key={c.id} tiltAmount={3}>
              <div className="court-card-surface p-7 border border-ct-gold/30 shadow-court-hover">

                <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-ct-gold/15">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                        {c.category}
                      </span>
                      <span className="font-mono text-xs text-ct-muted">Case ID: {c.caseNumber}</span>
                    </div>

                    <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-ct-ivory mt-1">{c.title}</h3>
                    <p className="font-inter text-xs text-ct-muted mt-1">📍 Forum: <strong className="text-ct-ivory">{c.forum}</strong></p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full border px-4 py-1.5 font-general text-[10px] uppercase tracking-widest font-bold ${c.progress === 100 ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400' : 'border-ct-gold/40 bg-ct-gold/10 text-ct-gold'}`}>
                      {c.status}
                    </span>
                    <span className="font-general text-[9px] uppercase tracking-wider text-ct-muted">Assigned: {c.advocate}</span>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-general uppercase tracking-widest text-ct-muted mb-1.5">
                    <span>Dispute Resolution Stage</span>
                    <span className="font-bold text-ct-gold">{c.progress}% Completed</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-ct-void overflow-hidden border border-ct-gold/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] transition-all duration-500 shadow-gold-glow"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>

                {/* Latest Status */}
                <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 flex items-center justify-between text-xs">
                  <span className="font-inter text-ct-ivory">
                    <strong className="text-ct-gold">Status Update:</strong> {c.lastUpdate}
                  </span>
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CasesPage;
