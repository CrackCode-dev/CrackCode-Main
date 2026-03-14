import crypto from 'crypto';

// stores AI results so we don't call Gemini for the same error twice
const cache = new Map();
const MAX_CACHE_SIZE = 200;

// create a unique key from language + error type + error text
export const generateCacheKey = (language, errorType, errorText) => {
  // use only first 150 chars to keep keys stable
  const input = `${language}|${errorType}|${errorText.slice(0, 150)}`;
  return crypto.createHash('sha256').update(input).digest('hex');
};

// get a saved result from cache, returns null if not found
export const getFromCache = (key) => {
  return cache.get(key) || null;
};

// save a result to cache, drops oldest entry if it is full
export const saveToCache = (key, value) => {
  if (cache.size >= MAX_CACHE_SIZE) {
    // remove the oldest key when the limit is hit
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, value);
};

// clear all cached results (useful for testing)
export const clearCache = () => {
  console.log(`🗑️  Clearing AI error cache (was ${cache.size} items)`);
  cache.clear();
  console.log(`✓ Cache cleared`);
};

// get cache stats
export const getCacheStats = () => {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    isFull: cache.size >= MAX_CACHE_SIZE,
  };
};
