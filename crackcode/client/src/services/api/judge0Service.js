import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Submit code to backend for execution with test cases
 * @param {string} code - The source code to execute
 * @param {string} language - Programming language (python, javascript, cpp, java, c)
 * @param {Array} testCases - Array of test case objects with input and expectedOutput
 * @returns {Promise<Object>} Result from backend containing test results
 */
export const submitCodeToJudge0 = async (code, language, testCases) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/codeEditor/execute`,
      {
        sourceCode: code,
        language: language,
        testCases: testCases
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for code execution
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to execute code');
    }
  } catch (error) {
    console.error('Code execution error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to execute code. Please check your connection and try again.'
    );
  }
};

/**
 * Execute code with a single input (for debugging)
 * @param {string} code - The source code to execute
 * @param {string} language - Programming language
 * @param {string} input - Standard input for the program
 * @returns {Promise<Object>} Execution result
 */
export const executeCodeWithInput = async (code, language, input) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/codeEditor/run`,
      {
        sourceCode: code,
        language: language,
        input: input
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to execute code');
    }
  } catch (error) {
    console.error('Code execution error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to execute code'
    );
  }
};

/**
 * Get supported programming languages
 * @returns {Promise<Object>} Map of supported languages
 */
export const getSupportedLanguages = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/codeEditor/languages`,
      {
        timeout: 10000
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch languages');
    }
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    throw error;
  }
};
