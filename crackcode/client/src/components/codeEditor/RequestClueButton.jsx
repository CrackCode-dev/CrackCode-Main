import React from 'react';
import { useEditor } from '../../context/code-editor/EditorContext';

const RequestClueButton = ({ clue }) => {
  const { showClue, setShowClue } = useEditor();

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowClue(!showClue)}
        className="w-full bg-[#252525] hover:bg-[#2d2d2d] border border-cyan-500 text-cyan-400 
                   px-6 py-3 rounded-lg flex items-center justify-between transition-all duration-200
                   hover:border-cyan-400 group"
      >
        <div className="flex items-center gap-3">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
          <span className="font-semibold">Request a Clue</span>
        </div>
        
        <svg 
          className={`w-5 h-5 transition-transform duration-200 ${showClue ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showClue && (
        <div className="mt-4 bg-[#252525] border border-cyan-500/30 rounded-lg p-6 animate-slideDown">
          <div className="flex items-start gap-3">
            <svg 
              className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Detective's Hint:</h3>
              <p className="text-gray-300 leading-relaxed italic">{clue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestClueButton;