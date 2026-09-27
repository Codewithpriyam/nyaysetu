/**
 * NyayaSetu — Navbar (Apple Liquid Glass)
 * Floating translucent glass navigation with GSAP scroll transitions.
 *
 * Features:
 *  - Floating capsule geometry — detached from page edges
 *  - Translucent glass material with backdrop blur
 *  - Soft inner highlight + specular reflection
 *  - GSAP ScrollTrigger: top=transparent → scroll=more opaque
 *  - Moving glass pill behind active nav link
 *  - Subtle pointer-follow highlight on glass surface
 *  - Glass mobile menu sheet with smooth animation
 *  - prefers-reduced-motion respect
 *  - Touch device fallback (no pointer effects)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { HiOutlineUser, HiMenu, HiX, HiScale } from 'react-icons/hi';
import clsx from 'clsx';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { ROUTES } from '@/constants/routes';

const NAV_LINKS = [
  { label: 'Home',            to: ROUTES.HOME },
  { label: 'Categories',     to: ROUTES.CATEGORIES },
  { label: 'Know Your Rights', to: ROUTES.KNOW_YOUR_RIGHTS },
  { label: 'Find a Lawyer',  to: ROUTES.LAWYERS },
  { label: 'My Cases',       to: ROUTES.CASES },
  { label: 'AI Copilot & Resources', to: ROUTES.RESOURCES },
];

const NavBar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { isSignedIn, isLoaded }        = useAuth();
  const { user }                        = useUser();
  const location                        = useLocation();
  const prefersReduced                  = useReducedMotion();

  const navRef       = useRef(null);
  const glowRef      = useRef(null);
  const mobileMenuRef = useRef(null);

  // Detect touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // ─── GSAP Scroll-Linked Ambient Shadow Transition ───────────────────────────
  useEffect(() => {
    if (!navRef.current) return;

    if (prefersReduced) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 40);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const navEl = navRef.current;

    // Pure neutral, dense dark layered black shadows (zero gold/amber/colored glow)
    // Focuses darkness & density immediately around the bottom edge of the navbar for strong text separation
    const shadowTop =
      '0 4px 12px rgba(0, 0, 0, 0.45), 0 10px 24px rgba(0, 0, 0, 0.40), 0 20px 45px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)';
    const shadowMid =
      '0 4px 12px rgba(0, 0, 0, 0.50), 0 10px 26px rgba(0, 0, 0, 0.50), 0 20px 50px rgba(0, 0, 0, 0.35), 0 32px 75px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.06)';
    const shadowScrolled =
      '0 4px 12px rgba(0, 0, 0, 0.55), 0 10px 28px rgba(0, 0, 0, 0.58), 0 22px 55px rgba(0, 0, 0, 0.42), 0 35px 80px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)';

    let currentStage = 'top';

    // Set initial subtle top shadow
    gsap.set(navEl, { boxShadow: shadowTop });

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: () => {
        const y = window.scrollY || document.documentElement.scrollTop;

        let nextStage = 'top';
        if (y >= 90) {
          nextStage = 'deep';
        } else if (y >= 35) {
          nextStage = 'mid';
        }

        if (nextStage !== currentStage) {
          currentStage = nextStage;
          setIsScrolled(nextStage !== 'top');

          const targetShadow =
            nextStage === 'deep' ? shadowScrolled : nextStage === 'mid' ? shadowMid : shadowTop;

          gsap.to(navEl, {
            boxShadow: targetShadow,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReduced]);

  // GSAP Navbar Entrance Animation
  useEffect(() => {
    if (prefersReduced || !navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, [prefersReduced]);

  // Pointer-Follow Glow on Glass Surface (desktop only)
  const handleNavMouseMove = useCallback((e) => {
    if (prefersReduced || isTouchDevice || !glowRef.current || !navRef.current) return;

    const rect = navRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    gsap.to(glowRef.current, {
      '--glow-x': `${x}%`,
      '--glow-y': `${y}%`,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [prefersReduced, isTouchDevice]);

  const handleNavMouseLeave = useCallback(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  // ─── Mobile Menu Animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuRef.current || prefersReduced) return;

    if (isMobileOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isMobileOpen, prefersReduced]);

  // Close mobile on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none py-3 px-4 sm:px-6">
      <nav
        ref={navRef}
        className={clsx(
          'glass-nav relative w-full max-w-6xl rounded-2xl pointer-events-auto',
          'px-4 sm:px-6 lg:px-5 py-2.5',
          isScrolled && 'glass-nav--scrolled'
        )}
        onMouseMove={handleNavMouseMove}
        onMouseLeave={handleNavMouseLeave}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Pointer-follow glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background: 'radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255, 255, 255, 0.04) 0%, transparent 60%)',
            opacity: 0,
            '--glow-x': '50%',
            '--glow-y': '50%',
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">

          {/* ─── LEFT: Logo & Nav Links ─────────────────────────────────── */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Brand Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group shrink-0" aria-label="NyayaSetu Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-court-gold text-ct-void font-zentry text-sm font-black shadow-gold-glow">
                NS
              </div>
              <div className="flex flex-col">
                <span className="font-cormorant text-lg font-bold tracking-wide text-ct-ivory group-hover:text-ct-gold transition-colors duration-200">
                  NyayaSetu
                </span>
                <span className="font-general text-[7px] uppercase tracking-[0.2em] text-ct-gold/70 -mt-0.5">
                  Justice. Simplified.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROUTES.HOME}
                  className={({ isActive }) =>
                    clsx(
                      'font-general text-[10px] uppercase tracking-[0.12em] transition-all duration-200 whitespace-nowrap',
                      'px-3 py-1.5 rounded-xl',
                      isActive
                        ? 'text-ct-gold font-bold'
                        : 'text-ct-ivory/75 hover:text-ct-ivory hover:text-ct-gold'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Auth Controls & User Avatar ─────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Loading state */}
            {!isLoaded && (
              <div className="h-8 w-8 rounded-full bg-ct-gold/20 animate-pulse" />
            )}

            {/* Signed Out — LOGIN & SIGN UP */}
            {isLoaded && !isSignedIn && (
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.SIGN_IN}
                  className="hidden sm:flex items-center gap-1.5 glass-button glass-button-secondary px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest"
                >
                  <HiOutlineUser size={14} />
                  <span>Login</span>
                </Link>

                <Link
                  to={ROUTES.SIGN_UP}
                  className="flex items-center gap-1.5 glass-button glass-button-primary px-4 py-2 font-general text-[10px] uppercase tracking-widest font-bold"
                >
                  <span>Sign Up</span>
                  <span className="text-ct-gold">→</span>
                </Link>
              </div>
            )}

            {/* Signed In — DASHBOARD Shortcut & User Avatar */}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-3">
                {user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('priyamsingh504') ? (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    className="hidden sm:flex items-center gap-1.5 glass-button px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest font-bold"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.08)' }}
                    title="Go to Admin Panel"
                  >
                    <HiScale size={14} className="text-red-400" />
                    <span className="text-red-400">Admin Panel</span>
                  </Link>
                ) : (
                  user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('shruti') ||
                  user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('prince') ||
                  user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('singhshruti11122002')
                ) ? (
                  <Link
                    to={ROUTES.LAWYER_DASHBOARD}
                    className="hidden sm:flex items-center gap-1.5 glass-button glass-button-primary px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest font-bold"
                    title="Go to Advocate Portal"
                  >
                    <HiScale size={14} />
                    <span>Advocate Portal</span>
                  </Link>
                ) : (
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="hidden sm:flex items-center gap-1.5 glass-button glass-button-primary px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest font-bold"
                    title="Go to Dashboard"
                  >
                    <HiScale size={14} />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Clerk Avatar Dropdown */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:       'h-8 w-8 ring-2 ring-ct-gold/50 ring-offset-2 ring-offset-transparent hover:ring-ct-gold transition-all',
                      userButtonPopoverCard:  'bg-[#0e1527] border border-[#C89B52]/40 shadow-2xl',
                      userButtonPopoverActionButton: 'text-[#f0e9d8] hover:bg-[#C89B52]/10',
                      userButtonPopoverActionButtonText: 'text-[#ffffff] font-medium',
                      userButtonPopoverFooter: 'hidden',
                    },
                  }}
                />
              </div>
            )}

            {/* Mobile Menu Toggle — Glass button */}
            <button
              className="glass-menu-btn lg:hidden"
              onClick={() => setIsMobileOpen((p) => !p)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Dropdown — Glass Sheet ──────────────────────────────────── */}
      {isMobileOpen && (
        <div
          ref={mobileMenuRef}
          className="glass-sheet absolute top-full left-4 right-4 mt-2 rounded-2xl p-5 lg:hidden pointer-events-auto z-50"
        >
          <div className="relative z-10 flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.HOME}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'font-general text-xs uppercase tracking-[0.15em] p-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-ct-gold font-bold bg-ct-gold/8'
                      : 'text-ct-ivory/80 hover:text-ct-gold hover:bg-ct-gold/5'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Auth Controls */}
          <div className="relative z-10 mt-4 pt-4 border-t border-ct-gold/10">
            {isLoaded && !isSignedIn && (
              <div className="flex gap-2">
                <Link
                  to={ROUTES.SIGN_IN}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 glass-button glass-button-secondary justify-center py-2.5 font-general text-xs uppercase tracking-widest"
                >
                  <HiOutlineUser size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  to={ROUTES.SIGN_UP}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 glass-button glass-button-primary justify-center py-2.5 font-general text-xs uppercase tracking-widest font-bold"
                >
                  <span>Sign Up →</span>
                </Link>
              </div>
            )}

            {isLoaded && isSignedIn && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="font-inter text-xs font-bold text-ct-ivory leading-tight">
                      {user?.fullName || user?.firstName || 'My Account'}
                    </p>
                    <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold/80">
                      Authenticated Session
                    </span>
                  </div>
                </div>
                <Link
                  to={ROUTES.DASHBOARD}
                  onClick={() => setIsMobileOpen(false)}
                  className="glass-button glass-button-primary px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest font-bold"
                >
                  Dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
