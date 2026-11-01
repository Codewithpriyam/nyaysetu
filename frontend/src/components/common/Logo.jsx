/**
 * NyayaSetu — Animated Scales of Justice Logo Component
 * Video-powered logo (from logo.mp4) with poster image fallback.
 */

export const LogoBadge = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-11 w-11 sm:h-12 sm:w-12',
    xl: 'h-16 w-16 sm:h-20 sm:w-20',
  };

  const chosenSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden bg-black border border-orange/30 transition-all duration-300 group-hover:border-orange/60 shrink-0 ${chosenSize} ${className}`}
    >
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
  );
};

export default LogoBadge;
