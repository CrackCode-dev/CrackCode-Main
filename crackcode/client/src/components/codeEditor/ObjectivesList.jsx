import React from 'react';

const ObjectivesList = ({ objectives }) => {
  return (
    <div className="mb-8">
      <h2 className="text-cyan-400 text-xl font-semibold mb-4 uppercase tracking-wide">
        Your Objectives
      </h2>
      
      <ol className="space-y-3">
        {objectives?.map((objective, index) => (
          <li key={index} className="flex items-start gap-3 text-gray-300">
            <span className="text-cyan-400 font-bold text-lg min-w-[24px]">
              {index + 1}.
            </span>
            <span className="leading-relaxed">{objective}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObjectivesList;