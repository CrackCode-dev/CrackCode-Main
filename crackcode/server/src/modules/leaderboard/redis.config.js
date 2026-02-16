import { createClient } from 'redis';

/**
 * Real Redis Client Configuration
 */
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    },
    password: process.env.REDIS_PASSWORD || undefined
});

// Event Listeners for debugging and monitoring
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Redis Client Connecting...');
});

redisClient.on('ready', () => {
    console.log('🚀 Redis Client Ready');
});

// Note: Connection is handled in server.js using redisClient.connect()
export default redisClient;
