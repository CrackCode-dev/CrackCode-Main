import { useEditor } from '../../../context/code-editor/EditorContext';
import { submitCodeToJudge0 } from '../../../services/api/judge0Service';
import { generateDetectiveMessage } from '../utils/detectiveMessages';

export const useCodeExecution = () => {
  const { 
    code, 
    language, 
    currentProblem, 
    setIsExecuting, 
    setTestResults,
    setActiveTab 
  } = useEditor();

  const executeCode = async () => {
    if (!currentProblem || !code.trim()) {
      alert('Please write some code before executing!');
      return;
    }

    setIsExecuting(true);
    setActiveTab('error-log'); // Switch to error log tab
    setTestResults([]); // Clear previous results

    const testCases = currentProblem.testCases || [];
    const results = [];

    // Initialize with "running" status
    const initialResults = testCases.map((tc, index) => ({
      status: 'running',
      detectiveMessage: `Investigating Test Case ${index + 1}...`,
      narrativeMessage: 'The detective is examining the evidence...',
    }));
    setTestResults(initialResults);

    // Execute each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        const result = await submitCodeToJudge0(code, language, testCase.input);

        let testResult;

        if (result.stdout && result.stdout.trim() === testCase.expectedOutput.trim()) {
          // Test passed
          testResult = {
            status: 'passed',
            detectiveMessage: `Test Case ${i + 1} - Case Solved! ✓`,
            narrativeMessage: generateDetectiveMessage('success', i + 1),
            details: {
              input: testCase.input,
              expected: testCase.expectedOutput,
              time: result.time,
              memory: result.memory,
            },
          };
        } else if (result.stderr) {
          // Runtime error
          testResult = {
            status: 'failed',
            detectiveMessage: `Test Case ${i + 1} - Runtime Error Detected`,
            narrativeMessage: generateDetectiveMessage('runtime_error', i + 1),
            error: result.stderr,
            aiSuggestion: 'It looks like your code encountered an error during execution. Check for syntax errors, undefined variables, or incorrect function calls.',
          };
        } else if (result.compile_output) {
          // Compilation error
          testResult = {
            status: 'failed',
            detectiveMessage: `Test Case ${i + 1} - Compilation Failed`,
            narrativeMessage: generateDetectiveMessage('compile_error', i + 1),
            error: result.compile_output,
            aiSuggestion: 'The code failed to compile. Review your syntax and ensure all language-specific rules are followed.',
          };
        } else {
          // Wrong answer
          testResult = {
            status: 'failed',
            detectiveMessage: `Test Case ${i + 1} - Wrong Answer`,
            narrativeMessage: generateDetectiveMessage('wrong_answer', i + 1),
            error: `Expected: ${testCase.expectedOutput}\nGot: ${result.stdout || 'No output'}`,
            aiSuggestion: 'Your code produced an incorrect output. Double-check your logic and edge cases.',
          };
        }

        results.push(testResult);
        setTestResults([...results]); // Update UI progressively

      } catch (error) {
        results.push({
          status: 'failed',
          detectiveMessage: `Test Case ${i + 1} - System Error`,
          narrativeMessage: 'The detective encountered an unexpected obstacle...',
          error: error.message || 'Failed to execute code. Please try again.',
        });
        setTestResults([...results]);
      }
    }

    setIsExecuting(false);

    // Check if all tests passed
    const allPassed = results.every(r => r.status === 'passed');
    if (allPassed) {
      // Could trigger confetti or celebration animation here
      console.log('🎉 All test cases passed! Case solved!');
    }
  };

  return { executeCode };
};