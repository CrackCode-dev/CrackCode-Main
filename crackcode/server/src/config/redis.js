const redis = require('redis');

// Create Redis Client
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    },
    password: process.env.REDIS_PASSWORD || undefined
});

// Event Listeners for debugging
redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Client Connecting...'));

// Note: In server.js we will call redisClient.connect() 
module.exports = redisClient;