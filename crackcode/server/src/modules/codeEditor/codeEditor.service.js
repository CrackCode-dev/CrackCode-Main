import axios from "axios";

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
  c: 50
};

// Get language ID
export const getLanguageId = (language) => {
  return LANGUAGE_IDS[language] || LANGUAGE_IDS.python;
};

// Submit code to Judge0 API
export const submitCodeToJudge0 = async (sourceCode, languageId, stdin = "") => {
  try {
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('Judge0 API Error:', error.message);
    throw new Error(`Failed to execute code: ${error.message}`);
  }
};

// Wrap user code with a stdin→function→stdout harness for interpreted languages
const wrapWithHarness = (sourceCode, language, stdinPayload) => {
  if (language === 'python') {
    // Only inject the harness if the code has a `def solve(` signature
    // and doesn't already read from stdin
    if (sourceCode.includes('def solve(') && !sourceCode.includes('sys.stdin') && !sourceCode.includes('input()')) {
      return sourceCode + `
import json as _json, sys as _sys
_data = _json.load(_sys.stdin)
if isinstance(_data, dict):
    _result = solve(**_data)
elif isinstance(_data, list):
    _result = solve(*_data)
else:
    _result = solve(_data)
print(_result)
`;
    }
  } else if (language === 'javascript') {
    if (sourceCode.includes('function solve(') && !sourceCode.includes('process.stdin') && !sourceCode.includes('readline')) {
      return sourceCode + `
const _data = JSON.parse(${JSON.stringify(stdinPayload)});
const _result = Array.isArray(_data) ? solve(..._data) : solve(...Object.values(_data));
console.log(_result);
`;
    }
  }
  return sourceCode;
};

// Run test cases and return results
export const runTestCases = async (sourceCode, language, testCases) => {
  const languageId = getLanguageId(language);
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    try {
      // Serialize the input to a JSON string for stdin so any language can parse it
      const stdinPayload = typeof testCase.input === 'string'
        ? testCase.input
        : JSON.stringify(testCase.input);

      // Wrap with harness if the code looks like a function-only implementation
      const codeToRun = wrapWithHarness(sourceCode, language, stdinPayload);

      const result = await submitCodeToJudge0(codeToRun, languageId, stdinPayload);

      // Normalize expected output to a trimmed string for comparison
      const expectedStr = testCase.expectedOutput !== undefined && testCase.expectedOutput !== null
        ? String(testCase.expectedOutput).trim()
        : '';

      const actualStr = result.stdout ? result.stdout.trim() : '';

      let testResult;

      if (result.compile_output && !result.stdout) {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Compilation Error`,
          error: result.compile_output,
          input: testCase.input,
          expected: expectedStr,
        };
      } else if (result.stderr && !result.stdout) {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Runtime Error`,
          error: result.stderr,
          input: testCase.input,
          expected: expectedStr,
        };
      } else if (actualStr === expectedStr) {
        testResult = {
          testNumber: i + 1,
          status: 'passed',
          message: `Test Case ${i + 1} Passed`,
          input: testCase.input,
          expected: expectedStr,
          actual: actualStr,
          time: result.time || 0,
          memory: result.memory || 0,
        };
      } else {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Wrong Answer`,
          input: testCase.input,
          expected: expectedStr,
          actual: actualStr || 'No output',
        };
      }

      results.push(testResult);
    } catch (error) {
      results.push({
        testNumber: i + 1,
        status: 'failed',
        message: `Test Case ${i + 1} Failed - API Error`,
        error: error.message,
        input: testCase.input,
        expected: testCase.expectedOutput,
      });
    }
  }

  return results;
};

// Execute code with a single input (for debugging)
export const executeCode = async (sourceCode, language, input = "") => {
  try {
    const languageId = getLanguageId(language);
    const result = await submitCodeToJudge0(sourceCode, languageId, input);

    return {
      success: true,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      time: result.time || 0,
      memory: result.memory || 0,
      status_id: result.status_id,
      status: result.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.message
    };
  }
};
