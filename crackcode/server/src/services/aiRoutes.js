// Example endpoints for testing AI features
// Usage:
//   POST /api/ai/assistant - ask a question in the editor
//   POST /api/ai/error - manually analyse an error (for testing)


import express from 'express';
import { postAssistantMessage, postAnalyseError } from './aiController.js';

const router = express.Router();

/*
POST /api/ai/assistant
Request body:
question: the student's question
language: code language (python, javascript, etc)
code: current code in editor
problemTitle: title of the problem
problemDescription: full problem text
lastJudgeResult (object): last test result from Judge0
 */
router.post('/assistant', postAssistantMessage);

/*
 POST /api/ai/error
 Request body:
code: the student's code
language: code language
testResult (object): { status: 'failed', error: ..., expected: ..., actual: ... }
previousErrors (array): list of previous error messages (optional)
 */
router.post('/error', postAnalyseError);

export default router;
