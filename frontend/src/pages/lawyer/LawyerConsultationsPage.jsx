/**
 * NyayaSetu — LawyerConsultationsPage Component
 * Advocate Consultation History & Video Call Logs Portal:
 *  - Filter by Status (Completed, Scheduled, Active Today)
 *  - Verified UTR Reference Numbers & ₹500 Session Revenue
 *  - Google Meet Links & Client Rating Feedback
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiVideoCamera, HiCheckCircle, HiStar, HiExternalLink, HiSearch, HiFilter } from 'react-icons/hi';
import { formatCurrency } from '@/utils';

const ALL_MOCK_CONSULTATIONS = [
  {
    id: 'con-101',
    clientName: 'Rahul Kumar Sharma',
    city: 'Patna, Bihar',
    category: 'Consumer Protection',
    issue: 'E-Commerce Seller refund denial for defective Rs 45,000 laptop. Notice needed.',
    fee: 500,
    utrNumber: '403819204812',
    date: 'Today, 05:00 PM IST',
    status: 'Scheduled',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    rating: null,
  },
  {
    id: 'con-102',
    clientName: 'Pooja Verma',
    city: 'Ranchi, Jharkhand',
    category: 'Property & Rental',
    issue: 'Landlord refusing to return Rs 30,000 security deposit after 2 months.',
    fee: 500,
    utrNumber: '409182401824',
    date: '06 Feb 2026',
    status: 'Completed',
    meetLink: 'https://meet.google.com/xyz-uvwx-rst',
    rating: 5.0,
  },
  {
    id: 'con-103',
    clientName: 'Vikash Singh',
    city: 'Dhanbad, Jharkhand',
    category: 'Banking & UPI Fraud',
    issue: 'Unauthorized UPI transaction of Rs 18,000. RBI Ombudsman escalation.',
    fee: 500,
    utrNumber: '401928401928',
    date: '04 Feb 2026',
    status: 'Completed',
    meetLink: 'https://meet.google.com/mno-pqrs-tuv',
    rating: 4.8,
  },
];

const LawyerConsultationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ALL_MOCK_CONSULTATIONS.filter((c) => {
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
            <span className="label-text">ADVOCATE CONSULTATION LOGS</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Consultation History <span className="text-ct-gold italic">& Google Meet Logs</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Log of all 1-on-1 legal consultations, verified UTR reference numbers, and Google Meet room links.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="court-card-surface p-4 mb-8 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HiFilter className="text-ct-gold" size={18} />
            <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Filter by Status:</span>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Scheduled', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`rounded-xl px-4 py-1.5 font-general text-[10px] uppercase tracking-widest transition-all ${activeFilter === st ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white font-bold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border border-ct-gold/20'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Consultations List */}
        <div className="grid gap-6 grid-cols-1">
          {filtered.map((c) => (
            <BentoTilt key={c.id} tiltAmount={3}>
              <div className="court-card-surface p-7 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-6 shadow-court-card">

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{c.clientName}</h3>
                    <span className="font-general text-[9px] text-ct-muted">📍 {c.city}</span>
                    <span className={`rounded-full border px-3 py-0.5 font-general text-[8px] uppercase tracking-widest font-bold ${c.status === 'Completed' ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400' : 'border-ct-gold/40 bg-ct-gold/10 text-ct-gold'}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="font-inter text-xs text-ct-gold font-medium mt-1">{c.category}</p>
                  <p className="font-inter text-xs text-ct-muted mt-1 leading-relaxed max-w-xl">
                    "{c.issue}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 font-general text-[10px] uppercase tracking-wider text-ct-ivory/90">
                    <span>🗓️ {c.date}</span>
                    <span className="font-mono text-emerald-400">UTR: {c.utrNumber}</span>
                    <span className="font-bold text-ct-gold">Fee: {formatCurrency(c.fee ?? c.totalAmount ?? 500)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  {c.rating && (
                    <div className="flex items-center gap-1 bg-ct-gold/10 px-3 py-1 rounded-full border border-ct-gold/30">
                      <HiStar className="text-ct-gold" size={14} />
                      <span className="font-inter text-xs font-bold text-ct-ivory">{c.rating} Client Rating</span>
                    </div>
                  )}

                  <a
                    href={c.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                  >
                    <HiVideoCamera size={16} />
                    <span>Open Google Meet</span>
                  </a>
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LawyerConsultationsPage;
