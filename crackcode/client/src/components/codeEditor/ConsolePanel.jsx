import React, { useEffect, useRef } from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import TestCaseResult from './TestcaseResult';
import AIAssistantChat from './AIAssistantChat';
import ErrorDiagnosisView from './ErrorDiagnosisView';


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
      <span className="ml-0.5 min-w-4 h-4 text-[10px] font-bold rounded-full
                       bg-red-500 text-white flex items-center justify-center px-1">
        {badge}
      </span>
    )}
  </button>
);

// collapsible history card showing one past run
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
          <span className={`w-2 h-2 rounded-full shrink-0 ${allPassed ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs font-mono text-gray-300 truncate">
            Run #{entry.runIndex} &nbsp;·&nbsp;
            <span className={allPassed ? 'text-emerald-400' : 'text-red-400'}>
              {entry.passed}/{entry.total} passed
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
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

// main panel with tabs: Test Cases, Error Diagnosis, AI Assistant, History
const ConsolePanel = () => {
  const {
    activeRightTab, setActiveRightTab,
    testResults, isExecuting,
    errorHistory, setErrorHistory,
    attemptCount, setAttemptCount,
  } = useEditor();

  const prevExecutingRef = useRef(false);

  // save a history entry each time execution finishes
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
      // switch to Error Diagnosis tab after each run
      setActiveRightTab('error-diagnosis');
    }
    prevExecutingRef.current = isExecuting;
  }, [isExecuting]);

  const errorCount = testResults.filter(r => r.status === 'failed').length;
  const historyCount = errorHistory.length;
  const allPassed = testResults.length > 0 && testResults.every(r => r.status === 'passed');

  // render
  return (
    <div className="h-75 shrink-0 flex flex-col bg-[#111111] border-t-2 border-gray-800/80">

      {/* Panel header */}
      <div className="bg-[#161616] border-b border-gray-800/80 px-2 shrink-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <TabBtn
            id="test-cases"
            label="Test Cases"
            icon="🧪"
            active={activeRightTab === 'test-cases'}
            onClick={setActiveRightTab}
            badge={0}
          />
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

        {/* TEST CASES TAB */}
        {activeRightTab === 'test-cases' && (
          <div className="p-3">
            {isExecuting && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                <p className="text-cyan-400 text-xs font-mono animate-pulse">Running test cases…</p>
              </div>
            )}

            {!isExecuting && testResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="text-4xl opacity-30">🧪</div>
                <p className="text-gray-600 text-xs leading-relaxed max-w-45">
                  Run your code to see test case results.
                </p>
              </div>
            )}

            {!isExecuting && testResults.length > 0 && (
              <div className="space-y-2">
                {/* Summary progress bar */}
                <div className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-2.5 flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(testResults.filter(r => r.status === 'passed').length / testResults.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 shrink-0">
                    <span className="text-emerald-400 font-bold">{testResults.filter(r => r.status === 'passed').length}</span>
                    /{testResults.length} passed
                  </span>
                </div>

                {/* Compact test case cards */}
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 flex items-start gap-3
                      ${ result.status === 'passed'
                          ? 'border-emerald-500/30 bg-emerald-900/10'
                          : 'border-red-500/30 bg-red-900/10'
                      }`}
                  >
                    {/* Status icon */}
                    <div className="shrink-0 mt-0.5">
                      {result.status === 'passed'
                        ? <span className="text-emerald-400 text-base">✓</span>
                        : <span className="text-red-400 text-base">✗</span>
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-200">Test Case {i + 1}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${
                          result.status === 'passed' ? 'text-emerald-400' : 'text-red-400'
                        }`}>{result.status}</span>
                      </div>

                      {/* Show input/expected for all cases */}
                      {result.details?.input !== undefined && (
                        <p className="text-[10px] text-gray-600 mt-1 font-mono truncate">Input: {result.details.input || '(none)'}</p>
                      )}
                      {result.details?.expected && (
                        <p className="text-[10px] text-gray-600 font-mono truncate">Expected: {result.details.expected}</p>
                      )}

                      {/* Show actual output for failed cases */}
                      {result.status === 'failed' && result.error && (
                        <p className="text-[10px] text-red-400/80 font-mono mt-1 truncate">{result.error.split('\n')[0]}</p>
                      )}

                      {/* Time for passed cases */}
                      {result.status === 'passed' && result.details?.time && (
                        <p className="text-[10px] text-gray-600 mt-1">{result.details.time}s</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ERROR DIAGNOSIS TAB */}
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
                <p className="text-gray-600 text-xs leading-relaxed max-w-45">
                  Run your code to see error diagnosis here.
                </p>
              </div>
            )}

            {/* ALL PASSED — success state */}
            {!isExecuting && allPassed && (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="text-5xl">🎉</div>
                <p className="text-emerald-400 text-sm font-bold">Answer Correct!</p>
                <p className="text-gray-500 text-xs">No errors detected. All test cases passed.</p>
              </div>
            )}

            {/* FAILED — show only the primary error using the dedicated diagnosis view */}
            {!isExecuting && testResults.length > 0 && !allPassed && (() => {
              const firstFailed = testResults.find(r => r.status === 'failed');
              if (!firstFailed) return null;
              return <ErrorDiagnosisView result={firstFailed} />;
            })()}
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
                <p className="text-gray-600 text-xs leading-relaxed max-w-45">
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