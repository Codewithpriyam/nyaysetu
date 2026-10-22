/**
 * NyayaSetu — LawyerProfilePage Component
 * Advocate Profile View & Direct UPI QR Code Payment with UTR Verification Workflow.
 */

import { useState, useEffect } from 'react';
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
  HiClipboardCopy,
} from 'react-icons/hi';
import {
  formatCurrency,
  formatPerMinuteRate,
  formatConsultationPrice,
  calculateConsultationCost,
  parseNumeric,
  formatDuration,
  initials,
} from '@/utils';
import apiClient from '@/services/api';
import YoupiCheckoutModal from '@/components/payment/YoupiCheckoutModal';

const LawyerAvatar = ({ lawyer }) => (
  <div
    className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-ct-gold/50 font-zentry text-2xl font-black text-ct-gold shadow-gold-glow"
    style={{ background: `linear-gradient(135deg, ${lawyer.accentColor || '#C89B52'}22, ${lawyer.accentColor || '#C89B52'}44)` }}
    aria-hidden
  >
    {initials(lawyer.name.replace('Adv. ', ''))}
  </div>
);

const DURATION_OPTIONS = [
  { minutes: 15, label: '15 Minutes' },
  { minutes: 20, label: '20 Minutes (Standard)' },
  { minutes: 30, label: '30 Minutes' },
  { minutes: 45, label: '45 Minutes' },
  { minutes: 60, label: '1 Hour' },
];

