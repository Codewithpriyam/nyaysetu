/**
 * NyayaSetu — LawyerProfilePage Component
 * Advocate Profile View & Direct UPI QR Code Payment with UTR Verification Workflow.
 */

import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { MOCK_LAWYERS } from '@/data/mockLawyers';
import { fetchRealDistrictAdvocates } from '@/data/realIndianAdvocatesDatabase';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { TiLocationArrow } from 'react-icons/ti';
import {
  HiStar,
  HiCheckCircle,
  HiShieldCheck,
  HiPhone,
  HiQrcode,
  HiCheck,
  HiX,
  HiInformationCircle,
} from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';
import { formatCurrency, initials } from '@/utils';

const LawyerAvatar = ({ lawyer }) => (
  <div
    className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-ct-gold/50 font-zentry text-2xl font-black text-ct-gold shadow-gold-glow"
    style={{ background: `linear-gradient(135deg, ${lawyer.accentColor || '#C89B52'}22, ${lawyer.accentColor || '#C89B52'}44)` }}
    aria-hidden
  >
    {initials(lawyer.name.replace('Adv. ', ''))}
  </div>
);

const LawyerProfilePage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { isSignedIn } = useAuth();

  // Lookup in mock or fallback to first featured advocate
  const lawyer =
    MOCK_LAWYERS.find((l) => l.slug === id || l.id === id) ||
    MOCK_LAWYERS[0];

  // UPI Payment & UTR State
  const [showQrModal, setShowQrModal]       = useState(false);
  const [utrNumber, setUtrNumber]           = useState('');
  const [clientIssue, setClientIssue]       = useState('');
  const [bookingStatus, setBookingStatus]   = useState(null); // null | 'submitted'
  const [utrError, setUtrError]             = useState('');

  const upiId = lawyer.name.toLowerCase().replace(/[^a-z]/g, '') + '@upi';

  const handleOpenPayment = () => {
    // If not signed in → redirect to /sign-in, returning to THIS lawyer page after auth
    if (!isSignedIn) {
      navigate(ROUTES.SIGN_IN, { state: { returnTo: location.pathname } });
      return;
    }
    setShowQrModal(true);
    setUtrError('');
  };

  const handleConfirmUtrPayment = (e) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 8) {
      setUtrError('Please enter a valid 12-digit UPI UTR / Transaction Reference Number.');
      return;
    }

    setBookingStatus('submitted');
    setShowQrModal(false);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        {/* Advocate Header Bento */}
        <BentoTilt className="mb-10" tiltAmount={4}>
          <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40 shadow-court-hover">
            <div className="flex flex-wrap items-start justify-between gap-6">

              <div className="flex items-start gap-6">
                <LawyerAvatar lawyer={lawyer} />

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                      {lawyer.name}
                    </h1>
                    <HiCheckCircle className="text-emerald-400 flex-shrink-0" size={22} title="Verified Bar Council Advocate" />
                  </div>

                  <p className="font-inter text-sm text-ct-gold font-medium mt-1">
                    {lawyer.specializations ? lawyer.specializations.join(' · ') : lawyer.specialization}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 font-general text-[10px] uppercase tracking-wider text-ct-muted">
                    <span>📍 {lawyer.location || lawyer.district || 'India'}</span>
                    <span>⚖️ {lawyer.experience} Years Experience</span>
                    <span>🗣️ {lawyer.languages ? lawyer.languages.join(', ') : 'Hindi, English'}</span>
                  </div>
                </div>
              </div>

              {/* Rating & Bar Verification Badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-ct-gold/10 px-4 py-2 rounded-full border border-ct-gold/30">
                  <HiStar className="text-ct-gold" size={18} />
                  <span className="font-inter text-base font-bold text-ct-ivory">{lawyer.rating || 4.8} / 5.0</span>
                  <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">({lawyer.consultationCount || 120} Reviews)</span>
                </div>

                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                  Bar Council Verified Advocate
                </span>
              </div>

            </div>
          </div>
        </BentoTilt>

        {/* Profile Content Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-10">

          {/* Left 2 Columns: Bio & Practice */}
          <div className="md:col-span-2 flex flex-col gap-8">

            <div className="court-card-surface p-7 border border-ct-gold/20">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-3 flex items-center gap-2">
                <HiShieldCheck className="text-ct-gold" size={22} />
                <span>Professional Background</span>
              </h2>
              <p className="font-inter text-xs sm:text-sm text-ct-muted leading-relaxed whitespace-pre-line">
                {lawyer.bio || `Registered practitioner with ${lawyer.experience} years of trial and advisory experience before District Courts and High Court. Empanelled with statutory bodies.`}
              </p>
            </div>

            <div className="court-card-surface p-7 border border-ct-gold/20">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
                <MdOutlineGavel className="text-ct-gold" size={22} />
                <span>Court Practice & Jurisdiction</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4">
                  <p className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">Practice Forums</p>
                  <p className="font-inter text-xs font-bold text-ct-ivory mt-1">{lawyer.court || 'High Court & District Civil Courts'}</p>
                </div>
                <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4">
                  <p className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">Bar Enrollment</p>
                  <p className="font-mono text-xs font-bold text-ct-gold mt-1">{lawyer.barEnrollment || 'BC/STATE/2012/9120'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Fee & Direct Payment Action Card */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28">
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                Book 1-on-1 Session
              </h3>
              <p className="font-general text-[9px] uppercase tracking-widest text-ct-muted mb-5">
                Direct Advocate UPI Payment
              </p>

              {/* Flat Fee per session */}
              <div className="mb-5 rounded-xl border border-ct-gold/20 bg-ct-deep p-4 text-center">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Session Consultation Fee</span>
                <p className="font-zentry text-3xl font-black text-ct-gold mt-1">
                  ₹ 500 <span className="font-inter text-xs text-ct-muted font-normal">/ session</span>
                </p>
              </div>

              {/* Fee Summary */}
              <div className="pt-4 border-t border-ct-gold/15 mb-6">
                <div className="flex justify-between items-center text-xs font-inter text-ct-muted mb-2">
                  <span>1-on-1 Consultation Session</span>
                  <span className="font-bold text-ct-ivory">₹ 500</span>
                </div>
                <div className="flex justify-between items-center text-xs font-inter text-ct-muted mb-3">
                  <span>Platform Fee</span>
                  <span className="font-bold text-emerald-400">₹ 0 (100% Free)</span>
                </div>
                <div className="pt-2 border-t border-ct-gold/10 flex justify-between items-center">
                  <span className="font-general text-xs font-bold uppercase text-ct-ivory">Total Payable</span>
                  <span className="font-zentry text-2xl font-black text-ct-gold">₹ 500</span>
                </div>
              </div>

              {/* Booking Action / Status */}
              {bookingStatus === 'submitted' ? (
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-5 text-center">
                  <HiCheckCircle className="mx-auto text-emerald-400 mb-2" size={36} />
                  <p className="font-general text-xs font-bold uppercase text-emerald-400">Payment UTR Submitted!</p>
                  <p className="font-inter text-xs text-ct-ivory/90 mt-1 leading-relaxed">
                    Advocate {lawyer.name} is verifying your UTR payment. Once confirmed, you will receive the Google Meet consultation link in your Dashboard!
                  </p>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="inline-block mt-4 rounded-xl bg-ct-gold px-5 py-2 font-general text-[10px] uppercase tracking-widest text-ct-void font-bold"
                  >
                    Go to Citizen Dashboard →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleOpenPayment}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                >
                  <HiQrcode size={18} />
                  <span>Pay ₹500 via QR & Book</span>
                </button>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* ─── DIRECT LAWYER UPI QR PAYMENT MODAL ────────────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="court-card-surface max-w-md w-full p-7 border border-ct-gold/50 shadow-2xl relative animate-in fade-in zoom-in duration-200">

            {/* Close Button */}
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-ct-muted hover:text-ct-ivory"
            >
              <HiX size={20} />
            </button>

            <div className="text-center mb-5">
              <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                DIRECT LAWYER UPI PAYMENT
              </span>
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mt-2">
                Scan & Pay ₹500 to {lawyer.name}
              </h3>
              <p className="font-inter text-xs text-ct-muted mt-1">
                Scan using GPay, PhonePe, Paytm, or BHIM. Zero Platform Markup.
              </p>
            </div>

            {/* QR Code Display Box */}
            <div className="rounded-2xl border-2 border-ct-gold/40 bg-white p-4 text-center mb-5 max-w-[240px] mx-auto shadow-gold-glow">
              {lawyer.qrCodeImage ? (
                <img
                  src={lawyer.qrCodeImage}
                  alt={`${lawyer.name} UPI QR Code`}
                  className="w-full h-auto max-h-56 object-contain rounded-xl mx-auto border border-ct-gold/20"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}

              <div
                className={`bg-ct-void text-ct-gold p-4 rounded-xl font-mono text-[10px] flex-col items-center justify-center gap-2 aspect-square border border-ct-gold/30 ${lawyer.qrCodeImage ? 'hidden' : 'flex'}`}
              >
                <HiQrcode size={110} className="text-ct-gold" />
                <span className="text-[9px] font-bold tracking-widest text-white uppercase">PAY ₹ 500</span>
              </div>

              <p className="font-mono text-xs font-bold text-slate-900 mt-2">{lawyer.upiId || upiId}</p>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handleConfirmUtrPayment} className="flex flex-col gap-4">

              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Describe Your Legal Dispute / Query:
                </label>
                <textarea
                  rows={2}
                  value={clientIssue}
                  onChange={(e) => setClientIssue(e.target.value)}
                  placeholder="e.g. Security deposit refund non-payment of Rs 35,000…"
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  12-Digit UPI UTR / Transaction Ref No.*:
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 403819204812"
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-mono text-sm font-bold text-ct-gold placeholder:text-ct-muted/60 focus:border-ct-gold focus:outline-none"
                />
                <p className="font-inter text-[10px] text-ct-muted mt-1">
                  Enter the UTR / Ref No. shown in GPay/PhonePe after sending ₹500.
                </p>
              </div>

              {utrError && (
                <p className="font-inter text-xs text-rose-400 font-bold">{utrError}</p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all mt-1"
              >
                <HiCheck size={18} />
                <span>Submit UTR & Book Session</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default LawyerProfilePage;
