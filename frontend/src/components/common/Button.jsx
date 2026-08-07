/**
 * NyayaSetu — Button Component
 * Preserved skew-text hover animation from reference repo.
 * Updated:
 *  - Luminous bright gold background with crisp white text (per user request).
 *  - High visibility contrast across all dark courtroom surfaces.
 */

import { Link } from 'react-router-dom';
import clsx from 'clsx';

/**
 * @param {'gold'|'outline'|'ghost'|'crimson'} variant
 * @param {boolean} asLink - render as React Router <Link>
 * @param {string} to - route path (required if asLink=true)
 */
const Button = ({
  id,
  title,
  rightIcon,
  leftIcon,
  containerClass,
  variant = 'gold',
  asLink = false,
  to,
  href,
  onClick,
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}) => {
  const baseClass = clsx(
    'group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full',
    'transition-all duration-300 select-none flex items-center justify-center',
    {
      // Gold (primary CTA with bright gold background & crisp white text)
      'bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] text-white font-bold shadow-gold-glow border border-ct-gold/60 hover:shadow-lg hover:scale-105':
        variant === 'gold',
      // Outline gold with white text on hover
      'border-2 border-ct-gold text-ct-gold font-bold px-7 py-3 hover:bg-ct-gold hover:text-white shadow-gold-glow':
        variant === 'outline',
      // Ghost
      'text-ct-ivory px-7 py-3 hover:text-ct-gold':
        variant === 'ghost',
      // Crimson (danger/urgent)
      'bg-crimson-600 text-white font-bold px-7 py-3 hover:bg-crimson-500 shadow-md':
        variant === 'crimson',
      // Disabled state
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    containerClass
  );

  const content = (
    <>
      {leftIcon && <span className="mr-1.5 flex items-center text-white">{leftIcon}</span>}

      <span className="relative inline-flex overflow-hidden font-general text-xs font-bold uppercase tracking-widest text-white">
        {/* Text slides out on hover */}
        <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12 text-white">
          {title}
        </span>
        {/* Clone slides in from below */}
        <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0 text-white">
          {title}
        </span>
      </span>

      {rightIcon && <span className="ml-1.5 flex items-center text-white">{rightIcon}</span>}
    </>
  );

  if (asLink && to) {
    return (
      <Link id={id} to={to} className={baseClass} aria-label={ariaLabel || title}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        id={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        aria-label={ariaLabel || title}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
    >
      {content}
    </button>
  );
};

export default Button;