const LawyerProfilePage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { isSignedIn } = useAuth();

  // Lookup in mock or fallback to first featured advocate
  const lawyer =
    MOCK_LAWYERS.find((l) => l.slug === id || l.id === id) ||
    MOCK_LAWYERS[0];

  // Pricing Model State (defensive parsing)
  const pricePerMinute = parseNumeric(lawyer?.pricePerMinute, 25);
  const [selectedDuration, setSelectedDuration] = useState(20);
  const totalPayable = calculateConsultationCost(pricePerMinute, selectedDuration, 500);

  // UPI Payment & UTR State
  const [showQrModal, setShowQrModal]       = useState(false);
  const [createdConsultationId, setCreatedConsultationId] = useState(null);
  const [utrNumber, setUtrNumber]           = useState('');
  const [clientIssue, setClientIssue]       = useState('');
  const [copiedUpi, setCopiedUpi]           = useState(false);
  const [bookingStatus, setBookingStatus]   = useState(null); // null | 'submitted'
  const [utrError, setUtrError]             = useState('');
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // Read custom advocate payment settings if saved by advocate in Advocate Panel
  const savedPaymentSettings = (() => {
    try {
      const saved = localStorage.getItem('nyaysetu_advocate_payment_settings');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Scalable Lawyer Specific UPI ID & QR Code Image Path (Custom Advocate QR or Default)
  const upiId = savedPaymentSettings?.upiId || lawyer.upiId || lawyer.name.toLowerCase().replace(/[^a-z]/g, '') + '@upi';
  const qrImage = savedPaymentSettings?.qrCodeImage || lawyer.qrCodeImage || lawyer.qr_image || '/img/qrcodes/priya_sharma_qr.png';

  // Prevent background body scrolling while payment modal is open
  useEffect(() => {
    if (showQrModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showQrModal]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenPayment = async () => {
    // If not signed in → redirect to /sign-in, returning to THIS lawyer page after auth
    if (!isSignedIn) {
      navigate(ROUTES.SIGN_IN, { state: { returnTo: location.pathname } });
      return;
    }

    try {
      const consultRes = await apiClient.post('/consultations', {
        lawyerId: lawyer.databaseId || 1,
        problem: clientIssue || 'Legal Consultation Request',
        category: lawyer.specialization || 'General Law',
        durationMinutes: selectedDuration,
      });
      setCreatedConsultationId(consultRes?.id || 1);
    } catch (err) {
      setCreatedConsultationId(1);
    }

    setShowQrModal(true);
    setUtrError('');
  };

  const handlePaymentSuccess = (paymentRecord) => {
    setBookingStatus('submitted');
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

              {/* Consultation Pricing Badge */}
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-ct-gold/15">
                <div>
                  <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold block">
                    Per-Minute Consultation Rate
                  </span>
                  <div className="font-zentry text-3xl font-black text-ct-ivory mt-0.5">
                    {formatPerMinuteRate(pricePerMinute)}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-general text-[10px] font-bold uppercase tracking-wider mt-2 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available Now</span>
                </div>
              </div>

            </div>
          </div>
        </BentoTilt>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Bio & Specializations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Box */}
            <div className="court-card-surface p-7 border border-ct-gold/30">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-3">
                About Advocate
              </h2>
              <p className="font-inter text-sm text-ct-ivory/80 leading-relaxed">
                {lawyer.bio}
              </p>
            </div>

            {/* Practice Areas */}
            <div className="court-card-surface p-7 border border-ct-gold/30">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4">
                Primary Practice Areas
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {(lawyer.specializations || [lawyer.specialization]).map((spec, i) => (
                  <span
                    key={i}
                    className="rounded-xl border border-ct-gold/30 bg-ct-gold/10 px-4 py-2 font-general text-xs text-ct-gold font-medium"
                  >
                    ⚖️ {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Calculator & Action */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28">
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                Book Video Consultation
              </h3>
              <p className="font-inter text-xs text-ct-muted mb-6">
                Choose session duration & pay directly to Advocate's verified UPI QR.
              </p>

              {/* Duration Selector */}
              <div className="mb-5">
                <label className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold block mb-2">
                  Select Consultation Duration
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.minutes}
                      onClick={() => setSelectedDuration(opt.minutes)}
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl border text-xs font-inter transition-all ${
                        selectedDuration === opt.minutes
                          ? 'border-ct-gold bg-ct-gold/20 text-ct-gold font-bold shadow-gold-glow'
                          : 'border-ct-gold/20 bg-ct-card/50 text-ct-ivory/80 hover:border-ct-gold/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-bold">{formatConsultationPrice(pricePerMinute, opt.minutes)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue Description */}
              <div className="mb-5">
                <label className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold block mb-1">
                  Brief Legal Problem (Optional)
                </label>
                <textarea
                  value={clientIssue}
                  onChange={(e) => setClientIssue(e.target.value)}
                  placeholder="Describe your legal matter in 2-3 sentences..."
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  rows={3}
                />
              </div>

              {/* Pricing Breakdown Card */}
              <div className="rounded-xl border border-ct-gold/20 bg-ct-void/60 p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs font-inter text-ct-muted">
                  <span>Rate Per Minute</span>
                  <span>{formatPerMinuteRate(pricePerMinute)}</span>
                </div>
                <div className="flex justify-between text-xs font-inter text-ct-muted">
                  <span>Selected Duration</span>
                  <span>{formatDuration(selectedDuration)}</span>
                </div>
                <div className="flex justify-between text-xs font-inter text-ct-muted">
                  <span>Platform Processing Fee</span>
                  <span className="font-bold text-emerald-400">₹0 (100% Free)</span>
                </div>
                <div className="pt-2 border-t border-ct-gold/10 flex justify-between items-center">
                  <span className="font-general text-xs font-bold uppercase text-ct-ivory">Total Amount</span>
                  <span className="font-zentry text-2xl font-black text-ct-gold">{formatCurrency(totalPayable)}</span>
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
                  <span>Pay {formatCurrency(totalPayable)} via QR & Book</span>
                </button>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* ─── YOUPI PG V2 SOVEREIGN UPI CHECKOUT MODAL ────────────────────── */}
      <YoupiCheckoutModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        consultationId={createdConsultationId || 1}
        lawyer={lawyer}
        amount={totalPayable}
        durationMinutes={selectedDuration}
        clientIssue={clientIssue}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
};

export default LawyerProfilePage;
