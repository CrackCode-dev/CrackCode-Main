import React, { useEffect, useRef } from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import TestCaseResult from './TestcaseResult';
import AIAssistantChat from './AIAssistantChat';


const TabBtn = ({ id, label, icon, active, onClick, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-semibold
                transition-all whitespace-nowrap border-b-2
                ${active
                  ? 'text-cyan-400 border-cyan-400 bg-[#1a1a1a]'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
                }`}
  >
    <span className="text-base leading-none">{icon}</span>
    {label}
    {badge > 0 && (
      <span className="ml-0.5 min-w-[16px] h-4 text-[10px] font-bold rounded-full
                       bg-red-500 text-white flex items-center justify-center px-1">
        {badge}
      </span>
    )}
  </button>
);

/* History entry card  */
const HistoryEntry = ({ entry, index }) => {
  const [open, setOpen] = React.useState(false);
  const allPassed = entry.passed === entry.total;
  const statusColor = allPassed ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-red-500/40 bg-red-900/10';

  return (
    <div className={`rounded-lg border ${statusColor} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${allPassed ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs font-mono text-gray-300 truncate">
            Run #{entry.runIndex} &nbsp;·&nbsp;
            <span className={allPassed ? 'text-emerald-400' : 'text-red-400'}>
              {entry.passed}/{entry.total} passed
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[10px] text-gray-600 font-mono">{entry.timestamp}</span>
          <svg
            className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-800/50 pt-2">
          {entry.results.map((r, i) => (
            <TestCaseResult key={i} result={r} compact />
          ))}
        </div>
      )}
    </div>
  );
};

/*Main component */
const ConsolePanel = () => {
  const {
    activeRightTab, setActiveRightTab,
    testResults, isExecuting,
    errorHistory, setErrorHistory,
    attemptCount, setAttemptCount,
  } = useEditor();

  const prevExecutingRef = useRef(false);

  /* Save history entry when execution finishes */
  useEffect(() => {
    if (prevExecutingRef.current && !isExecuting && testResults.length > 0) {
      const passed = testResults.filter(r => r.status === 'passed').length;
      setAttemptCount(c => c + 1);
      setErrorHistory(prev => [
        {
          id: Date.now(),
          runIndex: prev.length + 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          results: [...testResults],
          passed,
          total: testResults.length,
        },
        ...prev,
      ].slice(0, 20));
      // Auto-switch to Error Diagnosis tab after execution
      setActiveRightTab('error-diagnosis');
    }
    prevExecutingRef.current = isExecuting;
  }, [isExecuting]);

  const errorCount = testResults.filter(r => r.status === 'failed').length;
  const historyCount = errorHistory.length;

  /*  render */
  return (
    <div className="h-[300px] flex-shrink-0 flex flex-col bg-[#111111] border-t-2 border-gray-800/80">

      {/* Panel header */}
      <div className="bg-[#161616] border-b border-gray-800/80 px-2 flex-shrink-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <TabBtn
            id="error-diagnosis"
            label="Error Diagnosis"
            icon="🔍"
            active={activeRightTab === 'error-diagnosis'}
            onClick={setActiveRightTab}
            badge={errorCount}
          />
          <TabBtn
            id="ai-assistant"
            label="AI Assistant"
            icon="🤖"
            active={activeRightTab === 'ai-assistant'}
            onClick={setActiveRightTab}
            badge={0}
          />
          <TabBtn
            id="history"
            label="History"
            icon="📋"
            active={activeRightTab === 'history'}
            onClick={setActiveRightTab}
            badge={historyCount}
          />
        </div>
      </div>

      {/*Tab content*/}
      <div className="flex-1 overflow-y-auto">

        {/* ERROR DIAGNOSIS */}
        {activeRightTab === 'error-diagnosis' && (
          <div className="p-3 space-y-3">
            {isExecuting && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-lg">🔍</div>
                </div>
                <p className="text-cyan-400 text-xs font-mono animate-pulse">Analysing evidence…</p>
              </div>
            )}

            {!isExecuting && testResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="text-4xl opacity-30">🔬</div>
                <p className="text-gray-600 text-xs leading-relaxed max-w-[180px]">
                  Run your code to see error diagnosis results here.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-700 font-mono">
                  <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">Enter</kbd>
                </div>
              </div>
            )}

            {!isExecuting && testResults.length > 0 && (
              <>
                {/* Summary bar */}
                <div className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-2.5 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(testResults.filter(r => r.status === 'passed').length / testResults.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                    <span className="text-emerald-400 font-bold">
                      {testResults.filter(r => r.status === 'passed').length}
                    </span>
                    /{testResults.length}
                  </span>
                </div>

                {testResults.map((result, i) => (
                  <TestCaseResult key={i} result={result} />
                ))}
              </>
            )}
          </div>
        )}

        {/* AI ASSISTANT  */}
        {activeRightTab === 'ai-assistant' && <AIAssistantChat />}

        {/*HISTORY  */}
        {activeRightTab === 'history' && (
          <div className="p-3 space-y-2.5">
            {errorHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="text-4xl opacity-30">📋</div>
                <p className="text-gray-600 text-xs leading-relaxed max-w-[180px]">
                  Your run history for this problem will appear here after each execution.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold">
                    {errorHistory.length} run{errorHistory.length !== 1 ? 's' : ''} recorded
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear run history?')) {
                        setErrorHistory([]);
                        setAttemptCount(0);
                      }
                    }}
                    className="text-[10px] text-gray-600 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {errorHistory.map((entry, i) => (
                  <HistoryEntry key={entry.id} entry={entry} index={i} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;