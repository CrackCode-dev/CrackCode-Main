import React from 'react';

const ExampleCard = ({ example }) => {
  if (!example) return null;

  const inputDisplay = typeof example.input === 'object'
    ? JSON.stringify(example.input, null, 2)
    : example.input;

  const outputDisplay = typeof example.output === 'object'
    ? JSON.stringify(example.output, null, 2)
    : example.output;

  return (
    <div className="rounded-xl border border-gray-800 bg-[#161616] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Example</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Input */}
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Input</p>
          <pre className="bg-[#0d0d0d] rounded-lg px-3 py-2.5 text-xs text-cyan-300 font-mono
                          border border-gray-800/60 whitespace-pre-wrap overflow-x-auto">
            {inputDisplay}
          </pre>
        </div>

        {/* Output */}
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Output</p>
          <pre className="bg-[#0d0d0d] rounded-lg px-3 py-2.5 text-xs text-emerald-300 font-mono
                          border border-gray-800/60 whitespace-pre-wrap overflow-x-auto">
            {outputDisplay}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExampleCard;