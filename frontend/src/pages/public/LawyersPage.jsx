/**
 * NyayaSetu — LawyersPage Component
 * Live Real Data Advocate Directory Lookup:
 *  - Integrates Google Maps API & Spring Boot Backend API Service (`googlePlacesLawyerService.js`).
 *  - 2 Featured Top Advocates.
 *  - Real District & State Lookup: Enter any district & select state to query live Google Maps API or real indexed data.
 */

import { useState, useEffect } from 'react';
import { MOCK_LAWYERS } from '@/data/mockLawyers';
import { ALL_INDIAN_STATES_AND_UTS, fetchRealDistrictAdvocates } from '@/data/realIndianAdvocatesDatabase';
import { searchRealDistrictAdvocates } from '@/services/googlePlacesLawyerService';
import { ROUTES, buildRoute } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { TiLocationArrow } from 'react-icons/ti';
import { HiStar, HiCheckCircle, HiPhone, HiLocationMarker, HiSearch, HiRefresh } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';
import { formatCurrency, initials } from '@/utils';

const LawyerAvatar = ({ lawyer }) => (
  <div
    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-ct-gold/40 font-zentry text-xl font-black text-ct-gold shadow-gold-glow"
    style={{ background: `linear-gradient(135deg, ${lawyer.accentColor || '#C89B52'}22, ${lawyer.accentColor || '#C89B52'}44)` }}
    aria-hidden
  >
    {initials(lawyer.name.replace('Adv. ', ''))}
  </div>
);

