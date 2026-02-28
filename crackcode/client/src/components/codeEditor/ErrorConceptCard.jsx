import { useState } from 'react';



//  Header: concept title (like  "Variable Definition")
//   Body:   conceptLesson + fixDirection (only when expanded)
 
//   data comes from te  aiAnalysis field on the test result object
//    { conceptTitle, conceptLesson, fixDirection }
 


const ErrorConceptCard = ({ conceptTitle, conceptLesson, fixDirection }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if there's no concept data
  if (!conceptTitle) return null;

  return (
    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-950/20 overflow-hidden">

      {/* Header / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left 
                   hover:bg-amber-900/20 transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          {/* Book icon */}
          <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-300 text-xs font-semibold">
            Concept: {conceptTitle}
          </span>
        </div>

        {/* Chevron — rotates when open */}
        <svg
          className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="px-3 pb-3 space-y-2.5">
          <div className="h-px bg-amber-500/20" />

          {/* Concept lesson */}
          {conceptLesson && (
            <div>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide mb-1">
                What this means
              </p>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                {conceptLesson}
              </p>
            </div>
          )}

          {/* Fix direction (hint without solution) */}
          {fixDirection && (
            <div className="bg-amber-900/30 rounded px-2.5 py-2">
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide mb-1">
                Where to look
              </p>
              <p className="text-xs text-amber-200 leading-relaxed">
                {fixDirection}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorConceptCard;
