import React from 'react';

const ObjectivesList = ({ objectives }) => {
  if (!objectives?.length) return null;

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
        Objectives
      </h2>
      <ol className="space-y-2.5">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-3 group">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30
                             text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-gray-300 text-sm leading-relaxed">{obj}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObjectivesList;