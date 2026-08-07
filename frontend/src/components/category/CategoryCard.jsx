/**
 * NyayaSetu — CategoryCard Component
 * Inspired by Reference 2 layout + Diagonal Image Cut + BentoTilt 3D Hover.
 */

import { Link } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import { buildRoute, ROUTES } from '@/constants/routes';
import BentoTilt from '@/components/common/BentoTilt';

const CategoryCard = ({ category }) => {
  const detailUrl = buildRoute(ROUTES.CATEGORY, { slug: category.slug || category.id });
  const categoryTitle = category.title || category.label || 'Legal Guidance';

  return (
    <BentoTilt className="h-full w-full" tiltAmount={6}>
      <Link
        to={detailUrl}
        id={`cat-card-${category.id}`}
        className="group relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl border border-ct-gold/30 bg-ct-card p-6 shadow-court-card transition-all duration-500 hover:border-ct-gold hover:shadow-court-hover"
        aria-label={`Explore ${categoryTitle} legal guidance`}
      >
        {/* Top Image Box with Diagonal Cut Effect & Icon Overlay */}
        <div className="relative mb-4 h-40 sm:h-44 w-full overflow-hidden rounded-xl bg-ct-void border border-ct-gold/20">
          <img
            src={category.image}
            alt={categoryTitle}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ct-card via-ct-card/30 to-transparent" />

          {/* Category Icon Badge */}
          <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ct-void/85 backdrop-blur-md border border-ct-gold/40 text-xl text-ct-gold shadow-gold-glow">
            {category.icon}
          </div>

          {/* Rights Count Badge */}
          <div className="absolute bottom-3 right-3 rounded-full border border-ct-gold/40 bg-ct-void/90 px-3 py-1 text-[10px] font-general uppercase tracking-widest text-ct-gold font-bold backdrop-blur-md">
            {category.rightsCount || 15} Rights
          </div>
        </div>

        {/* Text Content Area */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-ct-ivory leading-tight group-hover:text-ct-gold transition-colors duration-300">
              {categoryTitle}
            </h3>

            <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed line-clamp-2">
              {category.description}
            </p>
          </div>

          {/* Card Footer */}
          <div className="mt-4 border-t border-ct-gold/15 pt-3 flex items-center justify-between">
            <span className="font-general text-[10px] uppercase tracking-widest text-ct-gold/80 font-bold group-hover:text-ct-gold transition-colors">
              Explore Rights
            </span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ct-gold/10 text-ct-gold transition-all duration-300 group-hover:bg-ct-gold group-hover:text-ct-void group-hover:scale-110 shadow-gold-glow">
              <TiLocationArrow className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </BentoTilt>
  );
};

export default CategoryCard;
