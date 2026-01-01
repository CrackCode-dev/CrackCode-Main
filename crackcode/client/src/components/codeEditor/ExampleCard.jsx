import React from 'react';

const ExampleCard = ({ example }) => {
  return (
    <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 text-lg">Example:</h3>
      
      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-2 font-semibold">Input</div>
        <div className="bg-[#1a1a1a] rounded p-4 font-mono text-sm text-gray-300 border border-gray-700">
          {example?.input}
        </div>
      </div>

      <div>
        <div className="text-gray-400 text-sm mb-2 font-semibold">Output</div>
        <div className="bg-[#1a1a1a] rounded p-4 font-mono text-sm text-gray-300 border border-gray-700">
          {example?.output}
        </div>
      </div>
    </div>
  );
};

export default ExampleCard;