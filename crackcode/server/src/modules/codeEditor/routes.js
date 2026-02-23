import express from 'express';
import {
  executeTestCases,
  runCode,
  getSupportedLanguages
} from './codeEditor.controller.js';

const router = express.Router();

// Execute test cases
router.post('/execute', executeTestCases);

// Run code with input
router.post('/run', runCode);

// Get supported languages
router.get('/languages', getSupportedLanguages);

export default router;
