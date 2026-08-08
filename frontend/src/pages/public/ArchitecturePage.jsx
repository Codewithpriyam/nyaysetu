/**
 * NyayaSetu — System Architecture Page
 * Full technical breakdown of frontend, backend, security, database DDL, and AI integration.
 */

import BentoTilt from '@/components/common/BentoTilt';
import { HiCode, HiDatabase, HiShieldCheck, HiSparkles, HiLightningBolt } from 'react-icons/hi';

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">

        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
            TECHNICAL ARCHITECTURE & SPECIFICATIONS
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight mt-2">
            System Architecture <span className="text-ct-gold italic">& Infrastructure</span>
          </h1>
          <p className="mt-3 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
            Production-grade multi-tier architecture featuring Spring Boot 3.3, MySQL Flyway migrations, Clerk OAuth2 JWT authentication, and Groq Llama-3 70B AI pipeline.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-10">
          <BentoTilt tiltAmount={3}>
            <div className="court-card-surface p-7 border border-ct-gold/30 h-full">
              <div className="flex items-center gap-3 mb-3">
                <HiCode className="text-ct-gold" size={24} />
                <h2 className="font-cormorant text-2xl font-bold text-ct-ivory">Frontend Architecture</h2>
              </div>
              <ul className="font-inter text-xs text-ct-ivory/80 space-y-2 leading-relaxed">
                <li>• <strong>Framework:</strong> React 18 + Vite 5 + TailwindCSS</li>
                <li>• <strong>Animations:</strong> GSAP 3.12 micro-interactions & Smooth Scroll</li>
                <li>• <strong>Auth Integration:</strong> Official Clerk React SDK (`@clerk/clerk-react`)</li>
                <li>• <strong>HTTP Client:</strong> Axios with Bearer JWT interceptor injection</li>
                <li>• <strong>Performance:</strong> Code splitting with React Lazy & Suspense</li>
              </ul>
            </div>
          </BentoTilt>

          <BentoTilt tiltAmount={3}>
            <div className="court-card-surface p-7 border border-ct-gold/30 h-full">
              <div className="flex items-center gap-3 mb-3">
                <HiDatabase className="text-ct-gold" size={24} />
                <h2 className="font-cormorant text-2xl font-bold text-ct-ivory">Backend & Database</h2>
              </div>
              <ul className="font-inter text-xs text-ct-ivory/80 space-y-2 leading-relaxed">
                <li>• <strong>Backend:</strong> Java 17 + Spring Boot 3.3.0 REST API</li>
                <li>• <strong>Database:</strong> MySQL 8.0 on `localhost:3306`</li>
                <li>• <strong>Migrations:</strong> Flyway DDL versioning (`V1` to `V4`)</li>
                <li>• <strong>ORM:</strong> Spring Data JPA with Object-Level Security Query Filters</li>
                <li>• <strong>Security:</strong> Spring Security Resource Server with JWKS verification</li>
              </ul>
            </div>
          </BentoTilt>
        </div>

      </div>
    </div>
  );
};

export default ArchitecturePage;
