// Handles HTTP requests related to AI features
// Example: POST /api/ai/assistant → calls the AI assistant agent

import { handleAIRequest } from './aiGateway.js';

/*
 POST /api/ai/assistant
 Student asks a question in the editor
 */
export const postAssistantMessage = async (req, res) => {
  try {
    const { question, language, code, problemTitle, problemDescription, lastJudgeResult } = req.body;

    // Get user info from session/auth
    const userId = req.user?._id?.toString();
    const sessionId = req.sessionID;

    // Validate question is provided
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'question is required',
      });
    }

    // Call AI gateway to route to assistant agent
    const result = await handleAIRequest({
      type: 'assistant',
      payload: {
        userId,
        sessionId,
        question,
        language,
        code,
        problemTitle,
        problemDescription,
        lastJudgeResult,
      },
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('postAssistantMessage error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Assistant failed',
      error: error.message,
    });
  }
};

/*
  POST /api/ai/error
  Analyse a failed test case with AI error diagnosis
  (can be called manually to test the error feature)
 */
export const postAnalyseError = async (req, res) => {
  try {
    const { code, language, testResult, previousErrors } = req.body;

    const userId = req.user?._id?.toString();
    const sessionId = req.sessionID;

    // Validate required fields
    if (!code || !language || !testResult) {
      return res.status(400).json({
        success: false,
        message: 'code, language, and testResult are required',
      });
    }

    // Call AI gateway to route to error diagnosis agent
    const result = await handleAIRequest({
      type: 'error_diagnosis',
      payload: {
        userId,
        sessionId,
        code,
        language,
        testResult,
        previousErrors: previousErrors || [],
      },
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('postAnalyseError error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error analysis failed',
      error: error.message,
    });
  }
};
