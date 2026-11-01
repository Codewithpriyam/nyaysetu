/**
 * NyayaSetu — CategoryCard Component
 * FlexCarousel Liquid Preset Inspiration:
 *  - Premium translucent dark surface with backdrop blur
 *  - NyayaSetu 4-colour palette: Orange (#FE7F2D), Deep Blue (#233D4D), Black (#000000), Light Gray (#EAECF0)
 *  - Liquid image banner with smooth hover zoom & dark vignette
 *  - Category emoji badge + statutory rights count
 *  - Crisp legal title + concise description + statutory situation pills
 *  - Illuminated orange CTA button with animated arrow
 *  - 3D BentoTilt perspective hover interaction
 */

import { Link } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import { buildRoute, ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';

const CategoryCard = ({ category, index = 0, isActive = false, className = '' }) => {
  const detailUrl = buildRoute(ROUTES.CATEGORY, { slug: category.slug || category.id });
  const categoryTitle = category.title || category.label || 'Legal Guidance';
  const displayIndex = String(index + 1).padStart(2, '0');
  const setNumber = Math.floor(index / 3) + 1;

  return (
    <BentoTilt className={`h-full w-full ${className}`} tiltAmount={6}>
      <Link
        to={detailUrl}
        id={`cat-card-${category.id}`}
        className={`group relative flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl border transition-all duration-500 backdrop-blur-xl p-5 sm:p-6 select-none ${
          isActive
            ? 'border-orange/60 bg-gradient-to-b from-[#14232C]/95 via-[#0C161D]/95 to-black/95 shadow-[0_12px_40px_rgba(254,127,45,0.22)]'
            : 'border-deep-blue/80 bg-gradient-to-b from-[#101A22]/90 via-[#0A1218]/90 to-black/90 hover:border-orange/50 hover:shadow-[0_12px_36px_rgba(254,127,45,0.16)]'
        }`}
        aria-label={`Explore ${categoryTitle} legal guidance`}
      >
        {/* Subtle Specular Top Reflection */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Top Media Banner */}
        <div className="relative mb-3.5 h-44 sm:h-48 w-full overflow-hidden rounded-2xl bg-black border border-deep-blue/60 shrink-0">
          <img
            src={category.image}
            alt={categoryTitle}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {/* Liquid Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1218] via-[#0A1218]/30 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />

          {/* Top-Left: Category Icon with Glass Backdrop */}
          <div className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/80 backdrop-blur-md border border-orange/30 text-lg shadow-md">
            {category.icon}
          </div>

          {/* Top-Right: Statutory Rights Count Badge */}
          <div className="absolute top-3 right-3 rounded-full border border-orange/40 bg-black/80 px-2.5 py-1 text-[10px] font-inter uppercase tracking-widest text-orange font-bold backdrop-blur-md shadow-sm">
            {category.rightsCount || 15} Rights
          </div>

          {/* Bottom-Left: Set Tag & Guide Index */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-deep-blue/50">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            <span className="font-inter text-[9px] uppercase tracking-[0.16em] text-light-gray/90 font-semibold">
              SET 0{setNumber} · GUIDE {displayIndex}
            </span>
          </div>
        </div>

        {/* Middle: Content Area */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-calluna text-2xl lg:text-[1.65rem] font-bold text-light-gray leading-tight group-hover:text-orange transition-colors duration-300">
              {categoryTitle}
            </h3>

            <p className="mt-2 font-inter text-xs sm:text-sm text-light-gray/70 leading-relaxed line-clamp-2">
              {category.description}
            </p>

            {/* Everyday Situation Preview Pills */}
            {category.examples && category.examples.length > 0 && (
              <div className="mt-3.5 space-y-1.5">
                {category.examples.slice(0, 2).map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-deep-blue/30 border border-deep-blue/60 px-2.5 py-1 text-[11px] text-light-gray/80 truncate font-inter"
                    title={ex}
                  >
                    <span className="h-1 w-1 rounded-full bg-orange shrink-0" />
                    <span className="truncate">{ex}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer: Clear Action CTA */}
          <div className="mt-4 border-t border-deep-blue/60 pt-3 flex items-center justify-between">
            <span className="font-inter text-xs uppercase tracking-widest text-orange font-bold group-hover:text-orange/90 transition-colors flex items-center gap-1">
              <span>Explore Rights</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/15 text-orange border border-orange/30 transition-all duration-300 group-hover:bg-orange group-hover:text-black group-hover:scale-110 shadow-sm shadow-orange/20">
              <TiLocationArrow className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </BentoTilt>
  );
};

export default CategoryCard;
