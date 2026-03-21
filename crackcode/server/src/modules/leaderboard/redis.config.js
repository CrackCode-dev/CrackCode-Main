import { createClient } from 'redis';

/*
 Redis client configuration

 This file creates a single Redis client instance used by the
 application for caching (leaderboard, sessions). 
 Thehost/port come from environment variables so you can run Redis
 locally or in Docker without changing code.
 */
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
    },
    // If your Redis server has a password, set REDIS_PASSWORD in .env
    password: process.env.REDIS_PASSWORD || undefined,
});

// Event listeners provide helpful runtime messages for developers.
// They help diagnose connection issues early during startup.
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    // Emitted when the client starts connecting (not yet ready)
    console.log('✅ Redis Client Connecting...');
});

redisClient.on('ready', () => {
    // Emitted when the client is fully ready to accept commands
    const host = process.env.REDIS_HOST || 'redis';
    const port = process.env.REDIS_PORT || 6379;
    console.log(`🚀 Redis Client Ready (${host}:${port})`);
});

// Connection is established centrally in server.js via redisClient.connect()
export default redisClient;
