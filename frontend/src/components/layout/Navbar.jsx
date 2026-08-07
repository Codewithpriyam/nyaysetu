/**
 * NyayaSetu — Navbar (Courtroom Theme)
 * Auth state-aware:
 *  - Signed Out: LOGIN | SIGN UP →
 *  - Signed In: UserButton avatar (Clerk) + Dashboard shortcut
 */

import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useWindowScroll } from 'react-use';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { HiOutlineUser, HiMenu, HiX, HiViewGrid, HiLogout, HiScale } from 'react-icons/hi';
import clsx from 'clsx';
import { ROUTES } from '@/constants/routes';

const NAV_LINKS = [
  { label: 'Home',            to: ROUTES.HOME },
  { label: 'Categories',     to: ROUTES.CATEGORIES },
  { label: 'Know Your Rights', to: ROUTES.KNOW_YOUR_RIGHTS },
  { label: 'Resources',      to: ROUTES.RESOURCES },
  { label: 'Find a Lawyer',  to: ROUTES.LAWYERS },
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
          ? 'bg-ct-void/90 backdrop-blur-md border-b border-ct-gold/20 py-3 shadow-court-card'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="section-container flex items-center justify-between">

        {/* ─── Logo ─────────────────────────────────────────────────────── */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3 group" aria-label="NyayaSetu Home">
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

        {/* ─── Desktop Nav Links ────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.HOME}
              className={({ isActive }) =>
                clsx(
                  'font-general text-xs uppercase tracking-[0.15em] transition-colors duration-200 whitespace-nowrap',
                  isActive ? 'text-ct-gold font-bold' : 'text-ct-ivory/80 hover:text-ct-gold'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ─── Auth Controls ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* While Clerk is loading — placeholder */}
          {!isLoaded && (
            <div className="h-10 w-10 rounded-full bg-ct-gold/20 animate-pulse" />
          )}

          {/* Signed Out — show LOGIN + SIGN UP */}
          {isLoaded && !isSignedIn && (
            <>
              <Link
                to={ROUTES.SIGN_IN}
                className="hidden sm:flex items-center gap-1.5 font-general text-xs uppercase tracking-widest text-ct-ivory/80 hover:text-ct-gold transition-colors"
              >
                <HiOutlineUser size={16} />
                <span>Login</span>
              </Link>

              <Link
                to={ROUTES.SIGN_UP}
                className="flex items-center gap-1.5 rounded-xl border border-ct-gold/50 bg-ct-gold/10 px-4 py-2 font-general text-xs uppercase tracking-widest text-ct-gold font-bold hover:bg-ct-gold hover:text-ct-void transition-all shadow-gold-glow"
              >
                <span>Sign Up</span>
                <span>→</span>
              </Link>
            </>
          )}

          {/* Signed In — show Clerk UserButton avatar */}
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.DASHBOARD}
                className="hidden sm:flex items-center gap-1.5 font-general text-[10px] uppercase tracking-widest text-ct-ivory/70 hover:text-ct-gold transition-colors"
                title="My Dashboard"
              >
                <HiScale size={15} />
                <span>Dashboard</span>
              </Link>

              {/* Clerk Avatar with built-in dropdown (Sign out, profile, etc.) */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:       'h-9 w-9 ring-2 ring-ct-gold/50 ring-offset-1 ring-offset-ct-void hover:ring-ct-gold transition-all',
                    userButtonPopoverCard:  'bg-[#0e1527] border border-[#C89B52]/30',
                    userButtonPopoverActionButton: 'text-[#f0e9d8] hover:bg-[#C89B52]/10',
                    userButtonPopoverActionButtonText: 'text-[#f0e9d8]',
                    userButtonPopoverFooter: 'hidden',
                  },
                }}
              />
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="flex md:hidden text-ct-ivory hover:text-ct-gold transition-colors ml-1"
            onClick={() => setIsMobileOpen((p) => !p)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Dropdown ──────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="absolute top-full inset-x-4 mt-2 rounded-2xl border border-ct-gold/30 bg-ct-void/95 backdrop-blur-xl p-5 md:hidden shadow-court-hover">
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

          {/* Mobile Auth Footer */}
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
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] font-general text-xs uppercase tracking-widest text-white font-bold"
                >
                  <span>Sign Up →</span>
                </Link>
              </div>
            )}

            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-3 px-1">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-9 w-9 ring-2 ring-ct-gold/50',
                    },
                  }}
                />
                <div>
                  <p className="font-inter text-xs font-bold text-ct-ivory leading-tight">
                    {user?.firstName || 'My Account'}
                  </p>
                  <Link
                    to={ROUTES.DASHBOARD}
                    onClick={() => setIsMobileOpen(false)}
                    className="font-general text-[9px] uppercase tracking-widest text-ct-gold hover:underline"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
