import React from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import { useCodeExecution } from '../../features/codeEditor/hooks/useCodeExecution';

const EditorToolbar = () => {
  const { language, setLanguage, isExecuting, currentProblem, setCode } = useEditor();
  const { executeCode } = useCodeExecution();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    // Update starter code template when language flips
    if (currentProblem?.starterCode?.[newLang]) {
      setCode(currentProblem.starterCode[newLang]);
    }
  };

  return (
    <div className="bg-[#2d2d30] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-cyan-400 text-sm font-mono uppercase">
          {currentProblem?.fileName || 'investigation'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <select value={language} onChange={handleLanguageChange} className="bg-[#1e1e1e] text-white px-3 py-1 rounded border border-gray-600">
          <option value="python">Python 3</option>
          <option value="javascript">JavaScript</option>
        </select>
        <button 
          onClick={executeCode} 
          disabled={isExecuting} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-1 rounded font-bold transition-all"
        >
          {isExecuting ? 'Executing...' : 'Execute'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;