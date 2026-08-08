/**
 * NyayaSetu — CaseDetailPage Component
 * Detailed Stage-by-Stage Case Progression Timeline, Hearings Schedule, & Document Vault.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import {
  HiCheckCircle,
  HiClock,
  HiFolder,
  HiDocumentText,
  HiArrowLeft,
  HiPlus,
  HiDownload,
  HiShieldCheck,
  HiCalendar,
} from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';
import apiClient from '@/services/api';

const STAGES = [
  { id: 'created', label: 'Case Created', icon: '📋' },
  { id: 'consultation', label: 'Consultation Completed', icon: '📹' },
  { id: 'documents', label: 'Documents Uploaded', icon: '📁' },
  { id: 'scheduled', label: 'Court Hearing Scheduled', icon: '📅' },
  { id: 'hearing_done', label: 'Court Hearing Completed', icon: '⚖️' },
  { id: 'closed', label: 'Case Closed', icon: '🏁' },
];

const CaseDetailPage = () => {
  const { id } = useParams();
  const [caseData, setCaseData]   = useState(null);
  const [hearings, setHearings]   = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiClient.get(`/cases/${id}`)
      .then((res) => {
        if (isMounted && res) {
          setCaseData(res);
          if (res.hearings) setHearings(res.hearings);
          if (res.documents) setDocuments(res.documents);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ct-void flex items-center justify-center text-ct-gold">
        <p className="font-general text-xs uppercase tracking-widest">Loading Case File...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20 flex flex-col items-center justify-center">
        <div className="court-card-surface p-10 border border-ct-gold/30 text-center max-w-md">
          <MdOutlineGavel className="text-ct-gold/40 mx-auto mb-3" size={48} />
          <h2 className="font-cormorant text-2xl font-bold text-ct-ivory">Case Record Not Found</h2>
          <p className="font-inter text-xs text-ct-muted mt-2">
            The requested case file does not exist or you do not have permission to view it.
          </p>
          <Link
            to={ROUTES.CASES}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ct-gold px-5 py-2.5 font-general text-xs font-bold uppercase text-ct-void shadow-gold-glow"
          >
            <HiArrowLeft size={16} />
            <span>Return to My Cases</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = caseData?.status === 'CLOSED' ? 5 : (hearings.length > 1 ? 3 : 2);

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        {/* Back Link */}
        <Link to={ROUTES.CASES} className="inline-flex items-center gap-2 text-ct-muted hover:text-ct-gold text-xs font-general uppercase tracking-widest mb-6">
          <HiArrowLeft size={16} />
          <span>Back to My Cases</span>
        </Link>

        {/* Case Banner */}
        <BentoTilt className="mb-10" tiltAmount={3}>
          <div className="court-card-surface p-8 border border-ct-gold/40 shadow-court-hover">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-ct-gold">Case #{caseData?.caseNumber}</span>
                  <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold">
                    {caseData?.category}
                  </span>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                    {caseData?.status}
                  </span>
                </div>

                <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight mt-1">
                  {caseData?.title}
                </h1>

                <p className="font-inter text-xs text-ct-muted mt-2">
                  🏛️ Forum: <strong>{caseData?.courtName}</strong> · Assigned Advocate: <strong>{caseData?.lawyerName || 'Counsel Unassigned'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Filing Date</span>
                <span className="font-mono text-sm font-bold text-ct-ivory">{caseData?.filingDate || 'Pending'}</span>
              </div>
            </div>
          </div>
        </BentoTilt>

        {/* ─── STAGE-BY-STAGE CASE TIMELINE VISUALIZATION ─────────────────────── */}
        <div className="court-card-surface p-8 border border-ct-gold/30 mb-10">
          <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-6 flex items-center gap-2">
            <MdOutlineGavel className="text-ct-gold" size={24} />
            <span>Case Progression Timeline</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent   = idx === currentStageIndex;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center group">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg mb-2 transition-all ${
                    isCompleted
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400 shadow-gold-glow'
                      : 'border-ct-gold/20 bg-ct-void text-ct-muted'
                  }`}>
                    {stage.icon}
                  </div>
                  <span className={`font-general text-[9px] uppercase tracking-wider font-bold leading-snug ${
                    isCurrent ? 'text-ct-gold' : isCompleted ? 'text-ct-ivory' : 'text-ct-muted'
                  }`}>
                    {stage.label}
                  </span>
                  {isCompleted && (
                    <span className="font-inter text-[8px] text-emerald-400 mt-1">✓ Verified</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hearings Schedule & Document Vault Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Court Hearings Table */}
          <div className="court-card-surface p-7 border border-ct-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                <HiCalendar className="text-ct-gold" size={22} />
                <span>Court Hearings</span>
              </h3>
            </div>

            {hearings.length === 0 ? (
              <div className="p-6 text-center text-ct-muted font-inter text-xs border border-ct-gold/15 rounded-xl">
                No court hearings scheduled yet for this case file.
              </div>
            ) : (
              <div className="space-y-4">
                {hearings.map((h) => (
                  <div key={h.id} className="rounded-xl border border-ct-gold/20 bg-ct-void/60 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-ct-gold">📅 {h.hearingDate} at {h.hearingTime || '10:30 AM'}</span>
                      <span className={`rounded-full px-2 py-0.5 font-general text-[8px] uppercase tracking-widest font-bold ${
                        h.status === 'COMPLETED' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30' : 'bg-sky-400/10 text-sky-400 border border-sky-400/30'
                      }`}>
                        {h.status}
                      </span>
                    </div>
                    <p className="font-inter text-xs text-ct-muted">🏛️ {h.courtName || caseData?.courtName}</p>
                    <p className="font-inter text-xs text-ct-ivory/90 mt-2 bg-ct-deep/50 p-2.5 rounded-lg border border-ct-gold/10">
                      <strong>Court Remarks:</strong> {h.remarks}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Case Document Vault */}
          <div className="court-card-surface p-7 border border-ct-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-2xl font-bold text-ct-ivory flex items-center gap-2">
                <HiFolder className="text-ct-gold" size={22} />
                <span>Case Document Vault</span>
              </h3>
            </div>

            {documents.length === 0 ? (
              <div className="p-6 text-center text-ct-muted font-inter text-xs border border-ct-gold/15 rounded-xl">
                No legal document files uploaded to vault yet.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-xl border border-ct-gold/20 bg-ct-void/60">
                    <div className="flex items-center gap-3">
                      <HiDocumentText className="text-ct-gold flex-shrink-0" size={24} />
                      <div>
                        <h4 className="font-inter text-xs font-bold text-ct-ivory">{doc.fileName}</h4>
                        <span className="font-general text-[8px] uppercase tracking-widest text-ct-muted">{doc.documentType}</span>
                      </div>
                    </div>
                    <button className="text-ct-gold hover:text-ct-ivory p-1.5 rounded-lg border border-ct-gold/20">
                      <HiDownload size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CaseDetailPage;
