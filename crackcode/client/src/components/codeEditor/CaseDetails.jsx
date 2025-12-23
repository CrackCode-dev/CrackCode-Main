import React from 'react';
import { useEditor } from '../../context/code-editor/EditorContext';
import CaseHeader from './CaseHeader';
import ObjectivesList from './ObjectivesList';
import RequestClueButton from './RequestClueButton';
import ExampleCard from './ExampleCard';

const CaseDetails = () => {
  const { currentProblem, loading } = useEditor();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-cyan-400 text-lg">Loading case files...</div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-red-400 text-lg">Case file not found</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1a1a1a] text-gray-100 p-8 overflow-y-auto">
      {/* Case Header */}
      <CaseHeader 
        caseNumber={currentProblem.caseNumber}
        difficulty={currentProblem.difficulty}
      />

      {/* Case Title */}
      <h1 className="text-3xl font-bold text-white mb-4">
        {currentProblem.title}
      </h1>

      {/* Case Description with Detective Narrative */}
      <p className="text-gray-300 text-base leading-relaxed mb-8">
        {currentProblem.description}
      </p>

      {/* Objectives Section */}
      <ObjectivesList objectives={currentProblem.objectives} />

      {/* Request Clue Button */}
      <RequestClueButton clue={currentProblem.clue} />

      {/* Example Card */}
      <ExampleCard example={currentProblem.example} />
    </div>
  );
};

export default CaseDetails;