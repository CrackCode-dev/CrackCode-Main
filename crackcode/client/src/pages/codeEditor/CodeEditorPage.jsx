import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EditorProvider } from "../../context/codeEditor/EditorContext";
import { useProblemData } from "../../features/codeEditor/hooks/useProblemData";
import CaseDetails from "../../components/codeEditor/CaseDetails";
import EditorWrapper from "../../components/codeEditor/EditorWrapper";

const CodeEditorContent = () => {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const preloadedQuestion = location.state?.question || null;
  const sourceArea = location.state?.sourceArea || 'learn_page'; // NEW: Get sourceArea from navigation
  const { error, setLanguage, setLanguageLocked } = useProblemData(problemId, preloadedQuestion, sourceArea);

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
      setLanguageLocked(true);  // Lock the language when pre-selected
    }
  }, [location.state, setLanguage, setLanguageLocked]);

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-red-400 p-6 font-mono text-lg mb-4 bg-red-900/10 border border-red-500/30 rounded-lg">
          CASE NOT FOUND: {error}
        </div>
        <button
          onClick={() => navigate('/learn')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-lg font-bold transition-colors"
        >
          ← Back to Cases
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-[#0d0d0d] overflow-hidden">
      {/* LEFT: Problem Description */}
      <div className="w-[42%] flex-shrink-0 overflow-y-auto border-r border-gray-800/60">
        <CaseDetails />
      </div>

      {/* RIGHT: Editor + Analysis Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <EditorWrapper />
      </div>
    </div>
  );
};

export default function CodeEditorPage() {
  return (
    <EditorProvider>
      <CodeEditorContent />
    </EditorProvider>
  );
}
