/**
 * NyayaSetu — Navbar (Courtroom Theme)
 * Full width header layout with Left-aligned Brand & Nav Links, Right-aligned Auth & User Controls.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWindowScroll } from 'react-use';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { HiOutlineUser, HiMenu, HiX, HiScale } from 'react-icons/hi';
import clsx from 'clsx';
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
  const { y: scrollY }                  = useWindowScroll();
  const { isSignedIn, isLoaded }        = useAuth();
  const { user }                        = useUser();

  useEffect(() => {
    setIsScrolled(scrollY > 40);
  }, [scrollY]);

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-ct-void/95 backdrop-blur-md border-b border-ct-gold/20 py-3.5 shadow-court-card'
          : 'bg-ct-void/60 backdrop-blur-sm py-4 border-b border-ct-gold/10'
      )}
    >
      <nav className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6">

        {/* ─── LEFT: Logo & Nav Links ────────────────────────────────────── */}
        <div className="flex items-center gap-8 xl:gap-12">
          {/* Brand Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group shrink-0" aria-label="NyayaSetu Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-court-gold text-ct-void font-zentry text-base font-black shadow-gold-glow">
              NS
            </div>
            <div className="flex flex-col">
              <span className="font-cormorant text-xl font-bold tracking-wide text-ct-ivory group-hover:text-ct-gold transition-colors duration-200">
                NyayaSetu
              </span>
              <span className="font-general text-[8px] uppercase tracking-[0.2em] text-ct-gold/80 -mt-1">
                Justice. Simplified.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.HOME}
                className={({ isActive }) =>
                  clsx(
                    'font-general text-xs uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap',
                    isActive ? 'text-ct-gold font-bold' : 'text-ct-ivory/80 hover:text-ct-gold'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Auth Controls & User Avatar ───────────────────────── */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Loading state */}
          {!isLoaded && (
            <div className="h-9 w-9 rounded-full bg-ct-gold/20 animate-pulse" />
          )}

          {/* Signed Out — LOGIN & SIGN UP */}
          {isLoaded && !isSignedIn && (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.SIGN_IN}
                className="hidden sm:flex items-center gap-1.5 font-general text-xs uppercase tracking-widest text-ct-ivory/90 hover:text-ct-gold transition-colors px-3 py-1.5"
              >
                <HiOutlineUser size={16} />
                <span>Login</span>
              </Link>

              <Link
                to={ROUTES.SIGN_UP}
                className="flex items-center gap-1.5 rounded-xl border border-ct-gold/60 bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-4 py-2 font-general text-xs uppercase tracking-widest text-ct-void font-bold hover:brightness-110 transition-all shadow-gold-glow"
              >
                <span>Sign Up</span>
                <span>→</span>
              </Link>
            </div>
          )}

          {/* Signed In — DASHBOARD Shortcut & User Avatar */}
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-4">
              {user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('priyamsingh504') ? (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 font-general text-xs uppercase tracking-widest text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Go to Admin Panel"
                >
                  <HiScale size={16} />
                  <span>Admin Panel</span>
                </Link>
              ) : (
                user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('shruti') ||
                user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('prince') ||
                user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('singhshruti11122002')
              ) ? (
                <Link
                  to={ROUTES.LAWYER_DASHBOARD}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-ct-gold/40 bg-ct-gold/10 px-3.5 py-1.5 font-general text-xs uppercase tracking-widest text-ct-gold font-bold hover:bg-ct-gold hover:text-ct-void transition-all shadow-sm"
                  title="Go to Advocate Portal"
                >
                  <HiScale size={16} />
                  <span>Advocate Portal</span>
                </Link>
              ) : (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-ct-gold/30 bg-ct-gold/10 px-3.5 py-1.5 font-general text-xs uppercase tracking-widest text-ct-gold font-bold hover:bg-ct-gold hover:text-ct-void transition-all shadow-sm"
                  title="Go to Dashboard"
                >
                  <HiScale size={16} />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* Clerk Avatar Dropdown */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:       'h-9 w-9 ring-2 ring-ct-gold/60 ring-offset-2 ring-offset-ct-void hover:ring-ct-gold transition-all',
                    userButtonPopoverCard:  'bg-[#0e1527] border border-[#C89B52]/40 shadow-2xl',
                    userButtonPopoverActionButton: 'text-[#f0e9d8] hover:bg-[#C89B52]/10',
                    userButtonPopoverActionButtonText: 'text-[#ffffff] font-medium',
                    userButtonPopoverFooter: 'hidden',
                  },
                }}
              />
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="flex lg:hidden text-ct-ivory hover:text-ct-gold transition-colors p-1"
            onClick={() => setIsMobileOpen((p) => !p)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>

      </nav>

      {/* ─── Mobile Dropdown ──────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="absolute top-full inset-x-4 mt-2 rounded-2xl border border-ct-gold/30 bg-ct-void/98 backdrop-blur-xl p-5 lg:hidden shadow-court-hover">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.HOME}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'font-general text-xs uppercase tracking-[0.15em] p-2.5 rounded-xl transition-colors',
                    isActive ? 'text-ct-gold font-bold bg-ct-gold/10' : 'text-ct-ivory/80 hover:text-ct-gold'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Auth Controls */}
          <div className="mt-4 pt-4 border-t border-ct-gold/15">
            {isLoaded && !isSignedIn && (
              <div className="flex gap-2">
                <Link
                  to={ROUTES.SIGN_IN}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-ct-gold/30 font-general text-xs uppercase tracking-widest text-ct-ivory hover:text-ct-gold transition-colors"
                >
                  <HiOutlineUser size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  to={ROUTES.SIGN_UP}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] font-general text-xs uppercase tracking-widest text-ct-void font-bold shadow-gold-glow"
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
                  className="rounded-xl bg-ct-gold px-3.5 py-1.5 font-general text-[10px] uppercase tracking-widest text-ct-void font-bold shadow-sm"
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
