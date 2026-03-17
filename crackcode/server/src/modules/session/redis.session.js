import redisClient from '../leaderboard/redis.config.js'

//  Key Helpers 
const sessionKey = (sessionId) => `session:${sessionId}`
const userSessionsKey = (userId) => `user_sessions:${userId}`

//  Health Check 
/**
 * Check if Redis is connected and functional
 * Returns { connected: boolean, message: string }
 */
export const checkRedisHealth = async () => {
  try {
    const result = await redisClient.ping()
    if (result === 'PONG' || result === true) {
      return { connected: true, message: 'Redis connected' }
    }
    return { connected: false, message: 'Redis ping failed' }
  } catch (err) {
    return {
      connected: false,
      message: `Redis health check failed: ${err?.message || err}`,
    }
  }
}

//  Session Caching 
/*
 Cache a session payload in Redis with TTL (seconds)
 payload: { userId, tokenVersion, isActive, expiresAt? }
 Syncs TTL across the session key and the user's session set
 */
export const cacheSession = async (sessionId, payload, ttlSeconds) => {
  try {
    if (!sessionId || !payload) return false
    const key = sessionKey(sessionId)
    const value = JSON.stringify(payload)
    
    if (ttlSeconds && Number(ttlSeconds) > 0) {
      // Set session with TTL (expires automatically)
      await redisClient.set(key, value, { EX: Number(ttlSeconds) })
    } else {
      // No TTL — Redis admin must clean manually (rare edge case)
      await redisClient.set(key, value)
    }
    return true
  } catch (err) {
    console.warn(`[Redis] cacheSession failed: ${err?.message || err}`)
    return false
  }
}


/*
 Read cached session and parse JSON safely. Returns object or null.
 Returns null if key missing, Redis unavailable, or JSON corrupted.
 */
export const getCachedSession = async (sessionId) => {
  try {
    if (!sessionId) return null
    const key = sessionKey(sessionId)
    const raw = await redisClient.get(key)
    if (!raw) return null  // Cache miss — will fallback to MongoDB
    
    try {
      return JSON.parse(raw)
    } catch (parseErr) {
      // Corrupted cache entry — remove it and fallback to MongoDB
      await redisClient.del(key).catch(() => {})
      return null
    }
  } catch (err) {
    // Redis unavailable — caller will fallback to MongoDB
    console.warn(`[Redis] getCachedSession failed (will use MongoDB): ${err?.message || err}`)
    return null
  }
}


/*
 Delete a session key from Redis cache.
 Returns boolean: true if deleted, false if not found or error.
 */
export const deleteCachedSession = async (sessionId) => {
  try {
    if (!sessionId) return false
    const key = sessionKey(sessionId)
    const deleted = await redisClient.del(key)
    return deleted > 0
  } catch (err) {
    console.warn(`[Redis] deleteCachedSession failed: ${err?.message || err}`)
    return false
  }
}



/*
 Add a sessionId to the user's session set with optional TTL.
 This maintains a quick lookup set for "logout all devices".
 Optional ttlSeconds: if provided, set expiry on the user_sessions set itself.
 Returns boolean success.
 */
export const addUserSession = async (userId, sessionId, ttlSeconds = null) => {
  try {
    if (!userId || !sessionId) return false
    const key = userSessionsKey(userId)
    
    // Add sessionId to the set
    await redisClient.sAdd(key, sessionId)
    
    // Optionally set TTL on the user's session set (for cleanup)
    // This ensures user_sessions:<userId> expires when all sessions are old
    if (ttlSeconds && Number(ttlSeconds) > 0) {
      await redisClient.expire(key, Number(ttlSeconds)).catch(() => {})
    }
    
    return true
  } catch (err) {
    console.warn(`[Redis] addUserSession failed: ${err?.message || err}`)
    return false
  }
}



/*
 Remove a sessionId from the user's session set.
 Returns boolean: true if sessionId was removed, false if not found or error.
 */
export const removeUserSession = async (userId, sessionId) => {
  try {
    if (!userId || !sessionId) return false
    const key = userSessionsKey(userId)
    const removed = await redisClient.sRem(key, sessionId)
    return removed > 0
  } catch (err) {
    console.warn(`[Redis] removeUserSession failed: ${err?.message || err}`)
    return false
  }
}



/*
 Return all sessionIds for a user from the user_sessions set.
 Returns array (possibly empty). Returns empty array on Redis error.
 Fallback: caller must check MongoDB for authoritative session list.
 */
export const getUserSessionIds = async (userId) => {
  try {
    if (!userId) return []
    const key = userSessionsKey(userId)
    const members = await redisClient.sMembers(key)
    return Array.isArray(members) ? members : []
  } catch (err) {
    console.warn(`[Redis] getUserSessionIds failed (will use MongoDB): ${err?.message || err}`)
    return []
  }
}

/*
 Delete all session keys and the user's session set atomically using MULTI pipeline.
 This is the ultimate "logout all devices" operation on the cache layer.
 Returns number of keys deleted.
 MongoDB will also be cleaned separately (caller's responsibility).
 */
export const deleteAllUserSessionCache = async (userId) => {
  try {
    if (!userId) return 0
    
    const uKey = userSessionsKey(userId)
    const sessionIds = await redisClient.sMembers(uKey)
    
    if (!sessionIds || sessionIds.length === 0) {
      // No sessions for this user — ensure user set is cleaned
      await redisClient.del(uKey).catch(() => {})
      return 0
    }

    // Atomic pipeline: delete all sessions + user set in one transaction
    const multi = redisClient.multi()
    for (const sid of sessionIds) {
      multi.del(sessionKey(sid))
    }
    multi.del(uKey)
    const results = await multi.exec()

    // Count deleted keys
    // node-redis v4: results is an array of command results (numbers for DEL)
    let removed = 0
    if (Array.isArray(results)) {
      for (const r of results) {
        if (typeof r === 'number') removed += r
        // Backwards compatibility: some clients may return [err, result]
        else if (Array.isArray(r) && typeof r[1] === 'number') removed += r[1]
      }
    }

    return removed
  } catch (err) {
    console.warn(`[Redis] deleteAllUserSessionCache failed: ${err?.message || err}`)
    return 0
  }
}

export default {
  checkRedisHealth,
  cacheSession,
  getCachedSession,
  deleteCachedSession,
  addUserSession,
  removeUserSession,
  getUserSessionIds,
  deleteAllUserSessionCache,
}
