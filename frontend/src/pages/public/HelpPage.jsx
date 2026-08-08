/**
 * NyayaSetu — Help Center Page
 */

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40">
          <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold block mb-2">
            KNOWLEDGE BASE & GUIDES
          </span>
          <h1 className="font-cormorant text-4xl font-bold text-ct-ivory mb-6">Help Center</h1>

          <div className="font-inter text-xs sm:text-sm text-ct-ivory/80 space-y-4 leading-relaxed">
            <h3 className="font-cormorant text-xl font-bold text-ct-gold">How to Book a Video Consultation</h3>
            <p>
              1. Browse Advocates by category or court district.<br />
              2. Select session duration (e.g. 20 mins) to view the auto-calculated fee.<br />
              3. Scan the advocate's direct UPI QR code and pay via GPay, PhonePe, or Paytm.<br />
              4. Submit your 12-digit UTR transaction reference number.<br />
              5. Once verified by the advocate, the Google Meet join link activates in your Dashboard.
            </p>

            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">How to Track a Legal Case</h3>
            <p>
              Navigate to "My Cases" from your dashboard to view the stage-by-stage progression timeline from filing to final verdict, hearing dates, and document vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
