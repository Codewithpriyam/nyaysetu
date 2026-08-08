/**
 * NyayaSetu — Privacy Policy Page
 */

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        <div className="court-card-surface p-8 sm:p-10 border border-ct-gold/40">
          <span className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold block mb-2">
            LEGAL & PRIVACY COMPLIANCE
          </span>
          <h1 className="font-cormorant text-4xl font-bold text-ct-ivory mb-6">Privacy Policy</h1>

          <div className="font-inter text-xs sm:text-sm text-ct-ivory/80 space-y-4 leading-relaxed">
            <p>
              NyayaSetu is committed to safeguarding the privacy of citizens, advocates, and platform users. This Privacy Policy details how we collect, store, encrypt, and process personal data under the Digital Personal Data Protection Act (DPDP Act, 2023) of India.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">1. Data Collection & Authentication</h3>
            <p>
              User authentication is managed via Clerk's OAuth2 infrastructure. We store only essential profile fields (name, verified email address, Clerk User ID, and role) in our MySQL database. Passwords are never handled or stored on NyayaSetu servers.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">2. Manual UPI Payments & Screenshots</h3>
            <p>
              Transaction Reference Numbers (UTRs) and payment screenshot files are stored securely with strict object-level authorization rules. Payment records are visible only to the citizen who submitted the payment and the designated Bar Council advocate.
            </p>
            <h3 className="font-cormorant text-xl font-bold text-ct-gold pt-2">3. Encrypted Vault Storage</h3>
            <p>
              Evidence files and court case documents uploaded to NyayaSetu Case Vault are protected by strict access control lists (ACLs) and restricted to authorized parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
