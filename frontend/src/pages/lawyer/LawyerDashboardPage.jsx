/**
 * NyayaSetu — LawyerDashboardPage Component
 * Full Advocate Portal Dashboard for Bar Council Practitioners:
 *  - Verification Badge & Bar Enrollment Details
 *  - Consultation Metrics & Monthly Revenue
 *  - Pending Client Request Manager (Accept / Decline)
 *  - Today's Scheduled Calls
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import {
  HiCheckCircle,
  HiClock,
  HiStar,
  HiCurrencyRupee,
  HiUserGroup,
  HiPhone,
  HiCheck,
  HiX,
  HiExternalLink,
  HiCog,
} from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';
import { formatCurrency } from '@/utils';

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    clientName: 'Rahul Kumar Sharma',
    city: 'Patna, Bihar',
    category: 'Consumer Protection',
    issue: 'E-Commerce Seller refund denial for defective Rs 45,000 laptop. Notice needed.',
    duration: '30 Mins',
    fee: 1050,
    requestedTime: 'Today at 05:00 PM',
  },
  {
    id: 'req-2',
    clientName: 'Pooja Verma',
    city: 'Ranchi, Jharkhand',
    category: 'Property & Rental',
    issue: 'Landlord refusing to return Rs 30,000 security deposit after 2 months.',
    duration: '15 Mins',
    fee: 525,
    requestedTime: 'Tomorrow at 11:30 AM',
  },
  {
    id: 'req-3',
    clientName: 'Vikash Singh',
    city: 'Dhanbad, Jharkhand',
    category: 'Banking & UPI Fraud',
    issue: 'Unauthorized UPI transaction of Rs 18,000. RBI Ombudsman escalation.',
    duration: '60 Mins',
    fee: 2100,
    requestedTime: 'Tomorrow at 03:00 PM',
  },
];

const TODAY_CALLS = [
  {
    id: 'call-1',
    clientName: 'Sanjay Sinha',
    category: 'Employment & Unpaid Salary',
    time: '04:30 PM IST',
    duration: '30 Mins',
    fee: 1050,
    roomLink: '#',
    status: 'Upcoming in 30 Mins',
  },
];

const LawyerDashboardPage = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [actionAlert, setActionAlert] = useState('');

  const handleAcceptRequest = (id, clientName) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionAlert(`Accepted consultation request from ${clientName}. Room link generated!`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  const handleDeclineRequest = (id, clientName) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionAlert(`Declined request from ${clientName}.`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Action Feedback Alert */}
        {actionAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md">
            {actionAlert}
          </div>
        )}

        {/* Advocate Header Card */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">

            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-ct-gold/50 bg-ct-gold/15 font-zentry text-3xl font-black text-ct-gold shadow-gold-glow">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                    Adv. Rajesh Kumar
                  </h1>
                  <HiCheckCircle className="text-emerald-400 flex-shrink-0" size={22} title="Verified Bar Council Advocate" />
                </div>
                <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">
                  Employment Law · Civil Writs · Consumer Disputes
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 font-general text-[10px] uppercase tracking-wider text-ct-muted">
                  <span>📍 Patna High Court & District Court</span>
                  <span className="font-mono text-ct-gold/90">Reg: BC/BH/1998/1420</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.LAWYER_AVAILABILITY}
                className="rounded-xl border border-ct-gold/30 bg-ct-void px-5 py-2.5 font-general text-xs uppercase tracking-widest text-ct-ivory hover:border-ct-gold transition-all"
              >
                Set Availability
              </Link>
              <Link
                to={ROUTES.LAWYER_PROFILE_EDIT}
                className="rounded-xl border border-ct-gold/30 bg-ct-void px-5 py-2.5 font-general text-xs uppercase tracking-widest text-ct-gold hover:bg-ct-gold hover:text-ct-void font-bold transition-all"
              >
                Edit Profile
              </Link>
            </div>

          </div>

          {/* Quick Advocate Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ct-gold/15">
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Consultations Done</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">890+</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Monthly Earnings</span>
              <p className="font-zentry text-3xl font-black text-emerald-400 mt-1">₹ 42,500</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Pending Requests</span>
              <p className="font-zentry text-3xl font-black text-ct-ivory mt-1">{requests.length}</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Client Rating</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1 flex items-center justify-center gap-1">
                4.9 <HiStar size={18} />
              </p>
            </div>
          </div>
        </div>

        {/* Portal Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-10">

          {/* Left 2 Columns: Pending Requests & Today's Schedule */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Pending Consultation Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                  <HiUserGroup className="text-ct-gold" size={24} />
                  <span>Pending Client Consultation Requests</span>
                </h2>
                <Link to={ROUTES.LAWYER_REQUESTS} className="font-general text-xs uppercase tracking-widest text-ct-gold hover:underline">
                  View All ({requests.length}) →
                </Link>
              </div>

              {requests.length === 0 ? (
                <div className="court-card-surface p-8 text-center border border-ct-gold/20">
                  <p className="font-inter text-sm text-ct-muted">No pending consultation requests at the moment.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {requests.map((req) => (
                    <BentoTilt key={req.id} tiltAmount={3}>
                      <div className="court-card-surface p-6 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{req.clientName}</h3>
                            <span className="font-general text-[9px] text-ct-muted">📍 {req.city}</span>
                          </div>

                          <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{req.category}</p>
                          <p className="font-inter text-xs text-ct-muted mt-1 leading-relaxed max-w-xl">
                            "{req.issue}"
                          </p>

                          <div className="flex items-center gap-4 mt-3 font-general text-[10px] uppercase tracking-wider text-ct-ivory/90">
                            <span>⏰ {req.requestedTime}</span>
                            <span>⏱️ {req.duration}</span>
                            <span className="font-bold text-emerald-400">Fee: {formatCurrency(req.fee)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAcceptRequest(req.id, req.clientName)}
                            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                          >
                            <HiCheck size={16} />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(req.id, req.clientName)}
                            className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
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

            {/* Today's Scheduled Calls */}
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
                <HiPhone className="text-ct-gold" size={22} />
                <span>Today's Scheduled Video Consultations</span>
              </h2>

              <div className="flex flex-col gap-4">
                {TODAY_CALLS.map((call) => (
                  <div key={call.id} className="court-card-surface p-6 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{call.clientName}</h3>
                        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                          {call.status}
                        </span>
                      </div>
                      <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{call.category}</p>
                      <p className="font-general text-[9px] uppercase tracking-wider text-ct-muted mt-1">
                        ⏰ {call.time} · {call.duration} · Fee: {formatCurrency(call.fee)}
                      </p>
                    </div>

                    <a
                      href={call.roomLink}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-6 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
                    >
                      <span>Start Video Consultation</span>
                      <HiExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quick Links & Bar Council License Details */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28 flex flex-col gap-6">

              <div>
                <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                  Advocate Quick Actions
                </h3>
                <p className="font-general text-[9px] uppercase tracking-widest text-ct-muted mb-4">
                  Manage Advocate Portal
                </p>

                <div className="flex flex-col gap-2.5">
                  <Link
                    to={ROUTES.LAWYER_AVAILABILITY}
                    className="flex items-center justify-between rounded-xl border border-ct-gold/20 bg-ct-void p-3.5 font-general text-xs uppercase tracking-widest text-ct-ivory hover:border-ct-gold transition-all"
                  >
                    <span>Time Slots & Rates</span>
                    <span className="text-ct-gold">→</span>
                  </Link>
                  <Link
                    to={ROUTES.LAWYER_EARNINGS}
                    className="flex items-center justify-between rounded-xl border border-ct-gold/20 bg-ct-void p-3.5 font-general text-xs uppercase tracking-widest text-ct-ivory hover:border-ct-gold transition-all"
                  >
                    <span>Revenue & Bank Payouts</span>
                    <span className="text-ct-gold">→</span>
                  </Link>
                  <Link
                    to={ROUTES.LAWYER_CONSULTATIONS}
                    className="flex items-center justify-between rounded-xl border border-ct-gold/20 bg-ct-void p-3.5 font-general text-xs uppercase tracking-widest text-ct-ivory hover:border-ct-gold transition-all"
                  >
                    <span>Past Consultations Log</span>
                    <span className="text-ct-gold">→</span>
                  </Link>
                </div>
              </div>

              {/* Bar Council License Box */}
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <HiCheckCircle className="text-emerald-400" size={18} />
                  <span className="font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                    Bar Council Verification Active
                  </span>
                </div>
                <p className="font-mono text-xs font-bold text-ct-ivory">Reg: BC/BH/1998/1420</p>
                <p className="font-inter text-[10px] text-ct-muted mt-1">
                  Licensed to practice before District Courts & High Court.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LawyerDashboardPage;
