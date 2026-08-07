/**
 * NyayaSetu — How It Works Section (Courtroom Theme)
 * Updates:
 *  - Step cards wrapped in BentoTilt for 3D perspective mouse hover interaction.
 *  - GSAP ScrollTrigger entrance animations.
 */

import { useRef } from 'react';
import { useScrollAnimation } from '@/animations/useScrollAnimation';
import { gsap } from '@/animations/gsap-config';
import { TiLocationArrow } from 'react-icons/ti';
import BentoTilt from '@/components/common/BentoTilt';

const STEPS = [
  {
    number: '01',
    title:  'Tell Us What Happened',
    desc:   'Describe your situation in plain language — no legal jargon required. Our system understands everyday Indian situations.',
    icon:   '✍️',
    detail: 'Consumer issue · Banking fraud · Workplace dispute · Property matter · Cyber crime · Travel complaint',
  },
  {
    number: '02',
    title:  'Understand Your Rights',
    desc:   'We retrieve verified legal information — your rights, applicable laws, relevant government authorities, and clear options.',
    icon:   '⚖️',
    detail: 'Source-backed · Jurisdiction-aware · In plain Hindi & English · AI-explained, lawyer-verified',
  },
  {
    number: '03',
    title:  'Take the Right Action',
    desc:   'Follow a clear step-by-step action plan. Save your case, track progress, upload documents, or consult a verified lawyer.',
    icon:   '🎯',
    detail: 'Step-by-step guide · Document checklist · Case tracking · Lawyer consultation',
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef(null);

  useScrollAnimation(sectionRef, () => {
    // Header Entrance Animation
    gsap.fromTo(
      '.hiw-header-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.hiw-header',
          start: 'top 90%',
        },
      }
    );

    // Step Cards Entrance
    gsap.fromTo(
      '.hiw-step',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hiw-steps-grid',
          start: 'top 90%',
        },
      }
    );

    // Connector Line Growth
    gsap.fromTo(
      '.hiw-connector',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '.hiw-steps-grid',
          start: 'top 85%',
        },
      }
    );
  });

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-ct-void py-12 md:py-16 border-t border-ct-gold/10 relative">
      <div className="section-container">

        {/* Header */}
        <div className="hiw-header mb-10 flex flex-col items-center text-center">
          <div className="hiw-header-item mb-3 flex items-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">How NyayaSetu Works</span>
            <div className="gold-divider-sm" />
          </div>

          <h2 className="hiw-header-item font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Your Legal Journey, <span className="text-ct-gold italic">Simplified in 3 Steps</span>
          </h2>

          <p className="hiw-header-item mt-3 max-w-xl font-inter text-sm sm:text-base text-ct-muted leading-relaxed">
            From confusion to clarity — NyayaSetu walks you through your legal situation so you know exactly where you stand and what to do next.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="hiw-steps-grid relative grid gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div
            className="hiw-connector absolute left-1/3 right-1/3 top-12 hidden h-0.5 bg-gradient-to-r from-ct-gold/50 to-ct-gold/50 md:block origin-left"
          />

          {STEPS.map((step, i) => (
            <BentoTilt key={step.number} className="hiw-step h-full" tiltAmount={7}>
              <div className="court-card-surface p-7 relative group h-full flex flex-col justify-between">
                <div>
                  {/* Step number */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-court-gold text-ct-void font-zentry text-xs font-black shadow-gold-glow">
                      {step.number}
                    </div>
                    <span className="text-2xl" role="img" aria-label={step.title}>{step.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-cormorant text-xl sm:text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-soft transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-3 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div>
                  {/* Detail tags */}
                  <div className="gold-divider mb-3" />
                  <p className="font-general text-[9px] uppercase tracking-widest text-ct-gold/80">
                    {step.detail}
                  </p>
                </div>

                {/* Arrow connector hint */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block z-10">
                    <TiLocationArrow className="text-ct-gold text-xl -rotate-45" />
                  </div>
                )}
              </div>
            </BentoTilt>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
