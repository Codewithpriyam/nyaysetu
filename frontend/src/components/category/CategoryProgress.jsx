/**
 * NyayaSetu — CategoryProgress Component
 * Fix for visibility issue:
 *  - Non-active buttons now have bright, legible Ivory & Gold text (#F4EBDD / #C89B52).
 *  - Clearly visible at all times without needing mouse hover.
 *  - Active button highlighted with gold background & dark text.
 */

const CategoryProgress = ({ activeSet = 1, totalSets = 3, onSelectSet }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {Array.from({ length: totalSets }).map((_, idx) => {
        const setNum = idx + 1;
        const isActive = activeSet === setNum;

        return (
          <div key={setNum} className="flex items-center gap-4">
            {/* Step Button */}
            <button
              onClick={() => onSelectSet && onSelectSet(setNum)}
              className={`
                group flex items-center gap-2.5 rounded-full px-5 py-2 transition-all duration-300 border
                ${isActive
                  ? 'bg-ct-gold text-ct-void border-ct-gold shadow-gold-glow font-bold scale-105'
                  : 'bg-ct-card border-ct-gold/40 text-ct-ivory hover:border-ct-gold hover:bg-ct-gold/15'
                }
              `}
              aria-label={`Go to Set ${setNum}`}
            >
              <span className={`font-zentry text-xs font-black ${isActive ? 'text-ct-void' : 'text-ct-gold'}`}>
                0{setNum}
              </span>
              <span className={`font-general text-[11px] uppercase tracking-widest font-bold ${isActive ? 'text-ct-void' : 'text-ct-ivory'}`}>
                SET {setNum}
              </span>
            </button>

            {/* Line Divider */}
            {idx < totalSets - 1 && (
              <div
                className={`
                  h-0.5 w-12 sm:w-16 rounded-full transition-all duration-500
                  ${activeSet > setNum ? 'bg-ct-gold' : 'bg-ct-gold/30'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProgress;
