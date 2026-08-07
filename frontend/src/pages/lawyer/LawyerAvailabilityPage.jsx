/**
 * NyayaSetu — LawyerAvailabilityPage Component
 * Time Slots & Fee Rate Manager for Advocates.
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { HiClock, HiCheckCircle, HiSave, HiCheck } from 'react-icons/hi';
import { formatCurrency } from '@/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LawyerAvailabilityPage = () => {
  const [ratePerSession, setRatePerSession] = useState(500);
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [activeSlots, setActiveSlots] = useState(['10:00 AM - 01:00 PM', '04:00 PM - 07:00 PM']);
  const [savedAlert, setSavedAlert] = useState('');

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedAlert('Availability & Consultation Rate successfully updated!');
    setTimeout(() => setSavedAlert(''), 4000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">

        {/* Feedback Alert */}
        {savedAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md">
            {savedAlert}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">ADVOCATE SCHEDULE & RATES</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Consultation Fee <span className="text-ct-gold italic">& Availability Settings</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
            Set your consultation rate per minute and manage active time slots for 1-on-1 calls.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover flex flex-col gap-8">

          {/* Rate per Session */}
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
              Consultation Rate Per Session
            </h2>
            <p className="font-inter text-xs text-ct-muted mb-4">
              Flat fee charged per 1-on-1 audio/video legal consultation session.
            </p>

            <div className="flex items-center gap-4 max-w-xs">
              <span className="font-zentry text-3xl font-black text-ct-gold">₹</span>
              <input
                type="number"
                min={100}
                max={5000}
                value={ratePerSession}
                onChange={(e) => setRatePerSession(Number(e.target.value))}
                className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-mono text-xl font-bold text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
              <span className="font-inter text-xs text-ct-muted">/ session</span>
            </div>
          </div>

          {/* Available Working Days */}
          <div className="pt-6 border-t border-ct-gold/15">
            <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
              Available Working Days
            </h2>
            <p className="font-inter text-xs text-ct-muted mb-4">
              Select days when clients can book 1-on-1 consultations with you.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-xl px-5 py-2.5 font-general text-xs font-bold transition-all border ${isSelected ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white border-ct-gold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border-ct-gold/20'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="pt-6 border-t border-ct-gold/15">
            <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-1">
              Active Time Slots
            </h2>
            <p className="font-inter text-xs text-ct-muted mb-4">
              Chamber consultation hours for video calls.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {['10:00 AM - 01:00 PM (Morning Slot)', '04:00 PM - 07:00 PM (Evening Slot)'].map((slot, i) => (
                <div key={i} className="rounded-xl border border-ct-gold/20 bg-ct-deep p-4 flex items-center justify-between">
                  <span className="font-inter text-xs font-bold text-ct-ivory">{slot}</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-general text-[8px] uppercase tracking-widest text-emerald-400 font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-ct-gold/15 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-8 py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
            >
              <HiSave size={18} />
              <span>Save Schedule Settings</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default LawyerAvailabilityPage;
