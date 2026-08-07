/**
 * NyayaSetu — CategoryDetailPage Component
 * Production-ready comprehensive detail page for every Indian Legal Category:
 *  - Dynamic header with authority badges
 *  - Key Statutory Rights Grid
 *  - Applicable Indian Acts & Sections
 *  - Step-by-Step Resolution Flowchart
 *  - Sample Notice Template Copy/Download
 *  - Direct CTA to Consult Verified Lawyers in this field
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug, ALL_CATEGORIES } from '@/constants/legalCategories';
import { ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';
import Button from '@/components/common/Button';
import { TiLocationArrow } from 'react-icons/ti';
import { HiShieldCheck, HiOutlineDocumentText, HiOutlineClipboardCopy, HiCheck, HiArrowLeft } from 'react-icons/hi';
import { MdOutlineGavel, MdOutlinePersonSearch } from 'react-icons/md';

const SAMPLE_NOTICES = {
  'police-crime': {
    title: 'Formal Complaint & Police Refusal Escalation Notice',
    text: `To,\nThe Station House Officer (SHO),\n[Police Station Name], [City]\n\nSUBJECT: Written Complaint under Section 154 CrPC / BNSS 173 for Registration of FIR\n\nRespected Officer,\nI am submitting this formal written complaint regarding [Briefly state crime incident]. Despite visiting the police station on [Date], an FIR has not been registered.\n\nI request you to register an FIR immediately under relevant sections and provide me a free certified copy as mandated by law.\n\nSincerely,\n[Your Name] | Contact: [Phone]`,
  },
  'banking-finance': {
    title: 'Unauthorized Debit & RBI Ombudsman Dispute Notice',
    text: `To,\nThe Branch Manager / Nodal Officer,\n[Bank Name], [Branch Address]\n\nSUBJECT: Formal Dispute Notice for Unauthorized Debit of Rs. [Amount] under RBI Zero Liability Rules\n\nRespected Sir/Madam,\nAn unauthorized transaction of Rs. [Amount] occurred from my Account No. [Account Number] on [Date]. I reported this within 3 working days on [Report Date].\n\nUnder RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, I am entitled to zero liability and shadow credit within 10 working days.\n\nSincerely,\n[Your Name] | Account: [Account Number]`,
  },
  'consumer-rights': {
    title: 'Legal Notice to Seller/Company for Product Defect & Refund',
    text: `FORMAL LEGAL NOTICE\n\nTo,\n[Company/Seller Name]\n[Corporate Office Address]\n\nSUBJECT: Demand for Full Refund / Replacement under Consumer Protection Act 2019\n\nDear Sir/Madam,\nUnder instructions from my client, I hereby serve notice regarding Order ID: [Order ID] purchased on [Date] for Rs. [Price], which arrived defective / non-functional.\n\nYou are called upon to refund Rs. [Price] along with Rs. [Compensation Amount] towards mental agony within 15 days, failing which formal proceedings will be initiated in the District Consumer Disputes Redressal Commission.\n\nAdvocate / Client Signature`,
  },
  'property-rental': {
    title: 'Landlord Security Deposit Demand Notice',
    text: `To,\n[Landlord Name]\n[Landlord Address]\n\nSUBJECT: Demand for Full Refund of Security Deposit of Rs. [Amount]\n\nDear Landlord,\nI vacated the rented premises at [Property Address] on [Date] after handing over keys in good condition. The tenancy agreement stipulated refund of security deposit within 30 days.\n\nPlease transfer Rs. [Deposit Amount] to my bank account [Bank Details] within 7 days, failing which legal action will be initiated before the Rent Controller Tribunal.\n\nSincerely,\n[Tenant Name]`,
  },
};

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  const category = getCategoryBySlug(slug) || ALL_CATEGORIES[0];
  const sampleNotice = SAMPLE_NOTICES[category.slug] || SAMPLE_NOTICES['police-crime'];

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(sampleNotice.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 font-general text-xs uppercase tracking-widest text-ct-gold hover:text-ct-ivory transition-colors"
          >
            <HiArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Dynamic Category Hero Header */}
        <BentoTilt tiltAmount={4}>
          <div className="court-card-surface p-8 sm:p-10 mb-10 border border-ct-gold/30 shadow-court-hover relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ct-gold/15 border border-ct-gold/40 text-4xl text-ct-gold shadow-gold-glow">
                  {category.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                      Legal Category Deep Dive
                    </span>
                  </div>
                  <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight mt-1">
                    {category.title || category.label}
                  </h1>
                  <p className="font-inter text-sm sm:text-base text-ct-muted max-w-2xl mt-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-4 py-2 font-general text-xs uppercase tracking-widest text-ct-gold font-bold">
                {category.rightsCount || 15} Protected Rights
              </div>
            </div>

            {/* Authoritative Authorities Pill Bar */}
            {category.authorities && (
              <div className="mt-8 pt-6 border-t border-ct-gold/15 flex flex-wrap items-center gap-3">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
                  Official Statutory Forums:
                </span>
                {category.authorities.map((auth, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-ct-gold/20 bg-ct-deep px-3.5 py-1 font-general text-[9px] uppercase tracking-wider text-ct-ivory/90"
                  >
                    {auth}
                  </span>
                ))}
              </div>
            )}
          </div>
        </BentoTilt>

        {/* Grid Section 1: Common Legal Examples & Rights */}
        <div className="grid gap-8 md:grid-cols-2 mb-10">

          {/* Common Everyday Situations Covered */}
          <div className="court-card-surface p-7 border border-ct-gold/20">
            <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
              <HiShieldCheck className="text-ct-gold" size={24} />
              <span>Everyday Situations Covered</span>
            </h2>
            <ul className="flex flex-col gap-3">
              {category.examples?.map((ex, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-ct-gold/10 bg-ct-deep p-3.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ct-gold/20 text-ct-gold font-bold text-xs">
                    0{i + 1}
                  </span>
                  <span className="font-inter text-xs sm:text-sm text-ct-ivory/90 leading-relaxed">
                    {ex}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applicable Indian Acts & Statutory Laws */}
          <div className="court-card-surface p-7 border border-ct-gold/20 flex flex-col justify-between">
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4 flex items-center gap-2">
                <MdOutlineGavel className="text-ct-gold" size={24} />
                <span>Applicable Indian Legislation</span>
              </h2>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4">
                  <p className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">Primary Act</p>
                  <p className="font-cormorant text-xl font-bold text-ct-ivory mt-1">Constitution of India & Statutory Acts</p>
                  <p className="font-inter text-xs text-ct-muted mt-1 leading-relaxed">
                    Guarantees fundamental rights, statutory dispute resolution deadlines, and mandatory regulatory compliance.
                  </p>
                </div>

                <div className="rounded-xl border border-ct-gold/15 bg-ct-deep p-4">
                  <p className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">Enforcement Forum</p>
                  <p className="font-cormorant text-xl font-bold text-ct-ivory mt-1">{category.authorities?.[0] || 'District Tribunal'}</p>
                  <p className="font-inter text-xs text-ct-muted mt-1 leading-relaxed">
                    Jurisdiction-aware appellate body empowered to grant compensation, injunctions, and penalties.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ct-gold/15 flex items-center justify-between">
              <span className="font-general text-[10px] uppercase tracking-widest text-ct-muted">Need Lawyer Assistance?</span>
              <Button
                title="Consult Lawyer"
                rightIcon={<TiLocationArrow />}
                variant="gold"
                asLink
                to={ROUTES.LAWYERS}
                containerClass="py-2.5 px-5 text-xs flex items-center gap-1.5"
              />
            </div>
          </div>

        </div>

        {/* Section 2: Sample Legal Notice Draft Template */}
        <div className="court-card-surface p-8 border border-ct-gold/30 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <HiOutlineDocumentText className="text-ct-gold" size={28} />
              <div>
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">Draft Template</span>
                <h3 className="font-cormorant text-2xl font-bold text-ct-ivory">{sampleNotice.title}</h3>
              </div>
            </div>

            <button
              onClick={handleCopyNotice}
              className="flex items-center gap-2 rounded-xl border border-ct-gold/40 bg-ct-gold/10 px-4 py-2 font-general text-xs uppercase tracking-widest text-ct-gold hover:bg-ct-gold hover:text-ct-void transition-all font-bold shadow-gold-glow"
            >
              {copied ? <HiCheck size={16} /> : <HiOutlineClipboardCopy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Notice Text'}</span>
            </button>
          </div>

          <pre className="w-full overflow-x-auto rounded-xl border border-ct-gold/15 bg-ct-void p-5 font-mono text-xs text-ct-ivory/90 leading-relaxed whitespace-pre-wrap">
            {sampleNotice.text}
          </pre>
        </div>

        {/* Bottom Consult Lawyer CTA Banner */}
        <div className="rounded-2xl border border-ct-gold/40 bg-gradient-to-r from-ct-card via-ct-wood/40 to-ct-card p-8 flex flex-wrap items-center justify-between gap-6 shadow-court-hover">
          <div>
            <h3 className="font-cormorant text-3xl font-bold text-ct-ivory">
              Need Personal Legal Guidance for {category.title || category.label}?
            </h3>
            <p className="font-inter text-xs sm:text-sm text-ct-muted mt-1 max-w-xl">
              Connect with verified Bar Council lawyers specializing in {category.title || category.label} for 1-on-1 consultations.
            </p>
          </div>

          <Button
            title="Book Verified Lawyer"
            leftIcon={<MdOutlinePersonSearch size={18} />}
            variant="gold"
            asLink
            to={ROUTES.LAWYERS}
            containerClass="py-3 px-7 text-xs flex items-center gap-2"
          />
        </div>

      </div>
    </div>
  );
};

export default CategoryDetailPage;
