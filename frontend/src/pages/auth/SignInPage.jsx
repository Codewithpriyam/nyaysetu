/**
 * NyayaSetu — Sign In Page
 * Clerk SignIn component wrapped in the NyayaSetu dark courtroom + gold theme.
 * After sign-in, redirects to the `returnTo` location saved before auth, or /dashboard.
 */
import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const SignInPage = () => {
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/dashboard';

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
          redirectUrl={returnTo}
          afterSignInUrl={returnTo}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default SignInPage;
