import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import { useCodeExecution } from '../../features/codeEditor/hooks/useCodeExecution';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';
import { downloadCodeAsFile, getExtension } from '../../utils/downloadFile';

const EditorToolbar = () => {
  const {
    language, setLanguage, isExecuting, currentProblem,
    code, setCode, attemptCount, languageLocked,
  } = useEditor();
  const { executeCode } = useCodeExecution();
  const navigate = useNavigate();
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keyboard shortcut: Ctrl+Enter → Execute
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isExecuting) executeCode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isExecuting, executeCode]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (currentProblem?.starterCode?.[newLang]) {
      setCode(currentProblem.starterCode[newLang]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code || '').then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    });
  };

  const handleReset = () => {
    const starter = currentProblem?.starterCode?.[language];
    if (starter && window.confirm('Reset code to starter template?')) {
      setCode(starter);
    }
  };

  // Submit solution for official evaluation
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Convert language format (python → python, etc.)
      const languageMap = {
        python: 71,
        javascript: 63,
        cpp: 54,
        java: 62
      };

      const response = await axios.post('/codeEditor/submit', {
        questionId: currentProblem?.problemId || currentProblem?._id,
        code: code,
        languageId: languageMap[language] || 71
      });

      const { data } = response.data;

      if (!data.passed) {
        // Tests failed
        alert(`❌ Some test cases failed!\n\n${
          data.failedTests?.length > 0 
            ? `Failed ${data.failedTests.length} test(s)` 
            : data.message
        }`);
        return;
      }

      if (data.firstTimeCompletion) {
        // First-time completion - show celebration
        const badges = data.newlyUnlockedBadges?.length > 0 
          ? `\n🏆 Unlocked badges: ${data.newlyUnlockedBadges.join(', ')}`
          : '';
        alert(
          `✅ Correct!\n\n+${data.earnedXP} XP\n+${data.earnedTokens} Tokens${badges}`
        );
      } else {
        // Already completed before
        alert('✅ Correct!\n\n(Already completed)');
      }

      // Dispatch custom event to signal successful submission (use standard event name without 'on')
      console.log('🎯 Dispatching solutionSubmitted event for:', currentProblem?.problemId);
      window.dispatchEvent(new CustomEvent('solutionSubmitted', { 
        detail: { questionId: currentProblem?.problemId, earnedXP: data.earnedXP, earnedTokens: data.earnedTokens }
      }));

      // Navigate back to learn page or reload
      const sourceArea = currentProblem?.sourceArea;
      if (sourceArea === 'learn_page') {
        // Parse learn page info from the problemId (e.g., py_fundamentals_001)
        const problemId = currentProblem?.problemId || '';
        // Match: {lang}_{difficulty}_{number}
        const match = problemId.match(/^(py|js|java|cpp)_([a-z]+)_\d+/);
        if (match) {
          const langMap = { py: 'python', js: 'javascript', java: 'java', cpp: 'cpp' };
          const trackId = langMap[match[1]];
          const difficultyId = match[2];  // Just the difficulty word, no number
          console.log(`🔄 Navigating back to /learn/${trackId}/${difficultyId}`);
          navigate(`/learn/${trackId}/${difficultyId}`);
          return;
        }
      }
      
      // Fallback: refresh page to update stats
      console.log('🔄 Reloading page...');
      window.location.reload();

    } catch (error) {
      alert(`❌ Error submitting solution:\n${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border-b border-gray-800/80 px-4 flex flex-col">
      {/* Top row: file name + controls */}
      <div className="flex items-center justify-between py-2.5">
        {/* File label */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 animate-pulse" />
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-wider truncate">
            {currentProblem?.fileName || 'investigation.py'}
          </span>
          {attemptCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex-shrink-0">
              {attemptCount} {attemptCount === 1 ? 'run' : 'runs'}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={languageLocked}
            className={`bg-[#252525] text-xs px-2 py-1.5 rounded border
                       ${languageLocked 
                         ? 'text-gray-500 border-gray-700 cursor-not-allowed opacity-60' 
                         : 'text-gray-300 border-gray-700 hover:border-gray-500 cursor-pointer'
                       } focus:outline-none focus:border-cyan-500 transition-colors`}
            title={languageLocked ? 'Language is locked for this challenge' : 'Select language'}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
          >
            {copyFeedback ? (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Download Code Button */}
          <button
            onClick={() => {
              if (!code?.trim()) {
                alert('No code to download');
                return;
              }
              const filename = `solution.${getExtension(language)}`;
              downloadCodeAsFile(code, filename, language);
            }}
            title="Download code as file"
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-medium transition-colors active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            title="Reset to starter code"
            className="p-1.5 rounded text-gray-400 hover:text-orange-400 hover:bg-gray-700/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Execute button */}
          <button
            onClick={executeCode}
            disabled={isExecuting}
            title="Run code (Ctrl+Enter)"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-semibold text-sm transition-all
              ${isExecuting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 active:scale-95'
              }`}
          >
            {isExecuting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Run
              </>
            )}
          </button>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isExecuting}
            title="Submit solution for official evaluation"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-semibold text-sm transition-all
              ${isSubmitting || isExecuting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 active:scale-95'
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3z" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Shortcut hint strip */}
      <div className="flex items-center gap-1 pb-1.5 text-[10px] text-gray-600 font-mono">
        <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-500">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-500">Enter</kbd>
        <span className="ml-1">to run, click Submit to evaluate</span>
      </div>
    </div>
  );
};

export default EditorToolbar;