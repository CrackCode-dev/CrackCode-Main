import { useEditor } from '../../../context/codeEditor/EditorContext';
import { submitCodeToJudge0 } from '../../../services/api/judge0Service';

// figure out the error type label from the raw error text
const extractErrorType = (errorText = '') => {
  if (errorText.includes('SyntaxError'))       return 'Syntax Error';
  if (errorText.includes('NameError'))         return 'Name Error';
  if (errorText.includes('TypeError'))         return 'Type Error';
  if (errorText.includes('IndexError'))        return 'Index Error';
  if (errorText.includes('ZeroDivision'))      return 'Zero Division Error';
  if (errorText.includes('IndentationError'))  return 'Indentation Error';
  if (errorText.includes('ValueError'))        return 'Value Error';
  if (errorText.includes('AttributeError'))    return 'Attribute Error';
  if (errorText.includes('ImportError'))       return 'Import Error';
  if (errorText.includes('error:'))            return 'Compilation Error';
  return 'Runtime Error';
};

export const useCodeExecution = () => {
  const { code, language, currentProblem, setIsExecuting, setTestResults, errorHistory } = useEditor();

  const executeCode = async () => {
    if (!currentProblem || !code.trim()) {
      alert('Please write some code before executing!');
      return;
    }

    setIsExecuting(true);
    setTestResults([]);

    const testCases = currentProblem.testCases || [];

    // pull raw errors from previous runs so Gemini has real history context
    const previousErrors = errorHistory
      .flatMap(run => run.results.filter(r => r.status === 'failed' && r.rawError).map(r => r.rawError))
      .slice(0, 5);
    
    if (testCases.length === 0) {
      alert('No test cases available for this problem');
      setIsExecuting(false);
      return;
    }

    try {
      // Filter out invalid test cases (missing input or expected_output)
      const validTestCases = testCases.filter(tc => 
        tc.input && (tc.expected_output !== null && tc.expected_output !== undefined || tc.expectedOutput !== null && tc.expectedOutput !== undefined)
      );

      if (validTestCases.length === 0) {
        alert('No valid test cases available for this problem');
        setIsExecuting(false);
        return;
      }

      if (validTestCases.length === 1) {
        alert('Warning: Only 1 valid test case found. Consider adding more test cases.');
      }

      // Take up to 3 test cases, but minimum 2 (or all if less than 2 available)
      const testCasesToRun = validTestCases.slice(0, Math.min(3, validTestCases.length));

      const transformedTestCases = testCasesToRun.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expected_output !== undefined ? tc.expected_output : tc.expectedOutput,
        setup: tc.setup || ''
      }));

      console.log(`Running ${transformedTestCases.length} test cases:`, transformedTestCases);

      // call the backend with all test cases
      const result = await submitCodeToJudge0(code, language, transformedTestCases, previousErrors);
      
      // turn the backend response into the shape the UI expects
      const results = result.results.map((testResult, index) => {
        if (testResult.status === 'passed') {
          return {
            status: 'passed',
            detectiveMessage: `Test Case ${index + 1} - Case Solved! ✓`,
            details: {
              input: testResult.input,
              expected: testResult.expected,
              actual: testResult.actual,
              time: testResult.time,
              memory: testResult.memory,
            },
          };
        } else {
          // failed test — store all the info the Error Diagnosis tab needs
          const isRuntimeError = !!testResult.error;

          return {
            status: 'failed',
            testNumber: index + 1,
            // use the server's classified error type, fall back to client-side detection
            errorType: testResult.errorType || (isRuntimeError
              ? extractErrorType(testResult.error)
              : 'Wrong Answer'),
            // the raw error message from the runner
            rawError: testResult.error || null,
            // expected vs actual output
            expected: testResult.expected ?? null,
            actual: testResult.actual ?? null,
            // AI hints from Gemini (null if AI is off)
            aiAnalysis: testResult.aiAnalysis || null,
            // used by the compact Test Cases tab card
            detectiveMessage: `Test Case ${index + 1} - ${testResult.message}`,
            error: testResult.error || `Expected: ${testResult.expected}\nGot: ${testResult.actual || 'No output'}`,
          };
        }
      });

      setTestResults(results);

      // check if all passed
      const allPassed = results.every(r => r.status === 'passed');
      if (allPassed) {
        console.log('All test cases passed!');
      }

    } catch (error) {
      console.error('Code execution error:', error);
      // show a general error card if the whole request fails
      setTestResults([{
        status: 'failed',
        detectiveMessage: 'Execution Failed',
        error: error.message || 'Failed to execute code. Please try again.',
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  return { executeCode };
};
