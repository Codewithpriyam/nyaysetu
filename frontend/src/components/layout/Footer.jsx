/**
 * NyayaSetu — Footer
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const FOOTER_LINKS = {
  'Legal Help': [
    { label: 'Know Your Rights',  to: ROUTES.KNOW_YOUR_RIGHTS },
    { label: 'Legal Categories',  to: ROUTES.CATEGORIES },
    { label: 'Legal Resources',   to: ROUTES.RESOURCES },
  ],
  'Lawyers': [
    { label: 'Find a Lawyer',    to: ROUTES.LAWYERS },
    { label: 'Request Consultation', to: ROUTES.LAWYERS },
  ],
  'Platform': [
    { label: 'About NyayaSetu', to: '#about' },
    { label: 'Privacy Policy',  to: '#privacy' },
    { label: 'Terms of Use',    to: '#terms' },
    { label: 'Disclaimer',      to: '#disclaimer' },
  ],
};

const Footer = () => (
  <footer className="bg-navy-950 border-t border-gold-500/10">
    <div className="section-container py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-navy-900 font-zentry text-sm font-black">
              NS
            </div>
            <span className="font-cormorant text-xl font-bold text-parchment-100">
              NyayaSetu
            </span>
          </div>
          <p className="font-inter text-sm text-parchment-300 leading-relaxed max-w-xs">
            Know your rights. Understand your options. Take the right action.
          </p>

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg border border-gold-500/20 bg-navy-800/50 p-3">
            <p className="font-general text-[10px] uppercase tracking-widest text-gold-500 mb-1">
              Important Disclaimer
            </p>
            <p className="font-inter text-xs text-parchment-400 leading-relaxed">
              NyayaSetu provides legal information, not legal advice.
              For specific legal matters, consult a qualified lawyer.
            </p>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="mb-4 font-general text-xs uppercase tracking-widest text-gold-400">
              {heading}
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-inter text-sm text-parchment-300 hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 gold-divider" />

      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-inter text-xs text-parchment-400">
          © {new Date().getFullYear()} NyayaSetu. All rights reserved.
        </p>
        <p className="font-inter text-xs text-parchment-400">
          Legal information platform for India 🇮🇳
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
