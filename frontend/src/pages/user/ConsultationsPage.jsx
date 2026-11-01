/**
 * NyayaSetu — User ConsultationsPage Component
 * Citizen legal consultations overview and meeting scheduler.
 * Fetches real booked consultations from Spring Boot backend (/api/v1/me/consultations).
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/api';
import { ROUTES } from '@/constants/routes';
import {
  HiVideoCamera,
  HiCalendar,
  HiClock,
  HiPlus,
  HiRefresh,
  HiShieldCheck,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import { formatCurrency, formatDuration } from '@/utils';

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState('');

  const fetchConsultations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/me/consultations');
      if (Array.isArray(res)) {
        setConsultations(res);
      }
    } catch {
      setError('Unable to load consultations. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const scheduledCount = consultations.filter((c) => c.status === 'SCHEDULED' || c.status === 'CONFIRMED').length;
  const completedCount = consultations.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ─── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAECF0]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-ct-gold animate-pulse" />
              <span className="font-inter text-xs uppercase tracking-widest text-ct-gold font-bold">
                My Legal Consultations
              </span>
            </div>
            <h1 className="font-calluna text-3xl sm:text-4xl font-bold text-ct-ivory">
              Scheduled & Past Consultations
            </h1>
            <p className="font-inter text-xs sm:text-sm text-ct-muted mt-1">
              Manage your advocate video consultations, meeting links, and case reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchConsultations}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ct-gold/30 bg-ct-deep/60 px-3.5 py-2 font-inter text-xs text-ct-ivory hover:border-ct-gold transition-colors"
              title="Refresh"
            >
              <HiRefresh className={isLoading ? 'animate-spin' : ''} size={15} />
              <span>Refresh</span>
            </button>

            <Link
              to={ROUTES.LAWYERS}
              className="inline-flex items-center gap-1.5 rounded-xl bg-ct-gold px-4 py-2 font-inter text-xs font-bold text-black uppercase tracking-wider hover:bg-ct-gold/90 transition-all shadow-md shadow-ct-gold/15"
            >
              <HiPlus size={16} />
              <span>Book Consultation</span>
            </Link>
          </div>
        </div>

        {/* ─── Stats Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#EAECF0]/15 bg-ct-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[10px] uppercase tracking-widest text-ct-muted">Total Consultations</span>
              <HiCalendar className="text-ct-gold" size={20} />
            </div>
            <p className="font-calluna text-3xl font-bold text-ct-ivory mt-2">{consultations.length}</p>
          </div>

          <div className="rounded-2xl border border-ct-gold/30 bg-ct-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[10px] uppercase tracking-widest text-ct-gold">Upcoming / Scheduled</span>
              <HiVideoCamera className="text-ct-gold" size={20} />
            </div>
            <p className="font-calluna text-3xl font-bold text-ct-gold mt-2">{scheduledCount}</p>
          </div>

          <div className="rounded-2xl border border-[#EAECF0]/15 bg-ct-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[10px] uppercase tracking-widest text-ct-muted">Completed Sessions</span>
              <HiShieldCheck className="text-emerald-400" size={20} />
            </div>
            <p className="font-calluna text-3xl font-bold text-ct-ivory mt-2">{completedCount}</p>
          </div>
        </div>

        {/* ─── Error Alert ────────────────────────────────────────────── */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 font-inter text-xs">
            {error}
          </div>
        )}

        {/* ─── Consultations List ──────────────────────────────────────── */}
        {isLoading ? (
          <div className="rounded-2xl border border-[#EAECF0]/10 bg-ct-card p-12 text-center">
            <HiRefresh className="mx-auto text-ct-gold animate-spin mb-3" size={32} />
            <p className="font-inter text-xs text-ct-muted">Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="rounded-2xl border border-[#EAECF0]/15 bg-ct-card p-12 text-center">
            <HiVideoCamera className="mx-auto text-ct-gold/40 mb-3" size={48} />
            <h3 className="font-calluna text-xl font-bold text-ct-ivory">No Consultations Booked Yet</h3>
            <p className="font-inter text-xs text-ct-muted max-w-md mx-auto mt-1 mb-6 leading-relaxed">
              Find verified advocates across India, choose your legal problem, and book an immediate 1-on-1 confidential consultation.
            </p>
            <Link
              to={ROUTES.LAWYERS}
              className="inline-flex items-center gap-2 rounded-xl bg-ct-gold px-5 py-2.5 font-inter text-xs font-bold text-black uppercase tracking-wider hover:bg-ct-gold/90 transition-all shadow-md shadow-ct-gold/20"
            >
              <span>Explore Advocates & Book</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => {
              const isScheduled = c.status === 'SCHEDULED' || c.status === 'CONFIRMED';
              const isPending = c.status === 'PENDING_PAYMENT';
              const isCompleted = c.status === 'COMPLETED';

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[#EAECF0]/15 bg-ct-card p-5 sm:p-6 transition-all hover:border-ct-gold/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-inter text-[10px] uppercase tracking-wider text-ct-gold font-bold">
                          #{c.id} · {c.category || 'Legal Guidance'}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-inter text-[9px] uppercase font-bold tracking-wider ${
                            isScheduled
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : isCompleted
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-ct-muted/20 text-ct-muted border border-ct-muted/40'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <h3 className="font-calluna text-xl font-bold text-ct-ivory">
                        Advocate: {c.lawyerName || 'Assigned Advocate'}
                      </h3>

                      {c.lawyerCourt && (
                        <p className="font-inter text-xs text-ct-muted">
                          Court: {c.lawyerCourt}
                        </p>
                      )}

                      {c.problem && (
                        <p className="font-inter text-xs text-ct-ivory/80 line-clamp-2 mt-1">
                          "{c.problem}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 border-[#EAECF0]/10 pt-3 md:pt-0 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-1.5 text-xs text-ct-muted">
                          <HiCalendar size={14} className="text-ct-gold" />
                          <span>{c.requestedDate || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Scheduled Date')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ct-muted mt-0.5">
                          <HiClock size={14} className="text-ct-gold" />
                          <span>{c.durationMinutes ? formatDuration(c.durationMinutes) : '30 mins'} · {formatCurrency(c.totalAmount || c.price || 499)}</span>
                        </div>
                      </div>

                      {c.meetLink && isScheduled && (
                        <a
                          href={c.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 font-inter text-xs font-bold text-black uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                        >
                          <HiVideoCamera size={16} />
                          <span>Join Video Consultation</span>
                          <HiOutlineExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsultationsPage;
