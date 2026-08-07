/**
 * NyayaSetu — LawyerRequestsPage Component
 * Advocate Consultation Request Manager with UTR Payment Verification & Google Meet Scheduling Modal.
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiUserGroup, HiCheck, HiX, HiCheckCircle, HiQrcode, HiVideoCamera, HiClock } from 'react-icons/hi';
import { formatCurrency } from '@/utils';

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    clientName: 'Rahul Kumar Sharma',
    city: 'Patna, Bihar',
    category: 'Consumer Protection',
    issue: 'E-Commerce Seller refund denial for defective Rs 45,000 laptop. Notice needed.',
    fee: 500,
    utrNumber: '403819204812',
    submittedAt: 'Today at 04:15 PM',
  },
  {
    id: 'req-2',
    clientName: 'Pooja Verma',
    city: 'Ranchi, Jharkhand',
    category: 'Property & Rental',
    issue: 'Landlord refusing to return Rs 30,000 security deposit after 2 months.',
    fee: 500,
    utrNumber: '409182401824',
    submittedAt: 'Today at 02:30 PM',
  },
  {
    id: 'req-3',
    clientName: 'Vikash Singh',
    city: 'Dhanbad, Jharkhand',
    category: 'Banking & UPI Fraud',
    issue: 'Unauthorized UPI transaction of Rs 18,000. RBI Ombudsman escalation.',
    fee: 500,
    utrNumber: '401928401928',
    submittedAt: 'Yesterday at 06:45 PM',
  },
];

const LawyerRequestsPage = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeRequestModal, setActiveRequestModal] = useState(null);

  // Advocate Schedule Modal Inputs
  const [sessionDateTime, setSessionDateTime] = useState('Tomorrow at 05:00 PM IST');
  const [meetLink, setMeetLink]               = useState('https://meet.google.com/abc-defg-hij');
  const [actionAlert, setActionAlert]         = useState('');

  const handleOpenScheduleModal = (req) => {
    setActiveRequestModal(req);
  };

  const handleConfirmPaymentAndSendMeetLink = (e) => {
    e.preventDefault();
    if (!activeRequestModal) return;

    const clientName = activeRequestModal.clientName;
    setRequests((prev) => prev.filter((r) => r.id !== activeRequestModal.id));
    setActiveRequestModal(null);

    setActionAlert(
      `Payment confirmed for ${clientName}! Session scheduled for ${sessionDateTime}. Google Meet link sent to client dashboard.`
    );
    setTimeout(() => setActionAlert(''), 5000);
  };

  const handleDecline = (id, clientName) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionAlert(`Declined consultation request from ${clientName}.`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        {/* Action Feedback Alert */}
        {actionAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md">
            {actionAlert}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">ADVOCATE PAYMENT & SCHEDULING PORTAL</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Client UTR Payment <span className="text-ct-gold italic">Verification & Google Meet Setup</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Verify client UPI UTR numbers, confirm ₹500 payments, set session times, and generate Google Meet links.
          </p>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="court-card-surface p-12 text-center border border-ct-gold/20">
            <p className="font-cormorant text-2xl font-bold text-ct-ivory">No Pending Verification Requests</p>
            <p className="font-inter text-xs text-ct-muted mt-1">All UTR payment submissions have been verified and scheduled.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map((req) => (
              <BentoTilt key={req.id} tiltAmount={3}>
                <div className="court-card-surface p-7 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-6 shadow-court-card">

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{req.clientName}</h3>
                      <span className="font-general text-[9px] text-ct-muted">📍 {req.city}</span>
                    </div>

                    <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{req.category}</p>

                    {/* Dispute details & UTR Number Box */}
                    <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 mt-3 max-w-xl">
                      <p className="font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold mb-0.5">Dispute Summary</p>
                      <p className="font-inter text-xs text-ct-ivory/90 leading-relaxed mb-2">
                        "{req.issue}"
                      </p>

                      <div className="pt-2 border-t border-ct-gold/10 flex items-center justify-between">
                        <span className="font-general text-[9px] uppercase text-ct-muted">Submitted UTR Ref No:</span>
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          {req.utrNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 font-general text-[10px] uppercase tracking-wider text-ct-ivory/90">
                      <span>⏰ Submitted: {req.submittedAt}</span>
                      <span className="font-bold text-ct-gold">Consultation Fee: ₹500</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenScheduleModal(req)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-6 py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                    >
                      <HiCheck size={16} />
                      <span>Confirm Payment & Schedule</span>
                    </button>

                    <button
                      onClick={() => handleDecline(req.id, req.clientName)}
                      className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 font-general text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <HiX size={16} />
                      <span>Decline</span>
                    </button>
                  </div>

                </div>
              </BentoTilt>
            ))}
          </div>
        )}

      </div>

      {/* ─── ADVOCATE SESSION SCHEDULING & GOOGLE MEET MODAL ────────────────── */}
      {activeRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="court-card-surface max-w-lg w-full p-7 border border-ct-gold/50 shadow-2xl relative animate-in fade-in zoom-in duration-200">

            <button
              onClick={() => setActiveRequestModal(null)}
              className="absolute top-4 right-4 text-ct-muted hover:text-ct-ivory"
            >
              <HiX size={20} />
            </button>

            <div className="text-center mb-6">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                <HiCheckCircle size={14} /> CONFIRM PAYMENT & SCHEDULE SESSION
              </span>
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mt-2">
                Schedule Session for {activeRequestModal.clientName}
              </h3>
              <p className="font-mono text-xs text-ct-gold mt-1">
                Verified UTR: {activeRequestModal.utrNumber} (₹500 Received)
              </p>
            </div>

            <form onSubmit={handleConfirmPaymentAndSendMeetLink} className="flex flex-col gap-4">

              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Select Session Date & Time Slot*:
                </label>
                <input
                  type="text"
                  required
                  value={sessionDateTime}
                  onChange={(e) => setSessionDateTime(e.target.value)}
                  placeholder="e.g. Tomorrow at 05:00 PM IST"
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Paste Google Meet Link*:
                </label>
                <input
                  type="url"
                  required
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-mono text-xs text-ct-gold focus:border-ct-gold focus:outline-none"
                />
                <p className="font-inter text-[10px] text-ct-muted mt-1">
                  Create a Google Meet call link and paste it here. It will be sent to the client dashboard.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all mt-2"
              >
                <HiVideoCamera size={18} />
                <span>Confirm Payment & Send Meet Link</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default LawyerRequestsPage;
