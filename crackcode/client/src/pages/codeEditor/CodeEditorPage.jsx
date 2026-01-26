import React from 'react';
import { useParams } from "react-router-dom";
import { EditorProvider } from "../../context/codeEditor/EditorContext";
import { useProblemData } from "../../features/codeEditor/hooks/useProblemData";
import CaseDetails from "../../components/codeEditor/CaseDetails";
import EditorWrapper from "../../components/codeEditor/EditorWrapper";

const CodeEditorContent = () => {
  const { problemId } = useParams();
  const { error } = useProblemData(problemId);

  if (error) return <div className="text-red-500 p-10 font-mono">ERROR: {error}</div>;

  return (
    <div className="h-screen flex bg-[#0a0a0a] overflow-hidden gap-1">
      {/* ✅ FIXED: Added gap between panels */}
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


//jwt key : crackcodeAdmin
//infocrackcode_db_user
//Up3qn0HqPFN1xQ73
//mongodb+srv://infocrackcode_db_user:Up3qn0HqPFN1xQ73@crackcodecluster.f8j0sea.mongodb.net/?appName=crackcodeCluster