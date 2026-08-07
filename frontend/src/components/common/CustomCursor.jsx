/**
 * NyayaSetu — CustomCursor Component
 * Smooth round follower cursor with GSAP motion and color invert styling.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/animations/gsap-config';
import { useReducedMotion } from '@/animations/useReducedMotion';

const CustomCursor = () => {
  const cursorRef     = useRef(null);
  const cursorDotRef  = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced            = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const cursor    = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Center cursor offsets
    const xTo    = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo    = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
    const dotXTo = gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power1.out' });
    const dotYTo = gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power1.out' });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Outer Ring — Mix blend invert style */}
      <div
        ref={cursorRef}
        className={`
          pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2
          rounded-full border border-ct-gold/80 transition-transform duration-200 ease-out hidden md:block
          mix-blend-difference bg-white/10 backdrop-invert
          ${isHovered ? 'h-12 w-12 border-ct-gold bg-ct-gold/20 scale-125' : 'h-8 w-8'}
        `}
      />

      {/* Inner Center Dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ct-gold transition-transform duration-100 hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