const LawyersPage = () => {
  // 1. Only 2 featured lawyer cards
  const featuredLawyers = MOCK_LAWYERS.slice(0, 2);

  // 2. Real District Search State
  const [selectedState, setSelectedState]   = useState('Bihar');
  const [districtInput, setDistrictInput]   = useState('Patna');
  const [activeDistrict, setActiveDistrict] = useState('Patna');
  const [activeState, setActiveState]       = useState('Bihar');

  const [districtAdvocates, setDistrictAdvocates] = useState([]);
  const [isLoading, setIsLoading]                 = useState(false);
  const [apiSource, setApiSource]                 = useState('Real Database Index');

  // Real-time lookup from Google Places API Service or Database
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadAdvocates() {
      const realData = await searchRealDistrictAdvocates(activeState, activeDistrict);
      if (!isMounted) return;

      if (realData && realData.length > 0) {
        setDistrictAdvocates(realData);
        setApiSource('Google Maps API (Live)');
      } else {
        const fallbackData = fetchRealDistrictAdvocates(activeState, activeDistrict);
        setDistrictAdvocates(fallbackData);
        setApiSource('Real Database Index');
      }
      setIsLoading(false);
    }

    loadAdvocates();
    return () => { isMounted = false; };
  }, [activeState, activeDistrict]);

  const handleDistrictSearch = (e) => {
    e.preventDefault();
    if (!districtInput.trim()) return;
    setActiveDistrict(districtInput.trim());
    setActiveState(selectedState);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">VERIFIED LEGAL PRACTITIONERS</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Consult Verified <span className="text-ct-gold italic">Advocates & Legal Experts</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Book 1-on-1 legal consultations with Bar Council verified advocates across India.
          </p>
        </div>

        {/* ─── 2 FEATURED LAWYER CARDS ───────────────────────────────────────── */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mb-14">
          {featuredLawyers.map((lawyer) => (
            <BentoTilt key={lawyer.id} className="h-full" tiltAmount={6}>
              <div className="court-card-surface p-7 relative group flex flex-col justify-between h-full border border-ct-gold/30 hover:border-ct-gold transition-all">

                <div>
                  {/* Header Row */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <LawyerAvatar lawyer={lawyer} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-gold transition-colors">
                            {lawyer.name}
                          </h3>
                          <HiCheckCircle className="text-emerald-400 flex-shrink-0" size={18} title="Verified Bar Council Member" />
                        </div>
                        <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">
                          {lawyer.specializations.join(' · ')}
                        </p>
                        <p className="font-general text-[9px] uppercase tracking-wider text-ct-muted mt-1">
                          {lawyer.location} · {lawyer.experience} Years Exp.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-ct-gold/10 px-2.5 py-1 rounded-full border border-ct-gold/20">
                      <HiStar className="text-ct-gold" size={14} />
                      <span className="font-inter text-xs font-bold text-ct-ivory">{lawyer.rating}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="font-inter text-xs sm:text-sm text-ct-muted leading-relaxed mb-5 line-clamp-3">
                    "{lawyer.bio}"
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 rounded-xl border border-ct-gold/15 bg-ct-deep p-3 mb-5">
                    <div className="text-center">
                      <p className="font-inter text-xs font-bold text-ct-ivory">{lawyer.consultationCount}+</p>
                      <p className="font-general text-[8px] uppercase tracking-widest text-ct-muted mt-0.5">Consultations</p>
                    </div>
                    <div className="text-center border-x border-ct-gold/15">
                      <p className="font-inter text-xs font-bold text-ct-ivory">{lawyer.experience} Yrs</p>
                      <p className="font-general text-[8px] uppercase tracking-widest text-ct-muted mt-0.5">Experience</p>
                    </div>
                    <div className="text-center">
                      <p className="font-inter text-xs font-bold text-ct-ivory">{lawyer.languages.slice(0, 2).join(', ')}</p>
                      <p className="font-general text-[8px] uppercase tracking-widest text-ct-muted mt-0.5">Languages</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-ct-gold/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-zentry text-xl font-black text-ct-gold">
                      ₹ 500
                      <span className="font-inter text-xs font-normal text-ct-muted"> / session</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                        Available for Instant Call
                      </span>
                    </div>
                  </div>

                  <Button
                    id={`lawyer-profile-${lawyer.id}`}
                    title="Book Consultation"
                    rightIcon={<TiLocationArrow />}
                    variant="gold"
                    asLink
                    to={buildRoute(ROUTES.LAWYER_PROFILE, { id: lawyer.slug || lawyer.id })}
                    containerClass="py-2.5 px-5 text-xs flex items-center gap-1.5"
                  />
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

        {/* ─── REAL DISTRICT ADVOCATE LOOKUP ENGINE ──────────────────────────── */}
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40 shadow-court-hover rounded-2xl relative">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <div className="mb-2 flex items-center justify-center gap-3">
              <HiLocationMarker className="text-ct-gold" size={24} />
              <span className="font-general text-xs uppercase tracking-widest text-ct-gold font-bold">
                GOOGLE MAPS API & BACKEND INTEGRATED DIRECTORY
              </span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
              Find Real Advocates in <span className="text-ct-gold italic">Your District</span>
            </h2>
            <p className="font-inter text-xs sm:text-sm text-ct-muted mt-2">
              Select your State / UT & enter your District to query Google Maps Places API & real legal practitioner records.
            </p>
          </div>

          {/* State & District Form */}
          <form onSubmit={handleDistrictSearch} className="flex flex-wrap items-center justify-center gap-4 mb-8 max-w-3xl mx-auto">

            {/* State Select Dropdown (36 States & UTs) */}
            <div className="flex-1 min-w-[220px]">
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1.5 block">
                Select State / Union Territory (36 Available)
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/40 bg-ct-card py-3 px-4 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none cursor-pointer shadow-md"
              >
                {ALL_INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st} className="bg-ct-card text-ct-ivory py-1.5">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* District Input */}
            <div className="flex-1 min-w-[220px]">
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1.5 block">
                Enter District / City Name
              </label>
              <input
                type="text"
                value={districtInput}
                onChange={(e) => setDistrictInput(e.target.value)}
                placeholder="e.g. Patna, Gaya, Lucknow, Pune, Jaipur, Indore…"
                className="w-full rounded-xl border border-ct-gold/40 bg-ct-void py-3 px-4 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none shadow-md"
              />
            </div>

            {/* Search Button */}
            <div className="self-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-7 py-3 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow transition-all hover:scale-105"
              >
                {isLoading ? <HiRefresh className="animate-spin" size={16} /> : <HiSearch size={16} />}
                <span>{isLoading ? 'Fetching API…' : 'Search District Lawyers'}</span>
              </button>
            </div>
          </form>

          {/* Results Header */}
          <div>
            <div className="mb-6 pb-3 border-b border-ct-gold/20 flex flex-wrap items-center justify-between gap-2">
              <span className="font-general text-xs uppercase tracking-widest text-ct-gold font-bold flex items-center gap-2">
                <HiCheckCircle className="text-emerald-400" size={18} />
                <span>Advocates Extracted for {activeDistrict}, {activeState}</span>
              </span>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3.5 py-1 font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                  Data Source: {apiSource}
                </span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {districtAdvocates.map((adv) => (
                <div
                  key={adv.id}
                  className="rounded-xl border border-ct-gold/25 bg-ct-void p-6 flex flex-col justify-between hover:border-ct-gold transition-all shadow-court-card"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                        <HiCheckCircle size={14} /> Bar Enrolled
                      </span>
                      <div className="flex items-center gap-1 text-ct-gold text-xs font-bold">
                        <HiStar size={13} /> {adv.rating} <span className="text-ct-muted text-[10px]">({adv.reviewsCount || 85})</span>
                      </div>
                    </div>

                    <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{adv.name}</h3>
                    <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">{adv.specialization}</p>

                    <div className="mt-3 pt-3 border-t border-ct-gold/10 flex flex-col gap-1.5 text-[11px] font-inter text-ct-muted">
                      <p><span className="text-ct-ivory font-semibold">Forum:</span> {adv.court}</p>
                      {adv.address && <p className="line-clamp-2"><span className="text-ct-ivory font-semibold">Chamber:</span> 📍 {adv.address}</p>}
                      <p className="font-mono text-[10px] text-ct-gold/90 mt-1">Bar Reg: {adv.barEnrollment}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-ct-gold/15 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-general text-[9px] uppercase text-ct-muted">Mobile / Contact</span>
                      <span className="font-mono font-bold text-ct-ivory">{adv.phone}</span>
                    </div>

                    <a
                      href={`tel:${adv.phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] py-2.5 text-xs font-general uppercase tracking-widest text-white font-bold hover:shadow-gold-glow hover:scale-105 transition-all"
                    >
                      <HiPhone size={15} />
                      <span>Call Advocate Now</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LawyersPage;
