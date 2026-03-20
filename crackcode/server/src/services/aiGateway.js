// Single entry point for error diagnosis, assist

import { analyseError } from './aiErrorAgent.js';
import { askAssistant } from './aiAssistantAgent.js';

/*
Routes to the correct AI agent based on request type
 
type - 'error_diagnosis' or 'assistant'
payload - data needed by that agent
returns {objecct} - AI agent response
 */
export const handleAIRequest = async ({ type, payload }) => {
  if (type === 'error_diagnosis') {
    // Payload: { userId, sessionId, code, language, testResult, previousErrors }
    return analyseError(payload);
  }

  if (type === 'assistant') {
    // Payload: { userId, sessionId, question, language, code, ... }
    return askAssistant(payload);
  }

  // Unknown request type
  return {
    error: 'Unknown AI request type. Use "error_diagnosis" or "assistant".',
  };
};

/*
Structured payloads for reference 
 */
export const requestExamples = {
  // When Judge0 returns a failed test:
  errorDiagnosis: {
    type: 'error_diagnosis',
    payload: {
      userId: 'user123',
      sessionId: 'session456',
      code: 'print(x)',
      language: 'python',
      testResult: {
        status: 'failed',
        error: 'NameError: name "x" is not defined at line 1',
        expected: '5',
        actual: null,
      },
      previousErrors: [],
    },
  },

  // When user asks a question in the editor:
  assistant: {
    type: 'assistant',
    payload: {
      userId: 'user123',
      sessionId: 'session456',
      question: 'Why am I getting a NameError?',
      language: 'python',
      code: 'print(x)',
      problemTitle: 'Print the number 5',
      problemDescription: 'Write code that prints 5',
      lastJudgeResult: {
        status: 'failed',
        error: 'NameError: name "x" is not defined',
      },
    },
  },
};
