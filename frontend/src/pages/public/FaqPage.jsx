/**
 * NyayaSetu — Frequently Asked Questions (FAQ) Page
 */

const FAQ_ITEMS = [
  {
    q: 'What is NyayaSetu?',
    a: 'NyayaSetu is an Indian LegalTech platform connecting citizens directly with verified Bar Council advocates, providing stage-by-stage case tracking, manual UPI payments with zero markup, and AI legal copilot guidance.'
  },
  {
    q: 'How does manual UPI payment verification work?',
    a: 'Citizens scan the selected advocate\'s specific QR code image and pay directly. After submitting the 12-digit UTR number, the advocate manually approves the payment, activating the video call link.'
  },
  {
    q: 'Is the AI Copilot legal advice binding?',
    a: 'No. NyayaSetu AI Copilot provides informational guidance based on statutory Indian law. It is not formal legal representation. Users are advised to consult a qualified lawyer for legal representation.'
  },
  {
    q: 'Are advocate profiles verified?',
    a: 'Yes. Advocate profiles are cross-referenced with Bar Council enrollment rolls across Jharkhand, Bihar, Delhi NCR, and other state rolls.'
  }
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
            QUESTIONS & ANSWERS
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight mt-2">
            Frequently Asked <span className="text-ct-gold italic">Questions</span>
          </h1>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="court-card-surface p-6 border border-ct-gold/30">
              <h3 className="font-cormorant text-xl font-bold text-ct-gold mb-2">Q: {faq.q}</h3>
              <p className="font-inter text-xs sm:text-sm text-ct-ivory/80 leading-relaxed">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
