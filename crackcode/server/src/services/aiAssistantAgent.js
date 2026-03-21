//Handles general coding questions in the code editor

import crypto from 'crypto';
import { aiConfig } from './aiConfig.js';
import { checkRateLimit } from './aiRateLimiter.js';
import { getGeminiModel } from './aiModel.js';
import { safeParseJSON } from './aiJson.js';
import { getFromCache, saveToCache } from './errorCache.js';

/*
 Build cache key for assistant responses
 Caches by: question + language + problem title + code snippet + last judge status
 */
const buildAssistantCacheKey = ({ question, language, code, problemTitle, lastStatus }) => {
  // Use only first 300 chars of code to keep keys reasonable
  const shortCode = (code || '').slice(0, 300);
  const input = `assistant:${question}|${language}|${problemTitle}|${lastStatus}|${shortCode}`;
  return crypto.createHash('sha256').update(input).digest('hex');
};

/*
This defines how the AI should act in the editor
 */
const buildAssistantSystemInstruction = () => {
  return `You are Detective AI, the CrackCode code assistant. Your job is to help students solve coding problems.

CRITICAL RULES:
1. ALWAYS respond with ONLY valid JSON, nothing else
2. NEVER ask for clarification - use context to answer
3. If question is vague, give the most likely answer (e.g., "help with loops" → explain loops in their code)
4. Be encouraging but honest
5. Guide to the "aha" moment, don't just solve it

Your tone: Friendly detective helping solve the case (the problem)
Your knowledge: You have their code, problem description, and judge results - use it all
Your goal: Make them understand WHY the code works or fails
  `.trim();
};


/*
Includes editor context so the answer is smart and relevant
 */
const buildAssistantPrompt = ({
  question,
  language,
  code,
  problemTitle,
  problemDescription,
  lastJudgeResult,
}) => {
  return `You are a coding assistant helping a student. Respond with ONLY valid JSON, nothing else.

STUDENT QUESTION:
"${question}"

CONTEXT:
- Language: ${language || 'unknown'}
- Problem: ${problemTitle || '(unknown)'}
- Description: ${problemDescription || '(not provided)'}
- Code: ${code || '(no code yet)'}
- Last result: ${JSON.stringify(lastJudgeResult || {})}

INSTRUCTIONS:
1. Answer their question directly and specifically
2. If code is provided, reference actual lines or variables
3. Keep answer short and beginner-friendly
4. Return ONLY this exact JSON structure, no other text:

{
  "mode": "concept",
  "reply": "Your answer here addressing their specific question",
  "hintTitle": "Optional hint title",
  "hintText": "Optional guidance",
  "nextStep": "One specific action to try",
  "severity": "info"
}

EXAMPLES:
Q: "How do I add two numbers?"
JSON: {"mode":"concept","reply":"In Python, use the + operator: result = 5 + 3","hintTitle":"Try it","hintText":"Use print() to see the result","nextStep":"Run your code","severity":"info"}

Q: "Why is my code returning None?"
JSON: {"mode":"debug","reply":"Your function doesn't have a return statement. Python returns None by default.","hintTitle":"Check your returns","hintText":"Make sure your function returns a value with the return keyword","nextStep":"Add a return statement","severity":"info"}

Now respond with ONLY JSON:`;
};

/*
Main function: Process a student's question in the editor
This acts like an intelligent agent because it gathers context first
 */
export const askAssistant = async ({
  userId,
  sessionId,
  question,
  language,
  code,
  problemTitle,
  problemDescription,
  lastJudgeResult,
}) => {
  // Check if assistant feature is enabled
  if (!aiConfig.enabled || !aiConfig.assistantEnabled) {
    return {
      disabled: true,
      message: 'AI assistant is disabled in .env (ENABLE_AI_ASSISTANT=false)',
    };
  }

  // Validate question is not empty
  if (!question || !question.trim()) {
    return {
      disabled: false,
      error: 'Please ask a question first',
    };
  }

  // Check rate limit (user can ask 4 times per minute)
  const userKey = userId || sessionId || 'anonymous';
  const rate = checkRateLimit({
    userKey,
    feature: 'assistant',
    limitPerMinute: aiConfig.assistantLimitPerMinute,
  });

  if (!rate.allowed) {
    console.log(`⚠️  Assistant rate limit hit for ${userKey}: ${rate.used}/${aiConfig.assistantLimitPerMinute}`);
    return {
      disabled: false,
      rateLimited: true,
      message: `Assistant limit reached (${rate.used}/${aiConfig.assistantLimitPerMinute} per minute). Please wait a moment and try again.`,
      remaining: rate.remaining,
      resetAt: Math.ceil((rate.resetAt - Date.now()) / 1000),
    };
  }

  // Check cache first (saves API calls if same question asked twice)
  const cacheKey = buildAssistantCacheKey({
    question,
    language,
    code,
    problemTitle,
    lastStatus: lastJudgeResult?.status || 'unknown',
  });

  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`✓ Assistant response from cache`);
    return {
      ...cached,
      cached: true,
    };
  }

  try {
    // Get Gemini model with assistant settings
    const model = getGeminiModel({
      modelName: aiConfig.model,
      systemInstruction: buildAssistantSystemInstruction(),
      temperature: 0.5, // slightly more creative than error diagnosis
    });

    // Build the full prompt with context
    const prompt = buildAssistantPrompt({
      question,
      language,
      code,
      problemTitle,
      problemDescription,
      lastJudgeResult,
    });

    // Call Gemini
    console.log(`→ Calling Gemini for assistant (user: ${userKey})`);
    const response = await model.generateContent(prompt);
    const rawText = response.response.text();

    // Parse the JSON response
    const parsed = safeParseJSON(rawText);

    if (!parsed) {
      console.warn('⚠️  Assistant could not parse Gemini response as JSON');
      console.warn('❌ Raw response was:', rawText?.substring(0, 200));
      return {
        mode: 'debug',
        reply: 'The case files got scrambled. Try asking your question differently or with more specific context.',
        hintTitle: 'Try rephrasing',
        hintText: 'Include what you\'ve tried or what error you\'re seeing.',
        nextStep: 'Run your code first, then ask again with the error message.',
        severity: 'info',
      };
    }

    // Cache the response for future identical questions
    saveToCache(cacheKey, parsed);
    console.log(`✓ Assistant response cached`);

    return parsed;
  } catch (error) {
    console.error(`❌ Assistant error: ${error.message}`);
    return {
      mode: 'debug',
      reply: 'The detective is temporarily out of the office. Your code editor still works — keep investigating!',
      hintTitle: 'Temporary glitch',
      hintText: 'Try again in a few moments.',
      nextStep: 'Continue working on your solution.',
      severity: 'info',
    };
  }
};
