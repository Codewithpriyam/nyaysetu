/**
 * NyayaSetu — Consult a Lawyer Section (Courtroom Theme)
 * Updates:
 *  - 2 verified lawyer profile cards wrapped in BentoTilt for 3D mouse tilt response.
 *  - GSAP ScrollTrigger entrance animations.
 */

import { useRef } from 'react';
import { useScrollAnimation } from '@/animations/useScrollAnimation';
import { gsap } from '@/animations/gsap-config';
import Button from '@/components/common/Button';
import { ROUTES, buildRoute } from '@/constants/routes';
import { MOCK_LAWYERS } from '@/data/mockLawyers';
import { TiLocationArrow } from 'react-icons/ti';
import { HiStar, HiCheckCircle } from 'react-icons/hi';
import { formatCurrency, initials } from '@/utils';
import BentoTilt from '@/components/common/BentoTilt';

const LawyerAvatar = ({ lawyer }) => (
  <div
    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-ct-gold/40 font-zentry text-xl font-black text-ct-gold shadow-gold-glow"
    style={{ background: `linear-gradient(135deg, ${lawyer.accentColor}22, ${lawyer.accentColor}44)` }}
    aria-hidden
  >
    {initials(lawyer.name.replace('Adv. ', ''))}
  </div>
);

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1.5 bg-ct-gold/10 px-2.5 py-1 rounded-full border border-ct-gold/20">
    <HiStar className="text-ct-gold" size={14} />
    <span className="font-inter text-xs font-bold text-ct-ivory">{rating}</span>
  </div>
);

const ConsultLawyerSection = () => {
  const sectionRef = useRef(null);

  const featuredLawyers = MOCK_LAWYERS.filter((l) => l.verified).slice(0, 2);

  useScrollAnimation(sectionRef, () => {
    gsap.fromTo(
      '.lawyer-header-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.lawyer-header',
          start: 'top 90%',
        },
      }
    );

    gsap.fromTo(
      '.lawyer-profile-card',
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.lawyers-grid-2',
          start: 'top 90%',
        },
      }
    );
  });

  return (
    <section ref={sectionRef} id="consult-lawyer" className="bg-ct-void py-12 md:py-16 border-t border-ct-gold/10 relative">
      <div className="section-container">

        {/* Header */}
        <div className="lawyer-header mb-10 flex flex-col items-center text-center">
          <div className="lawyer-header-item mb-3 flex items-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">NEED PROFESSIONAL ADVICE?</span>
            <div className="gold-divider-sm" />
          </div>

          <h2 className="lawyer-header-item font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight max-w-2xl">
            Talk To A <span className="text-ct-gold italic">Verified Lawyer</span>
          </h2>

          <p className="lawyer-header-item mt-3 max-w-xl font-inter text-sm sm:text-base text-ct-muted leading-relaxed">
            Get one-to-one legal consultation from verified lawyers based on specialization, experience, and availability.
          </p>
        </div>

        {/* 2 Lawyer Profile Cards Grid */}
        <div className="lawyers-grid-2 grid gap-8 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto mb-8">
          {featuredLawyers.map((lawyer) => (
            <BentoTilt key={lawyer.id} className="lawyer-profile-card h-full" tiltAmount={7}>
              <div className="court-card-surface flex flex-col justify-between p-7 relative group h-full">
                <div>
                  {/* Header Row */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <LawyerAvatar lawyer={lawyer} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-soft transition-colors">
                            {lawyer.name}
                          </h3>
                          <HiCheckCircle className="text-emerald-400 flex-shrink-0" size={16} title="Verified Bar Council" />
                        </div>
                        <p className="font-inter text-xs text-ct-gold font-medium mt-0.5">
                          {lawyer.specializations.join(' · ')}
                        </p>
                        <p className="font-general text-[9px] uppercase tracking-wider text-ct-muted mt-1">
                          {lawyer.location} · {lawyer.experience} Years Exp.
                        </p>
                      </div>
                    </div>

                    <RatingStars rating={lawyer.rating} />
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
                      {formatCurrency(lawyer.ratePerMinute)}
                      <span className="font-inter text-xs font-normal text-ct-muted">/min</span>
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
                    title="Consult Now"
                    rightIcon={<TiLocationArrow />}
                    variant="gold"
                    asLink
                    to={buildRoute(ROUTES.LAWYER_PROFILE, { id: lawyer.slug })}
                    containerClass="py-2.5 px-5 text-xs flex items-center gap-1.5"
                  />
                </div>
              </div>
            </BentoTilt>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            id="consult-see-all-lawyers"
            title="Browse All Verified Lawyers"
            rightIcon={<TiLocationArrow />}
            variant="outline"
            asLink
            to={ROUTES.LAWYERS}
            containerClass="flex items-center gap-2 py-3 px-8 text-xs"
          />
        </div>

      </div>
    </section>
  );
};

export default ConsultLawyerSection;
