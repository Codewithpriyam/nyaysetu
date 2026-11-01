/**
 * NyayaSetu — HeroSection Component
 * Refined, Minimal & Cinematic Homepage Hero:
 *  - Screen width utilization: 94-96% container aligned with wider navbar.
 *  - Reduced top padding: starts immediately below the floating navbar for instant 1440x900 viewport visibility.
 *  - Compact AI Assistant input box (~18% height reduction, tighter padding, clean search panel feel).
 *  - Large Lady Justice Floyd-Steinberg DitherVeil visual balanced vertically with hero heading and input.
 */

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBalance, MdOutlinePersonSearch } from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import Button from '@/components/common/Button';
import DitherVeil from './DitherVeil';
import { ROUTES } from '@/constants/routes';
import { useReducedMotion } from '@/animations/useReducedMotion';

const PLACEHOLDER_PROBLEMS = [
  'Describe your legal issue...',
  'My landlord is refusing to return my security deposit…',
  'Unauthorized UPI transaction from my bank account…',
  'Employer has not paid salary for 2 months…',
  'Online order arrived damaged, company refusing refund…',
  'Flight cancelled without compensation or refund…',
  'Received a legal notice and need guidance…',
];

const LADY_JUSTICE_SRC = 'https://static.vecteezy.com/system/resources/previews/078/456/819/non_2x/lady-justice-bronze-statue-holding-scales-and-sword-with-blindfold-free-png.png';

const HeroSection = () => {
  const [problemText, setProblemText]       = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isTyping, setIsTyping]             = useState(false);
  const inputRef                            = useRef(null);
  const prefersReduced                      = useReducedMotion();
  const navigate                            = useNavigate();

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_PROBLEMS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = problemText.trim() || (placeholderIdx === 0 ? '' : PLACEHOLDER_PROBLEMS[placeholderIdx]);
    navigate(ROUTES.RESOURCES, { state: { initialPrompt: query } });
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden bg-black text-light-gray flex flex-col justify-start pt-20 sm:pt-22 lg:pt-24 pb-8 sm:pb-12">

      {/* Ambient Radial Deep Blue & Subtle Warm Glows */}
      <div className="absolute top-1/4 left-1/4 h-[480px] w-[480px] rounded-full bg-deep-blue/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-[420px] w-[420px] rounded-full bg-orange/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar Clearance Blend */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* Bottom Gradient Blend into Next Section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* Main Wide Hero Container (94-96% of available desktop width) */}
      <div className="relative z-20 w-[95%] max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center">

          {/* Left Column: Eyebrow, Simplified Headline, Concise Description, Compact Input, CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">

            {/* Eyebrow */}
            <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
              <span className="font-inter text-xs sm:text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                NYAYASETU · AI LEGAL ASSISTANCE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-torkias text-4xl sm:text-6xl lg:text-[4.25rem] xl:text-[5rem] 2xl:text-[5.5rem] font-bold tracking-tight text-light-gray leading-[0.94] mb-3 sm:mb-3.5">
              Justice, <br />
              <span className="text-orange">Simplified.</span>
            </h1>

            {/* Concise Description */}
            <p className="font-inter text-sm sm:text-base lg:text-lg text-light-gray/80 font-normal leading-relaxed max-w-xl mb-4 sm:mb-5">
              Understand your rights. Find the right advocate. Take the next step.
            </p>

            {/* Compact Liquid Glass AI Legal Input Box (~18% more compact) */}
            <form onSubmit={handleSubmit} className="relative w-full max-w-xl xl:max-w-2xl">
              <div
                className={`
                  relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl
                  ${isTyping
                    ? 'border-orange/60 bg-black/85 shadow-[0_0_30px_rgba(254,127,45,0.22)]'
                    : 'border-deep-blue/80 bg-black/60 hover:border-orange/40 hover:bg-black/75'
                  }
                `}
              >
                <textarea
                  ref={inputRef}
                  id="hero-problem-input"
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  rows={2}
                  placeholder={placeholderIdx === 0 ? 'Describe your legal issue...' : `Describe your legal issue... e.g. "${PLACEHOLDER_PROBLEMS[placeholderIdx]}"`}
                  className="w-full resize-none bg-transparent px-4 sm:px-5 pt-3.5 pb-2 font-inter text-sm text-light-gray placeholder:text-light-gray/40 focus:outline-none"
                  aria-label="Describe your legal issue"
                />

                {/* Compact Input Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-2.5 border-t border-deep-blue/60">
                  {/* Single concise feature line */}
                  <span className="font-inter text-[10px] sm:text-[11px] text-light-gray/50 tracking-wide font-medium">
                    AI Legal Guidance · Advocate Discovery · Case Management
                  </span>

                  <button
                    type="submit"
                    id="hero-submit-btn"
                    className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange px-4 py-2 font-inter text-xs font-bold text-black uppercase tracking-wider transition-all duration-300 hover:bg-orange/90 hover:shadow-md hover:shadow-orange/20 shrink-0 cursor-pointer"
                    aria-label="Ask AI Assistant"
                  >
                    <span>Ask AI Assistant →</span>
                    <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Secondary CTAs + Official eCourts Link */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3.5">
              <Button
                id="hero-consult-lawyer"
                title="Consult a Lawyer"
                leftIcon={<MdOutlinePersonSearch size={15} />}
                variant="gold"
                asLink
                to={ROUTES.LAWYERS}
                containerClass="flex items-center gap-2 py-2.5 px-5 !bg-orange !text-black hover:!bg-orange/90 font-bold transition-all text-xs shadow-md shadow-orange/15"
              />

              {/* Official eCourts Case Tracking Card */}
              <a
                id="hero-track-case"
                href="https://services.ecourts.gov.in/ecourtindia_v6/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-2xl border border-deep-blue/80 bg-black/60 px-4 py-2 transition-all duration-300 hover:border-orange/50 hover:bg-deep-blue/20"
                aria-label="Track Court Case — eCourts Portal"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange/10 text-orange border border-orange/20">
                  <MdBalance size={15} />
                </div>
                <div className="text-left">
                  <p className="font-inter text-xs font-semibold text-light-gray group-hover:text-orange transition-colors">
                    Track Your Case
                  </p>
                  <p className="font-inter text-[8px] uppercase tracking-wider text-light-gray/50">
                    Official eCourts Portal ↗
                  </p>
                </div>
              </a>
            </div>

            {/* Mobile/Tablet Only: Lady Justice rendered neatly below the content */}
            <div className="block lg:hidden mt-8 w-full max-w-sm sm:max-w-md mx-auto h-[420px] sm:h-[480px] relative pointer-events-auto">
              <DitherVeil
                src={LADY_JUSTICE_SRC}
                pattern="floyd"
                pixelSize={2}
                inkColor="#120f17"
                paperColor="#f4f1ea"
                revealRadius={200}
                softness={0.6}
                linger={1}
              />
            </div>

          </div>

          {/* Right Column (Desktop): Large, Prominent Lady Justice Visual Vertically Aligned */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative select-none">
            <div className="w-full h-[540px] xl:h-[620px] 2xl:h-[700px] relative flex items-center justify-center pointer-events-auto">
              <DitherVeil
                src={LADY_JUSTICE_SRC}
                pattern="floyd"
                pixelSize={2}
                inkColor="#120f17"
                paperColor="#f4f1ea"
                revealRadius={220}
                softness={0.6}
                linger={1}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
