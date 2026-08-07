/**
 * NyayaSetu — CategoryJourneySection Component
 * Fixes for layout & spacing:
 *  - Reduced excessive section height & bottom padding to eliminate huge empty vertical gaps.
 *  - Tight alignment between section header, 3 cards grid, and set progress indicator.
 *  - Preserved 3-card pinned GSAP scroll discovery & card styling.
 */

import { useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';
import { useReducedMotion } from '@/animations/useReducedMotion';
import CategoryCard from '@/components/category/CategoryCard';
import CategoryProgress from '@/components/category/CategoryProgress';
import { CATEGORY_SETS } from '@/constants/legalCategories';

const CategoryJourneySection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeSet, setActiveSet] = useState(1);
  const prefersReduced = useReducedMotion();

  // ─── Header Entrance Animation ─────────────────────────────────────────────
  useEffect(() => {
    if (prefersReduced || !headerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from('.cat-eyebrow', {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from('.cat-heading', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.4')
        .from('.cat-subtitle', {
          opacity: 0,
          y: 25,
          duration: 0.6,
          ease: 'power3.out',
        }, '-=0.4');
    }, headerRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // ─── Pinned ScrollTrigger for 3 Card Sets ──────────────────────────────────
  useEffect(() => {
    if (prefersReduced || !sectionRef.current || !containerRef.current) return;

    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const totalSets = CATEGORY_SETS.length;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalSets - 1) * 1.0}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.35) {
            setActiveSet(1);
          } else if (progress < 0.7) {
            setActiveSet(2);
          } else {
            setActiveSet(3);
          }
        },
      });

      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // ─── Cards Transition Animation on Set Change ──────────────────────────────
  useEffect(() => {
    if (prefersReduced || !cardsRef.current.length) return;

    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 35,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    });

    return () => ctx.revert();
  }, [activeSet, prefersReduced]);

  const currentSetData = CATEGORY_SETS.find((s) => s.setNumber === activeSet) || CATEGORY_SETS[0];

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative w-full bg-ct-void py-12 md:py-16 flex flex-col justify-center overflow-hidden border-t border-ct-gold/10"
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(200,155,82,0.05),transparent)]" />

      <div ref={containerRef} className="section-container relative z-20 flex flex-col justify-between max-w-6xl mx-auto">

        {/* ─── Section Header ────────────────────────────────────────────── */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-6">
          <div className="cat-eyebrow mb-2 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">Explore Your Rights</span>
            <div className="gold-divider-sm" />
          </div>

          <h2 className="cat-heading font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold text-ct-ivory leading-tight">
            Find Guidance For <span className="text-ct-gold italic">What You're Facing</span>
          </h2>

          <p className="cat-subtitle mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed max-w-lg mx-auto">
            Explore everyday legal situations in India and understand the clear steps available to you.
          </p>
        </div>

        {/* ─── Desktop 3 Cards Grid ────────────────────────────────────────── */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 items-stretch">
          {currentSetData.categories.map((category, index) => (
            <div
              key={`${activeSet}-${category.id}`}
              ref={(el) => (cardsRef.current[index] = el)}
              className="h-full"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* ─── Mobile Fallback Carousel ────────────────────────────────────── */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-1 mb-4 no-scrollbar">
          {CATEGORY_SETS.flatMap((s) => s.categories).map((category) => (
            <div key={category.id} className="snap-center flex-shrink-0 w-[85vw] max-w-xs">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* ─── Progress Indicator (Tight alignment right below cards) ─────── */}
        <div className="pt-3 border-t border-ct-gold/15">
          <CategoryProgress
            activeSet={activeSet}
            totalSets={CATEGORY_SETS.length}
            onSelectSet={(num) => setActiveSet(num)}
          />
        </div>

      </div>
    </section>
  );
};

export default CategoryJourneySection;
