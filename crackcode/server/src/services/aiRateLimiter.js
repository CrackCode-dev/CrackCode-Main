// Tracks requests per user per minute per feature
// When limit is reached, returns rateLimited: true


const buckets = new Map();

/*
 Check if a user has exceeded their rate limit for a feature
userKey - unique identifier (userId, sessionId, or anonymous)
feature - feature name (errordiagnosi or assistant)
limitPerMinute - how many requests allowed per minute
returns {object} - { allowed: true/false, used, remaining, resetAt }
 */
export const checkRateLimit = ({ userKey, feature, limitPerMinute }) => {
  const now = Date.now();
  const bucketKey = `${feature}:${userKey}`;
  const windowMs = 60 * 1000; // 1 minute 

  let entry = buckets.get(bucketKey);

  // Create a new minute window or reuse existing one if not expired
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  // Increment request count
  entry.count += 1;
  buckets.set(bucketKey, entry);

  const allowed = entry.count <= limitPerMinute;

  return {
    allowed,
    used: entry.count,
    remaining: Math.max(0, limitPerMinute - entry.count),
    resetAt: entry.resetAt,
  };
};

// Helper: clear all rate limit buckets (useful for testing)
export const clearRateLimitBuckets = () => {
  buckets.clear();
  console.log('✓ Rate limit buckets cleared');
};

// Helper: get current state of rate limiters
export const getRateLimitStats = () => {
  return {
    activeBuckets: buckets.size,
    buckets: Array.from(buckets.entries()).map(([key, value]) => ({
      key,
      count: value.count,
      resetsIn: Math.max(0, value.resetAt - Date.now()),
    })),
  };
};
