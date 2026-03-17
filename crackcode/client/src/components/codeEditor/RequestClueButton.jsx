import React from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';

const RequestClueButton = ({ clue }) => {
  const { showClue, setShowClue } = useEditor();

  if (!clue) return null;

  return (
    <div className="mb-6">
      {/* Trigger button */}
      <button
        onClick={() => setShowClue(!showClue)}
        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl
                    border transition-all duration-200 font-medium text-sm
                    ${showClue
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                      : 'bg-[#1e1e1e] border-gray-700 text-gray-400 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5'
                    }`}
      >
        <div className="flex items-center gap-2.5">
          {/* Pulsing bulb icon */}
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                          ${showClue ? 'bg-amber-500/20' : 'bg-gray-800 group-hover:bg-amber-500/10'}`}>
            <svg className={`w-4 h-4 transition-colors ${showClue ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-400'}`}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span>Hint</span>
          {!showClue && (
            <span className="text-[10px] text-gray-600 ml-1 font-normal">(click to reveal)</span>
          )}
        </div>

        <svg className={`w-4 h-4 transition-transform duration-200 ${showClue ? 'rotate-180 text-amber-400' : 'text-gray-600'}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown content */}
      {showClue && (
        <div className="mt-2 rounded-xl border border-amber-500/20 bg-[#1a1710] overflow-hidden
                        animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header strip */}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/10">
            <span className="text-amber-400 text-sm">💡</span>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Detective's Hint</span>
          </div>

          {/* Hint text */}
          <div className="px-4 py-3">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{clue}"
            </p>
          </div>

          {/* Footer dismiss */}
          <div className="px-4 py-2 border-t border-amber-500/10 flex justify-end">
            <button
              onClick={() => setShowClue(false)}
              className="text-[10px] text-gray-600 hover:text-amber-400 transition-colors uppercase tracking-wide"
            >
              Hide hint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestClueButton;