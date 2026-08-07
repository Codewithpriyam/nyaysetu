/**
 * NyayaSetu — Sign Up Page
 * Clerk SignUp component wrapped in the NyayaSetu dark courtroom + gold theme.
 * Public sign-up — creates normal citizen users only.
 */
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="min-h-screen bg-ct-void flex items-center justify-center px-4 pt-28 pb-16">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-court-gold text-ct-void font-zentry text-lg font-black shadow-gold-glow">
            NS
          </div>
        </div>
        <h1 className="font-cormorant text-3xl font-bold text-ct-ivory">
          Create Your Account
        </h1>
        <p className="font-general text-[10px] uppercase tracking-widest text-ct-gold/80 mt-1">
          NyayaSetu · Your Legal Rights, Simplified.
        </p>
      </div>

      <SignUp
        routing="hash"
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  </div>
);

export default SignUpPage;
