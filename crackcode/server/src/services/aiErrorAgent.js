import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCacheKey, getFromCache, saveToCache } from './errorCache.js';
import { buildSystemInstruction, buildAnalysisPrompt } from './promptBuilder.js';

// set ENABLE_AI_AGENT=true in .env to turn on AI error analysis

let geminiModel = null;

const getGeminiModel = () => {
  // return the existing model if already created
  if (geminiModel) return geminiModel;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from .env file');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: buildSystemInstruction(),
    generationConfig: {
      temperature: 0.4,     // lower = more consistent answers
      maxOutputTokens: 600, // limit reply length to save quota
    },
  });

  return geminiModel;
};

// figure out what kind of error it is (NameError, TypeError, etc.)
export const classifyErrorType = (testResult) => {
  const errorMsg = testResult.error || '';

  if (errorMsg.includes('SyntaxError'))      return 'SyntaxError';
  if (errorMsg.includes('NameError'))        return 'NameError';
  if (errorMsg.includes('TypeError'))        return 'TypeError';
  if (errorMsg.includes('IndexError'))       return 'IndexError';
  if (errorMsg.includes('ZeroDivision'))     return 'ZeroDivisionError';
  if (errorMsg.includes('IndentationError')) return 'IndentationError';
  if (errorMsg.includes('ValueError'))       return 'ValueError';
  if (errorMsg.includes('AttributeError'))   return 'AttributeError';
  if (testResult.message?.includes('Compilation')) return 'CompilationError';
  if (testResult.status === 'failed' && !errorMsg)  return 'WrongAnswer';

  return 'RuntimeError';
};

// pull the JSON from Gemini's reply (it sometimes wraps it in a code block)
const safeParseJSON = (rawText) => {
  try {
    // find the JSON object inside the text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
};

// main function — sends failed test + code to Gemini and returns hints
export const analyseError = async ({ code, language, testResult, previousErrors = [] }) => {

  // skip if AI is turned off in .env
  if (process.env.ENABLE_AI_AGENT !== 'true') {
    return null;
  }

  // only run for failed tests
  if (testResult.status !== 'failed') {
    return null;
  }

  // build the error description we will send to Gemini
  const errorType = classifyErrorType(testResult);
  const errorText = testResult.error
    || `Expected: ${testResult.expected}, Got: ${testResult.actual || 'no output'}`;

  // check cache first so we don't call Gemini for the same error twice
  const cacheKey = generateCacheKey(language, errorType, errorText);
  const cached = getFromCache(cacheKey);

  if (cached) {
    console.log('AI Agent: returning cached result');
    return cached;
  }

  // call Gemini and get the analysis
  try {
    const model = getGeminiModel();

    const prompt = buildAnalysisPrompt({
      code,
      language,
      errorText,
      errorType,
      expected: testResult.expected,
      actual:   testResult.actual,
      previousErrors,
    });

    console.log(`AI Agent: asking Gemini about ${errorType} in ${language}...`);
    const response = await model.generateContent(prompt);
    const rawText  = response.response.text();

    // parse the JSON that Gemini returned
    const analysis = safeParseJSON(rawText);

    if (!analysis) {
      console.warn('AI Agent: could not read Gemini reply, using built-in hints');
      return null;
    }

    // save so the same error doesn't need another API call
    saveToCache(cacheKey, analysis);
    console.log(`AI Agent: done for ${errorType}`);

    return analysis;

  } catch (error) {
    // if Gemini fails, the app still works — just without AI hints
    console.error('AI Agent error (app still works):', error.message);
    return null;
  }
};
