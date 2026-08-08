/**
 * NyayaSetu — HeroSection Component
 * Direct AI Integration:
 *  - Submitting any problem statement redirects straight to the AI Copilot & Resources Page (`/resources`).
 *  - Automatically triggers Llama-3 70B AI legal assessment for the user's prompt.
 */

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import { MdBalance, MdOutlinePersonSearch, MdOutlineSmartToy } from 'react-icons/md';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';
import { useReducedMotion } from '@/animations/useReducedMotion';

const PLACEHOLDER_PROBLEMS = [
  'My landlord is refusing to return my security deposit…',
  'Unauthorized UPI transaction from my bank account…',
  'Employer has not paid salary for 2 months…',
  'Online order arrived damaged, company refusing refund…',
  'Flight cancelled without compensation or refund…',
  'Received a legal notice and need guidance…',
];

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
    }, 3800);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = problemText.trim() || PLACEHOLDER_PROBLEMS[placeholderIdx];
    navigate(ROUTES.RESOURCES, { state: { initialPrompt: query } });
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ct-void">

      {/* Poster Style Night Court Background */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-right md:bg-right-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('/img/hero/supreme-court-night.png')`,
        }}
      />

      {/* Horizontal Dark Overlay Blend */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, #08090C 0%, #08090C 35%, rgba(8,9,12,0.85) 55%, rgba(8,9,12,0.4) 75%, rgba(8,9,12,0.1) 100%)`,
        }}
      />

      {/* Subtle Golden Glow behind left text */}
      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-ct-gold/5 blur-3xl pointer-events-none" />

      {/* Top Navbar Gradient */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-ct-void/80 via-ct-void/40 to-transparent pointer-events-none z-10" />

      {/* Bottom Gradient Blend into #08090C */}
      <div className="absolute bottom-0 inset-x-0 h-36 md:h-52 bg-gradient-to-t from-ct-void via-ct-void/80 to-transparent pointer-events-none z-10" />

      {/* Hero Content */}
      <div className="section-container relative z-20 flex min-h-screen flex-col justify-center pt-28 pb-16">
        <div className="max-w-xl md:max-w-2xl">

          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-0.5 w-10 rounded-full bg-ct-gold" />
            <span className="font-general text-xs font-semibold uppercase tracking-[0.2em] text-ct-gold">
              NYAYASETU AI LEGAL COPILOT
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-ct-ivory leading-[0.95] mb-4">
            Justice. <br />
            <span className="text-ct-gold italic">Simplified.</span>
          </h1>

          {/* Description */}
          <p className="font-inter text-base sm:text-lg text-ct-ivory/90 leading-relaxed max-w-lg mb-8">
            Describe your problem in plain language. Our AI Legal Engine analyzes statutory rights, categorizes your case, & recommends verified advocates.
          </p>

          {/* AI Problem Input Box */}
          <form onSubmit={handleSubmit} className="relative max-w-lg">
            <div
              className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300
                ${isTyping
                  ? 'border-ct-gold shadow-gold-glow bg-ct-card/95'
                  : 'border-ct-gold/40 bg-ct-card/85 backdrop-blur-md hover:border-ct-gold/70'
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
                rows={3}
                placeholder={`Tell us what happened… e.g. "${PLACEHOLDER_PROBLEMS[placeholderIdx]}"`}
                className="w-full resize-none bg-transparent px-5 pt-5 pb-3 font-inter text-sm text-ct-ivory placeholder:text-ct-muted/70 focus:outline-none"
                aria-label="Tell us what happened"
              />

              {/* Input Footer CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pb-4 border-t border-ct-gold/10 pt-3">
                <span className="font-general text-[10px] uppercase tracking-widest text-ct-gold flex items-center gap-1.5 font-bold">
                  <MdOutlineSmartToy size={16} className="text-ct-gold" />
                  <span>Powered by Groq Llama-3 AI Engine</span>
                </span>

                <button
                  type="submit"
                  id="hero-submit-btn"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-5 py-2.5 font-general text-xs uppercase tracking-widest text-ct-void font-bold transition-all duration-300 hover:shadow-gold-glow hover:scale-105 shrink-0"
                  aria-label="Ask AI Assistant"
                >
                  <span>Ask AI Assistant ✨</span>
                  <TiLocationArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-5 flex flex-wrap items-center gap-6 text-xs text-ct-ivory/80">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-ct-gold" />
              <span>Instant AI Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-ct-gold" />
              <span>Statutory Rights Guidance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-ct-gold" />
              <span>100% Private & Confidential</span>
            </div>
          </div>

          {/* Secondary CTAs + eCourts Card */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button
              id="hero-consult-lawyer"
              title="Consult a Lawyer"
              leftIcon={<MdOutlinePersonSearch size={16} />}
              variant="gold"
              asLink
              to={ROUTES.LAWYERS}
              containerClass="flex items-center gap-2 py-3 px-6"
            />

            {/* Official eCourts Case Tracking Card */}
            <a
              id="hero-track-case"
              href="https://services.ecourts.gov.in/ecourtindia_v6/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-ct-gold/30 bg-ct-card/60 backdrop-blur-md px-5 py-2.5 transition-all duration-300 hover:border-ct-gold/60 hover:bg-ct-card/90"
              aria-label="Track Court Case — eCourts Portal"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ct-gold/10 text-ct-gold">
                <MdBalance size={18} />
              </div>
              <div className="text-left">
                <p className="font-inter text-xs font-semibold text-ct-ivory group-hover:text-ct-gold transition-colors">
                  Track Your Case
                </p>
                <p className="font-general text-[9px] uppercase tracking-wider text-ct-muted">
                  Official eCourts Portal ↗
                </p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
