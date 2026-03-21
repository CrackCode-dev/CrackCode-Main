import { generateCacheKey, getFromCache, saveToCache } from './errorCache.js';
import { buildSystemInstruction, buildAnalysisPrompt } from './promptBuilder.js';
import { aiConfig } from './aiConfig.js';
import { checkRateLimit } from './aiRateLimiter.js';
import { getGeminiModel } from './aiModel.js';
import { safeParseJSON } from './aiJson.js';

// figure out what kind of error it is (NameError, TypeError, etc.)
export const classifyErrorType = (testResult) => {
  const errorMsg = testResult.error || '';

  if (errorMsg.includes('SyntaxError'))      return 'Syntax Error';
  if (errorMsg.includes('NameError'))        return 'Name Error';
  if (errorMsg.includes('TypeError'))        return 'Type Error';
  if (errorMsg.includes('IndexError'))       return 'Index Error';
  if (errorMsg.includes('ZeroDivision'))     return 'Zero Division Error';
  if (errorMsg.includes('IndentationError')) return 'Indentation Error';
  if (errorMsg.includes('ValueError'))       return 'Value Error';
  if (errorMsg.includes('AttributeError'))   return 'Attribute Error';
  if (errorMsg.includes('ImportError'))      return 'Import Error';
  if (testResult.message?.includes('Compilation')) return 'Compilation Error';
  if (testResult.status === 'failed' && !errorMsg)  return 'Wrong Answer';

  return 'Runtime Error';
};

// main function — sends failed test + code to Gemini and returns hints
export const analyseError = async ({ userId, sessionId, code, language, testResult, previousErrors = [] }) => {

  // Check if AI is enabled in .env via new config system
  if (!aiConfig.enabled || !aiConfig.errorDiagnosisEnabled) {
    console.log(`AI Error Diagnosis: disabled (ENABLE_AI_AGENT=${process.env.ENABLE_AI_AGENT}, ENABLE_AI_ERROR_DIAGNOSIS=${process.env.ENABLE_AI_ERROR_DIAGNOSIS})`);
    return null;
  }

  // only run for failed tests
  if (testResult.status !== 'failed') {
    console.log('AI Error Diagnosis: skipping non-failed test');
    return null;
  }

  // Check rate limit (user can get 8 diagnoses per minute)
  const userKey = userId || sessionId || 'anonymous';
  const rate = checkRateLimit({
    userKey,
    feature: 'error_diagnosis',
    limitPerMinute: aiConfig.errorDiagnosisLimitPerMinute,
  });

  if (!rate.allowed) {
    console.log(`⚠️  Error diagnosis rate limit hit for ${userKey}: ${rate.used}/${aiConfig.errorDiagnosisLimitPerMinute}`);
    return {
      errorType: 'Rate Limit',
      simplifiedMessage: 'Officer, you have used the AI diagnosis too many times in one minute.',
      whatWentWrong: 'This is a safety limit for testing so the AI service does not get spammed.',
      affectedLines: [],
      actionableSteps: [
        'Step 1: Wait a few seconds.',
        'Step 2: Fix one thing before running again.',
        'Step 3: Re-run after the minute window resets.'
      ],
      conceptTitle: 'Rate Limiting',
      conceptLesson: 'Think of it like a queue at a help desk. Too many requests at once means you need to wait your turn.',
      severity: 'info',
      rateLimited: true,
      remaining: rate.remaining,
      resetAt: rate.resetAt,
    };
  }

  // build the error description we will send to Gemini
  const errorType = classifyErrorType(testResult);
  const errorText = testResult.error
    || `Expected: ${testResult.expected}, Got: ${testResult.actual || 'no output'}`;

  // check cache first so we don't call Gemini for the same error twice
  const cacheKey = generateCacheKey(language, errorType, errorText);
  const cached = getFromCache(cacheKey);

  if (cached) {
    console.log('AI Error Diagnosis: returning cached result');
    return cached;
  }

  // call Gemini and get the analysis
  try {
    const model = getGeminiModel({
      modelName: aiConfig.model,
      systemInstruction: buildSystemInstruction(),
      temperature: 0.4,
    });

    const prompt = buildAnalysisPrompt({
      code,
      language,
      errorText,
      errorType,
      expected: testResult.expected,
      actual:   testResult.actual,
      previousErrors,
    });

    console.log(`→ Calling Gemini for error diagnosis: ${errorType} in ${language}...`);
    const response = await model.generateContent(prompt);
    const rawText  = response.response.text();

    console.log(`✓ Gemini response length: ${rawText.length} chars`);

    // parse the JSON that Gemini returned
    const analysis = safeParseJSON(rawText);

    if (!analysis) {
      console.warn(`⚠️  Failed to parse JSON from Gemini response for ${errorType}`);
      return null;
    }

    console.log(`✓ Successfully parsed analysis for ${errorType}`);
    
    // save so the same error doesn't need another API call
    saveToCache(cacheKey, analysis);
    console.log(`✓ Cached result for ${errorType}`);

    return analysis;

  } catch (error) {
    // if Gemini fails, the app still works — just without AI hints
    console.error('❌ AI Error Diagnosis error (app still works):', error.message);
    return null;
  }
};
