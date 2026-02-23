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
  const { error, setLanguage } = useProblemData(problemId);

  // Set language from navigation state if provided (from ChapterSelection)
  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
  }, [location.state, setLanguage]);

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="text-red-500 p-10 font-mono text-lg mb-4">ERROR: {error}</div>
        <button 
          onClick={() => navigate('/learn')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded font-bold"
        >
          Back to Learn
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-[#0a0a0a] overflow-hidden gap-1">
      {/* FIXED: Added gap between panels */}
      <div className="w-[45%] overflow-y-auto">
        <CaseDetails />
      </div>
      <div className="w-[55%] flex flex-col">
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
