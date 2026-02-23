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

// Run test cases and return results
export const runTestCases = async (sourceCode, language, testCases) => {
  const languageId = getLanguageId(language);
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      // Create test wrapper code based on language
      let testCode = '';
      
      if (language === 'python') {
        testCode = `
${sourceCode}

# Parse input
numbers = list(map(int, "${testCase.input}".split()))
num1, num2 = numbers[0], numbers[1]

# Call the function and print result
solution = Solution()
result = solution.addTwoNumbers(num1, num2)
print(result)
`;
      } else if (language === 'javascript') {
        testCode = `
${sourceCode}

// Parse input
const numbers = "${testCase.input}".split(' ').map(Number);
const [num1, num2] = numbers;

// Call the function and print result
const solution = new Solution();
const result = solution.addTwoNumbers(num1, num2);
console.log(result);
`;
      } else {
        // For other languages, just append the code with stdin
        testCode = sourceCode;
      }
      
      const result = await submitCodeToJudge0(
        testCode,
        languageId,
        testCase.input || ""
      );

      let testResult;

      if (result.stdout && result.stdout.trim() === (testCase.expectedOutput || '').trim()) {
        testResult = {
          testNumber: i + 1,
          status: 'passed',
          message: `Test Case ${i + 1} Passed`,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result.stdout.trim(),
          time: result.time || 0,
          memory: result.memory || 0
        };
      } else if (result.stderr) {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Runtime Error`,
          error: result.stderr,
          input: testCase.input,
          expected: testCase.expectedOutput
        };
      } else if (result.compile_output) {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Compilation Error`,
          error: result.compile_output,
          input: testCase.input,
          expected: testCase.expectedOutput
        };
      } else {
        testResult = {
          testNumber: i + 1,
          status: 'failed',
          message: `Test Case ${i + 1} Failed - Wrong Answer`,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result.stdout ? result.stdout.trim() : 'No output'
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
        expected: testCase.expectedOutput
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
