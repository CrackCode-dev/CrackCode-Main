import { createClient } from 'redis';

/**
 * Redis Client Configuration
 * Connects using environment variables with sensible fallbacks.
 */
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('ready', () => {
    console.log('Redis Connected');
});

// Note: Connection is initiated in server.js via redisClient.connect()
export default redisClient;
