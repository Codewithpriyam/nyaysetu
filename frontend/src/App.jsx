/**
 * NyayaSetu — App Router
 * React Router v6 with lazy-loaded pages and Clerk-protected route groups.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ROUTES } from '@/constants/routes';
import PageWrapper from '@/components/layout/PageWrapper';

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

// ── Route guard: redirects to /sign-in if not authenticated ─────────────────
const RequireAuth = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ returnTo: location.pathname + location.search }} replace />;
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

// Auth pages
const SignInPage           = lazy(() => import('@/pages/auth/SignInPage'));
const SignUpPage           = lazy(() => import('@/pages/auth/SignUpPage'));

// User (protected)
const DashboardPage        = lazy(() => import('@/pages/user/DashboardPage'));
const CasesPage            = lazy(() => import('@/pages/user/CasesPage'));

// Lawyer (protected — role check deferred to later phase)
const LawyerDashboardPage     = lazy(() => import('@/pages/lawyer/LawyerDashboardPage'));
const LawyerRequestsPage      = lazy(() => import('@/pages/lawyer/LawyerRequestsPage'));
const LawyerConsultationsPage = lazy(() => import('@/pages/lawyer/LawyerConsultationsPage'));
const LawyerAvailabilityPage  = lazy(() => import('@/pages/lawyer/LawyerAvailabilityPage'));
const LawyerProfileEditPage   = lazy(() => import('@/pages/lawyer/LawyerProfileEditPage'));
const LawyerEarningsPage      = lazy(() => import('@/pages/lawyer/LawyerEarningsPage'));

// Admin (protected)
const AdminDashboardPage     = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminConsultationsPage = lazy(() => import('@/pages/admin/AdminConsultationsPage'));

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>

      {/* ── PUBLIC (no auth required) ─────────────────────────────────────── */}
      <Route path={ROUTES.HOME}            element={<PageWrapper><HomePage /></PageWrapper>} />
      <Route path={ROUTES.KNOW_YOUR_RIGHTS} element={<PageWrapper><KnowYourRightsPage /></PageWrapper>} />
      <Route path={ROUTES.CATEGORIES}      element={<PageWrapper><CategoriesPage /></PageWrapper>} />
      <Route path={ROUTES.CATEGORY}        element={<PageWrapper><CategoryDetailPage /></PageWrapper>} />
      <Route path={ROUTES.LAWYERS}         element={<PageWrapper><LawyersPage /></PageWrapper>} />
      <Route path={ROUTES.LAWYER_PROFILE}  element={<PageWrapper><LawyerProfilePage /></PageWrapper>} />
      <Route path={ROUTES.RESOURCES}       element={<PageWrapper><ResourcesPage /></PageWrapper>} />

      {/* ── AUTH PAGES ────────────────────────────────────────────────────── */}
      <Route path={ROUTES.SIGN_IN}         element={<PageWrapper hideFooter><SignInPage /></PageWrapper>} />
      <Route path={ROUTES.SIGN_UP}         element={<PageWrapper hideFooter><SignUpPage /></PageWrapper>} />

      {/* ── USER (authenticated) ──────────────────────────────────────────── */}
      <Route path={ROUTES.DASHBOARD} element={<RequireAuth><PageWrapper><DashboardPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.CASES}     element={<RequireAuth><PageWrapper><CasesPage /></PageWrapper></RequireAuth>} />

      {/* ── LAWYER (authenticated — role enforcement in next phase) ─────── */}
      <Route path={ROUTES.LAWYER_DASHBOARD}    element={<RequireAuth><PageWrapper hideFooter><LawyerDashboardPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.LAWYER_REQUESTS}     element={<RequireAuth><PageWrapper hideFooter><LawyerRequestsPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.LAWYER_CONSULTATIONS} element={<RequireAuth><PageWrapper hideFooter><LawyerConsultationsPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.LAWYER_AVAILABILITY} element={<RequireAuth><PageWrapper hideFooter><LawyerAvailabilityPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.LAWYER_PROFILE_EDIT} element={<RequireAuth><PageWrapper hideFooter><LawyerProfileEditPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.LAWYER_EARNINGS}     element={<RequireAuth><PageWrapper hideFooter><LawyerEarningsPage /></PageWrapper></RequireAuth>} />

      {/* ── ADMIN (authenticated — role enforcement in next phase) ────────── */}
      <Route path={ROUTES.ADMIN}               element={<RequireAuth><PageWrapper hideFooter><AdminDashboardPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.ADMIN_DASHBOARD}     element={<RequireAuth><PageWrapper hideFooter><AdminDashboardPage /></PageWrapper></RequireAuth>} />
      <Route path={ROUTES.ADMIN_CONSULTATIONS} element={<RequireAuth><PageWrapper hideFooter><AdminConsultationsPage /></PageWrapper></RequireAuth>} />

      {/* ── FALLBACK ──────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />

    </Routes>
  </Suspense>
);

export default AppRouter;
