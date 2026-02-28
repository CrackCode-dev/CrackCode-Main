import { runTestCases, executeCode, getLanguageId } from './codeEditor.service.js';
import { analyseError, classifyErrorType } from '../../services/aiErrorAgent.js';

// Run test cases for a submission
export const executeTestCases = async (req, res) => {
  try {
    const { sourceCode, language, testCases, previousErrors = [] } = req.body;

    // Validation
    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'Source code is required'
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Test cases array is required and cannot be empty'
      });
    }

    // Execute test cases
    const results = await runTestCases(sourceCode, language, testCases);

    // ── AI Error Analysis ────────────────────────────────────────────────────
    // attach a clean error type label to every failed result
    results.forEach(r => {
      if (r.status === 'failed') {
        r.errorType = classifyErrorType(r);
      }
    });

    // only call Gemini for the first failed test — saves API quota
    const firstFailedIndex = results.findIndex(r => r.status === 'failed');
    if (firstFailedIndex !== -1) {
      results[firstFailedIndex].aiAnalysis = await analyseError({
        code:          sourceCode,
        language,
        testResult:    results[firstFailedIndex],
        previousErrors, // real history sent from the client
      });
    }
    // ────────────────────────────────────────────────────────────────────────

    const passedCount = results.filter(r => r.status === 'passed').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          passed: passedCount,
          failed: failedCount
        }
      }
    });
  } catch (error) {
    console.error('Execute Test Cases Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute test cases'
    });
  }
};

// Execute code with a single input (debugging/console mode)
export const runCode = async (req, res) => {
  try {
    const { sourceCode, language, input } = req.body;

    // Validation
    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'Source code is required'
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }

    // Execute code
    const result = await executeCode(sourceCode, language, input || '');

    return res.status(200).json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Run Code Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute code'
    });
  }
};

// Get supported languages
export const getSupportedLanguages = async (req, res) => {
  try {
    const languages = {
      python: { id: 71, name: 'Python 3' },
      javascript: { id: 63, name: 'JavaScript (Node.js)' },
      cpp: { id: 54, name: 'C++' },
      java: { id: 62, name: 'Java' },
      c: { id: 50, name: 'C' }
    };

    return res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
