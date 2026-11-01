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
    { label: 'Help Center',       to: ROUTES.HELP },
    { label: 'FAQ',               to: ROUTES.FAQ },
  ],
  'Lawyers': [
    { label: 'Find a Lawyer',     to: ROUTES.LAWYERS },
    { label: 'Request Consultation', to: ROUTES.LAWYERS },
  ],
  'Platform & Legal': [
    { label: 'About Developer',  to: ROUTES.ABOUT },
    { label: 'Contact Support',   to: ROUTES.CONTACT },
    { label: 'Privacy Policy',   to: ROUTES.PRIVACY },
    { label: 'Terms of Use',     to: ROUTES.TERMS },
  ],
};

const Footer = () => (
  <footer className="bg-ct-void border-t border-[#EAECF0]/10">
    <div className="section-container py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-black border border-orange/30 shrink-0">
              <video
                src="/logo.mp4"
                poster="/logo-poster.png"
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                className="h-full w-full object-contain p-0.5 pointer-events-none select-none"
                aria-hidden="true"
              />
            </div>
            <span className="font-calluna text-xl font-bold text-ct-ivory">
              NyayaSetu
            </span>
          </div>
          <p className="font-inter text-sm text-ct-ivory/80 leading-relaxed max-w-xs">
            Know your rights. Understand your options. Take the right action.
          </p>

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg border border-[#EAECF0]/15 bg-ct-card/50 p-3">
            <p className="font-inter text-[10px] uppercase tracking-widest text-ct-gold font-bold mb-1">
              Important Disclaimer
            </p>
            <p className="font-inter text-xs text-ct-muted leading-relaxed">
              NyayaSetu provides legal information, not legal advice.
              For specific legal matters, consult a qualified lawyer.
            </p>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="mb-4 font-inter text-xs uppercase tracking-widest text-ct-gold font-bold">
              {heading}
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-inter text-sm text-ct-ivory/80 hover:text-ct-gold transition-colors duration-200"
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
        <p className="font-inter text-xs text-ct-muted">
          © {new Date().getFullYear()} NyayaSetu. All rights reserved.
        </p>
        <p className="font-inter text-xs text-ct-muted">
          Legal information platform for India 🇮🇳
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
