/**
 * NyayaSetu — Sign In Page
 * Clerk SignIn component wrapped in the NyayaSetu dark courtroom + gold theme.
 * After sign-in, redirects to the `returnTo` location saved before auth, or /dashboard.
 */
import { SignIn, useUser } from '@clerk/clerk-react';
import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const SignInPage = () => {
  const location = useLocation();
  const { isSignedIn, isLoaded, user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail && userEmail.toLowerCase().includes('priyamsingh504');
  const isLawyer = userEmail && (
    userEmail.toLowerCase().includes('shruti') ||
    userEmail.toLowerCase().includes('prince') ||
    userEmail.toLowerCase().includes('singhshruti11122002')
  );

  if (isLoaded && isSignedIn) {
    if (isAdmin) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    if (isLawyer) return <Navigate to={ROUTES.LAWYER_DASHBOARD} replace />;
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const returnTo = location.state?.returnTo || (isAdmin ? ROUTES.ADMIN_DASHBOARD : isLawyer ? ROUTES.LAWYER_DASHBOARD : ROUTES.DASHBOARD);

  return (
    <div className="min-h-screen bg-ct-void flex items-center justify-center px-4 pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-court-gold text-ct-void font-zentry text-lg font-black shadow-gold-glow">
              NS
            </div>
          </div>
          <h1 className="font-cormorant text-3xl font-bold text-ct-ivory">
            Welcome Back
          </h1>
          <p className="font-general text-[10px] uppercase tracking-widest text-ct-gold/80 mt-1">
            NyayaSetu · Justice. Simplified.
          </p>
        </div>

        <SignIn
          routing="hash"
          fallbackRedirectUrl={returnTo}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default SignInPage;
