// import { createClient } from 'redis';

// // Create Redis Client
// const redisClient = createClient({
//     socket: {
//         host: process.env.REDIS_HOST || '127.0.0.1',
//         port: process.env.REDIS_PORT || 6379
//     },
//     password: process.env.REDIS_PASSWORD || undefined
// });

// // Event Listeners for debugging
// redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));
// redisClient.on('connect', () => console.log('✅ Redis Client Connecting...'));

// // Note: Connect in server.js using redisClient.connect()
// export default redisClient;


// ═════════════════════════════════════════════════════════════
// REDIS DISABLED - Using MongoDB for sessions and leaderboard
// ═════════════════════════════════════════════════════════════
// If you need Redis in the future, uncomment the code below
// and install Redis server on your machine
// ═════════════════════════════════════════════════════════════

// import { createClient } from 'redis';

// // Create Redis Client
// const redisClient = createClient({
//     socket: {
//         host: process.env.REDIS_HOST || '127.0.0.1',
//         port: process.env.REDIS_PORT || 6379
//     },
//     password: process.env.REDIS_PASSWORD || undefined
// });

// // Event Listeners for debugging
// redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));
// redisClient.on('connect', () => console.log('✅ Redis Client Connecting...'));

// // Note: Connect in server.js using redisClient.connect()
// export default redisClient;






// ─── MOCK REDIS CLIENT (prevents errors when Redis is disabled) ───
const mockRedisClient = {
  connect: async () => console.log('ℹ️ Redis is disabled (using MongoDB only)'),
  disconnect: async () => {},
  isOpen: false,
  on: () => {},
  quit: async () => {},
};

export default mockRedisClient;