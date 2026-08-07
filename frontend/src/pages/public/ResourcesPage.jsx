/**
 * NyayaSetu — ResourcesPage Component
 * Legal Resource Vault & Download Center:
 *  - Free Statutory Legal Notice Templates (.docx / .pdf)
 *  - Official Complaint Forms (RTI, e-Daakhil, RBI Ombudsman)
 *  - Supreme Court Landmark Guidelines (DK Basu, Arnesh Kumar, RBI Zero Liability)
 */

import { useState } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import { HiDownload, HiDocumentText, HiShieldCheck, HiSearch, HiFolderDownload } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const RESOURCE_ITEMS = [
  {
    id: 'res-1',
    title: 'Statutory Legal Notice for E-Commerce Refund Denial',
    category: 'Notice Templates',
    format: 'DOCX / PDF',
    size: '124 KB',
    description: '15-day statutory demand notice draft under Consumer Protection Act 2019 for non-refund of defective laptop/mobile.',
    downloadCount: '4,890 Downloads',
  },
  {
    id: 'res-2',
    title: 'Landlord Security Deposit Return Demand Notice',
    category: 'Notice Templates',
    format: 'DOCX / PDF',
    size: '110 KB',
    description: 'Formal legal demand notice under Model Tenancy Act for non-refund of rental security deposit within 30 days.',
    downloadCount: '3,520 Downloads',
  },
  {
    id: 'res-3',
    title: 'Unpaid Salary & Notice Period Pay Recovery Draft',
    category: 'Notice Templates',
    format: 'DOCX / PDF',
    size: '135 KB',
    description: 'Demand notice under Payment of Wages Act 1936 addressed to employer for unpaid monthly salary & notice pay.',
    downloadCount: '2,940 Downloads',
  },
  {
    id: 'res-4',
    title: 'RTI Application Form 2005 (Standard Format)',
    category: 'Statutory Forms',
    format: 'PDF',
    size: '210 KB',
    description: 'Official Right to Information application template with fee payment instructions & PIO address guide.',
    downloadCount: '8,120 Downloads',
  },
  {
    id: 'res-5',
    title: 'RBI Banking Ombudsman Complaint Form (14448)',
    category: 'Statutory Forms',
    format: 'PDF',
    size: '180 KB',
    description: 'Official RBI Ombudsman claim form for unauthorized UPI debit, ATM cash non-dispense & credit card fraud.',
    downloadCount: '5,600 Downloads',
  },
  {
    id: 'res-6',
    title: 'Supreme Court Arrest Guidelines (DK Basu vs State of WB)',
    category: 'Landmark Rulings',
    format: 'PDF',
    size: '340 KB',
    description: 'Mandatory 11-point Supreme Court directive for police officers during arrest, interrogation & custody.',
    downloadCount: '6,450 Downloads',
  },
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [downloadAlert, setDownloadAlert]   = useState('');

  const categories = ['All', 'Notice Templates', 'Statutory Forms', 'Landmark Rulings'];

  const filteredResources = RESOURCE_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (title) => {
    setDownloadAlert(`Downloading: ${title}... Template downloaded!`);
    setTimeout(() => setDownloadAlert(''), 4000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-6xl mx-auto">

        {/* Feedback Alert */}
        {downloadAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md">
            {downloadAlert}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">FREE LEGAL RESOURCE VAULT</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Download Free Legal <span className="text-ct-gold italic">Notice Templates & Forms</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Free, lawyer-verified statutory notice drafts, RTI application forms, and High Court guideline PDFs.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="court-card-surface p-5 mb-10 border border-ct-gold/30 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ct-gold" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal templates (e.g. refund, RTI, security deposit, salary, RBI)…"
              className="w-full rounded-xl border border-ct-gold/20 bg-ct-void py-2.5 pl-11 pr-4 font-inter text-xs text-ct-ivory placeholder:text-ct-muted/70 focus:border-ct-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] text-white font-bold shadow-gold-glow' : 'bg-ct-void text-ct-ivory border border-ct-gold/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <BentoTilt key={res.id} className="h-full" tiltAmount={5}>
              <div className="court-card-surface p-6 relative group flex flex-col justify-between h-full border border-ct-gold/30 hover:border-ct-gold transition-all shadow-court-card">

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full border border-ct-gold/30 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                      {res.category}
                    </span>
                    <span className="font-general text-[9px] uppercase text-ct-muted font-bold">{res.format}</span>
                  </div>

                  <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-gold transition-colors mb-2">
                    {res.title}
                  </h3>

                  <p className="font-inter text-xs text-ct-muted leading-relaxed mb-4">
                    {res.description}
                  </p>
                </div>

                <div className="border-t border-ct-gold/15 pt-4 flex items-center justify-between">
                  <span className="font-general text-[9px] uppercase text-ct-muted">{res.downloadCount}</span>

                  <button
                    onClick={() => handleDownload(res.title)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-4 py-2 font-general text-[10px] uppercase font-bold tracking-widest text-white shadow-gold-glow hover:scale-105 transition-all"
                  >
                    <HiDownload size={14} />
                    <span>Download</span>
                  </button>
                </div>

              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ResourcesPage;
