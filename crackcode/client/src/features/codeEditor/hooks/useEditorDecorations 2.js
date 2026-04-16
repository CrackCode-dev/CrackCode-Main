import { useEffect } from 'react';

  
//   Applies red line highlight decorations in the Monaco editor
//   for lines that the AI agent identified as the source of errors.
 

export const useEditorDecorations = (editorRef, testResults) => {
  useEffect(() => {
    const editor = editorRef?.current;
    if (!editor) return;

    //colect all error line numbers from AI analysis 
    const errorLines = new Set();

    if (Array.isArray(testResults)) {
      testResults.forEach((result) => {
        if (
          result.status === 'failed' &&
          result.aiAnalysis?.affectedLines?.length > 0
        ) {
          result.aiAnalysis.affectedLines.forEach((lineNum) => {
            if (Number.isInteger(lineNum) && lineNum > 0) {
              errorLines.add(lineNum);
            }
          });
        }
      });
    }

    //Build Monaco decorations
    const decorations = Array.from(errorLines).map((lineNum) => ({
      range: {
        startLineNumber: lineNum,
        endLineNumber:   lineNum,
        startColumn: 1,
        endColumn: 1,
      },
      options: {
        // Red background on the whole line
        isWholeLine: true,
        className: 'ai-error-line-highlight',
        // Red gutter dot
        glyphMarginClassName: 'ai-error-glyph',
        // Tooltip on hover
        hoverMessage: { value: '⚠️ AI identified this line as a potential error source' },
      },
    }));

    // Apply decorations (Monaco manages the old/new IDs internally)
    // We store the returned IDs so we can clear them on the next run
    editor.deltaDecorations(
      editor.__aiDecorationIds || [],
      decorations
    );

    // Save IDs for cleanup on the next call
    // eslint-disable-next-line no-underscore-dangle
    editor.__aiDecorationIds = decorations.length > 0
      ? editor.deltaDecorations([], decorations)
      : [];

    // Clear decorations when component unmounts or results change
    return () => {
      if (editor && !editor.isDisposed?.()) {
        // eslint-disable-next-line no-underscore-dangle
        editor.deltaDecorations(editor.__aiDecorationIds || [], []);
      }
    };

  }, [editorRef, testResults]);
};
