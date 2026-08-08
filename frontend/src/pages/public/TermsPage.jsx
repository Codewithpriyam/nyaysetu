/**
 * NyayaSetu — Terms & Conditions Page
 */

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40">
          <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold block mb-2">
            LEGAL TERMS OF SERVICE
          </span>
          <h1 className="font-cormorant text-4xl font-bold text-ct-ivory mb-6">Terms & Conditions</h1>

          <div className="font-inter text-xs sm:text-sm text-ct-ivory/80 space-y-4 leading-relaxed">
            <p>
              Welcome to NyayaSetu. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">1. Informational Guidance Disclaimer</h3>
            <p>
              NyayaSetu AI Copilot provides informational guidance based on Indian statutory law. NyayaSetu is an technology platform and does NOT provide legal representation. AI guidance is not a substitute for formal advice from a qualified advocate enrolled with the Bar Council of India.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">2. Direct Lawyer UPI Payments</h3>
            <p>
              NyayaSetu facilitates direct consultation bookings where citizens pay consultation fees directly to the selected advocate's verified UPI account with zero platform markup. Verification of UTR reference numbers is conducted manually by the advocate.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">3. User Conduct</h3>
            <p>
              Users agree not to upload fraudulent UTR reference numbers, malicious files, or offensive content to the platform. Violation of these terms may result in account termination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
