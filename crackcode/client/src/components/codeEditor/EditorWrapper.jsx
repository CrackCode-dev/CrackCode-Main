import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import EditorToolbar from './EditorToolbar';
import ConsolePanel from './ConsolePanel';

const EditorWrapper = () => {
  const { code, setCode, language, testResults, isExecuting } = useEditor();
  
  // Calculate if console is visible
  const hasResults = testResults.length > 0 || isExecuting;

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <EditorToolbar />
      
      {/* ✅ Code Editor - Scrollable, fixed height */}
      <div className="flex-1 min-h-0 relative">
        {/* Editor Container with padding */}
        <div className="h-full p-4">
          <div className="h-full rounded-lg overflow-hidden border border-gray-700">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : 'javascript'}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                fontFamily: "'Fira Code', 'Courier New', monospace",
                padding: { top: 16, bottom: 16 },
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
        </div>
        
        {/* ✅ Section Divider - Subtle line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>
      
      {/* ✅ Console Panel - Fixed height at bottom */}
      <ConsolePanel />
    </div>
  );
};

export default EditorWrapper;