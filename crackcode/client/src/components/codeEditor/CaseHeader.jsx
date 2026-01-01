import React from 'react';

const CaseHeader = ({ caseNumber, difficulty }) => {
  const difficultyColors = {
    easy: 'bg-green-500 text-green-900',
    intermediate: 'bg-yellow-500 text-yellow-900',
    hard: 'bg-red-500 text-red-900',
  };

  const difficultyBg = difficultyColors[difficulty?.toLowerCase()] || difficultyColors.intermediate;

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Case Number Badge */}
      <div className="bg-yellow-600 text-black px-4 py-1 rounded font-bold text-sm uppercase tracking-wider">
        CASE #{caseNumber}
      </div>

      {/* Difficulty Badge */}
      <div className={`px-4 py-1 rounded font-bold text-sm uppercase tracking-wider ${difficultyBg}`}>
        DIFFICULTY: {difficulty?.toUpperCase()}
      </div>
    </div>
  );
};

export default CaseHeader;