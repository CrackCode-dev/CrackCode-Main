import React from 'react';

const DIFFICULTY_STYLES = {
  easy:         { label: 'Easy',         cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  hard:         { label: 'Hard',         cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const CaseHeader = ({ caseNumber, difficulty }) => {
  const key = difficulty?.toLowerCase();
  const diff = DIFFICULTY_STYLES[key] || DIFFICULTY_STYLES.intermediate;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Case badge */}
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                       bg-amber-500/10 border border-amber-500/30 text-amber-400
                       text-[11px] font-bold uppercase tracking-wider">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
        </svg>
        Case #{caseNumber}
      </span>

      {/* Difficulty badge */}
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border
                        text-[11px] font-semibold uppercase tracking-wider ${diff.cls}`}>
        {diff.label}
      </span>
    </div>
  );
};

export default CaseHeader;