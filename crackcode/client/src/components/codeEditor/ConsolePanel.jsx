import React, { useEffect } from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
//import TestCaseResult from './TestCaseResult';
import AIAssistantChat from './AIAssistantChat';

const ConsolePanel = () => {
  const { activeTab, setActiveTab, testResults, isExecuting } = useEditor();

  // ✅ Auto-switch to error-log when tests are running or completed
  useEffect(() => {
    if (isExecuting || testResults.length > 0) {
      setActiveTab('error-log');
    }
  }, [isExecuting, testResults, setActiveTab]);

  return (
    <div className="h-[280px] bg-[#1e1e1e] border-t-2 border-gray-800 flex flex-col">
      {/* Tab Headers */}
      <div className="bg-[#2d2d30] border-b border-gray-800 flex items-center px-4">
        <button
          onClick={() => setActiveTab('error-log')}
          className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2
                     ${activeTab === 'error-log' 
                       ? 'text-red-400 border-b-2 border-red-400' 
                       : 'text-gray-400 hover:text-gray-300'
                     }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Case Error Log
        </button>

        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2
                     ${activeTab === 'ai-assistant' 
                       ? 'text-cyan-400 border-b-2 border-cyan-400' 
                       : 'text-gray-400 hover:text-gray-300'
                     }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          AI Assistant
        </button>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'error-log' ? (
          <div className="p-4">
            {testResults.length === 0 && !isExecuting ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">Click "Execute" to run your code and see test results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <TestCaseResult key={index} result={result} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <AIAssistantChat />
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;