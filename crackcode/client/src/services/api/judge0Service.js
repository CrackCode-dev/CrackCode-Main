import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5051';

// send code + test cases to the backend and get results back
export const submitCodeToJudge0 = async (code, language, testCases, previousErrors = [], problemData = {}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/codeEditor/execute`,
      {
        sourceCode: code,
        language: language,
        testCases: testCases,
        previousErrors: previousErrors, // past run errors for AI context
        
        // NEW: Reward system fields
        problemId: problemData.problemId || problemData.id,
        difficulty: problemData.difficulty,
        sourceArea: problemData.sourceArea || 'learn_page'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
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

// run code against a single input (used for debugging/console mode)
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

// fetch the list of supported programming languages from the backend
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
