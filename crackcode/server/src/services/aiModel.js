// One place to bootstrap Gemini for both error diagnosis and assistant
// Models are cached so we don't reinitialize unnecessarily

import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiConfig } from './aiConfig.js';

// Cache models so we reuse them across multiple calls
const modelCache = new Map();

/*
 modelName - Gemini model name ('gemini-2.5-flash', etc.)
 ssystemInstruction - System prompt for behavior
 temperature - Creativity level (0.0-1.0, lower = more consistent)
 returns {object} - Initialized Gemini model ready to call
 */
export const getGeminiModel = ({ modelName, systemInstruction, temperature = 0.4 }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API key exists
  if (!apiKey) {
    throw new Error('❌ GEMINI_API_KEY is missing from .env file');
  }

  // Create cache key: unique per model + temperature + system instruction
  const cacheKey = `${modelName}::${temperature}::${systemInstruction.slice(0, 50)}`;

  // Return cached model if it exists
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey);
  }

  // Initialize new Gemini API instance
  const genAI = new GoogleGenerativeAI(apiKey);

  // Create the model with generationConfig
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      temperature,
      maxOutputTokens: aiConfig.maxOutputTokens,
    },
  });

  // Cache it for future reuse
  modelCache.set(cacheKey, model);
  console.log(`✓ Gemini model cached: ${modelName}`);

  return model;
};

// Helper: get cache stats (useful for debugging)
export const getModelCacheStats = () => {
  return {
    cachedModels: modelCache.size,
    keys: Array.from(modelCache.keys()),
  };
};
