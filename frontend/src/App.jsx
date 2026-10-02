/**
 * NyayaSetu — App Router
 * React Router v6 with lazy-loaded pages and Clerk + Spring Boot Role-protected route groups.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ROUTES } from '@/constants/routes';
import PageWrapper from '@/components/layout/PageWrapper';
import ScrollToTop from '@/components/common/ScrollToTop';
import apiClient, { setTokenProvider } from '@/services/api';
import { syncRealUserToRegistry } from '@/utils/userRegistry';

// Loading fallback
const PageLoader = () => (
  <div className="flex-center min-h-screen bg-ct-void">
    <div className="text-center">
      <div className="three-body mx-auto mb-4">
        <div className="three-body__dot" />
        <div className="three-body__dot" />
        <div className="three-body__dot" />
      </div>
      <p className="label-text text-ct-gold">Loading…</p>
    </div>
  </div>
);

// ── Token Provider Initializer & Auth Guard ─────────────────────────────────
const RequireAuth = ({ children, requiredRole }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const location = useLocation();
  const [appUserRole, setAppUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const userId = clerkUser?.id;
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const userName = clerkUser?.fullName;

  useEffect(() => {
    let isSubscribed = true;

    if (isLoaded && isSignedIn) {
      setTokenProvider(getToken);

      // Strict role detection: ONLY priyamsingh504 is ADMIN, shruti & prince are LAWYER
      const isAdminByEmail = userEmail && userEmail.toLowerCase().includes('priyamsingh504');
      const isLawyerByEmail = userEmail && (
        userEmail.toLowerCase().includes('shruti') ||
        userEmail.toLowerCase().includes('prince') ||
        userEmail.toLowerCase().includes('singhshruti11122002')
      );

      let defaultRole = 'USER';
      if (isAdminByEmail) defaultRole = 'ADMIN';
      else if (isLawyerByEmail) defaultRole = 'LAWYER';

      apiClient.get('/me', { params: { email: userEmail, name: userName } })
        .then((res) => {
          const finalRole = res?.role || defaultRole;
          if (isSubscribed) setAppUserRole(finalRole);
          syncRealUserToRegistry(clerkUser, finalRole);
        })
        .catch(() => {
          if (isSubscribed) setAppUserRole(defaultRole);
          syncRealUserToRegistry(clerkUser, defaultRole);
        })
        .finally(() => {
          if (isSubscribed) setCheckingRole(false);
        });
    } else if (isLoaded && !isSignedIn) {
      setCheckingRole(false);
    }

    return () => { isSubscribed = false; };
  }, [isLoaded, isSignedIn, userId, userEmail, userName]);

  if (!isLoaded || checkingRole) return <PageLoader />;
  if (!isSignedIn) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ returnTo: location.pathname + location.search }} replace />;
  }

  // Smart routing when accessing general /dashboard
  if (location.pathname === ROUTES.DASHBOARD) {
    if (appUserRole === 'ADMIN') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    if (appUserRole === 'LAWYER') {
      return <Navigate to={ROUTES.LAWYER_DASHBOARD} replace />;
    }
  }

  if (requiredRole && appUserRole !== requiredRole && appUserRole !== 'ADMIN') {
    if (appUserRole === 'LAWYER') return <Navigate to={ROUTES.LAWYER_DASHBOARD} replace />;
    if (appUserRole === 'ADMIN') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

// Lazy-loaded pages — Public
const HomePage            = lazy(() => import('@/pages/public/HomePage'));
const KnowYourRightsPage  = lazy(() => import('@/pages/public/KnowYourRightsPage'));
const CategoriesPage      = lazy(() => import('@/pages/public/CategoriesPage'));
const CategoryDetailPage  = lazy(() => import('@/pages/public/CategoryDetailPage'));
const LawyersPage         = lazy(() => import('@/pages/public/LawyersPage'));
const LawyerProfilePage   = lazy(() => import('@/pages/public/LawyerProfilePage'));
const ResourcesPage       = lazy(() => import('@/pages/public/ResourcesPage'));
const AboutPage           = lazy(() => import('@/pages/public/AboutPage'));
const ArchitecturePage    = lazy(() => import('@/pages/public/ArchitecturePage'));
const PrivacyPage         = lazy(() => import('@/pages/public/PrivacyPage'));
const TermsPage           = lazy(() => import('@/pages/public/TermsPage'));
const ContactPage         = lazy(() => import('@/pages/public/ContactPage'));
const HelpPage            = lazy(() => import('@/pages/public/HelpPage'));
const FaqPage             = lazy(() => import('@/pages/public/FaqPage'));

// Auth pages
const SignInPage           = lazy(() => import('@/pages/auth/SignInPage'));
const SignUpPage           = lazy(() => import('@/pages/auth/SignUpPage'));

// User (protected)
const DashboardPage        = lazy(() => import('@/pages/user/DashboardPage'));
const CasesPage            = lazy(() => import('@/pages/user/CasesPage'));
const CaseDetailPage       = lazy(() => import('@/pages/user/CaseDetailPage'));

// Lawyer (protected — LAWYER role required)
const LawyerDashboardPage     = lazy(() => import('@/pages/lawyer/LawyerDashboardPage'));
const LawyerRequestsPage      = lazy(() => import('@/pages/lawyer/LawyerRequestsPage'));
const LawyerConsultationsPage = lazy(() => import('@/pages/lawyer/LawyerConsultationsPage'));
const LawyerAvailabilityPage  = lazy(() => import('@/pages/lawyer/LawyerAvailabilityPage'));
const LawyerProfileEditPage   = lazy(() => import('@/pages/lawyer/LawyerProfileEditPage'));
const LawyerEarningsPage      = lazy(() => import('@/pages/lawyer/LawyerEarningsPage'));

// Admin (protected — ADMIN role required)
const AdminDashboardPage     = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminConsultationsPage = lazy(() => import('@/pages/admin/AdminConsultationsPage'));

const AppRouter = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setTokenProvider(getToken);
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>

        {/* ── PUBLIC (no auth required) ─────────────────────────────────────── */}
        <Route path={ROUTES.HOME}            element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path={ROUTES.KNOW_YOUR_RIGHTS} element={<PageWrapper><KnowYourRightsPage /></PageWrapper>} />
        <Route path={ROUTES.CATEGORIES}      element={<PageWrapper><CategoriesPage /></PageWrapper>} />
        <Route path={ROUTES.CATEGORY}        element={<PageWrapper><CategoryDetailPage /></PageWrapper>} />
        <Route path={ROUTES.LAWYERS}         element={<PageWrapper><LawyersPage /></PageWrapper>} />
        <Route path={ROUTES.LAWYER_PROFILE}  element={<PageWrapper><LawyerProfilePage /></PageWrapper>} />
        <Route path={ROUTES.RESOURCES}       element={<PageWrapper><ResourcesPage /></PageWrapper>} />
        <Route path={ROUTES.ABOUT}           element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path={ROUTES.ARCHITECTURE}    element={<PageWrapper><ArchitecturePage /></PageWrapper>} />
        <Route path={ROUTES.PRIVACY}         element={<PageWrapper><PrivacyPage /></PageWrapper>} />
        <Route path={ROUTES.TERMS}           element={<PageWrapper><TermsPage /></PageWrapper>} />
        <Route path={ROUTES.CONTACT}         element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path={ROUTES.HELP}            element={<PageWrapper><HelpPage /></PageWrapper>} />
        <Route path={ROUTES.FAQ}             element={<PageWrapper><FaqPage /></PageWrapper>} />

        {/* ── AUTH PAGES ────────────────────────────────────────────────────── */}
        <Route path={ROUTES.SIGN_IN}         element={<PageWrapper hideFooter><SignInPage /></PageWrapper>} />
        <Route path={ROUTES.SIGN_UP}         element={<PageWrapper hideFooter><SignUpPage /></PageWrapper>} />

        {/* ── USER (authenticated) ──────────────────────────────────────────── */}
        <Route path={ROUTES.DASHBOARD} element={<RequireAuth><PageWrapper><DashboardPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.CASES}     element={<RequireAuth><PageWrapper><CasesPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.CASE_DETAIL} element={<RequireAuth><PageWrapper><CaseDetailPage /></PageWrapper></RequireAuth>} />

        {/* ── LAWYER (role protected — LAWYER required) ────────────────────── */}
        <Route path={ROUTES.LAWYER_DASHBOARD}    element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerDashboardPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.LAWYER_REQUESTS}     element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerRequestsPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.LAWYER_CONSULTATIONS} element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerConsultationsPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.LAWYER_AVAILABILITY} element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerAvailabilityPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.LAWYER_PROFILE_EDIT} element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerProfileEditPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.LAWYER_EARNINGS}     element={<RequireAuth requiredRole="LAWYER"><PageWrapper hideFooter><LawyerEarningsPage /></PageWrapper></RequireAuth>} />

        {/* ── ADMIN (role protected — ADMIN required) ───────────────────────── */}
        <Route path={ROUTES.ADMIN}               element={<RequireAuth requiredRole="ADMIN"><PageWrapper hideFooter><AdminDashboardPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.ADMIN_DASHBOARD}     element={<RequireAuth requiredRole="ADMIN"><PageWrapper hideFooter><AdminDashboardPage /></PageWrapper></RequireAuth>} />
        <Route path={ROUTES.ADMIN_CONSULTATIONS} element={<RequireAuth requiredRole="ADMIN"><PageWrapper hideFooter><AdminConsultationsPage /></PageWrapper></RequireAuth>} />

        {/* ── FALLBACK ──────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />

      </Routes>
    </Suspense>
  );
};

export default AppRouter;
