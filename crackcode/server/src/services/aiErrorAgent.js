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
    console.error('❌ GEMINI_API_KEY is missing from .env file!');
    throw new Error('GEMINI_API_KEY is missing from .env file');
  }

  console.log(`✓ GEMINI_API_KEY found (length: ${apiKey.length} chars)`);

  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: buildSystemInstruction(),
    generationConfig: {
      temperature: 0.4,     // lower = more consistent answers
      maxOutputTokens: 600, // limit reply length to save quota
    },
  });

  console.log('✓ Gemini model initialized successfully');
  return geminiModel;
};

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

// pull the JSON from Gemini's reply (it sometimes wraps it in a code block)
const safeParseJSON = (rawText) => {
  try {
    // first try direct JSON parse
    return JSON.parse(rawText);
  } catch {
    // try to find JSON inside code blocks
    const jsonBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      try {
        return JSON.parse(jsonBlockMatch[1]);
      } catch {
        console.log('Failed to parse JSON from code block');
      }
    }
    
    // try to find JSON object in the text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.log('Failed to parse JSON object from text');
      }
    }
    
    return null;
  }
};

// main function — sends failed test + code to Gemini and returns hints
export const analyseError = async ({ code, language, testResult, previousErrors = [] }) => {

  // skip if AI is turned off in .env
  const aiEnabled = process.env.ENABLE_AI_AGENT === 'true';
  console.log(`AI Agent Status: ENABLE_AI_AGENT=${process.env.ENABLE_AI_AGENT}, Enabled=${aiEnabled}`);
  
  if (!aiEnabled) {
    console.log('AI Agent: disabled in .env (ENABLE_AI_AGENT !== "true")');
    return null;
  }

  // only run for failed tests
  if (testResult.status !== 'failed') {
    console.log('AI Agent: skipping non-failed test');
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

    console.log(`AI Agent: calling Gemini for ${errorType} in ${language}...`);
    const response = await model.generateContent(prompt);
    const rawText  = response.response.text();

    console.log(`AI Agent: Gemini response length: ${rawText.length} chars`);
    console.log(`AI Agent: Raw response (first 200 chars): ${rawText.substring(0, 200)}`);

    // parse the JSON that Gemini returned
    const analysis = safeParseJSON(rawText);

    if (!analysis) {
      console.warn(`AI Agent: Failed to parse JSON from Gemini response for ${errorType}`);
      console.warn(`AI Agent: Raw text: ${rawText.substring(0, 500)}`);
      return null;
    }

    console.log(`AI Agent: Successfully parsed analysis for ${errorType}`);
    
    // save so the same error doesn't need another API call
    saveToCache(cacheKey, analysis);
    console.log(`AI Agent: Cached result for ${errorType}`);

    return analysis;

  } catch (error) {
    // if Gemini fails, the app still works — just without AI hints
    console.error('AI Agent error (app still works):', error.message);
    console.error('AI Agent stack:', error.stack);
    return null;
  }
};
