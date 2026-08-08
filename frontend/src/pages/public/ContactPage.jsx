/**
 * NyayaSetu — Contact Us Page
 */

import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="rounded-full border border-ct-gold/40 bg-ct-gold/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold">
            SUPPORT & ENQUIRIES
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight mt-2">
            Get in Touch with <span className="text-ct-gold italic">NyayaSetu</span>
          </h1>
          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted">
            Have questions about advocate enrollment, consultation bookings, or legal notices? Our team is here to assist.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400">
            Thank you! Your message has been sent. Our support team will get back to you within 24 hours.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="court-card-surface p-8 border border-ct-gold/30">
            <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-6">Contact Information</h3>
            <div className="space-y-4 font-inter text-xs text-ct-ivory/80">
              <div className="flex items-center gap-3">
                <HiMail className="text-ct-gold" size={20} />
                <span>support@nyaysetu.in</span>
              </div>
              <div className="flex items-center gap-3">
                <HiPhone className="text-ct-gold" size={20} />
                <span>+91 1800 123 4900 (Toll Free Legal Helpline)</span>
              </div>
              <div className="flex items-center gap-3">
                <HiLocationMarker className="text-ct-gold" size={20} />
                <span>NyayaSetu LegalTech Tower, Exhibition Road, Patna, Bihar 800001</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="court-card-surface p-8 border border-ct-gold/30 space-y-4">
            <h3 className="font-cormorant text-2xl font-bold text-ct-ivory mb-4">Send Us a Message</h3>
            <input
              type="text"
              required
              placeholder="Your Full Name"
              className="w-full rounded-xl border border-ct-gold/30 bg-ct-void px-4 py-2.5 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="Your Email Address"
              className="w-full rounded-xl border border-ct-gold/30 bg-ct-void px-4 py-2.5 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
            />
            <textarea
              required
              placeholder="How can we assist you?"
              className="w-full rounded-xl border border-ct-gold/30 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              rows={4}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-ct-gold py-3 font-general text-xs font-bold uppercase tracking-widest text-ct-void shadow-gold-glow hover:bg-ct-gold-light"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
