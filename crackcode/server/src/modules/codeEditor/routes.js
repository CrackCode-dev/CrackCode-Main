import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  executeTestCases,
  runCode,
  getSupportedLanguages
} from './codeEditor.controller.js';

const router = express.Router();

// limit code execution to 15 runs per minute per IP to protect Gemini quota
const executeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please wait a moment before running again.' }
});

// Execute test cases
router.post('/execute', executeRateLimit, executeTestCases);

// Run code with input
router.post('/run', runCode);

// Get supported languages
router.get('/languages', getSupportedLanguages);

export default router;
