/**
 * NyayaSetu — Popular Legal Guides Section
 * BentoTilt cards with popular problems + category discovery.
 */
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/animations/useScrollAnimation';
import { gsap } from '@/animations/gsap-config';
import { BentoTilt } from '@/components/common/BentoTilt';
import AnimatedTitle from '@/components/common/AnimatedTitle';
import Button from '@/components/common/Button';
import { ROUTES, buildRoute } from '@/constants/routes';
import { POPULAR_PROBLEMS } from '@/data/mockLawyers';
import { LEGAL_CATEGORIES } from '@/constants/legalCategories';
import { TiLocationArrow } from 'react-icons/ti';
import { HiArrowRight } from 'react-icons/hi';

const PopularGuidesSection = () => {
  const sectionRef = useRef(null);
  const navigate   = useNavigate();

  useScrollAnimation(sectionRef, () => {
    gsap.from('.guide-card', {
      opacity:  0,
      y:        40,
      stagger:  0.1,
      ease:     'power2.out',
      duration: 0.6,
      scrollTrigger: {
        trigger: '.guides-grid',
        start:   '100px bottom',
      },
    });
  });

  const handleProblemClick = (problem) => {
    navigate(`${ROUTES.KNOW_YOUR_RIGHTS}?q=${encodeURIComponent(problem)}`);
  };

  return (
    <section ref={sectionRef} id="guides" className="bg-ct-void section-padding">
      <div className="section-container">

        {/* Header */}
        <div className="mb-16 flex flex-col items-start">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text text-ct-gold font-bold">Popular Legal Questions</span>
          </div>
          <AnimatedTitle
            title="What Others Are<br />Asking <b>Today</b>"
            containerClass="!text-ct-ivory !text-left !items-start !px-0 !text-5xl md:!text-6xl"
          />
          <p className="mt-6 max-w-lg font-inter text-base text-ct-ivory/80 leading-relaxed">
            Real legal questions from across India — click any to see your rights and options instantly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Popular problems — left 2 cols */}
          <div className="guides-grid flex flex-col gap-4 lg:col-span-2">
            {POPULAR_PROBLEMS.map((item) => (
              <BentoTilt
                key={item.id}
                className="guide-card cursor-pointer"
              >
                <button
                  onClick={() => handleProblemClick(item.problem)}
                  className="w-full text-left glass-card p-5 hover:border-ct-gold/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-court-hover group"
                  aria-label={`Know my rights: ${item.problem}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-2xl flex-shrink-0" role="img" aria-hidden>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm text-ct-ivory leading-relaxed group-hover:text-ct-gold transition-colors">
                        {item.problem}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="info-tag-legal">{item.categoryLabel}</span>
                        <span className="font-general text-[10px] uppercase tracking-widest text-ct-muted">
                          {item.searches} searches
                        </span>
                      </div>
                    </div>
                    <HiArrowRight className="flex-shrink-0 text-ct-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mt-1" />
                  </div>
                </button>
              </BentoTilt>
            ))}

            <Button
              id="guides-see-all"
              title="Browse All Legal Guides"
              rightIcon={<TiLocationArrow />}
              variant="outline"
              asLink
              to={ROUTES.CATEGORIES}
              containerClass="mt-2 flex items-center gap-1"
            />
          </div>

          {/* Categories sidebar — right 1 col */}
          <div className="flex flex-col gap-4">
            <h3 className="font-cormorant text-xl font-bold text-ct-ivory">
              Browse by Category
            </h3>

            <div className="flex flex-col gap-2">
              {LEGAL_CATEGORIES.map((cat) => (
                <BentoTilt key={cat.id} className="guide-card">
                  <button
                    onClick={() => navigate(buildRoute(ROUTES.CATEGORY, { slug: cat.slug }))}
                    className="w-full text-left flex items-center gap-3 rounded-xl border border-[#EAECF0]/15 bg-ct-card/60 px-4 py-3 hover:border-ct-gold/50 hover:bg-ct-card transition-all duration-200 group"
                    aria-label={`Explore ${cat.label}`}
                  >
                    <span className="text-lg flex-shrink-0" role="img" aria-hidden>{cat.icon}</span>
                    <span className="flex-1 font-inter text-sm text-ct-ivory/80 group-hover:text-ct-ivory transition-colors">
                      {cat.label}
                    </span>
                    <div
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                  </button>
                </BentoTilt>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularGuidesSection;
