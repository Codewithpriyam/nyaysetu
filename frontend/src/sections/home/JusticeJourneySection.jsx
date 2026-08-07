/**
 * NyayaSetu — Justice Journey Section (8 Interactive Legal Scenes)
 * Courtroom Theme + Interactive Scene Explorer with GSAP Motion & Legal Insights.
 * Updates:
 *  - Added "Proceed →" button right beside "Next Scene" button linking directly to that category detail page.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '@/animations/gsap-config';
import { useReducedMotion } from '@/animations/useReducedMotion';
import BentoTilt from '@/components/common/BentoTilt';
import { buildRoute, ROUTES } from '@/constants/routes';
import { HiShieldCheck, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const SCENES = [
  {
    id: 1,
    categorySlug: 'police-crime',
    title: 'Police Station & FIR Rights',
    subtitle: 'Arrest Rights · Zero FIR · Bail Rights',
    icon: '👮‍♂️',
    act: 'Section 154 CrPC / BNSS 173',
    keyRights: [
      'Police cannot refuse to register an FIR for cognizable offences.',
      'Zero FIR can be lodged at any police station regardless of jurisdiction.',
      'Arrested individuals must be informed of bail rights and grounds of arrest.',
      'Must be produced before a Magistrate within 24 hours of arrest.',
    ],
    procedure: 'Approach Station House Officer (SHO) → Submit Written Complaint → Demand FIR Copy (Free) → Escalate to SP/DCP if refused.',
    helpline: 'Dial 112 / State Police Helpline',
    accent: '#C89B52',
  },
  {
    id: 2,
    categorySlug: 'banking-finance',
    title: 'Banking & UPI Fraud Recovery',
    subtitle: 'Unauthorized Debit · ATM Cash Failure · OTP Scams',
    icon: '🏦',
    act: 'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18',
    keyRights: [
      'Zero liability if reported within 3 working days of unauthorized transaction.',
      'Bank must shadow-credit the disputed amount within 10 working days.',
      'ATM cash non-dispense reversal required within 5 days or ₹100/day penalty.',
      'Right to escalate unresolved complaints to RBI Banking Ombudsman.',
    ],
    procedure: 'Notify Bank immediately via Customer Care/App → Block Card/UPI → File Cyber Complaint → Submit Ombudsman Grievance after 30 days.',
    helpline: 'RBI Ombudsman: 14448',
    accent: '#E0BD78',
  },
  {
    id: 3,
    categorySlug: 'consumer-rights',
    title: 'Consumer Rights & E-Commerce',
    subtitle: 'Defective Goods · Refund Denial · Service Deficiency',
    icon: '🛒',
    act: 'Consumer Protection Act 2019',
    keyRights: [
      'Right to refund, replacement, or compensation for defective goods.',
      'Protection against misleading advertisements and unfair trade practices.',
      'E-commerce platforms are liable for seller deficiencies and fake products.',
      'No advocate required to file a complaint in Consumer Commissions.',
    ],
    procedure: 'Serve Legal Notice to Seller/Company → Wait 15 Days → File Online via NCDRC e-Daakhil Portal → Attend District Forum Hearing.',
    helpline: 'National Consumer Helpline: 1915',
    accent: '#C89B52',
  },
  {
    id: 4,
    categorySlug: 'property-rental',
    title: 'Rent & Landlord Disputes',
    subtitle: 'Security Deposit · Illegal Eviction · Maintenance',
    icon: '🏠',
    act: 'Model Tenancy Act & State Rent Control Acts',
    keyRights: [
      'Security deposit must be refunded within 1 month of vacating property.',
      'Landlord cannot cut off electricity or water supply to force eviction.',
      '24-hour advance notice mandatory before landlord enters rented premises.',
      'Eviction only possible through lawful Rent Authority order.',
    ],
    procedure: 'Send Written Deposit Demand Notice → File Application before Rent Controller → Dispute Settlement before Rent Tribunal.',
    helpline: 'State Rent Authority Portal',
    accent: '#E0BD78',
  },
  {
    id: 5,
    categorySlug: 'employment-workplace',
    title: 'Unpaid Salary & Workplace',
    subtitle: 'Termination · Notice Pay · PF Non-Deposit',
    icon: '💼',
    act: 'Payment of Wages Act & Industrial Disputes Act',
    keyRights: [
      'Salaries must be disbursed by the 7th or 10th of every month.',
      'Wrongful termination entitles employee to severance pay & notice pay.',
      'Employer mandatory PF contribution must be deposited with EPFO monthly.',
      'Gratuity mandatory for employees completing 5 continuous years.',
    ],
    procedure: 'Send Formal Demand Letter to HR/Management → Serve Legal Notice → File Complaint with Assistant Labour Commissioner (ALC).',
    helpline: 'EPFO Toll-Free: 1800-118-005',
    accent: '#C89B52',
  },
  {
    id: 6,
    categorySlug: 'cyber-digital',
    title: 'Cyber Crime & Account Hacking',
    subtitle: 'Financial Scam · Identity Theft · Online Abuse',
    icon: '💻',
    act: 'Information Technology Act 2000 (Sec 66C/66D)',
    keyRights: [
      'Right to immediate financial freeze of stolen funds via 1930 helpline.',
      'Protection against non-consensual image sharing and online harassment.',
      'Intermediary platforms must take down reported illegal content within 36 hrs.',
      'Adjudicating Officer empowered to award compensation for data theft.',
    ],
    procedure: 'Call 1930 immediately to freeze bank accounts → Log Complaint on cybercrime.gov.in → Submit FIR at local Cyber Police Cell.',
    helpline: 'Cyber Crime Helpline: 1930',
    accent: '#5724ff',
  },
  {
    id: 7,
    categorySlug: 'business-company',
    title: 'MSME & Client Non-Payment',
    subtitle: 'Invoice Recovery · Vendor Breach · Delayed Payment',
    icon: '🏢',
    act: 'MSMED Act 2006 (Section 15 & 16)',
    keyRights: [
      'Buyer must pay MSME supplier within 45 days of invoice acceptance.',
      'Mandatory compound interest at 3x RBI bank rate for delayed payments.',
      'Statutory right to conciliation via MSME Samadhaan Facilitation Council.',
      'High Court appeals require 75% upfront deposit by defaulting buyer.',
    ],
    procedure: 'Register on MSME Samadhaan Portal → Submit Unpaid Invoice → Council issues Notice to Buyer → Conciliation & Award.',
    helpline: 'MSME Samadhaan Portal (samadhaan.msme.gov.in)',
    accent: '#C89B52',
  },
  {
    id: 8,
    categorySlug: 'general-legal',
    title: 'Court Summons & Legal Notice',
    subtitle: 'Civil Summons · Legal Reply · High Court Writs',
    icon: '⚖️',
    act: 'Code of Civil Procedure 1908 & Bharatiya Nagarik Suraksha Sanhita',
    keyRights: [
      'Right to receive 15-30 days time to respond to a legal notice.',
      'Court summons must be served in person or by registered post.',
      'Right to free legal representation through District Legal Services Authority (DLSA).',
      'Constitutional right to file Writ Petition in High Court under Article 226.',
    ],
    procedure: 'Examine Legal Notice with Advocate → Draft Formal Written Reply → Appear before Court on Summons Date → File Written Statement.',
    helpline: 'NALSA Legal Aid Helpline: 15100',
    accent: '#E0BD78',
  },
];

const JusticeJourneySection = () => {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const cardRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const activeScene = SCENES[activeSceneIdx];
  const categoryDetailUrl = buildRoute(ROUTES.CATEGORY, { slug: activeScene.categorySlug });

  const handleNext = () => {
    setActiveSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  const handlePrev = () => {
    setActiveSceneIdx((prev) => (prev - 1 + SCENES.length) % SCENES.length);
  };

  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0.3, y: 15, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeSceneIdx, prefersReduced]);

  return (
    <section id="justice-journey" className="bg-ct-void py-12 md:py-16 border-t border-ct-gold/10 relative">
      <div className="section-container">

        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">Interactive Legal Walkthrough</span>
            <div className="gold-divider-sm" />
          </div>

          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold text-ct-ivory leading-tight">
            The Justice Journey: <span className="text-ct-gold italic">8 Legal Environments</span>
          </h2>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-xl mx-auto">
            Explore step-by-step rights, applicable Indian Acts, and official recourse across 8 everyday legal situations.
          </p>
        </div>

        {/* Scene Selector Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start md:justify-center">
          {SCENES.map((scene, idx) => {
            const isActive = activeSceneIdx === idx;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveSceneIdx(idx)}
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2 text-xs font-general uppercase tracking-wider transition-all duration-300 flex-shrink-0 border
                  ${isActive
                    ? 'bg-ct-gold text-ct-void border-ct-gold shadow-gold-glow font-bold scale-105'
                    : 'bg-ct-card border-ct-gold/30 text-ct-ivory hover:border-ct-gold/60 hover:bg-ct-gold/10'
                  }
                `}
              >
                <span>{scene.icon}</span>
                <span>0{scene.id}</span>
              </button>
            );
          })}
        </div>

        {/* Active Scene Explorer Card */}
        <div className="max-w-4xl mx-auto">
          <BentoTilt tiltAmount={5}>
            <div
              ref={cardRef}
              className="court-card-surface p-7 sm:p-9 relative overflow-hidden border border-ct-gold/30 shadow-court-hover"
            >
              {/* Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-ct-gold/15">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ct-gold/10 border border-ct-gold/30 text-3xl text-ct-gold shadow-gold-glow">
                    {activeScene.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                        Scene 0{activeScene.id} of 08
                      </span>
                    </div>
                    <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-ct-ivory leading-tight mt-0.5">
                      {activeScene.title}
                    </h3>
                    <p className="font-inter text-xs text-ct-muted mt-0.5">{activeScene.subtitle}</p>
                  </div>
                </div>

                {/* Applicable Act Badge */}
                <div className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-4 py-1.5 font-general text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                  {activeScene.act}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid gap-6 md:grid-cols-2 mb-6">

                {/* Key Rights */}
                <div>
                  <h4 className="mb-3 font-general text-xs uppercase tracking-widest text-ct-gold font-bold flex items-center gap-2">
                    <HiShieldCheck size={16} />
                    <span>Your Statutory Rights</span>
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {activeScene.keyRights.map((right, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-inter text-xs text-ct-ivory/90 leading-relaxed">
                        <span className="text-ct-gold mt-0.5 font-bold">✓</span>
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Standard Procedure & Helpline */}
                <div className="flex flex-col justify-between rounded-xl border border-ct-gold/15 bg-ct-deep p-5">
                  <div>
                    <h4 className="mb-2 font-general text-xs uppercase tracking-widest text-ct-gold font-bold flex items-center gap-2">
                      <MdOutlineGavel size={16} />
                      <span>Standard Legal Recourse</span>
                    </h4>
                    <p className="font-inter text-xs text-ct-muted leading-relaxed mb-4">
                      {activeScene.procedure}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-ct-gold/10 flex items-center justify-between">
                    <div>
                      <p className="font-general text-[8px] uppercase tracking-widest text-ct-muted">Official Helpline</p>
                      <p className="font-inter text-xs font-bold text-ct-ivory mt-0.5">{activeScene.helpline}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card Bottom Nav (Previous Scene | Next Scene | PROCEED →) */}
              <div className="pt-4 border-t border-ct-gold/15 flex flex-wrap items-center justify-between gap-3">

                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 font-general text-xs uppercase tracking-widest text-ct-ivory/80 hover:text-ct-gold transition-colors py-2 px-4 rounded-xl border border-ct-gold/20 hover:border-ct-gold/50"
                  aria-label="Previous Scene"
                >
                  <HiArrowLeft size={16} />
                  <span>Previous Scene</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 font-general text-[10px] uppercase tracking-widest text-ct-muted">
                  <span>Scene {activeScene.id} / 8</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 font-general text-xs uppercase tracking-widest text-ct-ivory/90 hover:text-ct-gold transition-colors py-2 px-4 rounded-xl border border-ct-gold/30 hover:border-ct-gold"
                    aria-label="Next Scene"
                  >
                    <span>Next Scene</span>
                    <HiArrowRight size={16} />
                  </button>

                  {/* PROCEED → Button (Direct Category Detail Link) */}
                  <Link
                    to={categoryDetailUrl}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-5 py-2 font-general text-xs font-bold uppercase tracking-widest text-white border border-ct-gold/60 shadow-gold-glow transition-all hover:shadow-lg hover:scale-105"
                    aria-label={`Proceed to ${activeScene.title} details`}
                  >
                    <span>Proceed</span>
                    <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                  </Link>
                </div>

              </div>

            </div>
          </BentoTilt>
        </div>

      </div>
    </section>
  );
};

export default JusticeJourneySection;
