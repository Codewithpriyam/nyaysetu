/**
 * NyayaSetu — AdminConsultationsPage Component
 * Global Consultation & Dispute Resolution Monitor for Platform Admins.
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiShieldCheck, HiPhone, HiCheckCircle, HiStar, HiCurrencyRupee } from 'react-icons/hi';
import { formatCurrency } from '@/utils';

const ALL_MOCK_CONSULTATIONS = [
  {
    id: 'con-801',
    clientName: 'Rahul Kumar Sharma',
    city: 'Patna, Bihar',
    advocateName: 'Adv. Rajesh Kumar',
    category: 'Consumer Protection',
    duration: '30 Mins',
    fee: 1050,
    platformCommission: 105,
    status: 'Completed',
    rating: 5.0,
    date: '07 Feb 2026',
  },
  {
    id: 'con-802',
    clientName: 'Pooja Verma',
    city: 'Ranchi, Jharkhand',
    advocateName: 'Adv. Sunita Jha',
    category: 'Property & Rental',
    duration: '15 Mins',
    fee: 525,
    platformCommission: 52.5,
    status: 'Completed',
    rating: 4.8,
    date: '06 Feb 2026',
  },
  {
    id: 'con-803',
    clientName: 'Vikash Singh',
    city: 'Dhanbad, Jharkhand',
    advocateName: 'Adv. Amit Kumar Sinha',
    category: 'Banking & UPI Fraud',
    duration: '60 Mins',
    fee: 2100,
    platformCommission: 210,
    status: 'Scheduled',
    rating: null,
    date: 'Tomorrow, 08 Feb 2026',
  },
];

const AdminConsultationsPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">GLOBAL CONSULTATION MONITOR</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Platform Consultation <span className="text-ct-gold italic">Monitor & Analytics</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Track live, scheduled, and completed consultations across all 28 States & 8 UTs.
          </p>
        </div>

        {/* Consultations List */}
        <div className="grid gap-6 grid-cols-1">
          {ALL_MOCK_CONSULTATIONS.map((c) => (
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

                  <p className="font-inter text-xs text-ct-gold font-medium mt-1">
                    Advocate: <strong className="text-ct-ivory">{c.advocateName}</strong> · Category: {c.category}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 font-general text-[10px] uppercase tracking-wider text-ct-muted">
                    <span>🗓️ Date: {c.date}</span>
                    <span>⏱️ Duration: {c.duration}</span>
                    <span className="font-bold text-ct-ivory">Fee: {formatCurrency(c.fee)}</span>
                    <span className="font-bold text-emerald-400">Platform Share (10%): {formatCurrency(c.platformCommission)}</span>
                  </div>
                </div>

                {c.rating && (
                  <div className="flex items-center gap-1.5 bg-ct-gold/10 px-3.5 py-1.5 rounded-full border border-ct-gold/30">
                    <HiStar className="text-ct-gold" size={16} />
                    <span className="font-inter text-sm font-bold text-ct-ivory">{c.rating} / 5.0 Rating</span>
                  </div>
                )}

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminConsultationsPage;
