/**
 * NyayaSetu — LawyerEarningsPage Component
 * Advocate Revenue Analytics & Bank Payout Settlement Portal:
 *  - Flat ₹500/Session Revenue Metrics
 *  - Bank Account Payout Settings (IFSC, Account No)
 *  - Weekly Revenue Bar Chart Visualizer
 *  - Recent Settlement Transactions Table
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiCurrencyRupee, HiCheckCircle, HiBanknotes, HiArrowTrendingUp, HiDocumentText } from 'react-icons/hi2';
import { HiSave } from 'react-icons/hi';
import { formatCurrency } from '@/utils';

const RECENT_TRANSACTIONS = [
  {
    id: 'tx-901',
    date: '05 Feb 2026',
    sessionsCount: '8 Consultations',
    gross: 4000,
    platformFee: 400,
    netSettled: 3600,
    bankRef: 'UTR-HDFC202602058912',
    status: 'Settled to Bank',
  },
  {
    id: 'tx-902',
    date: '29 Jan 2026',
    sessionsCount: '12 Consultations',
    gross: 6000,
    platformFee: 600,
    netSettled: 5400,
    bankRef: 'UTR-HDFC202601294102',
    status: 'Settled to Bank',
  },
  {
    id: 'tx-903',
    date: '22 Jan 2026',
    sessionsCount: '10 Consultations',
    gross: 5000,
    platformFee: 500,
    netSettled: 4500,
    bankRef: 'UTR-HDFC202601221948',
    status: 'Settled to Bank',
  },
];

const LawyerEarningsPage = () => {
  const [bankName, setBankName]           = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100294182941');
  const [ifscCode, setIfscCode]           = useState('HDFC0001094');
  const [accountHolder, setAccountHolder] = useState('Adv. Rajesh Kumar');
  const [savedAlert, setSavedAlert]       = useState('');

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    setSavedAlert('Bank account details saved! Automatic payouts active.');
    setTimeout(() => setSavedAlert(''), 4000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Feedback Alert */}
        {savedAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md">
            {savedAlert}
          </div>
        )}

        {/* Header Card */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <HiCheckCircle size={14} /> Weekly Automatic Bank Payouts Active
                </span>
              </div>
              <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                Advocate Revenue <span className="text-ct-gold italic">& Bank Payouts</span>
              </h1>
              <p className="font-inter text-xs sm:text-sm text-ct-muted mt-1">
                Flat ₹500 per consultation session · Net payout after 10% platform fee.
              </p>
            </div>

            <div className="rounded-2xl border border-ct-gold/30 bg-ct-deep p-4 text-right">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Next Payout Date</span>
              <p className="font-inter text-sm font-bold text-ct-gold mt-0.5">Monday, 12 Feb 2026</p>
            </div>

          </div>

          {/* Revenue KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ct-gold/15">
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Lifetime Revenue</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">₹ 1,48,500</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">This Month's Earnings</span>
              <p className="font-zentry text-3xl font-black text-emerald-400 mt-1">₹ 42,500</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Pending Settlement</span>
              <p className="font-zentry text-3xl font-black text-ct-ivory mt-1">₹ 4,500</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Total Sessions</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">297</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-10">

          {/* Left 2 Columns: Settlement Transactions */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            <div>
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
                <HiBanknotes className="text-ct-gold" size={24} />
                <span>Recent Bank Settlement Transactions</span>
              </h2>

              <div className="flex flex-col gap-4">
                {RECENT_TRANSACTIONS.map((tx) => (
                  <BentoTilt key={tx.id} tiltAmount={3}>
                    <div className="court-card-surface p-6 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4 shadow-court-card">

                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{tx.date}</h3>
                          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-0.5 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                            {tx.status}
                          </span>
                        </div>

                        <p className="font-inter text-xs text-ct-gold font-medium mt-1">{tx.sessionsCount}</p>
                        <p className="font-mono text-[10px] text-ct-muted mt-1">Bank Reference: {tx.bankRef}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-zentry text-2xl font-black text-emerald-400">{formatCurrency(tx.netSettled)}</p>
                        <p className="font-general text-[9px] uppercase tracking-widest text-ct-muted mt-0.5">
                          Gross: {formatCurrency(tx.gross)} · Platform Fee: {formatCurrency(tx.platformFee)}
                        </p>
                      </div>

                    </div>
                  </BentoTilt>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Bank Account Settings Form */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28">
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                Bank Payout Account
              </h3>
              <p className="font-general text-[9px] uppercase tracking-widest text-ct-muted mb-5">
                Direct NEFT / RTGS Settlement
              </p>

              <form onSubmit={handleSaveBankDetails} className="flex flex-col gap-4">
                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    Account Holder Name:
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    Bank Name:
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    Account Number:
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-mono text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    IFSC Code:
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-mono text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all mt-2"
                >
                  <HiSave size={16} />
                  <span>Update Bank Details</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LawyerEarningsPage;
