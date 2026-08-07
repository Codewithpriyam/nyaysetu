/**
 * NyayaSetu — CategoriesPage Component
 * Full Comprehensive Grid of all 9 Indian Legal Categories & Statutory Protections:
 *  - Filterable by Category Sets (Police & Banking, Employment & Property, Cyber & Court)
 *  - Real-time Keyword Search Bar
 *  - 3D BentoTilt Category Cards with Images, Rights Count, Examples & Deep Dive Links
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_SETS, ALL_CATEGORIES } from '@/constants/legalCategories';
import { ROUTES, buildRoute } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { TiLocationArrow } from 'react-icons/ti';
import { HiSearch, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState('All'); // 'All' | 1 | 2 | 3

  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.examples.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesSet = true;
      if (selectedSet !== 'All') {
        const setObj = CATEGORY_SETS.find((s) => s.setNumber === Number(selectedSet));
        matchesSet = setObj ? setObj.categories.some((c) => c.slug === cat.slug) : true;
      }

      return matchesSearch && matchesSet;
    });
  }, [searchQuery, selectedSet]);

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">COMPREHENSIVE LEGAL CATEGORIES</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Know Your Statutory Rights Across <span className="text-ct-gold italic">9 Legal Categories</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Sourced from official Indian legislation, High Court rulings, and statutory authority guidelines.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="court-card-surface p-5 mb-10 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4">

          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ct-gold" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal categories (e.g. police, refund, salary, rent, OTP, MSME)…"
              className="w-full rounded-xl border border-ct-gold/20 bg-ct-void py-2.5 pl-11 pr-4 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none"
            />
          </div>

          {/* Set Filter Tabs */}
          <div className="flex items-center gap-2">
            <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Category Set:</span>
            {['All', '1', '2', '3'].map((setNum) => (
              <button
                key={setNum}
                onClick={() => setSelectedSet(setNum === 'All' ? 'All' : Number(setNum))}
                className={`rounded-lg px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest transition-all ${selectedSet === (setNum === 'All' ? 'All' : Number(setNum)) ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white font-bold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border border-ct-gold/20'}`}
              >
                {setNum === 'All' ? 'All (9)' : `Set 0${setNum}`}
              </button>
            ))}
          </div>

        </div>

        {/* Category Cards Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <BentoTilt key={cat.id} className="h-full" tiltAmount={5}>
              <div className="court-card-surface p-6 relative group flex flex-col justify-between h-full border border-ct-gold/30 hover:border-ct-gold transition-all shadow-court-card">

                <div>
                  {/* Category Image Header */}
                  {cat.image && (
                    <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl border border-ct-gold/20">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ct-card via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full border border-ct-gold/40 bg-ct-void/90 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold backdrop-blur-md">
                        {cat.rightsCount} Protected Rights
                      </span>
                    </div>
                  )}

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl" role="img" aria-hidden>{cat.icon}</span>
                    <div>
                      <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-gold transition-colors">
                        {cat.title}
                      </h3>
                      <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                        Statutory Rights Guide
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-inter text-xs text-ct-muted leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Examples List */}
                  <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-3.5 mb-5">
                    <p className="font-general text-[8px] uppercase tracking-widest text-ct-gold font-bold mb-1.5">Common Situations Covered</p>
                    <ul className="flex flex-col gap-1.5 font-inter text-[11px] text-ct-ivory/90">
                      {cat.examples.slice(0, 3).map((ex, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-ct-gold font-bold">•</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="border-t border-ct-gold/15 pt-4 flex items-center justify-between">
                  <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">Explore Acts & Templates</span>
                  <Link
                    to={buildRoute(ROUTES.CATEGORY, { slug: cat.slug })}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-4 py-2 font-general text-[10px] uppercase font-bold tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                  >
                    <span>Deep Dive</span>
                    <HiArrowRight size={14} />
                  </Link>
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CategoriesPage;
