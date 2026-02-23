import React from 'react';

const ExampleCard = ({ example }) => {
  // Convert object to JSON string for display
  const inputDisplay = typeof example?.input === 'object' 
    ? JSON.stringify(example.input, null, 2) 
    : example?.input;
    
  const outputDisplay = typeof example?.output === 'object' 
    ? JSON.stringify(example.output, null, 2) 
    : example?.output;

  return (
    <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 text-lg">Example:</h3>
      
      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-2 font-semibold">Input</div>
        <div className="bg-[#1a1a1a] rounded p-4 font-mono text-sm text-gray-300 border border-gray-700 whitespace-pre-wrap">
          {inputDisplay}
        </div>
      </div>

      <div>
        <div className="text-gray-400 text-sm mb-2 font-semibold">Output</div>
        <div className="bg-[#1a1a1a] rounded p-4 font-mono text-sm text-gray-300 border border-gray-700 whitespace-pre-wrap">
          {outputDisplay}
        </div>
      </div>
    </div>
  );
};

export default ExampleCard;