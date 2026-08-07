/**
 * NyayaSetu — User DashboardPage Component
 * Comprehensive Citizen Legal Dashboard:
 *  - Active Case Timeline Tracker
 *  - Verified Google Meet Consultation Calls (Join Link Active)
 *  - Groq AI Instant Legal Notice Assistant Widget
 *  - Encrypted Vault Status
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { queryGroqLegalAI } from '@/services/groqLegalAiService';
import { TiLocationArrow } from 'react-icons/ti';
import {
  HiShieldCheck,
  HiClock,
  HiOutlineDocumentText,
  HiPhone,
  HiCheckCircle,
  HiFolder,
  HiSparkles,
  HiPlus,
  HiExternalLink,
  HiVideoCamera,
} from 'react-icons/hi';
import { MdOutlineGavel, MdOutlineSmartToy } from 'react-icons/md';

const MOCK_USER_CASES = [
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
    steps: [
      { name: 'Notice Drafted', date: '10 Jan 2026', done: true },
      { name: 'Legal Notice Served', date: '14 Jan 2026', done: true },
      { name: 'Reply Received (Rejected)', date: '28 Jan 2026', done: true },
      { name: 'e-Daakhil Complaint Filed', date: '02 Feb 2026', done: true },
      { name: 'Court Hearing Scheduled', date: '18 Feb 2026', done: false },
    ],
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
    steps: [
      { name: 'Branch Dispute Logged', date: '20 Jan 2026', done: true },
      { name: 'Cyber Portal 1930 Logged', date: '20 Jan 2026', done: true },
      { name: 'RBI Ombudsman Escalate', date: '04 Feb 2026', done: true },
      { name: 'Shadow Credit & Resolution', date: 'Pending', done: false },
    ],
  },
];

const MOCK_CONSULTATIONS = [
  {
    id: 'con-1',
    advocateName: 'Adv. Rajesh Kumar',
    specialization: 'Employment & Labour Disputes',
    date: 'Tomorrow, 09 Feb 2026',
    time: '05:00 PM IST',
    fee: 500,
    paymentStatus: '₹500 Payment Verified (UTR: 403819204812)',
    type: 'Google Meet Video Consultation',
    roomLink: 'https://meet.google.com/abc-defg-hij',
  },
];

const DashboardPage = () => {
  const [aiPrompt, setAiPrompt]         = useState('');
  const [aiResponse, setAiResponse]     = useState('');
  const [isAiLoading, setIsAiLoading]   = useState(false);

  const handleGenerateAiAdvice = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const responseText = await queryGroqLegalAI(aiPrompt, 'Indian Consumer & Civil Law');
      setAiResponse(responseText);
    } catch (err) {
      setAiResponse('Failed to connect to Groq AI Legal Assistant. Please check network connection.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Dashboard Welcome Header */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <HiCheckCircle size={14} /> Aadhaar Verified Citizen
                </span>
              </div>
              <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                Welcome back, <span className="text-ct-gold italic">Citizen User</span>
              </h1>
              <p className="font-inter text-xs sm:text-sm text-ct-muted mt-1">
                Track active legal disputes, manage scheduled Google Meet sessions, and generate AI legal notices.
              </p>
            </div>

            <Button
              title="File New Legal Dispute"
              leftIcon={<HiPlus size={16} />}
              variant="gold"
              asLink
              to={ROUTES.CASES}
              containerClass="py-3 px-6 text-xs flex items-center gap-2"
            />

          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ct-gold/15">
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Active Cases</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">2</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Scheduled Meets</span>
              <p className="font-zentry text-3xl font-black text-emerald-400 mt-1">1</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Saved Notices</span>
              <p className="font-zentry text-3xl font-black text-ct-ivory mt-1">4</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Encrypted Vault</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">14 MB</p>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-10">

          {/* Left 2 Columns: Active Case Tracker & Upcoming Google Meet Consultations */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Verified Google Meet Consultation Sessions */}
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
                <HiVideoCamera className="text-ct-gold" size={24} />
                <span>Scheduled Google Meet Video Consultations</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-1">
                {MOCK_CONSULTATIONS.map((con) => (
                  <div key={con.id} className="court-card-surface p-7 border-2 border-emerald-400/40 flex flex-wrap items-center justify-between gap-4 shadow-gold-glow">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{con.advocateName}</h3>
                        <HiCheckCircle className="text-emerald-400" size={20} />
                        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                          Payment Verified
                        </span>
                      </div>

                      <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{con.specialization}</p>

                      <p className="font-mono text-[10px] text-emerald-400 mt-1">
                        ✓ {con.paymentStatus}
                      </p>

                      <p className="font-general text-[10px] uppercase tracking-wider text-ct-ivory mt-2">
                        ⏰ Scheduled Slot: <strong>{con.date} at {con.time}</strong>
                      </p>
                    </div>

                    <a
                      href={con.roomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-6 py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
                    >
                      <HiVideoCamera size={18} />
                      <span>Join Google Meet Call</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Case Timeline Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                  <MdOutlineGavel className="text-ct-gold" size={24} />
                  <span>Active Cases & Statutory Recourse</span>
                </h2>
                <Link to={ROUTES.CASES} className="font-general text-xs uppercase tracking-widest text-ct-gold hover:underline">
                  View All Cases →
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {MOCK_USER_CASES.map((c) => (
                  <BentoTilt key={c.id} tiltAmount={3}>
                    <div className="court-card-surface p-7 border border-ct-gold/30 shadow-court-card">

                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-ct-gold/15">
                        <div>
                          <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                            {c.category}
                          </span>
                          <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mt-2">{c.title}</h3>
                          <p className="font-inter text-xs text-ct-muted mt-0.5">📍 {c.forum} · No: {c.caseNumber}</p>
                        </div>
                        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                          {c.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-5">
                        <div className="flex justify-between items-center text-xs font-general uppercase tracking-widest text-ct-muted mb-1.5">
                          <span>Case Timeline Progress</span>
                          <span className="font-bold text-ct-gold">{c.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-ct-void overflow-hidden border border-ct-gold/20">
                          <div
                            className="h-full bg-gradient-to-r from-[#D9A758] to-[#C89B52] transition-all duration-500 shadow-gold-glow"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Timeline Steps */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                        {c.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl border p-2.5 text-center ${step.done ? 'border-ct-gold/40 bg-ct-gold/10 text-ct-ivory' : 'border-ct-gold/15 bg-ct-void text-ct-muted'}`}
                          >
                            <p className="font-general text-[8px] uppercase tracking-widest font-bold">{step.name}</p>
                            <p className="font-inter text-[10px] mt-0.5">{step.date}</p>
                          </div>
                        ))}
                      </div>

                      {/* Last Update Banner */}
                      <div className="rounded-xl border border-ct-gold/20 bg-ct-deep p-3 flex items-center justify-between text-xs">
                        <span className="font-inter text-ct-muted">
                          <strong className="text-ct-ivory">Latest Status:</strong> {c.lastUpdate}
                        </span>
                        <span className="font-general text-[9px] uppercase text-ct-gold font-bold flex-shrink-0">
                          Assigned: {c.advocate}
                        </span>
                      </div>

                    </div>
                  </BentoTilt>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Groq AI Instant Legal Notice Assistant */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28">
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineSmartToy className="text-ct-gold" size={24} />
                <span className="font-general text-xs uppercase tracking-widest text-ct-gold font-bold">
                  GROQ LLAMA-3 LEGAL AI
                </span>
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                Instant Legal Assistant
              </h3>
              <p className="font-inter text-xs text-ct-muted mb-5 leading-relaxed">
                Describe your legal issue or notice requirement to get real-time advice grounded in Indian Law.
              </p>

              <form onSubmit={handleGenerateAiAdvice} className="flex flex-col gap-3 mb-4">
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Landlord refusing to return security deposit of Rs 30,000 after 2 months. Draft a legal notice..."
                  className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3.5 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-3 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
                >
                  <HiSparkles size={16} />
                  <span>{isAiLoading ? 'Analyzing Indian Law…' : 'Generate AI Advice'}</span>
                </button>
              </form>

              {aiResponse && (
                <div className="rounded-xl border border-ct-gold/30 bg-ct-void p-4 font-inter text-xs text-ct-ivory/90 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line shadow-inner">
                  {aiResponse}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
