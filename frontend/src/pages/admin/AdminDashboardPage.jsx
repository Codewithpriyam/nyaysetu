/**
 * NyayaSetu — AdminDashboardPage Component
 * Full Platform Administration & Bar Council Advocate Verification Portal:
 *  - System Health & Platform Analytics (48k+ Users, 20k+ Advocates)
 *  - Pending Advocate Bar License Verification Manager (Approve / Reject)
 *  - System Compliance & Audit Trail
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import {
  HiShieldCheck,
  HiBadgeCheck,
  HiCheckCircle,
  HiXCircle,
  HiDocumentText,
  HiScale,
  HiOutlineDocumentReport,
  HiCheck,
  HiX,
} from 'react-icons/hi';
import { MdOutlineGavel, MdOutlineSecurity } from 'react-icons/md';

const INITIAL_VERIFICATION_REQUESTS = [
  {
    id: 'ver-101',
    name: 'Adv. Alok Sharma',
    state: 'Uttar Pradesh',
    barEnrollment: 'BC/UP/2014/9102',
    court: 'Allahabad High Court & Kanpur District Court',
    experience: '12 Years',
    specialization: 'Civil Writs & Property Disputes',
    idCardDoc: 'UP_BAR_ID_9102.pdf',
    appliedDate: '07 Feb 2026',
  },
  {
    id: 'ver-102',
    name: 'Adv. Kavitha Hegde',
    state: 'Karnataka',
    barEnrollment: 'BC/KAR/2018/3410',
    court: 'Karnataka High Court Bengaluru',
    experience: '8 Years',
    specialization: 'Cyber Law & Tech Contract Recovery',
    idCardDoc: 'KAR_BAR_ID_3410.pdf',
    appliedDate: '06 Feb 2026',
  },
  {
    id: 'ver-103',
    name: 'Adv. Subhash Mukherjee',
    state: 'West Bengal',
    barEnrollment: 'BC/WB/2009/1842',
    court: 'Calcutta High Court & Kolkata District Forum',
    experience: '17 Years',
    specialization: 'Consumer Protection & Financial Disputes',
    idCardDoc: 'WB_BAR_ID_1842.pdf',
    appliedDate: '05 Feb 2026',
  },
];

const AdminDashboardPage = () => {
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATION_REQUESTS);
  const [actionAlert, setActionAlert] = useState('');

  const handleApproveAdvocate = (id, name, barId) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    setActionAlert(`Approved ${name} (${barId}). Verified Advocate Badge & Portal Access Granted!`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  const handleRejectAdvocate = (id, name) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    setActionAlert(`Rejected verification application for ${name}. Notification sent.`);
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

        {/* Admin Header Card */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <HiShieldCheck size={14} /> Platform System Administrator
                </span>
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                  System Uptime: 99.98%
                </span>
              </div>
              <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                NyayaSetu <span className="text-ct-gold italic">Admin & Verification Portal</span>
              </h1>
              <p className="font-inter text-xs sm:text-sm text-ct-muted mt-1">
                Verify Bar Council licenses, monitor system consultations, and audit platform legal compliance.
              </p>
            </div>

            <Link
              to={ROUTES.ADMIN_CONSULTATIONS}
              className="rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-6 py-3 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
            >
              Monitor Consultations →
            </Link>

          </div>

          {/* Platform KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ct-gold/15">
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Registered Citizens</span>
              <p className="font-zentry text-3xl font-black text-ct-ivory mt-1">48,290</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Verified Advocates</span>
              <p className="font-zentry text-3xl font-black text-ct-gold mt-1">20,450+</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Consultations Handled</span>
              <p className="font-zentry text-3xl font-black text-ct-ivory mt-1">12,840</p>
            </div>
            <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4 text-center">
              <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Dispute Recovery</span>
              <p className="font-zentry text-3xl font-black text-emerald-400 mt-1">₹ 1.48 Cr</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-10">

          {/* Left 2 Columns: Pending Bar Council Advocate Verification Requests */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                  <HiBadgeCheck className="text-ct-gold" size={24} />
                  <span>Pending Bar Council Advocate Verifications</span>
                </h2>
                <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3 py-1 font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                  {verifications.length} Pending Approvals
                </span>
              </div>

              {verifications.length === 0 ? (
                <div className="court-card-surface p-8 text-center border border-ct-gold/20">
                  <p className="font-inter text-sm text-ct-muted">All Bar Council advocate verification applications have been reviewed.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {verifications.map((v) => (
                    <BentoTilt key={v.id} tiltAmount={3}>
                      <div className="court-card-surface p-6 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4 shadow-court-card">

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{v.name}</h3>
                            <span className="font-general text-[9px] text-ct-muted">📍 {v.state}</span>
                          </div>

                          <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{v.specialization}</p>
                          <p className="font-inter text-xs text-ct-muted mt-1">
                            Forum: <strong className="text-ct-ivory">{v.court}</strong> · Exp: {v.experience}
                          </p>

                          <div className="flex items-center gap-4 mt-3 font-general text-[10px] uppercase tracking-wider text-ct-ivory/90">
                            <span className="font-mono font-bold text-ct-gold">Bar Enrollment: {v.barEnrollment}</span>
                            <span className="text-ct-muted">Applied: {v.appliedDate}</span>
                            <span className="text-emerald-400 underline cursor-pointer">📄 View {v.idCardDoc}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleApproveAdvocate(v.id, v.name, v.barEnrollment)}
                            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-5 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                          >
                            <HiCheck size={16} />
                            <span>Verify & Grant Access</span>
                          </button>
                          <button
                            onClick={() => handleRejectAdvocate(v.id, v.name)}
                            className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 font-general text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <HiX size={16} />
                            <span>Reject</span>
                          </button>
                        </div>

                      </div>
                    </BentoTilt>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Platform Audit & Compliance Log */}
          <div>
            <div className="court-card-surface p-7 border border-ct-gold/40 shadow-court-hover sticky top-28 flex flex-col gap-6">

              <div>
                <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
                  System Audit Log
                </h3>
                <p className="font-general text-[9px] uppercase tracking-widest text-ct-muted mb-4">
                  Security & Compliance
                </p>

                <div className="flex flex-col gap-3 font-inter text-xs text-ct-muted">
                  <div className="rounded-xl border border-ct-gold/15 bg-ct-void p-3.5">
                    <p className="font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold">System Health</p>
                    <p className="font-semibold text-ct-ivory mt-0.5">Database Synced: 20,450+ Advocates</p>
                    <p className="text-[10px] text-ct-muted mt-0.5">All 28 States & 8 UTs Active.</p>
                  </div>

                  <div className="rounded-xl border border-ct-gold/15 bg-ct-void p-3.5">
                    <p className="font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold">Groq AI Engine</p>
                    <p className="font-semibold text-ct-ivory mt-0.5">Llama-3 70B Versatile Active</p>
                    <p className="text-[10px] text-ct-muted mt-0.5">Avg response time: 280ms.</p>
                  </div>

                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3.5">
                    <p className="font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">Statutory Compliance</p>
                    <p className="font-semibold text-ct-ivory mt-0.5">DPDP Act 2023 Compliant</p>
                    <p className="text-[10px] text-ct-muted mt-0.5">End-to-End Encrypted Vault Storage.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
