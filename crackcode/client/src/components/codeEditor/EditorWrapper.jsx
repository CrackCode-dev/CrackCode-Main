import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import EditorToolbar from './EditorToolbar';
import ConsolePanel from './ConsolePanel';
import { useEditorDecorations } from '../../features/codeEditor/hooks/useEditorDecorations';

const EditorWrapper = () => {
  const { code, setCode, language, testResults } = useEditor();
  const editorRef = useRef(null);

  // Apply red line highlights in Monaco for AI-identified error lines
  useEditorDecorations(editorRef, testResults);

  return (
    <div className="h-full flex flex-col bg-[#141414]">
      <EditorToolbar />

      {/* Monaco Editor – takes up remaining space above the panel */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language === 'python' ? 'python' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'javascript'}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={(editor) => { editorRef.current = editor; }}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
            fontLigatures: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'gutter',
            cursorBlinking: 'phase',
            smoothScrolling: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>

      {/* Analysis Panel docked at the bottom */}
      <ConsolePanel />
    </div>
  );
};

export default EditorWrapper;