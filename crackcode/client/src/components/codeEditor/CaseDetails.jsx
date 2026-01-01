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
    <div className="h-full bg-[#1a1a1a] text-gray-100 overflow-y-auto">
      {/* ✅ FIXED: Better padding and spacing */}
      <div className="p-8 space-y-6">
        <CaseHeader 
          caseNumber={currentProblem.caseNumber}
          difficulty={currentProblem.difficulty}
        />
        
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">
            {currentProblem.title}
          </h1>
          
          <p className="text-gray-300 text-base leading-relaxed">
            {currentProblem.description}
          </p>
        </div>
        
        <ObjectivesList objectives={currentProblem.objectives} />
        
        <RequestClueButton clue={currentProblem.clue} />
        
        <ExampleCard example={currentProblem.example} />
      </div>
    </div>
  );
};

export default CaseDetails;