/**
 * NyayaSetu — CategoryProgress Component
 * Accessible, clear Set switcher with Previous & Next controls.
 */

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const CategoryProgress = ({ activeSet = 1, totalSets = 3, onSelectSet, onPrev, onNext }) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
      {/* Previous Set Button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ct-gold/30 bg-ct-card text-ct-ivory hover:border-ct-gold hover:text-ct-gold transition-colors cursor-pointer"
          aria-label="Previous category set"
        >
          <HiChevronLeft size={18} />
        </button>
      )}

      {/* Set Number Pills */}
      {Array.from({ length: totalSets }).map((_, idx) => {
        const setNum = idx + 1;
        const isActive = activeSet === setNum;

        return (
          <div key={setNum} className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onSelectSet && onSelectSet(setNum)}
              className={`
                group flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 transition-all duration-300 border cursor-pointer
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
              <span className={`font-inter text-[10px] sm:text-[11px] uppercase tracking-widest font-bold ${isActive ? 'text-ct-void' : 'text-ct-ivory'}`}>
                SET {setNum}
              </span>
            </button>

            {/* Line Divider */}
            {idx < totalSets - 1 && (
              <div
                className={`
                  h-0.5 w-8 sm:w-12 rounded-full transition-all duration-500
                  ${activeSet > setNum ? 'bg-ct-gold' : 'bg-ct-gold/30'}
                `}
              />
            )}
          </div>
        );
      })}

      {/* Next Set Button */}
      {onNext && (
        <button
          onClick={onNext}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ct-gold/30 bg-ct-card text-ct-ivory hover:border-ct-gold hover:text-ct-gold transition-colors cursor-pointer"
          aria-label="Next category set"
        >
          <HiChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default CategoryProgress;
