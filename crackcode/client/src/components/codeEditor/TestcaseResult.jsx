import React from 'react';

const TestCaseResult = ({ result }) => {
  const getStatusColor = () => {
    switch (result.status) {
      case 'passed':
        return 'border-green-500 bg-green-900/20';
      case 'failed':
        return 'border-red-500 bg-red-900/20';
      case 'running':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'passed':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'running':
        return (
          <svg className="w-5 h-5 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`border-l-4 rounded p-4 mb-3 ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <span className="font-semibold text-white">{result.detectiveMessage}</span>
      </div>

      {result.narrativeMessage && (
        <p className="text-gray-300 text-sm mb-3 italic pl-8">
          "{result.narrativeMessage}"
        </p>
      )}

      {result.error && (
        <div className="bg-[#1a1a1a] rounded p-3 mt-2 border border-red-500/30">
          <div className="text-red-400 text-xs font-semibold mb-1">ERROR:</div>
          <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
            {result.error}
          </pre>
        </div>
      )}

      {result.status === 'passed' && result.details && (
        <div className="text-gray-400 text-xs mt-2 pl-8 space-y-1">
          {result.details.input && <div>Input: {result.details.input}</div>}
          {result.details.expected && <div>Expected: {result.details.expected}</div>}
          {result.details.time && <div>Execution Time: {result.details.time}s</div>}
          {result.details.memory && <div>Memory: {result.details.memory}KB</div>}
        </div>
      )}

      {result.status === 'failed' && result.aiSuggestion && (
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-3 mt-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-cyan-400 text-xs font-semibold mb-1">Detective's Insight:</div>
              <p className="text-gray-300 text-xs leading-relaxed">{result.aiSuggestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseResult;