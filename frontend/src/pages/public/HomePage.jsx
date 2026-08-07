/**
 * NyayaSetu — HomePage
 * Section Flow:
 *  1. HeroSection (Supreme Court Night Poster Art Background)
 *  2. CategoryJourneySection (Pinned 3-Set GSAP Discovery)
 *  3. HowItWorksSection (3-Step Process)
 *  4. JusticeJourneySection (8 Interactive Legal Scenes)
 *  5. TrustSection (Content Transparency & Standalone Sticker Lawyer)
 *  6. ConsultLawyerSection (2 Verified Lawyer Profiles)
 *  7. PopularGuidesSection (Curated Legal Guides)
 */

import HeroSection            from '@/sections/home/HeroSection';
import CategoryJourneySection from '@/sections/home/CategoryJourneySection';
import HowItWorksSection      from '@/sections/home/HowItWorksSection';
import JusticeJourneySection  from '@/sections/home/JusticeJourneySection';
import TrustSection           from '@/sections/home/TrustSection';
import ConsultLawyerSection   from '@/sections/home/ConsultLawyerSection';
import PopularGuidesSection   from '@/sections/home/PopularGuidesSection';

const HomePage = () => {
  return (
    <main className="w-full overflow-hidden bg-ct-void">
      <HeroSection />
      <CategoryJourneySection />
      <HowItWorksSection />
      <JusticeJourneySection />
      <TrustSection />
      <ConsultLawyerSection />
      <PopularGuidesSection />
    </main>
  );
};

export default HomePage;
