/**
 * NyayaSetu — Trust Section (Courtroom Theme)
 * Updates:
 *  - 100% Transparent Sticker-Style 3D Lawyer Character.
 *  - Added "Consult a Lawyer" CTA button right below the lawyer sticker image (per user request).
 *  - Perfect alignment & GSAP motion.
 */

import { useRef } from 'react';
import { useScrollAnimation } from '@/animations/useScrollAnimation';
import { gsap } from '@/animations/gsap-config';
import { HiShieldCheck, HiInformationCircle } from 'react-icons/hi';
import { MdOutlineGavel, MdOutlineSmartToy } from 'react-icons/md';
import { TiLocationArrow } from 'react-icons/ti';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';

const INFO_TYPES = [
  {
    icon:    <HiInformationCircle size={22} />,
    label:   'Verified Legal Information',
    color:   '#FE7F2D',
    desc:    'Official Acts of Parliament, notifications, and statutory legal databases.',
  },
  {
    icon:    <MdOutlineSmartToy size={22} />,
    label:   'AI-Generated Explanation',
    color:   '#5724ff',
    desc:    'Plain-language summaries strictly grounded in verified Indian legislation.',
  },
  {
    icon:    <MdOutlineGavel size={22} />,
    label:   'Lawyer Advice',
    color:   '#FE7F2D',
    desc:    '1-on-1 consultations with Bar Council enrolled advocates.',
  },
];

const TRUST_POINTS = [
  { icon: '📚', text: 'Information sourced from official Indian legislation and government portals' },
  { icon: '🔍', text: 'AI explanations are grounded — it cannot invent laws, sections, or court procedures' },
  { icon: '⚖️', text: 'Lawyers are manually verified and licensed with the Bar Council of India' },
  { icon: '🔒', text: 'Your case data and documents are private — never shared without your consent' },
  { icon: '🇮🇳', text: 'Jurisdiction-aware — information is specific to Indian law and state variations' },
  { icon: '✅', text: 'Free to use — legal information should be accessible to every Indian' },
];

const TrustSection = () => {
  const sectionRef = useRef(null);

  useScrollAnimation(sectionRef, () => {
    // Info Types Entrance
    gsap.fromTo(
      '.trust-type-card',
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.trust-types-grid',
          start: 'top 85%',
        },
      }
    );

    // Transparent Sticker Lawyer Mascot Entrance + Float
    gsap.fromTo(
      '.trust-lawyer-sticker',
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.trust-lawyer-sticker',
          start: 'top 85%',
        },
      }
    );

    // Subtle Continuous Floating Motion for Sticker
    gsap.to('.trust-lawyer-sticker img', {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Trust Points Entrance
    gsap.fromTo(
      '.trust-point',
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.trust-points-list',
          start: 'top 85%',
        },
      }
    );
  });

  return (
    <section ref={sectionRef} id="trust" className="bg-ct-void py-12 md:py-16 border-t border-ct-gold/10 relative">
      <div className="section-container">

        {/* Disclaimer Banner */}
        <div className="mb-14 rounded-2xl border border-ct-gold/30 bg-ct-gold/5 p-6 flex items-start gap-4 shadow-court-card">
          <HiShieldCheck className="flex-shrink-0 text-ct-gold mt-0.5" size={26} />
          <div>
            <p className="font-calluna text-xl font-bold text-ct-ivory mb-1">
              NyayaSetu provides Legal Information — not Legal Advice
            </p>
            <p className="font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
              Statutory rights guidance under Indian legislation. For court proceedings, consult a verified advocate.
            </p>
          </div>
        </div>

        {/* Two-Column Grid Perfectly Aligned */}
        <div className="grid gap-12 lg:grid-cols-2 items-start">

          {/* Left Column: Content Transparency + Aligned Transparent Sticker Lawyer + Consult Button */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="gold-divider-sm" />
                <span className="label-text">Content Transparency</span>
              </div>
              <h2 className="mb-6 font-calluna text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
                We Always Tell You Where Information Comes From
              </h2>

              <div className="trust-types-grid flex flex-col gap-3.5 mb-6">
                {INFO_TYPES.map((type) => (
                  <div
                    key={type.label}
                    className="trust-type-card court-card-surface p-4 flex items-start gap-4"
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${type.color}22`, color: type.color }}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <span className="inline-block mb-1 font-inter text-[10px] uppercase tracking-widest text-ct-gold font-bold">
                        {type.label}
                      </span>
                      <p className="font-inter text-xs text-ct-muted leading-relaxed">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent Sticker-Style 3D Lawyer Illustration + Consult a Lawyer Button */}
            <div className="trust-lawyer-sticker flex flex-col items-center justify-center pt-2 pb-4">
              <img
                src="/img/lawyer/lawyer-mascot.png"
                alt="NyayaSetu Sticker Lawyer Character"
                className="h-64 sm:h-72 w-auto object-contain filter drop-shadow-[0_12px_25px_rgba(35,61,77,0.4)] transition-transform duration-300 hover:scale-105 pointer-events-none"
              />

              {/* Consult a Lawyer Button Right Below Sticker */}
              <div className="mt-3">
                <Button
                  id="trust-consult-lawyer-btn"
                  title="Consult a Lawyer"
                  rightIcon={<TiLocationArrow />}
                  variant="gold"
                  asLink
                  to={ROUTES.LAWYERS}
                  containerClass="py-2.5 px-6 text-xs flex items-center gap-2 shadow-gold-glow"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Commitments & Authoritative Sources */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="gold-divider-sm" />
              <span className="label-text">Our Commitments</span>
            </div>
            <h2 className="mb-6 font-calluna text-3xl sm:text-4xl font-bold text-ct-ivory leading-tight">
              Built on Trust, Designed for Every Indian
            </h2>

            <div className="trust-points-list flex flex-col gap-4 mb-8">
              {TRUST_POINTS.map((point, i) => (
                <div key={i} className="trust-point flex items-start gap-4">
                  <span className="flex-shrink-0 text-xl mt-0.5" role="img" aria-hidden>{point.icon}</span>
                  <p className="font-inter text-xs sm:text-sm text-ct-ivory/90 leading-relaxed">{point.text}</p>
                </div>
              ))}
            </div>

            {/* Authoritative Source List */}
            <div className="rounded-2xl border border-ct-gold/20 bg-ct-card p-6 shadow-court-card">
              <p className="mb-3 label-text text-ct-gold">Authoritative Sources Used</p>
              <div className="flex flex-wrap gap-2">
                {['IndiaCode.gov.in', 'eCourts.gov.in', 'MCA.gov.in', 'RBI.org.in', 'SEBI.gov.in', 'Consumer Forum', 'Bar Council'].map((src) => (
                  <span key={src} className="rounded-full border border-ct-gold/20 bg-ct-deep px-3.5 py-1.5 font-inter text-[9px] uppercase tracking-widest text-ct-ivory/90">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustSection;
