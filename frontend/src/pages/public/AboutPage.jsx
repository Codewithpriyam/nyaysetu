/**
 * NyayaSetu — About Developer & Platform Page
 * Information on the vision, technical engineering, and Indian legal access mission.
 */

import BentoTilt from '@/components/common/BentoTilt';
import { HiCode, HiShieldCheck, HiSparkles, HiHeart, HiAcademicCap } from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
            ABOUT THE DEVELOPER & PLATFORM
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight mt-2">
            Engineering Legal Empowerment <span className="text-ct-gold italic">For 1.4 Billion Indians</span>
          </h1>
          <p className="mt-3 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
            NyayaSetu was designed and engineered to bridge the gap between Indian citizens and statutory legal remedies using modern WebTech, Spring Boot enterprise microservices, and AI intelligence.
          </p>
        </div>

        <BentoTilt className="mb-10" tiltAmount={3}>
          <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40 shadow-court-hover">
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-ct-gold/50 bg-ct-gold/20 font-zentry text-2xl font-black text-ct-gold shadow-gold-glow">
                NS
              </div>
              <div>
                <h2 className="font-cormorant text-3xl font-bold text-ct-ivory">NyayaSetu Engineering Team</h2>
                <p className="font-inter text-xs text-ct-gold font-bold mt-0.5">Full Stack LegalTech Architecture & Design</p>
                <div className="flex items-center gap-4 mt-2 font-general text-[10px] uppercase text-ct-muted">
                  <span>🚀 Developed with React + Vite</span>
                  <span>⚡ Spring Boot + MySQL Backend</span>
                  <span>🤖 Groq Llama-3 AI</span>
                </div>
              </div>
            </div>

            <p className="font-inter text-xs sm:text-sm text-ct-ivory/80 leading-relaxed mb-6">
              NyayaSetu (न्यायसेतु — "Bridge to Justice") was built to transform legal access across Tier-1, Tier-2, and rural India. By combining 25,400+ verified Bar Council advocate records, per-minute direct UPI consultation payments, automated case timeline tracking, and Groq Llama-3 AI legal copilot guidance, NyayaSetu ensures that every citizen understands their statutory rights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-ct-gold/15">
              <div className="rounded-xl border border-ct-gold/20 bg-ct-deep p-4 text-center">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Advocate Database</span>
                <span className="font-zentry text-2xl font-black text-ct-gold mt-1 block">25,409 Records</span>
              </div>
              <div className="rounded-xl border border-ct-gold/20 bg-ct-deep p-4 text-center">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">Database Engine</span>
                <span className="font-zentry text-2xl font-black text-emerald-400 mt-1 block">MySQL + Flyway</span>
              </div>
              <div className="rounded-xl border border-ct-gold/20 bg-ct-deep p-4 text-center">
                <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted block">AI Model</span>
                <span className="font-zentry text-2xl font-black text-ct-ivory mt-1 block">Groq 70B</span>
              </div>
            </div>
          </div>
        </BentoTilt>

      </div>
    </div>
  );
};

export default AboutPage;
