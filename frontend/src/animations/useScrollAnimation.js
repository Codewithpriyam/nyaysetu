/**
 * useScrollAnimation — Reusable ScrollTrigger hook
 * Creates a GSAP context scoped to the provided ref.
 * Handles cleanup automatically on unmount.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useScrollAnimation(ref, () => {
 *     gsap.from('.my-element', { opacity: 0, scrollTrigger: { ... } });
 *   });
 *
 * NOTE: The animationFactory runs INSIDE a gsap.context scope.
 * Do NOT pass ctx to the factory — just call gsap directly inside it.
 */
import { useEffect } from 'react';
import { gsap } from './gsap-config';
import { useReducedMotion } from './useReducedMotion';

/**
 * @param {React.RefObject} containerRef - Scopes all GSAP selectors inside this element
 * @param {function}        animationFactory - Runs inside gsap.context; just call gsap.* directly
 * @param {Array}           deps - Extra deps (like React useEffect deps)
 */
export function useScrollAnimation(containerRef, animationFactory, deps = []) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReduced) return;

    // gsap.context scopes all selector queries to containerRef.current
    // animationFactory does NOT receive ctx — just call gsap.* directly inside
    const ctx = gsap.context(animationFactory, containerRef);

    return () => ctx.revert(); // Kills all ScrollTriggers + tweens created inside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, ...deps]);
}
