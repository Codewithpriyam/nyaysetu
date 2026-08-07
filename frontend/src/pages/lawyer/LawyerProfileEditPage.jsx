/**
 * NyayaSetu — LawyerProfileEditPage Component
 * Advocate Profile Editor for Bar Council Practitioners.
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiSave, HiCheckCircle, HiUser, HiShieldCheck } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const LawyerProfileEditPage = () => {
  const [name, setName]                   = useState('Adv. Rajesh Kumar');
  const [court, setCourt]                 = useState('Patna High Court & District Civil Court');
  const [barEnrollment, setBarEnrollment] = useState('BC/BH/1998/1420');
  const [experience, setExperience]       = useState(15);
  const [languages, setLanguages]         = useState('Hindi, English, Punjabi');
  const [bio, setBio]                     = useState('Senior advocate with 15 years in employment disputes, wrongful termination cases, and labour court proceedings. Represented clients before the Supreme Court.');
  const [upiId, setUpiId]                 = useState('rajeshkumar@okaxis');
  const [savedAlert, setSavedAlert]       = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedAlert('Advocate profile updated successfully!');
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
            <span className="label-text">ADVOCATE PROFILE EDITOR</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Edit Advocate <span className="text-ct-gold italic">Profile & Bio</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
            Update your public profile, Bar Council license enrollment, court practice, and UPI ID for payments.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover flex flex-col gap-6">

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Advocate Display Name*:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Bar Council Enrollment Number*:
              </label>
              <input
                type="text"
                required
                value={barEnrollment}
                onChange={(e) => setBarEnrollment(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-mono text-xs text-ct-gold focus:border-ct-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Primary Practice Courts*:
              </label>
              <input
                type="text"
                required
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Direct Payment UPI ID*:
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-mono text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Years of Legal Experience*:
              </label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Languages Spoken*:
              </label>
              <input
                type="text"
                required
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
              Professional Bio & Experience Summary*:
            </label>
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-ct-gold/15 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-8 py-3.5 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
            >
              <HiSave size={18} />
              <span>Save Profile Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default LawyerProfileEditPage;
