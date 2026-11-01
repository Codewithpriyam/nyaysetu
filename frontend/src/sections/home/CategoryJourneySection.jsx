/**
 * NyayaSetu — CategoryJourneySection Component
 * Pinned Horizontal Scroll Experience via GSAP ScrollTrigger:
 *  - Vertical page scrolling powers smooth horizontal glide across all 9 legal-rights categories.
 *  - Stationary section header remains cleanly visible in viewport throughout horizontal scroll.
 *  - FlexCarousel "liquid" preset inspired cards with 3D BentoTilt, specular highlights & dark translucent glass.
 *  - Dynamic distance calculation ensures the 9th card is 100% visible before unpinning.
 *  - Interactive progress indicator (01/09 through 09/09) with live category pill & progress bar.
 *  - Full touch-friendly horizontal snap carousel for mobile & tablet (< 1024px).
 *  - Strict 4-colour palette: Orange (#FE7F2D), Deep Blue (#233D4D), Black (#000000), Light Gray (#EAECF0).
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';
import { useReducedMotion } from '@/animations/useReducedMotion';
import CategoryCard from '@/components/category/CategoryCard';
import { ALL_CATEGORIES } from '@/constants/legalCategories';
import { HiChevronLeft, HiChevronRight, HiArrowNarrowDown } from 'react-icons/hi';

const CategoryJourneySection = () => {
  const sectionRef      = useRef(null);
  const pinContainerRef = useRef(null);
  const trackRef        = useRef(null);
  const headerRef       = useRef(null);
  const mobileScrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(1);
  const [progress, setProgress]       = useState(0);
  const [mobileIndex, setMobileIndex] = useState(1);

  const prefersReduced = useReducedMotion();
  const totalCards     = ALL_CATEGORIES.length; // 9 categories

  // ─── Desktop: GSAP ScrollTrigger Pinned Horizontal Scroll ───────────────────
  useEffect(() => {
    if (prefersReduced || !sectionRef.current || !trackRef.current) return;

    // Use gsap.matchMedia for clean desktop/tablet vs mobile separation
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const section = sectionRef.current;
      const track   = trackRef.current;

      // Dynamic calculation: distance needed so the final (9th) card plus end buffer rests comfortably in view
      const getScrollDistance = () => {
        if (!track) return 0;
        // Extra buffer clearance ensures Card 9 has generous breathing room before unpinning
        const buffer = 96;
        const dist = track.scrollWidth - window.innerWidth + buffer;
        return Math.max(0, dist);
      };

      // Subtle rise and entrance for cards when approaching viewport
      gsap.fromTo(
        '.cat-journey-card',
        { y: 40, opacity: 0.7 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      // Pinned Horizontal Timeline
      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setProgress(p);

            // Compute current active card (1 to 9)
            const idx = Math.min(
              Math.max(1, Math.round(p * (totalCards - 1)) + 1),
              totalCards
            );
            setActiveIndex(idx);
          },
        },
      });

      // Refresh ScrollTrigger after font & image layout settle
      const timer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
      const timer2 = setTimeout(() => ScrollTrigger.refresh(), 800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [prefersReduced, totalCards]);

  // ─── Jump To Card when clicking bottom indicator pills ──────────────────────
  const handleJumpToCard = useCallback((index) => {
    if (!sectionRef.current || !trackRef.current) return;

    // Retrieve active ScrollTrigger on the section
    const st = ScrollTrigger.getById('cat-journey-st') ||
      ScrollTrigger.getAll().find((s) => s.trigger === sectionRef.current);

    if (st) {
      const targetScroll = st.start + (index / (totalCards - 1)) * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    } else {
      setActiveIndex(index + 1);
    }
  }, [totalCards]);

  // ─── Mobile Horizontal Scroll Listener ──────────────────────────────────────
  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const el = mobileScrollRef.current;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild?.offsetWidth || 300;
    const gap = 16;
    const idx = Math.min(
      Math.max(1, Math.round(scrollLeft / (cardWidth + gap)) + 1),
      totalCards
    );
    setMobileIndex(idx);
  }, [totalCards]);

  const handleMobileNav = (direction) => {
    if (!mobileScrollRef.current) return;
    const el = mobileScrollRef.current;
    const cardWidth = el.firstElementChild?.offsetWidth || 300;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * (direction === 'next' ? 1 : -1);
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const currentCategory = ALL_CATEGORIES[activeIndex - 1] || ALL_CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative w-full bg-black overflow-hidden border-t border-deep-blue/40"
    >
      {/* Ambient Radial Deep Blue & Orange Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(35,61,77,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-[500px] w-[500px] rounded-full bg-orange/5 blur-[140px]" />

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW: PINNED GSAP HORIZONTAL SCROLL (min-width: 1024px)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={pinContainerRef}
        className="hidden lg:flex w-full h-screen min-h-[720px] max-h-[980px] flex-col justify-between pt-22 pb-7 overflow-hidden relative z-20"
      >
        {/* ─── Stationary Top Header (Stays Fixed in View) ────────────────── */}
        <div
          ref={headerRef}
          className="w-[95%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex-shrink-0 flex items-end justify-between gap-6 pb-2"
        >
          {/* Left: Titles & Subtitle */}
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                EXPLORE YOUR RIGHTS
              </span>
              <div className="h-px w-10 bg-orange/30" />
            </div>

            <h2 className="font-calluna text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-light-gray leading-tight">
              Find Guidance For <span className="text-orange">What You're Facing</span>
            </h2>

            <p className="mt-1.5 font-inter text-xs sm:text-sm text-light-gray/70 leading-relaxed max-w-xl">
              Everyday legal situations in India with clear statutory remedies across 9 core domains.
            </p>
          </div>

          {/* Right: Sleek Liquid Glass Progress Feedback */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="font-calluna text-3xl lg:text-4xl font-bold text-orange">
                {String(activeIndex).padStart(2, '0')}
              </span>
              <span className="font-inter text-sm text-light-gray/40 font-medium">
                / {String(totalCards).padStart(2, '0')}
              </span>
              <span className="ml-2 px-3 py-1 rounded-full bg-deep-blue/40 border border-deep-blue/80 text-[11px] font-inter text-light-gray font-semibold shadow-sm">
                {currentCategory?.title}
              </span>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-56 h-1.5 rounded-full bg-deep-blue/60 overflow-hidden relative border border-deep-blue/80">
              <div
                className="h-full bg-gradient-to-r from-orange to-[#FF9A50] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${Math.max(6, progress * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 font-inter text-[10px] text-light-gray/40 tracking-wider uppercase">
              <span>Scroll down to navigate</span>
              <HiArrowNarrowDown className="h-3 w-3 animate-bounce text-orange/80" />
            </div>
          </div>
        </div>

        {/* ─── Middle: Horizontal Moving Cards Track ──────────────────────── */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden my-auto py-2">
          <div
            ref={trackRef}
            className="flex gap-6 lg:gap-8 items-stretch will-change-transform pl-[max(2rem,calc((100vw-1720px)/2+2rem))] pr-16"
          >
            {ALL_CATEGORIES.map((category, index) => {
              const isCurrent = activeIndex === index + 1;
              return (
                <div
                  key={category.id}
                  className={`cat-journey-card transition-all duration-300 w-[380px] lg:w-[410px] xl:w-[430px] shrink-0 ${
                    isCurrent ? 'scale-100 opacity-100 z-10' : 'scale-[0.98] opacity-90'
                  }`}
                >
                  <CategoryCard
                    category={category}
                    index={index}
                    isActive={isCurrent}
                  />
                </div>
              );
            })}

            {/* End Buffer: Ensures 9th card rests fully inside the viewport with generous padding before unpinning */}
            <div className="w-20 lg:w-36 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* ─── Bottom: Interactive Set Navigation Pills & Category Groups ──── */}
        <div className="w-[95%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex-shrink-0 flex items-center justify-between border-t border-deep-blue/40 pt-3">
          {/* Quick Jump Dots for All 9 Cards */}
          <div className="flex items-center gap-2">
            {ALL_CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => handleJumpToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i + 1
                    ? 'w-8 bg-orange shadow-sm shadow-orange/30'
                    : 'w-2 bg-deep-blue/90 hover:bg-light-gray/40 hover:w-3'
                }`}
                aria-label={`Jump to ${cat.title}`}
                title={`0${i + 1} — ${cat.title}`}
              />
            ))}
          </div>

          {/* Grouping Overview */}
          <div className="flex items-center gap-4 text-[11px] font-inter text-light-gray/50">
            <span className={activeIndex <= 3 ? 'text-orange font-semibold' : ''}>
              Set 1: Police, Banking & Consumer
            </span>
            <span className="text-deep-blue/80">•</span>
            <span className={activeIndex > 3 && activeIndex <= 6 ? 'text-orange font-semibold' : ''}>
              Set 2: Travel, Workplace & Property
            </span>
            <span className="text-deep-blue/80">•</span>
            <span className={activeIndex > 6 ? 'text-orange font-semibold' : ''}>
              Set 3: Cyber, Business & Courts
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE & TABLET VIEW: TOUCH-FRIENDLY NATIVE SWIPE CAROUSEL (< 1024px)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden px-4 sm:px-6 py-12">
        {/* Mobile Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
            <span className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              EXPLORE YOUR RIGHTS
            </span>
          </div>

          <h2 className="font-calluna text-2xl sm:text-3xl font-bold text-light-gray leading-tight">
            Find Guidance For <span className="text-orange">What You're Facing</span>
          </h2>

          <p className="mt-1 font-inter text-xs text-light-gray/70 leading-relaxed">
            Everyday legal situations in India with clear statutory remedies across 9 domains.
          </p>

          {/* Mobile Current Counter & Arrow Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-calluna text-xl font-bold text-orange">
                {String(mobileIndex).padStart(2, '0')}
              </span>
              <span className="font-inter text-xs text-light-gray/40">
                / {String(totalCards).padStart(2, '0')}
              </span>
              <span className="ml-1.5 px-2.5 py-0.5 rounded-full bg-deep-blue/40 border border-deep-blue/80 text-[10px] font-inter text-light-gray font-semibold">
                {ALL_CATEGORIES[mobileIndex - 1]?.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMobileNav('prev')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-deep-blue/80 bg-black/80 text-light-gray hover:border-orange/60 hover:text-orange transition-colors cursor-pointer"
                aria-label="Previous category"
              >
                <HiChevronLeft size={16} />
              </button>
              <button
                onClick={() => handleMobileNav('next')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-deep-blue/80 bg-black/80 text-light-gray hover:border-orange/60 hover:text-orange transition-colors cursor-pointer"
                aria-label="Next category"
              >
                <HiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Snap Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 no-scrollbar scroll-smooth"
        >
          {ALL_CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              className="snap-center flex-shrink-0 w-[86vw] max-w-[340px]"
            >
              <CategoryCard
                category={category}
                index={index}
                isActive={mobileIndex === index + 1}
              />
            </div>
          ))}
        </div>

        {/* Mobile Dot Navigation */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {ALL_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => {
                if (!mobileScrollRef.current) return;
                const cardWidth = mobileScrollRef.current.firstElementChild?.offsetWidth || 300;
                mobileScrollRef.current.scrollTo({
                  left: i * (cardWidth + 16),
                  behavior: 'smooth',
                });
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                mobileIndex === i + 1 ? 'w-6 bg-orange' : 'w-1.5 bg-deep-blue/80'
              }`}
              aria-label={`Go to ${cat.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryJourneySection;
