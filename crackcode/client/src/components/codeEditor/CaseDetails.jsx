import React from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import CaseHeader from './CaseHeader';
import ObjectivesList from './ObjectivesList';
import RequestClueButton from './RequestClueButton';
import ExampleCard from './ExampleCard';

const CaseDetails = () => {
  const { currentProblem, loading } = useEditor();

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 bg-[#111111]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-cyan-500 text-xs font-mono animate-pulse">Loading case file…</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-full flex items-center justify-center bg-[#111111]">
        <p className="text-red-400 text-sm font-mono">Case file not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#111111] text-gray-100">
      {/* Sticky top header */}
      <div className="sticky top-0 z-10 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/60 px-5 py-4">
        <CaseHeader
          caseNumber={currentProblem.caseNumber}
          difficulty={currentProblem.difficulty}
        />
        <h1 className="text-lg font-bold text-white leading-tight mt-2">
          {currentProblem.title}
        </h1>
      </div>

      {/* Scrollable body */}
      <div className="px-5 py-5 space-y-6">
        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">
          {currentProblem.description}
        </p>

        <ObjectivesList objectives={currentProblem.objectives} />

        <RequestClueButton clue={currentProblem.clue} />

        <ExampleCard example={currentProblem.example} />
      </div>
    </div>
  );
};

export default CaseDetails;