/**
 * NYAYSETU — Central GSAP Configuration
 *
 * Register ALL GSAP plugins here — single source of truth.
 * Import this file ONCE in main.jsx before any component mounts.
 *
 * Installed GSAP plugins (free):
 *  - ScrollTrigger   → scroll-linked animations, pinning, scrubbing
 *  - Flip            → layout transition animations (FLIP technique)
 *  - MotionPath      → animate along SVG paths (lawyer character movement)
 *  - Observer        → scroll/touch/pointer event unification
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip }          from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Observer }     from 'gsap/Observer';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, Flip, MotionPathPlugin, Observer);

// ─── Global GSAP defaults ───────────────────────────────────────────────────
gsap.defaults({
  ease:     'power2.out',
  duration: 0.6,
});

// ─── ScrollTrigger defaults ─────────────────────────────────────────────────
ScrollTrigger.config({
  // Prevent accidental scroll-jank from layout shifts
  ignoreMobileResize: true,
});

// ─── Reduced Motion: disable animations globally if user prefers ─────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Set zero duration so animations still "complete" but instantly
  gsap.globalTimeline.timeScale(1000);
  ScrollTrigger.config({ limitCallbacks: true });
}

export { gsap, ScrollTrigger, Flip, MotionPathPlugin, Observer, prefersReducedMotion };
