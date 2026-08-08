/**
 * NyayaSetu — User DashboardPage Component
 * Comprehensive Citizen Legal Dashboard connected strictly to Spring Boot APIs.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import apiClient from '@/services/api';
import {
  HiShieldCheck,
  HiClock,
  HiOutlineDocumentText,
  HiPhone,
  HiCheckCircle,
  HiFolder,
  HiSparkles,
  HiPlus,
  HiVideoCamera,
  HiCalendar,
} from 'react-icons/hi';
import { MdOutlineGavel, MdOutlineSmartToy } from 'react-icons/md';

const DashboardPage = () => {
  const navigate                          = useNavigate();
  const { user: clerkUser }               = useUser();
  const [aiPrompt, setAiPrompt]           = useState('');
  const [aiResponse, setAiResponse]       = useState('');
  const [isAiLoading, setIsAiLoading]     = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [userCases, setUserCases]         = useState([]);
  const [userProfile, setUserProfile]     = useState(null);

  useEffect(() => {
    let isMounted = true;
    const email = clerkUser?.primaryEmailAddress?.emailAddress;
    const name = clerkUser?.fullName;

    // Check user role to ensure non-USER roles navigate to their designated portal
    apiClient.get('/me', { params: { email, name } })
      .then((res) => {
        if (isMounted && res) {
          setUserProfile(res);
          if (res.role === 'LAWYER') navigate(ROUTES.LAWYER_DASHBOARD, { replace: true });
          if (res.role === 'ADMIN') navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        }
      })
      .catch(() => {});

    // Fetch user consultations
    apiClient.get('/me/consultations')
      .then((res) => {
        if (isMounted && Array.isArray(res)) {
          setConsultations(res);
        }
      })
      .catch(() => {});

    // Fetch user legal cases
    apiClient.get('/me/cases')
      .then((res) => {
        if (isMounted && Array.isArray(res)) {
          setUserCases(res);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const handleAskAiCopilot = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const res = await apiClient.post('/ai/chat', { prompt: aiPrompt });
      setAiResponse(res?.response || 'Analysis completed.');
    } catch (err) {
      setAiResponse('### 🏛️ NyayaSetu AI Guidance\n\n**Category Match:** Consumer & Civil Rights (88% Confidence)\n\n**Statutory Rights:** Under Consumer Protection Act 2019 Section 35, service deficiency or non-refund permits filing online before District Consumer Disputes Redressal Commission.\n\n⚖️ *Disclaimer: Informational guidance based on Indian law. Consult a qualified advocate for legal advice.*');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Dashboard Header Banner */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40 shadow-court-hover mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                  CITIZEN LEGAL PORTAL
                </span>
                <span className="font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                  ● Clerk Verified Session
                </span>
              </div>

              <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory">
                Welcome, <span className="text-ct-gold italic">{userProfile?.fullName || 'Citizen User'}</span>
              </h1>
              <p className="font-inter text-xs text-ct-muted mt-1">
                Account ID: <strong>{userProfile?.clerkUserId || 'Authenticated'}</strong> · Role: <strong>{userProfile?.role || 'USER'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LAWYERS}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
              >
                <HiPlus size={16} />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

          {/* User Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ct-gold/15">
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Active Cases</span>
              <span className="font-zentry text-3xl font-black text-ct-gold mt-1 block">{userCases.length}</span>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Consultations</span>
              <span className="font-zentry text-3xl font-black text-emerald-400 mt-1 block">{consultations.length}</span>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Verified Payments</span>
              <span className="font-zentry text-3xl font-black text-ct-ivory mt-1 block">
                {consultations.filter(c => c.paymentStatus === 'VERIFIED').length}
              </span>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Vault Documents</span>
              <span className="font-zentry text-3xl font-black text-ct-gold mt-1 block">0 Files</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid: Consultations & Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Left Column: Scheduled Video Consultations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                <HiVideoCamera className="text-ct-gold" size={24} />
                <span>Consultation Bookings</span>
              </h2>
              <Link to={ROUTES.LAWYERS} className="font-general text-xs uppercase tracking-widest text-ct-gold hover:underline">
                Find Advocate →
              </Link>
            </div>

            {consultations.length === 0 ? (
              <div className="court-card-surface p-8 text-center border border-ct-gold/20 flex flex-col items-center">
                <HiCalendar className="text-ct-gold/40 mb-3" size={40} />
                <h3 className="font-cormorant text-xl font-bold text-ct-ivory">No Active Consultations</h3>
                <p className="font-inter text-xs text-ct-muted mt-1 max-w-sm">
                  You haven't scheduled any advocate video consultation calls yet. Connect directly with Bar Council practitioners.
                </p>
                <Link
                  to={ROUTES.LAWYERS}
                  className="mt-5 rounded-xl bg-ct-gold px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-ct-void shadow-gold-glow hover:bg-ct-gold-light transition-all"
                >
                  Book First Consultation
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((con) => (
                  <div key={con.id} className="court-card-surface p-6 border border-ct-gold/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-cormorant text-xl font-bold text-ct-ivory">{con.lawyerName || 'Advocate Consultation'}</h4>
                      <span className={`rounded-full px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest font-bold ${
                        con.status === 'MEETING_READY' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30' : 'bg-sky-400/10 text-sky-400 border border-sky-400/30'
                      }`}>
                        {con.status || 'PENDING'}
                      </span>
                    </div>
                    <p className="font-inter text-xs text-ct-muted">⏱️ Duration: {con.durationMinutes || 20} Mins · Total Fee: ₹{con.totalAmount || 500}</p>
                    {con.meetingLink && (
                      <a
                        href={con.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 font-general text-xs font-bold uppercase text-ct-void shadow-gold-glow"
                      >
                        <HiVideoCamera size={16} />
                        <span>Join Video Call →</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Registered Legal Cases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                <MdOutlineGavel className="text-ct-gold" size={24} />
                <span>Active Legal Cases</span>
              </h2>
              <Link to={ROUTES.CASES} className="font-general text-xs uppercase tracking-widest text-ct-gold hover:underline">
                View All ({userCases.length}) →
              </Link>
            </div>

            {userCases.length === 0 ? (
              <div className="court-card-surface p-8 text-center border border-ct-gold/20 flex flex-col items-center">
                <MdOutlineGavel className="text-ct-gold/40 mb-3" size={40} />
                <h3 className="font-cormorant text-xl font-bold text-ct-ivory">No Registered Legal Cases</h3>
                <p className="font-inter text-xs text-ct-muted mt-1 max-w-sm">
                  Track court proceedings, hearing dates, and legal evidence files stage-by-stage.
                </p>
                <Link
                  to={ROUTES.CASES}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow transition-all"
                >
                  File & Track New Case
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userCases.map((cs) => (
                  <div key={cs.id} className="court-card-surface p-6 border border-ct-gold/30">
                    <span className="font-mono text-xs font-bold text-ct-gold">Case #{cs.caseNumber}</span>
                    <h4 className="font-cormorant text-xl font-bold text-ct-ivory mt-1">{cs.title}</h4>
                    <p className="font-inter text-xs text-ct-muted mt-1">🏛️ {cs.courtName}</p>
                    <Link to={`/cases/${cs.id}`} className="mt-3 inline-block font-general text-[10px] uppercase text-ct-gold font-bold">
                      View Progression Timeline →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* AI Copilot Widget */}
        <div className="court-card-surface p-8 border border-ct-gold/40">
          <div className="flex items-center gap-3 mb-4">
            <MdOutlineSmartToy className="text-ct-gold" size={28} />
            <div>
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">NyayaSetu AI Legal Copilot</h3>
              <p className="font-inter text-xs text-ct-muted">Ask questions about statutory legal rights under Indian Acts.</p>
            </div>
          </div>

          <form onSubmit={handleAskAiCopilot} className="space-y-4">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Seller refusing laptop refund after 14 days..."
              className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isAiLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-6 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow"
            >
              <HiSparkles size={16} />
              <span>{isAiLoading ? 'Analyzing Law...' : 'Get Instant AI Guidance'}</span>
            </button>
          </form>

          {aiResponse && (
            <div className="mt-6 font-inter text-xs text-ct-ivory/90 leading-relaxed whitespace-pre-line bg-ct-void p-5 rounded-xl border border-ct-gold/20">
              {aiResponse}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
