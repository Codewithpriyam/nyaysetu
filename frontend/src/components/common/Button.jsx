/**
 * NyayaSetu — Button Component (Apple Liquid Glass)
 *
 * Premium capsule-shaped glass buttons with:
 *  - Translucent glass material + backdrop blur
 *  - Soft inner highlight + specular reflection
 *  - Light sweep animation on hover
 *  - Subtle scale ~1.02 on hover, ~0.97 on press
 *  - Preserved text skew animation from original
 *  - Multiple variants: gold (primary), outline, ghost, crimson
 *  - All rendered as glass-button
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
    'glass-button group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full',
    'select-none',
    {
      // Gold (primary CTA — glass-button-primary)
      'glass-button-primary px-6 py-2.5':
        variant === 'gold',
      // Outline — glass with stronger border
      'glass-button-secondary px-7 py-3 border-ct-gold/30 hover:border-ct-gold/50':
        variant === 'outline',
      // Ghost — minimal glass
      'bg-transparent border-transparent backdrop-blur-none px-7 py-3 text-ct-ivory hover:text-ct-gold hover:bg-ct-gold/5':
        variant === 'ghost',
      // Crimson (danger/urgent)
      'px-7 py-3 font-bold':
        variant === 'crimson',
      // Disabled state
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    containerClass
  );

  // Crimson needs custom inline styles since it's a special variant
  const crimsonStyle = variant === 'crimson' ? {
    background: 'rgba(220, 38, 38, 0.15)',
    borderColor: 'rgba(220, 38, 38, 0.30)',
  } : undefined;

  const content = (
    <>
      {leftIcon && <span className="mr-1.5 flex items-center text-current">{leftIcon}</span>}

      <span className="relative inline-flex overflow-hidden font-general text-xs font-bold uppercase tracking-widest text-current">
        {/* Text slides out on hover */}
        <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </span>
        {/* Clone slides in from below */}
        <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </span>
      </span>

      {rightIcon && <span className="ml-1.5 flex items-center text-current">{rightIcon}</span>}
    </>
  );

  if (asLink && to) {
    return (
      <Link id={id} to={to} className={baseClass} style={crimsonStyle} aria-label={ariaLabel || title}>
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
        style={crimsonStyle}
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
      style={crimsonStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
    >
      {content}
    </button>
  );
};

export default Button;
